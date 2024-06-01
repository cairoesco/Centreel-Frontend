import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, UntypedFormArray, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { StockService } from '../stock.service'
import { UtilsServiceService } from '../../../shared/services/utils-service.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddStockComponent implements OnInit {
  public myControl = new UntypedFormControl();
  public productVariantsForm: UntypedFormGroup;
  public dataArray: any = [];
  public vendors: any[] = [];
  public purchaseOrders: any[] = [];
  public VendorfilteredOptions: Observable<any[]>;
  // public PurchaseOrderNofilteredOptions: Observable<any[]>;
  public PurchaseOrderNofilteredOptions: any = [];
  public productsControl: any;
  public variantsControl: any
  public options = { prefix: '$ ', thousands: ',', decimal: '.', align: 'left', nullable: true, allowZero: false }
  public isReadOnly: boolean = false;
  productobj: any = new Object();

  constructor(
    private _formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddStockComponent>,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public stockService: StockService,
    public utility: UtilsServiceService
  ) {
    this.dataArray = [];
    this.dataArray.push(data);
    this.productVariantsForm = this.createproductVariantsForm();
    const control = <UntypedFormArray>this.productVariantsForm.controls['products'];
    this.dataArray.forEach(element => {
      control.push(this.addproducts(element.data));
    });
  }

  ngOnInit() {
    this.GetVendorList();
    this.productsControl = this.productVariantsForm.get('products') as UntypedFormArray;
    this.variantsControl = this.productsControl.at(0).get('productVariants') as UntypedFormArray;
    this.VendorfilteredOptions = this.variantsControl.at(0).get('vendor').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, "vendor"))
      );

    // this.PurchaseOrderNofilteredOptions = this.variantsControl.at(0).get('purchase_order_no').valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value, "po"))
    //   );

    /* po search filter */
    this.variantsControl.at(0).get('purchase_order_no').valueChanges.pipe(
      debounceTime(500),
    ).subscribe(val => {
      this.productobj['search'] = this.variantsControl.at(0).get('purchase_order_no').value;
      this.productobj['from_stock_page'] = 1;
      
      // this.productobj['pageIndex'] = 0;
      // this.productobj['pageSize'] = 20;
      
      this.stockService.getPoDetails(this.productobj)
      .subscribe((response: any) => {
        if (response.success) {
          this.PurchaseOrderNofilteredOptions = response.data;
        }
        else {
          this.utility.showSnackBar(response.message, { panelClass: 'error' });
        }
      });
      
    })
    /* po search filter */

    /* get thc and cbd value */
    this.variantsControl.at(0).get('batch_no').valueChanges.pipe(
      debounceTime(500),
    ).subscribe(val => {
      // this.productobj['batch_no'] = this.variantsControl.at(0).get('batch_no').value;
      // let variant_id = this.dataArray[0].data.variant_id;
      
      // if(this.productobj['batch_no'] != ''){
      //   this.stockService.getBatchDetails(variant_id, this.productobj)
      //   .subscribe((response: any) => {
      //     if (response.success) {
      //       this.variantsControl.at(0).get('thc').setValue(response.data.thc);
      //       this.variantsControl.at(0).get('cbd').setValue(response.data.cbd);
      //     }
      //   });
      // }else{
      //   this.variantsControl.at(0).get('thc').setValue('');
      //   this.variantsControl.at(0).get('cbd').setValue('');
      // }
      
    })
    /* get thc and cbd value */

    /* get batch number from GS1 barcode */
    this.variantsControl.at(0).get('batch_no').valueChanges.pipe(
      debounceTime(500),
    ).subscribe(val => {
      // let batch_value = this.variantsControl.at(0).get('batch_no').value;
      // if(batch_value){
      //   let value = batch_value;
      //   let index1 = value.indexOf('(01)')
      //   let index2 = value.indexOf('01')
      //   let batch_num: any;
      //   if (index1 == 0 && value.length > 17) {
      //     batch_num = value.substring(32)
      //   }
      //   else if (index2 == 0 && value.length > 15) {
      //     batch_num = value.substring(26)
      //   }
      //   else {
      //     batch_num = value
      //   }
      //   this.variantsControl.at(0).get('batch_no').setValue(batch_num);
      // }
    })
    /* get batch number from GS1 barcode */

    //Close dialog on route change
    this.router.events.subscribe(() => {
      this.dialogRef.close();
    });
  }

  private _filter(value: any, type: any): any[] {
    if(value){
      const filterValue = value.toLowerCase();
      if (type == "vendor") {
        return this.vendors.filter(option => option.name.toLowerCase().includes(filterValue));
      }
      else {
        return this.purchaseOrders.filter(option => option.purchase_order_no.toLowerCase().includes(filterValue));
      }
    }
  }

  isValue(po_name, store_index, index){
    if(!po_name){
      var _blank;
      const control: any = this.productVariantsForm.controls['products']
      const storeControl = control.at(store_index).get('productVariants');
      const vendorControl = storeControl.at(index).get('vendor');
      vendorControl.patchValue(_blank);
      this.isReadOnly = false;
    }
  }

  existingPO(po_name, store_index, index) {
    let data = _.find(this.PurchaseOrderNofilteredOptions, function (o) { return o.purchase_order_no.toLowerCase() == po_name.toLowerCase(); })
    const control: any = this.productVariantsForm.controls['products']
    const storeControl = control.at(store_index).get('productVariants');
    const vendorControl = storeControl.at(index).get('vendor');
    var _blank;
    if (typeof data == 'object') {
      vendorControl.setValue(data.vendor_name)
      this.isReadOnly = true;
      //vendorControl.disable();
    }
    else {
      vendorControl.patchValue(_blank);
      this.isReadOnly = false;
      //vendorControl.enable();
    }
    
  }

  //************************** Get existing vendor and purchase orders list *******************************/
  GetVendorList() {
    this.stockService.getVendorList()
      .subscribe((response: any) => {
        if (response.success) {
          this.vendors = response.data.vendors;
          this.purchaseOrders = response.data.purchase_orders;
        }
      });
  }

  //******************** Create product variant form **************** */
  createproductVariantsForm() {
    return this._formBuilder.group({
      products: this._formBuilder.array([])
    });
  }

  private addproducts(parentData) {
    let variant_name = (Boolean(parentData) && Boolean(parentData.variant_name)) ? parentData.variant_name : '';
    return this._formBuilder.group({
      name: [variant_name],
      product_name: [this.data.product_name],
      productVariants: this.addproductVariants(parentData)
    });
  }

  private addproductVariants(parentVariantData) {
    let regx = (this.data.product_unit != 'pcs') ? '^[0-9]+(\.[0-9][0-9]?)?' : '^[0-9]*$';
    let arr = new UntypedFormArray([])
    let variantArr = this._formBuilder.group({
      purchase_order_no: ['', [Validators.required]],
      value_added: ['', Validators.compose([Validators.required, Validators.min(1), Validators.pattern(regx)])],
      batch_no: ['', [Validators.required, spaceValidator]],
      // thc: [''],
      // cbd: [''],
      stock_price: [0, [Validators.required, Validators.min(0)]],
      reorder: [Boolean(parentVariantData) ? parentVariantData.reorder : 0, [Validators.required, Validators.min(0)]],
      vendor: [''],
      variant_id: [Boolean(parentVariantData) ? parentVariantData.variant_id : 0],
      selling_price: [Boolean(parentVariantData) ? parentVariantData.variant_price : 0],
      storage_id: [this.data.storage_id],
      total: 0,
      status: 1,
      product_id: [this.data.productId],
      index: [this.data.index],
      source_page: ['add_stock'],
    })
    if (this.data.product_type_slug == 'cannabis') {
      variantArr.controls["stock_price"].setValidators([Validators.required, Validators.max(parentVariantData.variant_price), Validators.min(0)]);
      variantArr.controls["stock_price"].updateValueAndValidity();
      variantArr.controls['batch_no'].setValidators([Validators.required,spaceValidator]);
      variantArr.controls['purchase_order_no'].setValidators([Validators.required]);
      variantArr.addControl('thc', new UntypedFormControl(null));
      variantArr.addControl('cbd', new UntypedFormControl(null));
    }else{
      variantArr.controls['batch_no'].clearValidators();
      variantArr.controls['purchase_order_no'].clearValidators();
      variantArr.controls['stock_price'].clearValidators();
      variantArr.removeControl('thc')
      variantArr.removeControl('cbd')
    }
    variantArr.controls['batch_no'].updateValueAndValidity();
    variantArr.controls['purchase_order_no'].updateValueAndValidity();
    variantArr.controls['stock_price'].updateValueAndValidity();
    arr.push(variantArr);
    return arr;
  }

  onSubmit(formData) {
    formData.value.products[0].productVariants[0].purchase_order_no = (formData.value.products[0].productVariants[0].purchase_order_no).trim();
    if (formData.value.products[0].productVariants[0].purchase_order_no != '') {
      formData.value.products[0].productVariants[0].chain_id = this.data.chain_id;
      formData.value.products[0].productVariants[0].is_received = 1;
      formData.value.products[0].productVariants[0].actual_qty = formData.value.products[0].productVariants[0].value_added;
    }else{
      formData.value.products[0].productVariants[0].chain_id = this.data.chain_id;
    }
    formData.value.products[0].productVariants[0].total = this.productVariantsForm.value.products[0].productVariants[0].stock_price * this.productVariantsForm.value.products[0].productVariants[0].value_added
    
    var selling_error = false;
    if(this.productVariantsForm.value.products[0].productVariants[0].stock_price > this.productVariantsForm.value.products[0].productVariants[0].selling_price){
      this.utility.showSnackBar("Purchase price must be equal or less than selling price", { panelClass: 'error' });
      selling_error = true;
    }
    
    if (this.productVariantsForm.valid && !selling_error) {
      if (!Boolean(this.productVariantsForm.value.products[0].productVariants[0].selling_price) || this.productVariantsForm.value.products[0].productVariants[0].stock_price <= this.productVariantsForm.value.products[0].productVariants[0].selling_price) {
        const data = new FormData();
        data.append("products", JSON.stringify(formData.value.products[0].productVariants))
        
        this.stockService.addStock(data).subscribe((response: any) => {
          if (response.success) {
            this.utility.showSnackBar(response.message);
            this.dialogRef.close(formData.value.products[0].productVariants);
          }
        });
      }
    }
  }

  getGTIN(){
      let batch_value = this.variantsControl.at(0).get('batch_no').value;
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
        this.variantsControl.at(0).get('batch_no').setValue(batch_num);

        if(batch_num && batch_num != ''){
          /* find thc cbd value from batch number */
          this.productobj['batch_no'] = this.variantsControl.at(0).get('batch_no').value;
          let variant_id = this.dataArray[0].data.variant_id;
          
          if(this.productobj['batch_no'] != ''){
            this.stockService.getBatchDetails(variant_id, this.productobj)
            .subscribe((response: any) => {
              if (response.success) {
                this.variantsControl.at(0).get('thc').setValue(response.data.thc);
                this.variantsControl.at(0).get('cbd').setValue(response.data.cbd);
              }
            });
          }else{
            this.variantsControl.at(0).get('thc').setValue('');
            this.variantsControl.at(0).get('cbd').setValue('');
          }
          /* find thc cbd value from batch number */
        }
      }
  }
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