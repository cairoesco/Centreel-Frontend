
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
//import { ReportService } from '../../report.service';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterReconcileDialogComponent implements OnInit {

  public filterForm: UntypedFormGroup;
  public product_categories = [];
  public product_types = [];
  public producttypeFormArray: any = [];
  public productSubCategory = [];
  public alltags: string[] = [];
  public form_obj: any = new Object();
  public inventory_reconcile: UntypedFormGroup;
  public storeList: any = [];
  public product_type_id: any;
  public product_category_id: any;
  public product_type = [{product_type_slug:'all', product_name: 'All'},{product_type_slug:'cannabis', product_name: 'Cannabis'},{product_type_slug:'non cannabis', product_name: 'Non-Cannabis'},]

  constructor(
    private formBuilder: UntypedFormBuilder,
    public productService: ProductService,
    public dialogRef: MatDialogRef<FilterReconcileDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public router: Router, public fb: UntypedFormBuilder) {
    this.inventory_reconcile = this.formBuilder.group({
      product_type: ['cannabis'],
      store_id: [this.data.fdata.store_id],
      has_stock: [false],
    });
  }

  ngOnInit() {
    this.getStores();
  }
  getStores() {
    this.productService.getStores()
      .subscribe((response: any) => {
        this.storeList = response.data.stores;
        if (this.storeList.length > 0) {
          this.data.fdata.has_stock = !this.data.fdata.has_stock;
          this.data.fdata.product_type = this.data.fdata.type;
          this.inventory_reconcile.patchValue(this.data.fdata);
        }
      });
  }
  applyFilter() {
    this.form_obj = this.inventory_reconcile.getRawValue();
    this.dialogRef.close(this.form_obj);
  }

  close() {
    this.inventory_reconcile.controls.store_id.setValue(this.storeList[0].store_id);
    this.inventory_reconcile.controls.product_type.setValue('cannabis');
    this.inventory_reconcile.controls.has_stock.setValue(false);
    this.applyFilter();
  }

}
