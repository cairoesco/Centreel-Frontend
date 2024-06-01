import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormArray } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { PurchaseOrderService } from '../purchase-order.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-print-po',
  templateUrl: './print-po.component.html',
  styleUrls: ['./print-po.component.scss']
})
export class PrintPoComponent implements OnInit {
  public printPoform: UntypedFormGroup;
  public generalForm: UntypedFormGroup;
  public dynamicHeightVariant = "";
  public innerHeight: any;
  public selected = [];
  public checkedCount = this.data.POdata.length;
  constructor(public utility: UtilsServiceService, private fb: UntypedFormBuilder, private api: PurchaseOrderService, public dialogRef: MatDialogRef<PrintPoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, ) {
  }

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
    return this.fb.group({
      product_name: [data.product_name],
      variant_name: [data.variant_name],
      variant_id: [data.variant_id],
      qty: [data.qty],
      isChecked: [true],

      purchase_price: [data.purchase_price],
      selling_price: [data.selling_price],
      batch: [data.batch],

      warehouse: [data.warehouse],
      cost: [data.cost],
      total_selling_price: [data.total_selling_price],
    });
  }
  filldata() {
    var productPropertiesControl: any = this.printPoform.controls;
    var productPropertiesControl1: any = productPropertiesControl.poProducts.controls;
    this.products.forEach(element => {
      let data = this.fillProductProperties(element);
      productPropertiesControl1.push(data)
    });
  }

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

  onSubmit(event) {
    let data = []
    let productcontrol: any = this.printPoform.controls['poProducts'];
    productcontrol.controls.forEach(element => {
      if (element.value.isChecked) {
        if(element.value.qty > 0){
          let variant = {
            variant_id: element.value.variant_id,
            qty: element.value.qty
          }
          data.push(variant)
        }
      }
    });
    const formData = new FormData();
    if (data.length > 0) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Printing...';
      formData.append("variants", JSON.stringify(data));
      this.api.printBarcode(this.poId, formData).then(
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
    // formData.append("width", this.printPoform.get('width').value);
    // formData.append("height", this.printPoform.get('height').value);
    // formData.append("unit", this.printPoform.get('unit').value);
    // formData.append("columns", this.printPoform.get('columns').value);
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

  products = this.data.POdata;
  poId = this.data.poId;

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
