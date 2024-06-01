import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormArray, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FileUploader } from 'ng2-file-upload';
import { ProductService } from '../../product.service';
import { Options, LabelType } from 'ng5-slider';
import * as _ from 'lodash';
import { UtilsServiceService } from '../../../shared/services/utils-service.service';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { InventoryModalComponent } from '../inventory-modal/inventory-modal.component';
import { SupplierDialogComponent } from '../supplier-dialog/supplier-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { CustomValidators } from 'ng2-validation';
import { DefaultProductSearchComponent } from '../default-product-search/default-product-search.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter }
  ],
})

export class AddProductComponent implements OnInit {

  public innerHeight: any;
  public type: string = 'component';
  public indexofTab = 0;
  public form: UntypedFormGroup;
  public addStore: UntypedFormGroup;
  public imageSrc: any;
  public heightOfY;
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public numOfSuppliers = 0;
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean;
  public hasAnotherDropZoneOver: boolean;
  public response: string;
  public arrayOfImages = [];
  public imagesOfarray = [];
  public deleteFileArray = [];
  public isTHCGreater = false;
  public isCBDGreater = false;
  public rawDetail;
  public categoryList;
  //public unitMeasurement = [{ slug: "ml", unit_name: "Milliliter" }, { slug: "pcs", unit_name: "Pieces" },]
  public unitMeasurement = [{ slug: "pcs", unit_name: "Pieces" },]
  public CannabisDryWeightUnit = [{ slug: "gm", unit_name: "Grams" }]
  public cityList: any;
  public isGreaterThc: any;
  public is_add_product: boolean = false;
  public is_edit_product: boolean = false;
  public is_view_product: boolean = false;
  public addProductForm: UntypedFormGroup;
  public image_option = [{ name: 'Auto-Generated', value: 0 }, { name: 'Gallery', value: 1 }];
  public radio_option = [{ name: 'Yes', value: 1 }, { name: 'No', value: 0 }];
  public isAuthorized = false;
  public isSubmitted = false;
  public isCanabis = false;
  public isOnVariantSellingPrice = false;
  public isOnSellingPrice = false;
  public stores = [];
  public warehouses = [];
  public chains = [];
  public provinceList: any;
  public createProduct: boolean = false;
  public selectedData = [];
  public chainwiseStores = [];
  public storewiseTaxes = [];
  public priceOptions = { prefix: '$ ', thousands: ',', decimal: '.', align: 'left', nullable: true, allowZero: false }

  @ViewChild('barcodeList') barcodeList;

