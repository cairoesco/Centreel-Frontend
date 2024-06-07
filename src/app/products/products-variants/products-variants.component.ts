import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { ProductService } from '../product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UtilsServiceService } from '../../shared/services/utils-service.service'
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { FileUploader } from 'ng2-file-upload';
import { InventoryModalComponent } from '../products/inventory-modal/inventory-modal.component';
import { ConfirmationDialogComponent } from '../products/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
// import { UtilsServiceService } from './../../shared/services/utils-service.service'

@Component({
  selector: 'app-products-variants',
  templateUrl: './products-variants.component.html',
  styleUrls: ['./products-variants.component.scss']
})
export class ProductsVariantsComponent implements OnInit {
  public CannabisDryWeightUnit = [{ slug: "gm", unit_name: "Grams" }];
  public product_id;
  public selected_variant;
  public variant_id;
  productVariantsForm: UntypedFormGroup;
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean;
  public hasAnotherDropZoneOver: boolean;
  public arrayOfImages = [];
  public imagesOfarray = [];
  public deleteFileArray = [];
  public innerHeight: any;
  isPriceConfirm: boolean = false;
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
  optionArray: any = [
    { "optionId": 1, "optionName": "Color" },
    { "optionId": 2, "optionName": "Size" },
    { "optionId": 3, "optionName": "Material" }
  ];
  constructor(private _formBuilder: UntypedFormBuilder,
    public refVar: ChangeDetectorRef,
    private route: ActivatedRoute,
    public utils: UtilsServiceService,
    public dialog: MatDialog,
    private router: Router,
    private api: ProductService, ) {
    this.productVariantsForm = this.createproductVariantsForm();
    const variantcontrol = <UntypedFormArray>this.productVariantsForm.controls['options'];
    this.optionArray.forEach(element => {
      variantcontrol.push(this.addOptions(element));
    });
  }

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
        this.utils.showSnackBar("Unsupported file format", { panelClass: 'error' });
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


  createproductVariantsForm() {
    return this._formBuilder.group({
      productID: [12],
      product_image: [''],
      image: [''],
      product_sku: ['', [Validators.required]],
      barcode: ['', [Validators.required]],
      inventory: this._formBuilder.array([]),
      options: this._formBuilder.array([]),
      price: ['', Validators.compose([Validators.required])],
      cost_price: [''],
      sku: ['', Validators.compose([Validators.required])],
      centreel_id: ['', Validators.compose([Validators.required])],
      gtin: ['', Validators.compose([Validators.required])],
      gov_id_number: ['', Validators.compose([Validators.required])],
      quantity: ['', Validators.compose([Validators.required])],
      cannabis_uom: ['gm'],
      cannabis_weight: [''],
      govt_id: [''],
      product_provinces: this._formBuilder.array([]),
      price_differ_for_store: ['0'],
      selling_price: ['', [Validators.required]],
      variant_price: this._formBuilder.array([]),
      is_product_variant: ['0'],

    });
  }
  updateVariantForm(variant_data, product_data) {
    this.productVariantsForm.patchValue({
      productID: variant_data.product_id,
      // product_image: product_data.product_images[0].path,
      // image: variant_data.product_id,
      product_sku: variant_data.variant_sku,
      barcode: variant_data.barcode,
      // inventory: this._formBuilder.array([]),
      // options: this._formBuilder.array([]),
      // price: ['', Validators.compose([Validators.required])],
      // cost_price: variant_data.product_id,
      // sku: ['', Validators.compose([Validators.required])],
      // centreel_id: ['', Validators.compose([Validators.required])],
      // gtin: ['', Validators.compose([Validators.required])],
      // gov_id_number: ['', Validators.compose([Validators.required])],
      // quantity: ['', Validators.compose([Validators.required])],
      cannabis_uom: variant_data.cannabis_unit,
      cannabis_weight: variant_data.cannabis_weight,
      govt_id: variant_data.variant_provinces,
      // product_provinces: this._formBuilder.array([]),
      // price_differ_for_store: ['0'],
      // selling_price: ['', [Validators.required]],
      // variant_price: this._formBuilder.array([]),
      // is_product_variant: ['0'],
    })
  }
  sellingPriceEnebleDisable(action) {
    if (action) {
      this.productVariantsForm.controls.price_differ_for_store.enable()

      if (this.productVariantsForm.controls.price_differ_for_store.value != 0)
        this.productVariantsForm.controls.variant_price.enable()

      else
        this.productVariantsForm.controls.selling_price.enable()
    }
    else {
      this.productVariantsForm.controls.price_differ_for_store.disable()

      if (this.productVariantsForm.controls.price_differ_for_store.value != 0)
        this.productVariantsForm.controls.variant_price.disable()

      else
        this.productVariantsForm.controls.selling_price.disable()
    }

  }
  countProvinceInfo(event, data) {
    const control = <UntypedFormArray>this.productVariantsForm.controls['product_provinces'];
    if (event.isUserInput) {
      if (event.source._selected) {
        control.push(this.addProvince(data));
      } else {
        const tempData = this.productVariantsForm.get('product_provinces').value;
        let index = tempData.indexOf(data);
        control.removeAt(index);
      }
    }
  }

