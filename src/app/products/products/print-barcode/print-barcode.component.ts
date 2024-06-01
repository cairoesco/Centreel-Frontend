// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormArray } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { UtilsServiceService } from '../../../shared/services/utils-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
// import { PurchaseOrderService } from '../purchase-order.service';
import { ProductService } from '../../product.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-print-barcode',
  templateUrl: './print-barcode.component.html',
  styleUrls: ['./print-barcode.component.scss']
})
export class PrintBarcodeComponent implements OnInit {
  public printPoform: UntypedFormGroup;
  public generalForm: UntypedFormGroup;
  public dynamicHeightVariant = "";
  public innerHeight: any;
  public selected = [];
  public checkedCount = this.data.vData.length;
  constructor(public utility: UtilsServiceService, private fb: UntypedFormBuilder, private api: ProductService, public dialogRef: MatDialogRef<PrintBarcodeComponent>, @Inject(MAT_DIALOG_DATA) public data: any, ) {
  }
  // constructor() { }

  purchaseInfoForm() {
    this.printPoform = this.fb.group({
      poProducts: this.fb.array([]),
      width: [],
      height: [],
      unit: [],
      columns: [],
    });
  }

  fillProductProperties(data) {
    
    let barcode_val = data.barcodes.split(',');
    
    return this.fb.group({
      product_name: [data.product_name],
      variant_name: [data.variant_name],
      variant_id: [data.variant_id],
      qty: [1],
      isChecked: [true],

      purchase_price: [data.purchase_price],
      selling_price: [data.variant_price],
      batch: [data.batch],

      warehouse: [data.warehouse],
      cost: [data.cost],
      total_selling_price: [data.total_selling_price],
      barcodes: [barcode_val[0], Validators.required],
      brand:[data.brand],
      variant_sku: [data.variant_sku]
    });
  }

  public barocde_array: any;
  filldata() {
    var productPropertiesControl: any = this.printPoform.controls;
    var productPropertiesControl1: any = productPropertiesControl.poProducts.controls;

    this.products.forEach(element => {
      let data = this.fillProductProperties(element);
      this.barocde_array = element.barcodes.split(',');
      productPropertiesControl1.push(data)
    });
  }

  products = this.data.vData;
  vId = this.data.vId;

  ngOnInit() {
    this.purchaseInfoForm();
    this.filldata();
  }
  ngDoCheck() {
    this.innerHeight = window.innerHeight - 192;
  }
  changeCount(event) {
    this.checkedCount = event.checked ? this.checkedCount + 1 : this.checkedCount - 1
  }
  isChecked(event) {
    let productcontrol: any = this.printPoform.controls['poProducts'];

    if (event.checked) {
      productcontrol.controls.forEach(element => {
        element.controls.isChecked.setValue(true)
      });
      this.checkedCount = this.data.POdata.length;
    }
    else {
      productcontrol.controls.forEach(element => {
        element.controls.isChecked.setValue(false)
      });
      this.checkedCount = 0;
    }
  }

  public valid: boolean = false;
  onSubmit(event) {
    let data = []
    let productcontrol: any = this.printPoform.controls['poProducts'];

    productcontrol.controls.forEach(element => {
      if (element.value.isChecked) {
        if (element.value.qty > 0) {
          let variant = {
            variant_id: element.value.variant_id,
            qty: element.value.qty,
            barcode: element.value.barcodes,
            selling_price: element.value.selling_price,
            product_name: element.value.product_name,

            variant_name: element.value.variant_name,
            brand_name: element.value.brand,
            variant_sku: element.value.variant_sku,
          }
          if (variant.barcode == "") {
            this.valid = false;
          } else {
            this.valid = true;
          }
          data.push(variant)
        }
      }
    });
    
    const formData = new FormData();

    if (this.valid) {
      if (data.length > 0) {
        this.barButtonOptions.active = true;
        this.barButtonOptions.text = 'Printing...';

        formData.append("variants", JSON.stringify(data));
        this.api.printBarcode(this.vId, formData).then(
          (res: HttpResponse<any>) => {
            this.downloadFile(res.body);
            this.dialogRef.close(formData);
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'PRINT';
          },
          err => {
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'PRINT';
          });
      }
    }
  }

  downloadFile(data: any) {
    let blob = new Blob([data], { type: 'application/pdf' });
    let url = window.URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  }

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Print',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }

  close() {
    this.dialogRef.close();

  }

  units = [{ unit_name: 'INCH' }, { unit_name: 'CM' }];
  columns = [{ column: 1 }, { column: 2 }, { column: 3 }, { column: 4 },]

}
