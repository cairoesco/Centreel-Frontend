import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FileUploader } from 'ng2-file-upload';
import { ProductService } from '../../product.service';
import * as _ from 'lodash';
import { Options, LabelType } from 'ng5-slider';
import { UtilsServiceService } from '../../../shared/services/utils-service.service'
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { MatDialog } from '@angular/material/dialog';
import { SupplierDialogComponent } from '../supplier-dialog/supplier-dialog.component';
import { MatChipInputEvent } from '@angular/material/chips';
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit {
  public generalForm: UntypedFormGroup;
  public imagesForm: UntypedFormGroup;
  public propertiesForm: UntypedFormGroup;
  public taxForm: UntypedFormGroup;
  public variantsForm: UntypedFormGroup;
  public identificationForm: UntypedFormGroup;
  public decisionForm: UntypedFormGroup;
  public supplierForm: UntypedFormGroup;
  public isAuthorized = false;
  public userRole = 1;
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean;
  public hasAnotherDropZoneOver: boolean;
  public response: string;
  public arrayOfImages = [];
  public imagesOfarray = [];
  public deleteFileArray = [];
  public rawDetail;
  public categoryList;
  //public unitMeasurement = [{ slug: "ml", unit_name: "Milliliter" }, { slug: "pcs", unit_name: "Pieces" },]
  public unitMeasurement = [{ slug: "pcs", unit_name: "Pieces" },]
  public cityList: any;
  public isGreaterThc: any;
  public innerHeight: any;
  public type: string = 'component';
  public selected = false;
  public indexofTab = 0;
  public addStore: UntypedFormGroup;
  public imageSrc: any;
  public heightOfY;
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public product_id;
  public isActive;
  public generalInfo: boolean = false;
  public imagesInfo: boolean = false;
  public propertiesInfo: boolean = false;
  public taxInfo: boolean = false;
  public variantsInfo: boolean = false;
  public identificationInfo: boolean = false;
  public decisionInfo: boolean = false;
  public supplier: boolean = false;
  public isTHCGreater = false;
  public isCBDGreater = false;
  public isCanabies = false;
  public isSubmitted = false;
  public numOfSuppliers = 0;
  public deletedImages = [];
  public provienceList: any;
  public productData: any;
  public variants: any;
  public supplierListData: any = [];
  public isAdmin: boolean = false;
  public isAdminRole: boolean = false;
  public dynamicHeight = "";
  public cannabiesData: any;
  public isCannabies: boolean = false;
  public options: Options = {
    floor: 0,
    ceil: 100,
    disabled: true,
    showSelectionBar: true,
    translate: (value: number, label: LabelType): string => {
      return value + '%';
    },
    getSelectionBarColor: (value: number): string => {
      return '#28b127';
    }
  };
  public image_option = [
    { name: 'Auto-Generated', value: 0 },
    { name: 'Gallery', value: 1 }
  ];
  public radio_option = [
    { name: 'Yes', value: 1 },
    { name: 'No', value: 0 }
  ];

  public priceOptions = { prefix: '$ ', thousands: ',', decimal: '.', align: 'left', nullable: true, allowZero: false }
  public batchList: any = []; //thc cbd

  constructor(private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private api: ProductService,
    public formBuilder: UntypedFormBuilder,
    public utility: UtilsServiceService,
    public refVar: ChangeDetectorRef) {
    this.fileUploader();
    this.utility.indexofTab = 0;
  }
  /* auto generate barcode */

  auto_generate_barcode_variant(index) {
    const control = (<UntypedFormArray>this.variantsForm.controls['variant_detail']).at(index).get('barcode') as UntypedFormArray;
    let control_val = control.value

    // let userData = this.utility.getSessionData('currentUser');
    // let uname = (userData.name).charAt(0).toUpperCase();

    // let pname = this.generalForm.get('product_name').value ? this.generalForm.get('product_name').value : 'P';
    // let product_module = 'O';
    // let product_name = product_module + pname.charAt(0).toUpperCase();
    // let variant_name = product_name + "v";
    let timestamp = +(new Date());
    // let username = variant_name + timestamp + uname;
    control_val.push(timestamp)

    control.setValue(control_val);
  }
  /* auto generate barcode */
  getRowHeight({ variant_name, product_type_name, product_category_name }) {
    if ((Boolean(variant_name) && variant_name.length > 25)) {
      return 70;
    }
    return 48;
  }
  //#region ______________________ View-Product Form Section ______________________/

  /* Editable Mode */
  viewOnly() {
    this.generalInfo = false;
    this.generalForm.disable();

    this.imagesInfo = false;
    this.imagesForm.disable();

    this.propertiesInfo = false;
    this.propertiesForm.disable();

    this.taxInfo = false;
    this.taxForm.disable();

    this.variantsInfo = false;
    // this.variantsForm.disable();

    this.identificationInfo = false;
    this.identificationForm.disable();

    this.decisionInfo = false;
    this.decisionForm.disable();

    this.supplier = false;
    this.supplierForm.disable();

    this.options = Object.assign({}, this.options, { disabled: true });

  }
  isEditable(key) {
    this.viewOnly();
    switch (key) {
      case 1:
        this.generalForm.enable()
        this.generalInfo = true;
        break;
      case 2:
        this.imagesForm.enable()
        this.imagesInfo = true;
        break;
      case 3:
        this.propertiesForm.enable()
        this.options = Object.assign({}, this.options, { disabled: false });
        this.propertiesInfo = true;
        break;
      case 4:
        this.taxForm.enable()
        this.taxInfo = true;
        break;
      case 5:
        this.variantsForm.enable()
        this.variantsInfo = true;
        break;
      case 6:
        this.identificationForm.enable()
        this.identificationInfo = true;
        break;
      case 7:
        this.decisionForm.enable()
        this.decisionInfo = true;
        break;
      case 8:
        this.supplierForm.enable()
        this.supplier = true;
        break;

      default:
        break;
    }
  }
  /* Editable Mode */

  /* form group */
  productEditForm() {
    this.generalForm = this.fb.group({
      product_name: ["", Validators.required],
      product_highlights: [""],
      specie_id: [""],
      type_id: ["", Validators.required],
      product_category: ["", Validators.required],
      //vendor: ["--"],
      brand: ["", Validators.required],
      thc1: [""],
      product_unit: ["", Validators.required],
      thc2: [""],
      cbd1: [""],
      cbd2: [""],
      product_thc: [""],
      product_cbd: [""],
      section: [""],
      _method: ["put"]
    });

    this.imagesForm = this.fb.group({
      variants_separate_Identification_numbers: [""],
      product_image: ["", Validators.required],
      default_image: [""],
      section: [""],
      _method: ["put"]
    });

    this.propertiesForm = this.fb.group({
      productProperties: this.formBuilder.array([]),
      product_attributes: [''],
      section: [""],
      _method: ["put"]
    });

    this.taxForm = this.fb.group({
      is_taxable: ["Y"],
      taxrate_id: [""],
      store_id: [""],
      section: [""],
      _method: ["put"]
    });

    this.identificationForm = this.fb.group({
      product_sku: ["", Validators.required],
      centreelId: ["", Validators.required],
      govt_id: ["", Validators.required],
      PO: ["", Validators.required],
      chain_id: [""],
      gtin_id: ["", [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
      product_proviences: this.formBuilder.array([]),
      section: [""],
      _method: ["put"]
    });
    this.decisionForm = this.fb.group({
      track_inventory: ["", Validators.required],
    });
    this.variantsForm = this.fb.group({
      variant_detail: this.formBuilder.array([]),
    });
    this.supplierForm = this.fb.group({
      // product_suppliers: this.formBuilder.array([]),
      product_suppliers_data: [''],
      product_suppliers_ids: [''],
      section: [""],
      _method: ["put"]
    });
  }
  //#endregion

  //#region ______________________ General Section ______________________/
  //********** Check THC or CBD validation ******************/
  isGreater(evt) {
    if (evt == "thc") {
      var thc1 = this.generalForm.get('thc1').value;
      var thc2 = this.generalForm.get('thc2').value;

      if (thc1 <= thc2) {
        this.isTHCGreater = false;
      }
      else {
        this.isTHCGreater = true;
      }
    }
    else if (evt == "cbd") {
      var cbd1 = this.generalForm.get('cbd1').value;
      var cbd2 = this.generalForm.get('cbd2').value;
      if (cbd1 <= cbd2) {
        this.isCBDGreater = false;
      }
      else {
        this.isCBDGreater = true;
      }
    }

  }

  subCategory(evt, event) {
    if (event.isUserInput) {
      this.categoryList = this.rawDetail.product_types.find(x => x.type_id === evt);
      if (this.categoryList.type_slug == 'cannabis') {
        this.isCanabies = true;
        this.isAuthorized = true;
        this.userRole = 0;
        this.taxForm.get("is_taxable").setValue('Y');
        this.taxForm.controls.is_taxable.disable();
        this.generalForm.get('brand').setValidators([Validators.required]);

        // this.generalForm.get('thc1').setValidators([Validators.required]);
        // this.generalForm.get('thc2').setValidators([Validators.required]);
        // this.generalForm.get('cbd1').setValidators([Validators.required]);
        // this.generalForm.get('cbd2').setValidators([Validators.required]);
      }
      else {
        this.isCanabies = false;
        this.isAuthorized = false;
        this.userRole = 1;
        this.generalForm.get('brand').clearValidators();

        // this.generalForm.get('thc1').clearValidators();
        // this.generalForm.get('thc2').clearValidators();
        // this.generalForm.get('cbd1').clearValidators();
        // this.generalForm.get('cbd2').clearValidators();

        // this.generalForm.get('thc1').setValue(0);
        // this.generalForm.get('thc2').setValue(0);
        // this.generalForm.get('cbd1').setValue(0);
        // this.generalForm.get('cbd2').setValue(0);
        // this.isTHCGreater = false;
        // this.isCBDGreater = false;
      }
      this.generalForm.get('brand').updateValueAndValidity();

      // this.generalForm.get('thc1').updateValueAndValidity();
      // this.generalForm.get('thc2').updateValueAndValidity();
      // this.generalForm.get('cbd1').updateValueAndValidity();
      // this.generalForm.get('cbd2').updateValueAndValidity();
    }
  }

  generalInfoForm(product) {
    if (product.product_thc){
      var thc = product.product_thc.split("-");
    }
    if (product.product_cbd)
      {
        var cbd = product.product_cbd.split("-");
    }
    this.generalForm.patchValue({
      product_name: product.product_name,
      product_highlights: product.product_highlights == null ? '' : product.product_highlights,
      type_id: product.type_id,
      specie_id: product.specie_id,
      product_category: product.product_category,
      // vendor: product.vendor,
      brand: product.brand == null ? '' : product.brand,
      thc1: product.product_thc ? thc[0] : '',
      thc2: product.product_thc ? thc[1] : '',
      product_unit: product.product_unit,
      cbd1: product.product_cbd ? cbd[0] : '',
      cbd2: product.product_cbd ? cbd[1] : '',
    });
  }

  //#endregion

  //#region ______________________ Images Section ______________________/
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

  public fileDragged(type) {
    this.uploader.queue.forEach(element => {
      let imageElement: any = element.file.rawFile;
      if (["image/jpeg", "image/jpg", "image/png", 'image/gif'].indexOf(imageElement.type) > -1) {
        let imageFile: any;
        const reader = new FileReader();
        reader.onload = (res) => {
          imageFile = reader.result;
          this.arrayOfImages.push({ id: 0, name: element.file.name, path: imageFile });
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
    this.fileDragged(type);
  }
  //#endregion

  //#region ______________________ Properties Section ______________________/

  productProperties() {
    this.propertiesForm = this.fb.group({
      productProperties: this.formBuilder.array([]),
      product_attributes: [''],
      section: [""],
      _method: ["put"]
    });
  }
  private addproductPROPERTIES(parentData) {
    return this.formBuilder.group({
      attribute_id: [parentData.attribute_id],
      property_id: [''],
      attribute_name: [parentData.attribute_name],
      product_attribute_properties: [parentData.product_attribute_properties],
      selected_product_attribute_properties: this.formBuilder.array([]),
    });
  }

  countProductProperties(event, data, index) {
    const propertyControl: any = (this.propertiesForm.controls['productProperties']);
    const control: any = propertyControl.at(index).get('selected_product_attribute_properties');
    if (event.isUserInput) {
      if (event.source._selected) {
        control.push(this.addSelectedProductAttributeProperties(data));
      } else {
        const tempData = control.value;
        let updateItem = _.find(tempData, { 'attribute_property_id': data.property_id });
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

  private editSelectedProductAttributeProperties(parentData) {
    return this.formBuilder.group({
      attribute_property_id: [parentData.attr_property_id],
      attribute_property_name: [parentData.attr_property_name],
      attribute_property_value: [parentData.attr_property_value],
    });
  }
  //#endregion

  //#region ______________________ Tax Section ______________________/

  taxInfoForm(product) {

    if (this.isAdminRole && product.tax.length > 0) {
      this.taxForm.patchValue({
        is_taxable: product.is_taxable,
        store_id: product.tax[0].store_id,
        taxrate_id: product.tax[0].taxrate_id,
      });
    } else {
      this.taxForm.patchValue({
        is_taxable: product.is_taxable,

      });
    }
  }
  //#endregion

  //#region ______________________ Variant & Identification Section ______________________/

  identificationInfoForm(product) {
    var govtArray = [];
    product.proviences.forEach(element => {
      govtArray.push(element.provience_id);
    });
    this.identificationForm.patchValue({
      product_sku: product.product_sku,
      govt_id: govtArray,
      gtin_id: product.gtin_id,
    });
  }

  viewDetailVariant(variant_id) {
    this.router.navigateByUrl('products/' + this.product_id + '/variants/' + variant_id + '/view');
  }

  countProvienceInfo(event, data) {
    const control: any = this.identificationForm.controls['product_proviences'];
    if (event.isUserInput) {
      if (event.source._selected) {
        control.push(this.addProvience(data));
      } else {
        const tempData = this.identificationForm.get('product_proviences').value;
        let index = tempData.indexOf(data);
        control.removeAt(index);
      }
    }
  }
  private addProvience(data) {
    return this.formBuilder.group({
      provience_id: [data.location_id],
      provience_code: [data.location_name],
      govt_id: [''],
    });
  }
  private viewProvience(data) {
    return this.formBuilder.group({
      provience_id: [data.provience_id],
      provience_code: [data.provience_code],
      govt_id: [data.govt_id],
    });
  }
  private variantData(data) {
    return this.formBuilder.group({
      barcode: [data.barcode],
      variant_name: [data.variant_name, Validators.required],
      variant_id: [data.variant_id],
      variant_price: [data.variant_price, Validators.required],
      stocks_variants_id: [data.stocks_variants_id],
      variant_sku: [data.variant_sku],
      dry_weight: [data.dry_weight],
      purchase_price: [data.purchase_price, Validators.required],
      special_price: [data.special_price],
      store_id: [data.store_id],
      batch_no: [data.variant_batches.length > 0 ? data.variant_batches[0].batch_no : ''],
      batch_detail: [data.variant_batches],
      thc: [data.variant_batches.length > 0 ? data.variant_batches[0].thc : ''],
      cbd: [data.variant_batches.length > 0 ? data.variant_batches[0].cbd : '']
    });
  }
  //#endregion

  public batch_no: any;
  public thc: any;
  public cbd: any;
  current_batch(index, val, event) {
    if (event.isUserInput) {
      this.batch_no = val.batch_no;
      this.thc = val.thc;
      this.cbd = val.cbd;

      const mainControl: any = this.variantsForm.controls['variant_detail'];
      const thc_control = mainControl.at(index).get('thc');
      const cbd_control = mainControl.at(index).get('cbd');

      thc_control.setValue(this.thc);
      cbd_control.setValue(this.cbd);
    }
  }

  //#region ______________________ Supplier Info Section ______________________/
  AddSupplier() {
    const dialogRef = this.dialog.open(SupplierDialogComponent, {
      width: '550px',
      disableClose: true,
      data: { name: '', chain_id: this.rawDetail.product.chain_id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.supplierListData.push(result.data[0]);
      }
    });
  }
  viewSupplier(data, index) {
    const dialogRef = this.dialog.open(SupplierDialogComponent, {
      width: '550px',
      disableClose: true,
      data: { supplierData: data, chain_id: this.rawDetail.product.chain_id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let supplierIndex = this.supplierListData.indexOf(this.supplierForm.controls.product_suppliers_data.value[index]);
        this.supplierForm.controls.product_suppliers_data.value[index] = result.data[0];
        this.supplierListData[supplierIndex] = result.data[0];
        this.supplierForm.controls.product_suppliers_data.setValue(this.supplierForm.controls.product_suppliers_data.value);
      }
    });
  }
  removeSupplier(i) {
    let supplierList = this.supplierForm.controls.product_suppliers_data.value;
    supplierList.splice(i, 1);
    this.supplierForm.controls.product_suppliers_data.setValue(supplierList)
  }
  //#endregion

  //#region ______________________ API Section ______________________/
  getProvince() {
    this.api.getProvinceList()
      .subscribe((response: any) => {
        if (response.success) {
          this.provienceList = response.data;
        }
      });
  }

  getCityList(parent) {
    this.api.getCityList(parent)
      .subscribe((response: any) => {
        if (response.success) {
          this.cityList = response.data;
        }
      });
  }

  getRawDetails_temp(data) {
    this.rawDetail = data;
    this.categoryList = this.rawDetail.product_types.find(product_type => product_type.type_id == this.productData.type_id)
    this.productProperties()
    const control: any = this.propertiesForm.controls['productProperties'];
    this.rawDetail.product_attributes.forEach(element => {
      if (element.product_attribute_properties.length > 0) {
        control.push(this.addproductPROPERTIES(element));
      }
    });
    let attr_propertys_ids = []
    this.rawDetail.product.product_attributes.forEach(element => {
      this.rawDetail.product_attributes.forEach((parentelement, parentIndex) => {
        let attr__property_control: any = this.propertiesForm.controls['productProperties'];
        let attr_control = attr__property_control.at(parentIndex).get('property_id');
        let control: any;
        control = attr__property_control.at(parentIndex).get('selected_product_attribute_properties');
        parentelement.product_attribute_properties.forEach((childelement, index) => {
          if (element.attr_property_id == childelement.property_id) {
            element.attr_property_name = childelement.property_name;
            attr_propertys_ids.push(childelement.property_id);
            control.push(this.editSelectedProductAttributeProperties(element));
          }
        });
        attr_control.patchValue(attr_propertys_ids);
      });
    });
    attr_propertys_ids = [];

  }
  public result: any;
  getProductById() {
    this.api.getProductById(this.product_id)
      .subscribe((response: any) => {
        if (response.success) {
          this.result = response.data;
          this.selectedChain();
          this.variants = response.data.product.variants;

          this.supplierListData = response.data.suppliers;
          let supplierData: any = [];
          var data: any;
          response.data.product.product_supplier.forEach(element => {
            data = _.find(this.supplierListData, function (o) {
              return o.id == element.supplier_id;
            })
            supplierData.push(data);
          });
          response.data.product.product_supplier = supplierData;
          this.productData = response.data.product;
          this.cannabiesData = response.data.product_types.find(x => x.type_id === this.productData.type_id);
          this.isCanabies = (this.cannabiesData.type_slug == "cannabis");
          this.dynamicHeight = this.variants.length < 12 ? ((this.variants.length + 1) * 90 + 10) + "px" : '';
          this.arrayOfImages = this.productData.product_images;
          this.taxInfoForm(this.productData);
          this.identificationInfoForm(this.productData);
          this.getRawDetails_temp({ product_attributes: response.data.product_attributes, product_types: response.data.product_types, variant_properties: response.data.variant_properties, product: response.data.product,species:response.data.species });
          this.generalInfoForm(this.productData);
          this.supplierForm.controls.product_suppliers_data.setValue(this.productData.product_supplier);
          const control1: any = this.identificationForm.controls['product_proviences'];
          this.variantsForm = this.fb.group({
            variant_detail: this.formBuilder.array([]),
          });
          const variant_control: any = this.variantsForm.controls['variant_detail'];

          this.productData.proviences.forEach(element => {
            control1.push(this.viewProvience(element));
          });
          this.productData.variants.forEach(element => {
            variant_control.push(this.variantData(element));
          });
          this.viewOnly();

        }
      });
  }

  add(event: MatChipInputEvent, index): void {
    let input = event.input;
    let value = event.value;
    const control = (<UntypedFormArray>this.variantsForm.controls['variant_detail']).at(index).get('barcode') as UntypedFormArray;
    if ((value || '').trim() && value.length > 7) {

      /* find GTIN value if standard barcode */
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
      /* find GTIN value if standard barcode */

      let data: any
      if (!control.value)
        data = [];
      else
        data = control.value
      /* if admin then add full barcode withou extract batch and expire date */
      if (this.isAdminRole) {
        data.push(event.value);
      } else {
        data.push(value);
      }
      // data.push(value);
      control.setValue(data)
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  remove(value: any, index1): void {
    const control = (<UntypedFormArray>this.variantsForm.controls['variant_detail']).at(index1).get('barcode') as UntypedFormArray;
    let index = control.value.indexOf(value);
    if (index >= 0) {
      let ctrlValue = control.value
      ctrlValue.splice(index, 1)
      control.setValue(ctrlValue);
    }
  }
  //#endregion

  //#region ______________________ Submit Form ______________________/

  generalInfoStore(event) {
    this.isSubmitted = true;
    this.generalForm.get('section').setValue(event);
    var product_thc = this.generalForm.get('thc1').value + '-' + this.generalForm.get('thc2').value;
    var product_cbd = this.generalForm.get('cbd1').value + '-' + this.generalForm.get('cbd2').value;
    this.generalForm.get('product_thc').setValue(product_thc);
    this.generalForm.get('product_cbd').setValue(product_cbd);
    const formData = new FormData();
    Object.keys(this.generalForm.value).forEach(key => {
      if (this.generalForm.value[key] instanceof Object) {
        formData.append(key, JSON.stringify(this.generalForm.value[key]));
      } else {
        formData.append(key, this.generalForm.value[key]);
      }
    });
    formData.append("product_status", '1');
    if (this.generalForm.valid) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';
      this.updateProduct(formData);
    } else {
      this.utility.scrollToError();
    }
  }
  imagesStore(event) {
    this.generalForm.get('section').setValue(event);
    var product_thc = this.generalForm.get('thc1').value + '-' + this.generalForm.get('thc2').value;
    var product_cbd = this.generalForm.get('cbd1').value + '-' + this.generalForm.get('cbd2').value;
    this.generalForm.get('product_thc').setValue(product_thc);
    this.generalForm.get('product_cbd').setValue(product_cbd);
    const formData = new FormData();
    if (this.imagesOfarray.length > 0) {
      Object.keys(this.imagesOfarray).forEach(key => {
        if (this.arrayOfImages[key])
          formData.append("product_images[]", this.imagesOfarray[key])
      });
    }
    Object.keys(this.generalForm.value).forEach(key => {
      if (key == "product_image") {
        Object.keys(this.imagesOfarray).forEach(key => {
          if (this.arrayOfImages[key])
            formData.append("product_images[]", this.imagesOfarray[key])
        });
      }
      else {
        if (this.generalForm.value[key] instanceof Object) {
          formData.append(key, JSON.stringify(this.generalForm.value[key]));
        } else {
          formData.append(key, this.generalForm.value[key]);
        }
      }
    });
    formData.append("product_status", '1');
    formData.append("deleted_images", JSON.stringify(this.deletedImages));
    this.barButtonOptions.active = true;
    this.barButtonOptions.text = 'Saving Data...';
    this.updateProduct(formData);
  }
  deleteImagesArray(file, index) {
    if (index !== -1 && file == 0) {
      let file_index = index - (this.arrayOfImages.length - this.imagesOfarray.length);
      this.imagesOfarray.splice(file_index, 1);
      this.arrayOfImages.splice(index, 1);
    }
    else if (index !== -1 && file && file != 0) {
      this.arrayOfImages.splice(index, 1);
      this.deletedImages.push(file);
    }
  }
  taxInfoStore(event) {
    this.taxForm.get('section').setValue(event);
    if (!this.isAdminRole) {
      this.taxForm.removeControl('store_id');
      this.taxForm.removeControl('taxrate_id');
    }

    const formData = new FormData();

    Object.keys(this.taxForm.value).forEach(key => {
      if (this.taxForm.value[key] instanceof Object) {
        formData.append(key, JSON.stringify(this.taxForm.value[key]));
      } else {
        formData.append(key, this.taxForm.value[key]);
      }
    });
    formData.append("product_status", '1');

    if (this.taxForm.valid) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';
      this.updateProduct(formData);
    }
  }
  identificationInfoStore(event) {
    this.identificationForm.get('section').setValue(event);
    const formData = new FormData();
    Object.keys(this.identificationForm.value).forEach(key => {
      if (this.identificationForm.value[key] instanceof Object) {
        formData.append(key, JSON.stringify(this.identificationForm.value[key]));
      } else {
        formData.append(key, this.identificationForm.value[key]);
      }
    });
    formData.append("product_status", '1');
    if (this.identificationForm.valid) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';
      this.updateProduct(formData);
    }

  }
  supplierInfoStore(event) {
    this.supplierForm.get('section').setValue(event);
    let suppliers_ids = this.supplierForm.controls.product_suppliers_data.value.map(x => x.id)
    this.supplierForm.controls.product_suppliers_ids.setValue(suppliers_ids);
    const formData = new FormData();
    Object.keys(this.supplierForm.value).forEach(key => {
      if (this.supplierForm.value[key] instanceof Object) {
        formData.append(key, JSON.stringify(this.supplierForm.value[key]));
      } else {
        formData.append(key, this.supplierForm.value[key]);
      }
    });
    formData.append("product_status", '1');
    if (this.supplierForm.valid) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';
      this.updateProduct(formData);
    }

  }
  propertyInfoStore(event) {
    this.propertiesForm.get('section').setValue(event);
    const formData = new FormData();
    let productAttribute = []
    this.propertiesForm.get('productProperties').value.forEach(element => {
      if (element.selected_product_attribute_properties && element.selected_product_attribute_properties.length > 0) {
        element.selected_product_attribute_properties.forEach(element => {
          productAttribute.push(element);
        });
      }
    });
    this.propertiesForm.get('product_attributes').patchValue(productAttribute);
    Object.keys(this.propertiesForm.value).forEach(key => {
      if (this.propertiesForm.value[key] instanceof Object) {
        formData.append(key, JSON.stringify(this.propertiesForm.value[key]));
      } else {
        formData.append(key, this.propertiesForm.value[key]);
      }
    });
    formData.append("product_status", '1');
    // return false
    if (this.propertiesForm.valid) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';
      this.updateProduct(formData);
    }
  }

  updateProduct(data) {
    this.api.updateProduct(data, this.product_id)
      .subscribe((response: any) => {
        if (response.success) {
          this.utility.showSnackBar(response.message);
          this.isSubmitted = false;
          this.viewOnly();
          this.barButtonOptions.active = false;
          this.barButtonOptions.text = 'SAVE CHANGES';
          this.imagesOfarray = [];
          this.getProductById()
          // this.router.navigateByUrl('products/allproducts');
        }
        else {
          this.utility.showSnackBar(response.message, { panelClass: 'error' });
          this.barButtonOptions.active = false;
          this.barButtonOptions.text = 'SAVE CHANGES';
        }
      },
        err => {
          this.barButtonOptions.active = false;
          this.barButtonOptions.text = 'SAVE CHANGES';
        });
  }

  isUpdate: boolean = false;
  onVariantSubmit(id, index) {
    this.isUpdate = true;
    this.variantsForm.get('variant_detail').updateValueAndValidity()
    const control1 = (<UntypedFormArray>this.variantsForm.controls['variant_detail']).at(index) as UntypedFormArray;
    const control = this.variantsForm.controls['variant_detail'].value;
    let data = control[index];
    var selling_error = false;

    /* If stock is not added for this variant */
    if (data.stocks_variants_id < 1) {
      this.utility.showSnackBar("No Stock is added for " + data.variant_name + " this variant, pls add stock.", { panelClass: 'error' });
      selling_error = true;
    }
    /* If stock is not added for this variant */

    /* if purchase price is not equla or less than selling price */
    data.purchase_price = +data.purchase_price;
    data.variant_price = +data.variant_price;
    data.dry_weight = +data.dry_weight;
    if (data.purchase_price > data.variant_price) {
      this.utility.showSnackBar("selling price must be equal or greater than purchase price for " + data.variant_name, { panelClass: 'error' });
      selling_error = true;
    }
    /* if purchase price is not equla or less than selling price */

    const formData = new FormData()
    formData.append('_method', 'put')
    if (data.batch_no && data.batch_no != '') {
      formData.append('batch_array', JSON.stringify({ batch_no: data.batch_no, thc: data.thc, cbd: data.cbd }))
    }
    formData.append('variant_detail', JSON.stringify({ variant_name: data.variant_name, chain_id: this.rawDetail.product.chain_id }))
    formData.append('barcode', JSON.stringify(data.barcode))
    formData.append('dry_weight', data.dry_weight)
    formData.append('selling_price', JSON.stringify({ selling_price: data.variant_price, store_id: data.store_id }))
    formData.append('special_price', JSON.stringify({ special_price: data.special_price, store_id: data.store_id }))
    formData.append('purchase_price', JSON.stringify({ purchase_price: data.purchase_price, stocks_variants_id: data.stocks_variants_id }))
    if (control1.valid && !selling_error && data.store_id > 0) {
      this.api.updateVariant(formData, id)
        .subscribe((response: any) => {
          if (response.success) {
            this.utility.showSnackBar(response.message);
            this.isSubmitted = false;
            this.viewOnly();
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'SAVE CHANGES';
            this.imagesOfarray = [];
            this.getProductById()
            // this.router.navigateByUrl('products/allproducts');
          }
          else {
            this.utility.showSnackBar(response.message, { panelClass: 'error' });
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'SAVE CHANGES';
          }
        },
          err => {
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'SAVE CHANGES';
          });
    }
  }

  onSubmit(event) {
    switch (event) {
      case "generalInfo":
        this.generalInfoStore(event);
        break;

      case "imageInfo":
        this.imagesStore(event);
        break;

      case "taxInfo":
        this.taxInfoStore(event);
        break;

      case "identificationInfo":
        this.identificationInfoStore(event);
        break;

      case "supplierInfo":
        this.supplierInfoStore(event);
        break;

      case "properties":
        this.propertyInfoStore(event);
        break;

      default:
        break;
    }

  }
  //#endregion
  ngOnInit() {
    this.getProvince();
    this.productEditForm()
    this.route.params.subscribe(params => {
      this.product_id = +params['id'];
    });
    let userData = this.utility.getSessionData('currentUser');
    this.isAdmin = userData.user_role.indexOf("superadmin") != -1 || userData.user_role.indexOf("chain_manager") != -1  || userData.user_role.indexOf("store_manager") != -1 || userData.user_role.indexOf("admin") != -1;
    this.isAdminRole = userData.user_role.indexOf("admin") != -1;
    this.getProductById();
    this.viewOnly();
  }
  ngDoCheck() {
    this.innerHeight = window.innerHeight - 192;
  }
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE CHANGES',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }

  public chainwiseStores = [];
  selectedChain() {
    this.chainwiseStores = [];
    /* for getting chain wise stores */
    this.result.stores.forEach(element => {
      this.chainwiseStores.push(element)
    });
    /* for getting chain wise stores */
  }

  /* store wise taxes */
  public storewiseTaxes = [];
  selectedStore(store_id, event) {

    if (event.isUserInput) {
      this.storewiseTaxes = [];
      this.result.stores.forEach(element => {
        if (element.store_id == store_id) {
          this.storewiseTaxes.push(element.taxrates)
        }
      });
    }
  }
  /* store wise taxes */
}