  public options: Options = {
    floor: 0,
    ceil: 100,
    showSelectionBar: true,
    translate: (value: number, label: LabelType): string => {
      return value + '%';
    },
    getSelectionBarColor: (value: number): string => {
      return '#28b127';
    }
  };
  public barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE ALL',
    //buttonColor: 'primary',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private api: ProductService,
    public formBuilder: UntypedFormBuilder,
    public utility: UtilsServiceService,
    public dialog: MatDialog,
    public refVar: ChangeDetectorRef) {
    this.fileUploader();

    let userData = this.utility.getSessionData('currentUser');
    if (userData.user_role && (userData.user_role.findIndex(e => ['admin', 'superadmin'].includes(e)) > -1)) {
      this.isAuthorized = true;
    } else {
      this.isAuthorized = false;
    }
    this.utility.indexofTab = 0;
  }
  //#region ______________________ Default product search dialog ______________________*/
  DefaultSearchDialogOpen() {
    const dialogRef = this.dialog.open(DefaultProductSearchComponent, {
      disableClose: true,
      data: { categoryList: this.rawDetail.product_types }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

  //#endregion ______________________ End of Identification and Inventory section all functions ______________________*/

  //#region ______________________ Add Product Form group ______________________/
  addProductFormGroup() {
    this.addProductForm = this.formBuilder.group({
      product_name: ['', Validators.required],
      // vendor: ['--'],
      brand: ['', Validators.required],
      chain_id: ['', Validators.required],
      store_id: ['', [Validators.required]],
      taxrate_id: [''],
      type_id: ['', Validators.required],
      cannabis_type: ['', Validators.required], //cannabis type
      specie_id: [''], //species id
      product_category: ['', Validators.required],
      default_image: [''],
      product_image: [''],
      product_unit: [this.unitMeasurement[0].slug, Validators.required],
      product_highlights: [''],
      variants_different_images: [''],
      is_taxable: ['Y'],
      product_attributes: [''],
      track_inventory: [false],
      product_suppliers: this.formBuilder.array([]),
      productProperties: this.formBuilder.array([]),
      variant_properties: this.formBuilder.array([]),
      thc1: [0, Validators.required],
      thc2: [0, Validators.required],
      cbd1: [0, Validators.required],
      cbd2: [0, Validators.required],
      product_thc: [''],
      product_cbd: [''],
      is_product_variant: ['0'],
      product_sku: ['', [Validators.required]],
      govt_id: [''],
      package_capacity: [1, [Validators.required]],
      //barcode: [''],
      barcode: [[]],
      barcodes: ['', Validators.minLength(8)],
      product_provinces: this.formBuilder.array([]),
      price_differ_for_store: ['0'],
      selling_price: [null], //price_differ_for_store==0
      special_price: [null], //price_differ_for_store==0
      //      selling_price: [null, [Validators.required]], //price_differ_for_store==0
      variant_price: this.formBuilder.array([]),
      inventory: this.formBuilder.array([]),
      //************************** Is Variants ************************************
      variants: this.formBuilder.array([]),
      dry_weight: [0.00, [Validators.required]],
      cannabis_unit: ['gm'],
      cannabis_type_id: [''],
      product_suppliers_ids: [''],
      product_suppliers_data: [[]],
    });
  }

  /* barcodes */
  addBarcode(event: MatChipInputEvent) {
    let input = event.input;
    let value = event.value;
    let controlValue: any = this.addProductForm.controls.barcode.value
    // if (value && value != null)
    //   controlValue.push(value);
    if (value && value != null && value.length > 7) {
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
      if (this.isAuthorized) {
        controlValue.push(event.value); //if admin then pass full barcode withou extract barcode, batch, expire date.
      } else {
        controlValue.push(value);
      }
      // controlValue.push(value);
    }

    if (controlValue.length == 0 && this.isCanabis && !this.isAuthorized) {
      this.barcodeList.errorState = true;
    } else {
      this.barcodeList.errorState = false;
    }
    this.addProductForm.controls.barcode.setValue(controlValue)
    this.addProductForm.controls.barcodes.setValue('')
  }

  removeBarcode(barcode_val): void {
    let controlValue: any = this.addProductForm.controls.barcode.value;
    const index = controlValue.indexOf(barcode_val);
    if (index >= 0) {
      controlValue.splice(index, 1);
    }
    if (controlValue.length == 0 && this.isCanabis && !this.isAuthorized) {
      this.barcodeList.errorState = true;
    } else {
      this.barcodeList.errorState = false;
    }
  }
  /* auto generate barcode */
  auto_generate_barcode(index) {
    const control = (<UntypedFormArray>this.addProductForm.controls['barcode']) as UntypedFormArray;
    let control_val = control.value

    //let userData = this.utility.getSessionData('currentUser');
    //let uname = (userData.name).charAt(0).toUpperCase();

    //let pname = this.addProductForm.get('product_name').value ? this.addProductForm.get('product_name').value : 'P';
    //let product_module = 'O';
    //let product_name = product_module + pname.charAt(0).toUpperCase();
    //let variant_name = product_name + "v";
    let timestamp = +(new Date());
    //let username = variant_name + timestamp + uname;
    control_val.push(timestamp)

    control.setValue(control_val);
  }

  auto_generate_barcode_variant(index) {
    const control = (<UntypedFormArray>this.addProductForm.controls['variants']).at(index).get('barcode') as UntypedFormArray;
    let control_val = control.value

    // let userData = this.utility.getSessionData('currentUser');
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
  addBarcodeVariant(event: MatChipInputEvent, index) {
    let input = event.input;
    let value = event.value;
    const control = (<UntypedFormArray>this.addProductForm.controls['variants']).at(index).get('barcode') as UntypedFormArray;
    const control1 = (<UntypedFormArray>this.addProductForm.controls['variants']).at(index).get('barcodes') as UntypedFormArray;
    let variantControl: any = this.addProductForm.controls['variants'];

    let controlValue: any = control.value
    // if (value && value != null)
    //   controlValue.push(value);

    if (value && value != null && value.length > 7) {
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
      if (this.isAuthorized) {
        controlValue.push(event.value); //if admin then pass full barcode withou extract barcode, batch, expire date.
      } else {
        controlValue.push(value);
      }
      // controlValue.push(value);
    }


    if (controlValue.length == 0 && this.isCanabis && !this.isAuthorized) {
      this.barcodeList.errorState = true;
    } else {
      this.barcodeList.errorState = false;
    }
    control.setValue(controlValue);
    control1.setValue(null)
  }

  removeBarcodeVariant(barcode_val, index): void {
    const control = (<UntypedFormArray>this.addProductForm.controls['variants']).at(index).get('barcode') as UntypedFormArray;
    let controlValue: any = control.value;

    const index_value = controlValue.indexOf(barcode_val);

    if (index >= 0) {
      controlValue.splice(index_value, 1);
    }
    if (controlValue.length == 0 && this.isCanabis && !this.isAuthorized) {
      this.barcodeList.errorState = true;
    } else {
      this.barcodeList.errorState = false;
    }
  }
  /* barcodes */

  //#endregion

  //#region ______________________ General section all functions ______________________/

  /* store wise taxes */
  selectedStore(store_id, event) {
    if (event.isUserInput) {
      this.storewiseTaxes = [];
      /* for getting store wise taxes */
      this.rawDetail.stores.forEach(element => {
        if (element.store_id == store_id) {
          this.storewiseTaxes.push(element.taxrates)
        }
      });
      /* for getting store wise taxes */
    }
  }
  /* store wise taxes */

  //************************ Data change as chain selected ******************/
  selectedChain(chain_id, event) {
    this.selectedData = [];

    if (event.isUserInput) {
      this.chainwiseStores = [];
      if (this.rawDetail.chains.length > 0) {

        /* for getting chain wise stores */
        this.rawDetail.stores.forEach(element => {
          if (element.chain_id == chain_id) {
            this.chainwiseStores.push(element)
          }
        });
        // this.chainwiseStores = [... this.chainwiseStores]
        /* for getting chain wise stores */

        this.rawDetail.warehouses.forEach(element => {
          if (element.chain_id == chain_id) {
            this.selectedData.push(element)
          }
        });
      }

      /* add validation and remove validation based on admin role */
      if (this.rawDetail.chains.length > 1) {
        this.addProductForm.get('store_id').setValidators([Validators.required]);
        this.addProductForm.get('taxrate_id').setValidators([Validators.required]);
      } else {
        this.addProductForm.get('store_id').clearValidators();
        this.addProductForm.get('taxrate_id').clearValidators();
      }
      this.addProductForm.get('store_id').updateValueAndValidity();
      this.addProductForm.get('taxrate_id').updateValueAndValidity();
      /* add validation and remove validation based on admin role */

      if (this.selectedData.length > 0) {
        const InventoryControl = <UntypedFormArray>this.addProductForm.controls['inventory'];
        while (InventoryControl.length !== 0) {
          InventoryControl.removeAt(0)
        }
        this.selectedData.forEach(element => {
          let data = this.addProductStoreWiseInventory(element);
          InventoryControl.push(data);
        });
      }
    }
  }
  //****************** Fetch Subcategory from selected category ******************/
  subCategory(evt, event) {
    if (event.isUserInput) {
      this.categoryList = this.rawDetail.product_types.find(x => x.type_id === evt);
      //this.categoryList.sort();
      if (this.categoryList.type_slug == 'cannabis') {
        this.isCanabis = true;
        this.addProductForm.get("is_taxable").setValue('Y');
        this.addProductForm.controls.is_taxable.disable();
        this.addProductForm.get('brand').setValidators([Validators.required]);
        this.addProductForm.get('dry_weight').setValidators([Validators.required]);
        this.addProductForm.get('cannabis_type').setValidators([Validators.required]);
        this.barcodeList.errorState = true;
      }
      else {
        this.isCanabis = false;
        this.addProductForm.get("is_taxable").setValue('Y');
        this.addProductForm.controls.is_taxable.enable();
        this.addProductForm.get('brand').clearValidators();
        this.addProductForm.get('dry_weight').clearValidators();
        this.addProductForm.get('cannabis_type').clearValidators();
      }
      if (this.addProductForm.get('is_product_variant').value == 1) {
        this.variantBarcodeValidation();
      }
      else {
        this.barcodeValidation(this.addProductForm);
      }
      this.addProductForm.get('brand').updateValueAndValidity();
      this.addProductForm.get('cannabis_type').updateValueAndValidity();
    }
  }
  variantBarcodeValidation() {
    let variantsArray: any = this.addProductForm.controls['variants'];
    variantsArray.controls.forEach(element => {
      this.barcodeValidation(element);
    });
  }

  //************THC and CBD validation *************/
  isGreater(evt) {
    if (evt == "thc") {
      var thc1 = this.addProductForm.get('thc1').value;
      var thc2 = this.addProductForm.get('thc2').value;
      if (thc1 <= thc2) {
        this.isTHCGreater = false;
      }
      else {
        this.isTHCGreater = true;
      }
    }
    else if (evt == "cbd") {
      var cbd1 = this.addProductForm.get('cbd1').value;
      var cbd2 = this.addProductForm.get('cbd2').value;
      if (cbd1 <= cbd2) {
        this.isCBDGreater = false;
      }
      else {
        this.isCBDGreater = true;
      }
    }

  }

  //#endregion ______________________ End of General section all functions ______________________/

  //#region ______________________ Images section all functions ______________________/

  //****************************** File Upload *************************************/
  fileUploader() {
    this.uploader = new FileUploader({
      disableMultipart: true,
      formatDataFunctionIsAsync: true,
      formatDataFunction: async item => {
        return new Promise((resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
    this.response = '';
  }


  public fileDragged() {
    this.uploader.queue.forEach(element => {
      let imageElement: any = element.file.rawFile;
      if (["image/jpeg", "image/jpg", "image/png", 'image/gif'].indexOf(imageElement.type) > -1) {
        let imageFile: any;
        const reader = new FileReader();
        reader.onload = (res) => {
          imageFile = reader.result;
          this.arrayOfImages.push({ file_id: 0, file_name: element.file.name, file_path: imageFile });
        }
        reader.readAsDataURL(imageElement);
        this.refVar.detectChanges();
        this.imagesOfarray.push(element.file.rawFile);
      }
      else {
        this.utility.showSnackBar("Unsupported file format", { panelClass: 'error' });
      }
    });
    this.uploader.clearQueue();
  }
  public fileOverBase(e: any, type): void {
    this.hasBaseDropZoneOver = e;
    this.fileDragged();
  }
  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  //****************************** File Upload End *************************************/

  //****************************** Delete File **************************************/
  DeleteImage(index) {
    if (index !== -1) {
      this.arrayOfImages.splice(index, 1);
      this.imagesOfarray.splice(index, 1);
      // this.addProductForm.get('file_input').setValue('');
    }
  }

  //#endregion ______________________  End of Images section all functions ______________________ */

  //#region ______________________ Variant section all functions ______________________/

  isThisProductHasVariants(event) {
    if (event.value == 1) {
      this.addProductForm.removeControl('selling_price')
      this.addProductForm.removeControl('special_price')
      this.addProductForm.removeControl('product_sku')
      this.addProductForm.removeControl('barcode')
      this.addProductForm.removeControl('inventory')
      this.addProductForm.removeControl('package_capacity')
    }
    else {
      const controlVariants = <UntypedFormArray>this.addProductForm.controls['variants'];
      controlVariants.controls = [];
      const VariantOption = <UntypedFormArray>this.addProductForm.controls['variant_properties'];
      VariantOption.controls = [];
      VariantOption.push(this.addnewProductVariant());

      if (!this.isAuthorized) {
        this.addProductForm.addControl('selling_price', new UntypedFormControl(null, Validators.required))
      } else {
        this.addProductForm.addControl('selling_price', new UntypedFormControl(null))
      }
      this.addProductForm.addControl('special_price', new UntypedFormControl(null))
      this.addProductForm.addControl('package_capacity', new UntypedFormControl(1, Validators.required))
      this.addProductForm.addControl('product_sku', new UntypedFormControl('', Validators.required))
      if (this.isCanabis && !this.isAuthorized)
        this.addProductForm.addControl('barcode', new UntypedFormControl('', Validators.required))

      else
        this.addProductForm.addControl('barcode', new UntypedFormControl(''))

      this.addProductForm.addControl('inventory', this.formBuilder.array([]))
      if (this.selectedData.length > 0) {
        const InventoryControl = <UntypedFormArray>this.addProductForm.controls['inventory'];
        this.selectedData.forEach(element => {
          let data = this.addProductStoreWiseInventory(element);
          InventoryControl.push(data);
        });
      }
    }
  }

  private addnewProductVariant() {
    return this.formBuilder.group({
      newvariantCode: [''],
      option_values: this.formBuilder.array([]),
      option: [''],
    });
  }

  private addProductStoreWiseInventory(data) {
    return this.formBuilder.group({
      storage_id: [data.storage_id],
      name: [data.name],
      inventories: this.formBuilder.array([]),
    });
  }
  removeVariantChip(i, fruit): void {
    const index = i.value.option_values.indexOf(fruit);
    const control = <UntypedFormArray>this.addProductForm.controls['variant_properties'];
    if (index >= 0) {
      i.value.option_values.splice(index, 1);
      var temparray = [];
      for (var j = 0; j < control.length; j++) {
        temparray.push(control.value[j].option_values)
      }
      const controlVariants = <UntypedFormArray>this.addProductForm.controls['variants'];
      var variantsArray = this.generateVariants(temparray);
      controlVariants.controls = [];
      variantsArray.forEach(element => {
        controlVariants.push(this.addUnitsVariantOptions(element));
      });
    }
  }

  //************* Variants generate ****************/
  private generateVariants(data) {
    var r = [], arg = data, max = arg.length - 1;
    function helper(arr, i) {
      for (var j = 0, l = arg[i].length; j < l; j++) {
        var a = arr.slice(0);
        a.push(arg[i][j]);
        if (i == max)
          r.push(a);
        else
          helper(a, i + 1);
      }
    }
    helper([], 0);
    return r;
  }

  //*********************** Add Units of Varients **********************************/ 
  private addUnitsVariantOptions(data) {
    let userData = this.utility.getSessionData('currentUser');

    var varient = data.join("-");
    let fbgroup = this.formBuilder.group({
      is_active_variant: [1],
      variant_images: [''],
      variant_name: [varient],
      variant_sku: ['', [Validators.required]],
      package_capacity: [1, [Validators.required]],
      // barcode: [''],
      barcode: [[]],
      barcodes: ['', [Validators.minLength(8)]],
      variant_tags: [],
      special_price: [null],
      selling_price: [null, (userData.user_role && (userData.user_role.findIndex(e => ['admin', 'superadmin'].includes(e)) > -1)) ? '' : [Validators.required]],
      price_differ_for_store: ['0'],
      variant_price: this.formBuilder.array([]),
      inventory: this.warehousesVariantPrice(this.selectedData),// form array
      product_provinces: this.formBuilder.array([]),
      track_inventory: [false],
      dry_weight: [0.00, [Validators.required]],
      cannabis_unit: ['gm'],
    });
    this.barcodeValidation(fbgroup)
    return fbgroup;
  }

  barcodeValidation(formGroup) {
    if (this.isCanabis && !this.isAuthorized) {
      formGroup.controls['barcode'].setValidators([Validators.required])
      formGroup.controls['barcode'].updateValueAndValidity();
    }
    else {
      formGroup.controls['barcode'].clearValidators();
      formGroup.controls['barcode'].updateValueAndValidity();
    }
  }

  warehousesVariantPrice(warehousesData) {
    let arr = new UntypedFormArray([])
    var testInd = 0;
    warehousesData.forEach(data => {
      arr.push(this.formBuilder.group({
        storage_id: [data.storage_id],
        name: [data.name],
        vendor: [''],
        stock_price: [''],
        value_added: [''],
        purchase_order_no: [''],
        batch_no: [''],
        reorder: [''],
        inventory: this.formBuilder.array([]),
      }));
      testInd = 1 + testInd;
    })
    return arr;
  }

  addVariantChip(i, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const control = <UntypedFormArray>this.addProductForm.controls['variant_properties'];
    if ((value || '').trim()) {
      if (_.find(i.value.option_values, function (o) { return o.toLowerCase() == value.toLowerCase(); }) == undefined) {
        i.value.option_values.push(value.trim());
        var temparray = [];
        for (var j = 0; j < control.length; j++) {
          temparray.push(control.value[j].option_values);
        }


        const controlVariants = <UntypedFormArray>this.addProductForm.controls['variants'];
        var variantsArray = this.generateVariants(temparray);
        if (variantsArray.length > 0) {
          controlVariants.controls = [];
          let j = 0;
          variantsArray.forEach(element => {
            controlVariants.push(this.addUnitsVariantOptions(element));
            j = j + 1;
          });

        }
      }
      else {
        this.utility.showSnackBar("Variant already exists", { panelClass: 'error' });
      }
    }
    if (input) {
      input.value = '';
    }
  }

  countProvinceInfoForVariant(event, data, index) {
    const control = (<UntypedFormArray>this.addProductForm.controls['variants']).at(index).get('product_provinces') as UntypedFormArray;
    if (event.isUserInput) {
      if (event.source._selected) {
        control.push(this.addProvince(data));
      } else {
        const tempData = (<UntypedFormArray>this.addProductForm.controls['variants']).at(index).get('product_provinces').value;
        let dataindex = tempData.indexOf(tempData);
        control.removeAt(dataindex);
      }
    }
  }

  //****************** Variants in different selling price */
  PricingDiffersPerStoreChangeWithVariants(event, index) {
    const VariantControls = this.addProductForm.get('variants')['controls']
    if (event.value == 1) {
      VariantControls[index].removeControl('selling_price');
      VariantControls[index].removeControl('special_price');
      VariantControls[index].addControl('variant_price', this.formBuilder.array([]));
      let variant_price_control = <UntypedFormArray>VariantControls[index].controls['variant_price'];
      // this.selectedData.forEach(element => {
      this.chainwiseStores.forEach(element => {
        let data = this.addProductStoreWiseSellingPrice(element);
        variant_price_control.push(data);
      });

    }
    else {
      if (!this.isAuthorized) {
        VariantControls[index].addControl('selling_price', new UntypedFormControl(null, Validators.required))
      } else {
        VariantControls[index].addControl('selling_price', new UntypedFormControl(null))
      }
      VariantControls[index].addControl('special_price', new UntypedFormControl(null))
      VariantControls[index].removeControl('variant_price');

    }
  }
  //*********************** Product Store Wise Selling Price**********************************/

  private addProductStoreWiseSellingPrice(data) {
    return this.formBuilder.group({
      store_id: [data.store_id],
      name: [data.name],
      selling_price: [null, this.isAuthorized ? '' : [Validators.required]],
      special_price: [null],
    });
  }

  AddMultipalVariantInventoryinSameStorage(index, variant_index, data) {


    const control = (<UntypedFormArray>this.addProductForm.controls['variants']).at(index).get('inventory') as UntypedFormArray;
    const control1 = control.at(variant_index).get('inventory') as UntypedFormArray;
    control1.push(this.AddMultipalInventoryin(data));
  }

  Deleteinventory(index, record, variant_index) {
    const control = (<UntypedFormArray>this.addProductForm.controls['variants']).at(variant_index).get('inventory') as UntypedFormArray;
    const control1 = control.at(index).get('inventory') as UntypedFormArray;
    control1.removeAt(record);
  }

  private addvariant_propertiesOption() {
    const controlVariant = <UntypedFormArray>this.addProductForm.controls['variant_properties'];
    controlVariant.push(this.addnewProductVariant());
  }

  removeUnit(i) {
    const control = <UntypedFormArray>this.addProductForm.controls['variant_properties'];
    control.removeAt(i);
    var temparray = [];
    for (var j = 0; j < control.length; j++) {
      temparray.push(control.value[j].option_values);
    }
    const controlVariants = <UntypedFormArray>this.addProductForm.controls['variants'];
    var variantsArray = this.generateVariants(temparray);
    if (variantsArray.length > 0) {
      controlVariants.controls = [];
      variantsArray.forEach(element => {
        controlVariants.push(this.addUnitsVariantOptions(element));
      });
    }
  }
  trackVariantInventory(event, index) {
    let data: any = this.addProductForm.controls.variants;
    if (event.checked) {
      data.at(index).removeControl('inventory')
    }
    else {
      data.at(index).controls.inventory = this.warehousesVariantPrice(this.selectedData)
    }

  }
  //#endregion ______________________ End of Variant section all functions ______________________/

  //#region ______________________ Properties section all functions ______________________/

  countProductProperties(event, data, index) {
    const control = (<UntypedFormArray>this.addProductForm.controls['productProperties']).at(index).get('selected_product_attribute_properties') as UntypedFormArray;
    if (event.isUserInput) {
      if (event.source._selected) {
        control.push(this.addSelectedProductAttributeProperties(data));
      } else {
        const tempData = (<UntypedFormArray>this.addProductForm.controls['productProperties']).at(index).get('selected_product_attribute_properties').value;
        let updateItem = _.find(tempData, { 'selected_attribute_id': data.property_id });
        let dataindex = tempData.indexOf(updateItem);
        control.removeAt(dataindex);
      }
    }
  }

  private addSelectedProductAttributeProperties(parentData) {
    return this.formBuilder.group({
      attribute_property_id: [parentData.property_id],
      attribute_property_name: [parentData.property_name],
      attribute_property_value: [''],
    });
  }

  private addproductPROPERTIES(parentData) {
    return this.formBuilder.group({
      attribute_id: [parentData.attribute_id],
      attribute_name: [parentData.attribute_name],
      attribute_property_id: [[parentData.attribute_id]],
      product_attribute_properties: [parentData.product_attribute_properties ? parentData.product_attribute_properties : []],
      selected_product_attribute_properties: this.formBuilder.array([])
    });
  }
  //#endregion ______________________ End of Properties section all functions ______________________*/

  //#region ______________________ Identification and Inventory section all functions ______________________*/
  //******************** Inventory *******************/
  AddInventory(index, data, variant, variant_index) {
    const dialogRef = this.dialog.open(InventoryModalComponent, {
      width: '550px',
      disableClose: true,
      data: { vendors: this.rawDetail.vendors, purchase_orders: this.rawDetail.purchase_orders, product_type: this.categoryList ? this.categoryList.type_slug : 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let date = result.get('purchase_date').value;
        if (date) {
          let formatedDate = _moment(date).format("YYYY-MM-DD");
          result.get('purchase_date').setValue(formatedDate);
        }
        result.get('storage_id').setValue(data.storage_id);
        if (variant == "variant") {
          const control = (<UntypedFormArray>this.addProductForm.controls['variants']).at(variant_index).get('inventory') as UntypedFormArray;
          const control1 = control.at(index).get('inventory') as UntypedFormArray;
          control1.push(result);
        }
        else {
          const control = (<UntypedFormArray>this.addProductForm.controls['inventory']).at(index).get('inventories') as UntypedFormArray;
          control.push(result);
        }

      }
    });
  }

  //************** Price differnt as per store in inventory without Variant ****************/
  PricingDiffersPerStoreChange(event) {
    if (event.value == 1) {
      this.addProductForm.removeControl('selling_price');
      this.addProductForm.removeControl('special_price');
      // this.addProductForm.removeControl('variant_price');
      this.addProductForm.addControl('variant_price', this.formBuilder.array([]))
      const SellingPriceControl = <UntypedFormArray>this.addProductForm.controls['variant_price'];
      // this.selectedData.forEach(element => {
      this.chainwiseStores.forEach(element => {
        let data = this.addProductStoreWiseSellingPrice(element);
        SellingPriceControl.push(data);
      });
    }
    else {
      if (!this.isAuthorized) {
        this.addProductForm.addControl('selling_price', new UntypedFormControl(null, Validators.required))
      } else {
        this.addProductForm.addControl('selling_price', new UntypedFormControl(null))
      }
      this.addProductForm.addControl('special_price', new UntypedFormControl(null))
      this.addProductForm.removeControl('variant_price');

    }
  }

  countProvinceInfo(event, data) {
    const control = <UntypedFormArray>this.addProductForm.controls['product_provinces'];
    if (event.isUserInput) {
      if (event.source._selected) {
        control.push(this.addProvince(data));
      } else {
        const tempData = this.addProductForm.get('product_provinces').value;
        let index = tempData.indexOf(data);
        control.removeAt(index);
      }
    }
  }

  private addProvince(data) {
    return this.formBuilder.group({
      //province_id: [data.location_id],
      provience_id: [data.location_id],
      //province_code: [data.location_name],
      provience_code: [data.location_name],
      govt_id: ['']
    });
  }

  private AddMultipalInventoryin(data) {
    return this.formBuilder.group({
      storage_id: [data.storage_id],
      name: [data.name],
      vendor: [''],
      stock_price: ['', [Validators.required]],
      value_added: [''],
      purchase_order_no: [''],
      batch_no: [''],
      purchase_date: [''],
      reorder: [''],
    });
  }

  AddMultipalInventoryinSameStorage(index, data) {
    const control = (<UntypedFormArray>this.addProductForm.controls['inventory']).at(index).get('inventories') as UntypedFormArray;
    control.push(this.AddMultipalInventoryin(data));
  }
  DeleteInventories(index, record) {
    const control = (<UntypedFormArray>this.addProductForm.controls['inventory']).at(index).get('inventories') as UntypedFormArray;
    control.removeAt(record);
  }
  trackInventory(event) {
    if (event.checked) {
      this.addProductForm.removeControl('inventory');
    }
    else {
      this.addProductForm.addControl('inventory', this.formBuilder.array([]))
      let event = { isUserInput: true }
      this.selectedChain(this.chains[0].chain_id, event);
    }
  }
  //#endregion ______________________ End of Identification and Inventory section all functions ______________________*/

  //#region ______________________ Supplier section all functions ______________________*/

  AddSupplier() {
    const dialogRef = this.dialog.open(SupplierDialogComponent, {
      width: '550px',
      disableClose: true,
      data: { name: '', chain_id: this.addProductForm.get('chain_id').value }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rawDetail.suppliers.push(result.data[0]);
      }
    });
  }
  removeSupplier(i) {
    let supplierList = this.addProductForm.controls.product_suppliers_data.value;
    supplierList.splice(i, 1);
    this.addProductForm.controls.product_suppliers_data.setValue(supplierList)
  }


  //#endregion ______________________ End of Supplier section all functions ______________________*/

  //#region ______________________ API section all functions ______________________*/
  //*************** Raw Details for Add product dropdown *******************/
  getRawDetails() {
    this.api.rawDetailsProducts()
      .subscribe((response: any) => {
        if (response.status) {
          this.rawDetail = response.data;
          this.stores = this.rawDetail.stores;
          this.warehouses = this.rawDetail.warehouses;
          this.chains = this.rawDetail.chains;
          this.addProductForm.controls.chain_id.setValue(this.chains[0].chain_id);

          let userData = this.utility.getSessionData('currentUser');
          if (userData.user_role && (userData.user_role.findIndex(e => ['admin', 'superadmin'].includes(e)) > -1)) {
            this.addProductForm.get('selling_price').clearValidators();
          } else {
            this.addProductForm.get('selling_price').setValidators([Validators.required])
          }
          this.addProductForm.get('selling_price').updateValueAndValidity();

          if (this.chains.length == 1) {
            this.addProductForm.get('chain_id').setValue(this.chains[0].chain_id);
            let event = { isUserInput: true }
            this.selectedChain(this.chains[0].chain_id, event)

          }
          const control = <UntypedFormArray>this.addProductForm.controls['productProperties'];
          this.rawDetail.product_attributes.forEach(element => {
            if (element.product_attribute_properties.length > 0) {
              let data = this.addproductPROPERTIES(element);
              control.push(data);
            }
          });
          const controlVariant = <UntypedFormArray>this.addProductForm.controls['variant_properties'];
          controlVariant.push(this.addnewProductVariant());
        }
      });
  }

  //*****************Province List *******************/
  getProvince() {
    this.api.getProvinceList()
      .subscribe((response: any) => {
        if (response.success) {
          this.provinceList = response.data;
        }
      });
  }

  //****************** City List ******************/
  getCityList(parent) {
    this.api.getCityList(parent)
      .subscribe((response: any) => {
        if (response.success) {
          this.cityList = response.data;
        }
      });
  }

  //#endregion ______________________ End of API section all functions ______________________*/

  //#region ______________________ Product create ______________________*/

  onSubmit(formDirective) {
    var product_thc = this.addProductForm.get('thc1').value + '-' + this.addProductForm.get('thc2').value;
    var product_cbd = this.addProductForm.get('cbd1').value + '-' + this.addProductForm.get('cbd2').value;
    this.addProductForm.get('product_thc').setValue(product_thc);
    this.addProductForm.get('product_cbd').setValue(product_cbd);
    let productAttribute = [];
    this.isSubmitted = true;

    this.addProductForm.get('productProperties').value.forEach(element => {
      if (element.selected_product_attribute_properties.length > 0) {
        element.selected_product_attribute_properties.forEach(element => {
          productAttribute.push(element);
        });
      }
    });
    this.addProductForm.get('product_attributes').setValue(productAttribute);
    let inventoryData = [];
    if (Boolean(Boolean(this.addProductForm.valid) && this.addProductForm.get('variants')) && this.addProductForm.get('variants').value) {
      let selectedVariant = [];
      let index = 0;
      this.addProductForm.controls['variants'].value.forEach(element => {
        if (element.is_active_variant) {
          selectedVariant.push(element);
        }
        else {
          const control = <UntypedFormArray>this.addProductForm.controls.variants;
          control.removeAt(index);
          index = index - 1;
        }
        index = index + 1;
      });
      this.addProductForm.value.variants = selectedVariant;
      selectedVariant = []
    }
    if (Boolean(Boolean(this.addProductForm.valid) && this.addProductForm.get('variants')) && this.addProductForm.get('variants').value.length) {
      Object.keys(this.addProductForm.value.variants).forEach(key => {
        if (this.addProductForm.value.variants[key].inventory && this.addProductForm.value.variants[key].inventory.length > 0) {
          this.addProductForm.value.variants[key].inventory.forEach(inventory => {
            if (inventory.inventory && inventory.inventory.length > 0) {
              inventoryData = inventoryData.concat(inventory.inventory);
            }
          });
          this.addProductForm.value.variants[key].inventory = inventoryData;
          inventoryData = [];
        }
      })
    }
    if (Boolean(this.addProductForm.valid) && Boolean(this.addProductForm.get('inventory')) && this.addProductForm.get('inventory').value.length) {
      this.addProductForm.get('inventory').value.forEach(element => {
        if (element.inventories.length > 0) {
          element.inventories.forEach(inventory => {
            inventoryData.push(inventory);
          });
        }
      });
    }
    if (this.addProductForm.controls.product_suppliers_data.value) {
      let suppliers_ids = this.addProductForm.controls.product_suppliers_data.value.map(x => x.id)
      this.addProductForm.controls.product_suppliers_ids.setValue(suppliers_ids);
    }
    const formData = new FormData();
    if (this.addProductForm.valid) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';
    }
    Object.keys(this.addProductForm.value).forEach(key => {
      if (key == "inventory") {
        formData.append("inventory", JSON.stringify(inventoryData));
      }
      else if (key == "product_image" && this.imagesOfarray.length > 0) {
        Object.keys(this.imagesOfarray).forEach(images => {
          if (images)
            formData.append("product_images[]", this.imagesOfarray[images])
        });
      }
      else {
        if (this.addProductForm.value[key] instanceof Object) {
          formData.append(key, JSON.stringify(this.addProductForm.value[key]));
        }
        else {
          formData.append(key, this.addProductForm.value[key]);
        }
      }
    });
    formData.append("product_status", '1');
    let variant = this.addProductForm.get('variants').value;
    if (variant.length > 0) {
      formData.append("product_variant", '1');
    }
    if (this.addProductForm.get('default_image').value)
      formData.append("default_image", '1');
    if (this.addProductForm.valid) {

      this.api.createProduct(formData)
        .subscribe((response: any) => {
          if (response.success) {
            this.utility.showSnackBar(response.message);
            if (this.createProduct) {
              this.resetFormValues(formDirective)
            }
            else {
              this.router.navigateByUrl('products/allproducts');
            }
            this.isSubmitted = false;
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'SAVE ALL';

          }
          else {
            this.utility.showSnackBar(response.message, { panelClass: 'error' });
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'SAVE ALL';
          }
        },
          err => {
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'SAVE ALL';
          });
    } else {
      this.utility.scrollToError();
    }
  }
  //#endregion

  onChange(event) {
    if (event.checked) {
      this.createProduct = true;
    }
    else {
      this.createProduct = false;
    }
  }
  resetFormValues(formDirective) {
    this.arrayOfImages = [];
    this.imagesOfarray = [];
    this.addProductForm.reset();
    formDirective.resetForm();
    this.ngOnInit();
  }
  ngOnInit() {
    this.addProductFormGroup();
    this.getProvince();
    this.getRawDetails();
  }
  ngDoCheck() {
    this.innerHeight = window.innerHeight - 192;
  }

  async canDeactivate() {
    var result_dt = await this.getConfirmData();
    if (Boolean(result_dt)) {
      return true;
    } else {
      return false;
    }
  }
  async getConfirmData(): Promise<any> {

    let filled_data = 0;
    if (this.addProductForm.dirty) {
      filled_data = 1;
    }
    if (filled_data && !this.addProductForm.valid) {
      return this.utility.confirmDialog({ title: 'Please confirm the action', message: 'Are you sure you\'d like to leave the page? You\'ll lose all your progress?', okButton: 'LEAVE', cancelButton: 'CANCEL' }).toPromise();
    } else {
      return true;
    }
  }
}
