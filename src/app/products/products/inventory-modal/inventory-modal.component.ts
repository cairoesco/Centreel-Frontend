import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators,AbstractControl,FormControl } from '@angular/forms';
import { UtilsServiceService } from '../../../shared/services/utils-service.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as _ from 'lodash';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-inventory-modal',
  templateUrl: './inventory-modal.component.html',
  styleUrls: ['./inventory-modal.component.scss']
})
export class InventoryModalComponent implements OnInit {
  public form: UntypedFormGroup;
  public countryList: any;
  public provinceList: any;
  public cityList: any;
  public minDate = new Date(2018, 9, 17);
  public maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  public VendorfilteredOptions: Observable<any[]>;
  public options = { prefix: '$ ', thousands: ',', decimal: '.', align: 'left', nullable: true, allowZero: false }
  public PurchaseOrderNofilteredOptions: Observable<any[]>;
  public isReadOnly: boolean = false;
  constructor(private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<InventoryModalComponent>,
    public utils: UtilsServiceService,
    @Inject(MAT_DIALOG_DATA) public data: InventoryDialogData) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [''],
      storage_id: [''],
      vendor: [''],
      stock_price: [''],
      value_added: ['', [Validators.required]],
      purchase_order_no: [''],
      batch_no: ['',[Validators.required, spaceValidator]],
      thc: [''],
      cbd: [''],
      purchase_date: [''],
      total: [null],
      unit_price: [null, [Validators.required]],
      reorder: [''],
      source_page:['add_product'],
      is_received:[0]
    });

    /* batch no validation */
    if(this.data.product_type == 'cannabis'){
      this.form.get('batch_no').setValidators([Validators.required, spaceValidator]);
    }else{
      this.form.get('batch_no').clearValidators();
    }
    this.form.get('batch_no').updateValueAndValidity();
    /* batch no validation */

    this.VendorfilteredOptions = this.form.get('vendor').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, "vendor"))
      );

    this.PurchaseOrderNofilteredOptions = this.form.get('purchase_order_no').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, "po"))
      );

    /* get batch number from GS1 barcode */
    this.form.get('batch_no').valueChanges.pipe(
      debounceTime(500),
    ).subscribe(val => {
      let batch_value = this.form.get('batch_no').value;
      if(batch_value){
        let value = batch_value;
        let index1 = value.indexOf('(01)')
        let index2 = value.indexOf('01')
        let batch_num: any;
        if (index1 == 0 && value.length > 17) {
          batch_num = value.substring(32)
        }
        else if (index2 == 0 && value.length > 15) {
          batch_num = value.substring(26)
        }
        else {
          batch_num = value
        }
        this.form.get('batch_no').setValue(batch_num);
      }
    })
    /* get batch number from GS1 barcode */

  }
  private _filter(value: any, type: any): any[] {
    if (value) {
      const filterValue = value.toLowerCase();
      if (type == "vendor") {
        return this.data.vendors.filter(option => option.name.toLowerCase().includes(filterValue));
      }
      else {
        return this.data.purchase_orders.filter(option => option.purchase_order_no.toLowerCase().includes(filterValue));
      }
    }
  }

  isValue(value){
    if(!value){
      var _blank;
      this.form.get('vendor').patchValue(_blank);
      this.isReadOnly = false;
    }
  }
  existingPO(po_name) {
    let data = _.find(this.data.purchase_orders, function (o) { return o.purchase_order_no.toLowerCase() == po_name.toLowerCase(); })
    var _blank;
    if (typeof data == 'object') {
      this.form.get('vendor').setValue(data.vendor_name)
      this.isReadOnly = true;
    }
    else {
      this.form.get('vendor').patchValue(_blank);
      this.isReadOnly = false;
    }
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      //let stockPrice = this.form.get('total').value / this.form.get('value_added').value;
      this.form.get('purchase_order_no').setValue(this.form.get('purchase_order_no').value.trim())
    
      let stockPrice = this.form.get('unit_price').value;
      let total = stockPrice*this.form.get('value_added').value;
      this.form.get('total').setValue(total);
      this.form.get('stock_price').setValue(stockPrice);

      if(this.form.get('purchase_order_no').value != ''){
        this.form.get('is_received').setValue(1);
      }
      
      this.dialogRef.close(this.form);
    }
  }

  /* batch value added */
  public selectedValue: boolean = false;
  selected_result(val){
    if(val != ''){
      this.selectedValue = true;
      // this.form.get('thc').enable();
      // this.form.get('cbd').enable();
    }else{
      this.selectedValue = false;
      this.form.get('thc').setValue('');
      this.form.get('cbd').setValue('');
      // this.form.get('thc').disable();
      // this.form.get('cbd').disable();
    }
  }
  /* batch value added */
}
export interface InventoryDialogData {
  vendors: any;
  purchase_orders: any;
  product_type:any;
}

/* space validator for batch number field */
export function spaceValidator(control: AbstractControl) {
  if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
      // console.log(control.value);
      return { required: true }
  }
  else {
      return null;
  }
}
/* space validator for batch number field */
