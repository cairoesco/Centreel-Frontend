import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Validators, UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { StockService } from '../stock.service'
import { UtilsServiceService } from '../../../shared/services/utils-service.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-reconcile-stock',
  templateUrl: './reconcile-stock.component.html',
  styleUrls: ['./reconcile-stock.component.scss']
})
export class ReconcileStockComponent implements OnInit {
  public myControl = new UntypedFormControl();
  public productVariantsForm: UntypedFormGroup;
  //public dataArray: any = [];
  public vendors: any[] = [];
  public purchaseOrders: any[] = [];
  public VendorfilteredOptions: Observable<any[]>;
  public PurchaseOrderNofilteredOptions: Observable<any[]>;
  public productsControl: any;
  public variantsControl: any
  public batchList: any = [];
  public reasonList: any = [];
  public available_stock: any = 0;
  public step: number = 0.01;
  constructor(
    private _formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ReconcileStockComponent>,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public stockService: StockService,
    public utility: UtilsServiceService,
    public decimalPipe: DecimalPipe,
  ) {
    if (data.product_unit == 'pcs') {
      this.step = 1;
    }
  }

  ngOnInit() {
    let storage_stock = 0;
    if (Boolean(this.data.data) && _.isArray(this.data.data.storage_stock)) {
      storage_stock = (this.data.product_unit == 'pcs') ? Math.round(this.data.data.storage_stock[this.data.index - 2]) : this.data.data.storage_stock[this.data.index - 2];
    }
    let variant_id=(Boolean(this.data.data) && Boolean(this.data.data.variant_id))?this.data.data.variant_id:0;
    this.productVariantsForm = this._formBuilder.group({
      //purchase_order_no: [''],
      // stock: ['', Validators.compose([Validators.required, Validators.max(-0.01), Validators.min(- +storage_stock)])],
      stock: ['', Validators.compose([Validators.required, Validators.min(- +storage_stock)])],
      batch_no: [''],
      current_stock: [{ value: storage_stock, disabled: false }],
      variant_id: [variant_id],
      storage_id: [this.data.storage_id],
      reason: [''],
      //product_id: [this.data.productId],
    })
    if (this.data.product_type_slug == 'cannabis') {
      //Get batch list
      this.getBatchList(variant_id, this.data.storage_id);
      this.productVariantsForm.controls["batch_no"].setValidators([Validators.required]);
      this.productVariantsForm.controls["batch_no"].updateValueAndValidity();

      this.productVariantsForm.controls["reason"].setValidators([Validators.required]);
      this.productVariantsForm.controls["reason"].updateValueAndValidity();
    }

    //Close dialog on route change
    this.router.events.subscribe(() => {
      this.dialogRef.close();
    });
    this.getReasonList();
  }

  public isValue(event) {
    let data = this.productVariantsForm.controls['stock'].value
    if (event && event > 0) {
      this.productVariantsForm.patchValue({ stock: -data });
    }
  }

  onBatchChange(available_stock, event) {
    if (event.isUserInput) {
      if (this.data.product_unit == 'pcs') {
        this.available_stock = this.decimalPipe.transform(parseInt(available_stock), '1.0');
      }else{
        this.available_stock = this.decimalPipe.transform(parseInt(available_stock), '1.2-2');;
      }
      
      //Apply validation based on batch stock
      this.productVariantsForm.controls["stock"].setValidators([Validators.required, Validators.min(- +available_stock)]);
      this.productVariantsForm.controls["stock"].updateValueAndValidity();
    }
  }

  getBatchList(variant_id, storage_id) {
    this.stockService.getBatchList({ variant_id: variant_id, storage_id: storage_id }).subscribe((result: any) => {
      if (result.success) {
        this.batchList = result.data.batch_no;
        this.productVariantsForm.patchValue({ batch_no: this.batchList[0].batch_no });
        //Apply validation based on batch stock
        this.productVariantsForm.controls["stock"].setValidators([Validators.required,  Validators.min(- +this.batchList[0].available_stock)])
        this.productVariantsForm.controls["stock"].updateValueAndValidity();
      }
    })
  }

  getReasonList(){
    this.stockService.getVendorList().subscribe((result: any) => {
      if (result.success) {
        //this.reasonList = result.data.reconcile_reson;
        this.reasonList = ["Damaged", "Lost/Theft", "Destroyed","Others"];
      }
    })
  }

  onSubmit(formData1) {
    if (this.productVariantsForm.valid) {
      const formData = new FormData();
      formData.append('reconcile_data', JSON.stringify([formData1.value]));

      this.stockService.reconcileStock(formData).subscribe((result: any) => {
        if (result.success) {
          this.utility.showSnackBar(result.message);
          this.data.stock = formData1.value.stock;
          this.data.variant_id = formData1.value.variant_id;
          this.dialogRef.close([{ stock: this.data.stock, variant_id: this.data.variant_id }]);
        }
      })
    }
  }

}