  public rawDetail;
  PricingDiffersPerStoreChange(event) {
    if (event.value == 1) {
      this.productVariantsForm.removeControl('selling_price')
      if (<UntypedFormArray>this.productVariantsForm.controls['variant_price'] == undefined) {
        this.productVariantsForm.addControl('variant_price', this._formBuilder.array([]))
        const SellingPriceControl = <UntypedFormArray>this.productVariantsForm.controls['variant_price'];
        this.rawDetail.stores.forEach(element => {
          let data = this.addProductStoreWiseSellingPrice(element);
          SellingPriceControl.push(data);
        });
      }
    }
    else {
      this.productVariantsForm.addControl('selling_price', new UntypedFormControl('', Validators.required))
    }
  }

  public imageSrc;
  //********************* Image ***********************/
  onFileChange(event) {
    if (event.target.files.length > 0) {
      let image = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(image);
      // this.refVar.detectChanges();
      // this.form.get('employee_image').setValue(image);
      // this.form.get('image').setValue(null);
    }
  }

  //******************** Inventory *******************/
  AddInventory(index, data) {
    const dialogRef = this.dialog.open(InventoryModalComponent, {
      width: '550px',
      disableClose: true,
      data: { vendors: this.rawDetail.vendors, purchase_orders: this.rawDetail.purchase_orders }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let date = result.get('purchase_date').value;
        let formatedDate = _moment(date).format("YYYY-MM-DD");
        result.get('purchase_date').setValue(formatedDate);
        result.get('storage_id').setValue(data.storage_id);
        const control = (<UntypedFormArray>this.productVariantsForm.controls['inventory']).at(index).get('inventories') as UntypedFormArray;
        control.push(this.AddMultipalInventoryin(result));
      }
    });
  }

  //*********************** Product Store Wise Selling Price**********************************/

  private addProductStoreWiseSellingPrice(data) {
    return this._formBuilder.group({
      store_id: [data.store_id],
      name: [data.name],
      selling_price: ['', [Validators.required]],
    });
  }
  private addProvince(data) {
    return this._formBuilder.group({
      province_id: [data.location_id],
      province_code: [data.location_name],
      govt_id: ['']
    });
  }

  private addOptions(parentData) {
    return this._formBuilder.group({
      optionId: [parentData.optionId],
      optionName: [parentData.optionName],
      optionValue: ['', Validators.compose([Validators.required])]
    });
  }

  //******************** Inventory *******************/
  priceConfirmation(data) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      // width: '550px',
      disableClose: true,
      panelClass: 'confirm-screen-dialog',
      data: { vendors: this.rawDetail.vendors, purchase_orders: this.rawDetail.purchase_orders }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.isPriceConfirm = false;
      this.sellingPriceEnebleDisable(false);
      if (result && result.success) {
        this.isPriceConfirm = true;
        this.sellingPriceEnebleDisable(true);
      }
    });
  }

  focusOutFunction(event, index) {
    // forcus out code will be here
  }
  //*************** Raw Details for Add product dropdown *******************/
  public stores
  public chains
  public warehouses
  getRawDetails() {
    this.api.rawDetailsProducts()
      .subscribe((response: any) => {
        if (response.status) {
          this.rawDetail = response.data;
          this.stores = this.rawDetail.stores;
          this.warehouses = this.rawDetail.warehouses;
          this.chains = this.rawDetail.chains;

          //**************************************** */
          if (this.rawDetail.stores.length > 0) {
            const SellingPriceControl = <UntypedFormArray>this.productVariantsForm.controls['variant_price'];
            this.rawDetail.stores.forEach(element => {
              let data = this.addProductStoreWiseSellingPrice(element);
              SellingPriceControl.push(data);
            });
          }
          if (this.rawDetail.warehouses.length > 0) {
            const InventoryControl = <UntypedFormArray>this.productVariantsForm.controls['inventory'];
            this.rawDetail.warehouses.forEach(element => {
              let data = this.addProductStoreWiseInventory(element);
              InventoryControl.push(data);
            });
          }

        }
      });
  }
  private addProductStoreWiseInventory(data) {
    return this._formBuilder.group({
      storage_id: [data.storage_id],
      name: [data.name],
      inventories: this._formBuilder.array([]),
    });
  }
  AddMultipalInventoryinSameStorage(index, data) {
    const control = (<UntypedFormArray>this.productVariantsForm.controls['inventory']).at(index).get('inventories') as UntypedFormArray;
    control.push(this.AddMultipalInventoryin(data));
  }
  private AddMultipalInventoryin(data) {
    return this._formBuilder.group({
      storage_id: [data.value.storage_id],
      name: [data.value.name],
      vendor: [data.value.vendor],
      stock_price: [data.value.stock_price],
      value_added: [data.value.value_added],
      purchase_order_no: [data.value.purchase_order_no],
      batch_no: [data.value.batch_no],
      purchase_date: [data.value.purchase_date],
      reorder: [data.value.reorder],
    });
  }
  public provinceList: any;
  getProvince() {
    this.api.getProvinceList()
      .subscribe((response: any) => {
        if (response.success) {
          this.provinceList = response.data;
        }
      });
  }
  public variantData: any;
  getVariantsList() {
    let data = { product_id: this.product_id }
    this.api.getVariantList(data)
      .subscribe((response: any) => {
        if (response.success) {
          this.variantData = response.data.products;
          this.getVariantDetail(this.variant_id);

        }
      });
  }
  public variantDetails: any;
  getVariantDetail(variant_id) {
    this.api.getVariantDetail(variant_id)
      .subscribe((response: any) => {
        if (response.success) {
          this.variantDetails = response.data.variants;
          this.updateVariantForm(this.variantDetails, this.variantData)
        }
      });
  }
  activeVariant(variant_id) {
    this.selected_variant = variant_id;
    this.router.navigateByUrl('products/' + this.product_id + '/variants/' + variant_id + '/view');
    this.getVariantDetail(variant_id);

  }
  navigateToProduct() {
    this.router.navigateByUrl('products/' + this.product_id + '/view');
  }
  onSubmit(formData) {
    console.log("form data is ", formData);
  }
  ngDoCheck() {
    this.innerHeight = window.innerHeight - 192;
  }
  ngOnInit() {
    this.getProvince();
    this.getRawDetails();
    this.sellingPriceEnebleDisable(false);
    this.route.params.subscribe(params => {
      this.product_id = +params['product_id'];
      this.variant_id = +params['variant_id'];
      this.selected_variant = this.variant_id;
    });
    this.getVariantsList();
  }

}
