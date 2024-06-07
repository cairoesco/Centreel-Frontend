import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormArray, UntypedFormGroup, Validators, FormControl, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { Observable, timer, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { debounceTime } from 'rxjs/operators';
import { PurchaseOrderService } from '../purchase-order.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {

  public form: UntypedFormGroup;
  public addProductForm: UntypedFormGroup;
  public countryList: any;
  public provinceList: any;
  public cityList: any;
  public minDate = new Date(2018, 9, 17);
  public maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  public VendorfilteredOptions: Observable<any[]>;
  public options = { prefix: '$ ', thousands: ',', decimal: '.', align: 'left', nullable: true, allowZero: false }
  public PurchaseOrderNofilteredOptions: Observable<any[]>;
  public isReadOnly: boolean = false;
  public formobj: any = new Object();

  public rawDetail; //new
  public categoryList; //new
  public unitMeasurement = [{ slug: "pcs", unit_name: "Pieces" },] //new
  //for barcode mat chip
  @ViewChild('barcodeList') barcodeList; //new
  readonly separatorKeysCodes: number[] = [ENTER, COMMA]; //new
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;

  constructor(private fb: UntypedFormBuilder, private api: PurchaseOrderService, public dialogRef: MatDialogRef<CreateProductComponent>,
    public utils: UtilsServiceService,
    @Inject(MAT_DIALOG_DATA) public data: CreateProductComponent) { }

  ngOnInit() {
    // console.log(this.data['storage_id']);
    this.getRawDetails()
    this.addProductForm = this.fb.group({
      chain_id: [''],
      store_id: [''],
      type_id: ['', Validators.required],
      product_category: ['', Validators.required],
      product_name: ['', Validators.required],
      product_unit: [this.unitMeasurement[0].slug, Validators.required],
      brand: [''],
      // product_sku: ['', [Validators.required]],
      // barcode: [[]],
      // barcodes: [''],
      // is_product_variant: ['0'],
      is_product_variant: ['1'],
      price_differ_for_store: ['1'],
      variant_price: this.fb.array([]),
      variants: this.fb.array([]),
      variant_properties: this.fb.array([]), //new
    });
    this.isThisProductHasVariants(1);
    // this.PricingDiffersPerStoreChange(1);
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // formData.append("product_status", '1');
    if (this.addProductForm.valid) {
      let itemList = this.addProductForm.value.variants;
      itemList.forEach((key) => {
        key["variant_price"] = this.addProductForm.value.variant_price;
      })
      this.dialogRef.close(this.addProductForm);
    }
  }

  public stores = [];
  public storeid: number;
  public chains = [];
  getRawDetails() {
    this.api.rawDetailsProducts()
      .subscribe((response: any) => {
        if (response.status) {
          let storage_id = this.data['storage_id'];

          this.rawDetail = response.data;
          this.rawDetail.product_types = _.filter(this.rawDetail.product_types, function (o) { return o.type_name !== 'Flower'; });
          this.rawDetail.warehouses = _.filter(this.rawDetail.warehouses, function (o) { return o.storage_id == storage_id; });
          let storeid = this.rawDetail.warehouses[0].store_id;
          this.rawDetail.stores = _.filter(this.rawDetail.stores, function (o) { return o.store_id == storeid; });
          this.PricingDiffersPerStoreChange(1);

          this.chains = this.rawDetail.chains;
          this.addProductForm.controls.chain_id.setValue(this.chains[0].chain_id);
          this.addProductForm.controls.store_id.setValue(storeid);
        }
      });
  }

  subCategory(evt, event) {
    if (event.isUserInput) {
      this.categoryList = this.rawDetail.product_types.find(x => x.type_id === evt);
      //this.categoryList.sort();

    }
  }

  /* barcodes */
  addBarcode(event: MatChipInputEvent, index) {
    let input = event.input;
    let value = event.value;

    const control = (<UntypedFormArray>this.addProductForm.controls['variants']).at(index).get('barcode') as UntypedFormArray;
    const control1 = (<UntypedFormArray>this.addProductForm.controls['variants']).at(index).get('barcodes') as UntypedFormArray;

    // let controlValue: any = this.addProductForm.controls.barcode.value
    let controlValue: any = control.value
    // if (value && value != null)
    //   controlValue.push(value);

    if (value && value != null) {
      /* find gtin value if standard barcode */
      if (value) {
        let index1 = value.indexOf('(01)')
        let index2 = value.indexOf('01')
        let barcode: any;
        let batch_num: any;
        // let exp_date: any;
        if (index1 == 0 && value.length > 17) {
          barcode = value.substring(4, 18)
          batch_num = value.substring(32)
          // exp_date = value.substring(22, 28)
        }
        else if (index2 == 0 && value.length > 15) {
          barcode = value.substring(2, 16)
          batch_num = value.substring(26)
          // exp_date = value.substring(18, 24)
        }
        else {
          barcode = value
        }
        value = barcode;
      }
      /* find gtin value if standard barcode */
      controlValue.push(value);
    }

    control.setValue(controlValue);
    control1.setValue(null)

    // this.addProductForm.controls.barcode.setValue(controlValue)
    // this.addProductForm.controls.barcodes.setValue('')
  }

  // removeBarcode1(barcode_val): void {
  //   let controlValue: any = this.addProductForm.controls.barcode.value;
  //   const index = controlValue.indexOf(barcode_val);
  //   if (index >= 0) {
  //     controlValue.splice(index, 1);
  //   }

  // }

  removeBarcode(barcode_val, index): void {
    const control = (<UntypedFormArray>this.addProductForm.controls['variants']).at(index).get('barcode') as UntypedFormArray;
    let controlValue: any = control.value;

    const index_value = controlValue.indexOf(barcode_val);

    if (index >= 0) {
      controlValue.splice(index_value, 1);
    }
    // if(controlValue.length == 0 && this.isCanabis && !this.isAuthorized){
    //   this.barcodeList.errorState = true;
    // }else{
    //   this.barcodeList.errorState = false;
    // }
  }

  /* price store wise */
  public chainwiseStores = [];
  PricingDiffersPerStoreChange(val) {
    if (val == 1) {
      this.addProductForm.addControl('variant_price', this.fb.array([]))
      const SellingPriceControl = <UntypedFormArray>this.addProductForm.controls['variant_price'];

      this.rawDetail.stores.forEach(element => {
        let data = this.addProductStoreWiseSellingPrice(element);
        SellingPriceControl.push(data);
      });
    }
  }

  private addProductStoreWiseSellingPrice(data) {
    return this.fb.group({
      store_id: [data.store_id],
      name: [data.name],
      selling_price: [0.00],
      special_price: [0.00],
    });
  }
  /* price store wise */

  /* auto generate barcode */
  auto_generate_barcode(index) {
    const control = (<UntypedFormArray>this.addProductForm.controls['variants']).at(index).get('barcode') as UntypedFormArray;
    let control_val = control.value
    // let userData = this.utils.getSessionData('currentUser');
    // let uname = (userData.name).charAt(0).toUpperCase();

    // let pname = this.addProductForm.get('product_name').value ? this.addProductForm.get('product_name').value : 'P';
    // let product_module = 'O';
    // let product_name = product_module + pname.charAt(0).toUpperCase();
    // let variant_name = product_name + "v";
    let timestamp = +(new Date());
    // let username = variant_name + timestamp + uname;
    control_val.push(timestamp)
    control.setValue(control_val);
  }
  /* auto generate barcode */

  isThisProductHasVariants(event) {
    if (event.value == 0) {

    } else {
      const controlVariants = <UntypedFormArray>this.addProductForm.controls['variants'];
      controlVariants.controls = [];
      // const VariantOption = <FormArray>this.addProductForm.controls['variant_properties'];
      // VariantOption.controls = [];
      // VariantOption.push(this.addnewProductVariant());
      controlVariants.push(this.addnewProductVariant());
    }
  }

  private addnewProductVariant() {

    return this.fb.group({
      variant_name: ['', this.first == 0 ? [Validators.required] : []],
      variant_sku: ['', this.first == 0 ? [Validators.required] : [], [this.customAsyncValidator()]],
      price_differ_for_store: ['1'],
      barcode: [[]],
      barcodes: [''],
    });
  }
  public first = 0;
  private addvariant_propertiesOption() {
    this.first = this.first + 1;
    const controlVariant = <UntypedFormArray>this.addProductForm.controls['variants'];
    controlVariant.push(this.addnewProductVariant());
    // this.scroll(this.first-1)
  }

  public scroll(id: any) {
    let element = document.getElementById(id)
    element.scrollIntoView();
  }

  removeUnit(i) {
    this.first = this.first - 1;
    const control = <UntypedFormArray>this.addProductForm.controls['variants'];
    control.removeAt(i);
    var temparray = [];
    for (var j = 0; j < control.length; j++) {
      temparray.push(control.value[j].option_values);
    }
  }

  setVariantName(val) {
    const mainControl: any = this.addProductForm.controls['variants'];
    // console.log(mainControl.controls[0]);
    // const variant_name = mainControl.controls[0].controls['variant_name'].setValue(val);
  }

  customAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {


      if (control.value != '') {
        this.formobj.variant_sku = control.value;
        this.formobj.chain_id = this.chains[0].chain_id;

        return timer(1000).pipe(
          switchMap(() => {
            return this.api.isExist(this.formobj).pipe(
              map(res => {
                if ((res.data).length > 0) {
                  return { 'asyncValidation': 'failed' };
                }
                return null;
              })
            );
          })
        );
      }
      // return null;
      return of(null);
    }
  }

}
