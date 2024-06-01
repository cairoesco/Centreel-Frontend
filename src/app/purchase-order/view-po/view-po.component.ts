import { Component, OnInit, ViewChild, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { PurchaseOrderService } from '../purchase-order.service';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { environment } from '../../../environments/environment';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { PrintPoComponent } from '../print-po/print-po.component';
import * as _ from 'lodash';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { PrintBarcodeComponent } from '../../products/products/print-barcode/print-barcode.component';

@Component({
  selector: 'app-view-po',
  templateUrl: './view-po.component.html',
  styleUrls: ['./view-po.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter }
  ],
})
export class viewPoComponent implements OnInit {

  /* scroll event */
  @ViewChild('1') element1: ElementRef;
  @ViewChild('2') element2: ElementRef;
  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  public API_URL = environment.baseUrl + "api/";
  public po_id: any;
  public innerHeight: any;
  public type: string = 'component';
  public selected = false;
  public indexofTab = 0;
  public form: UntypedFormGroup;
  public purchaseForm: UntypedFormGroup;
  public isCompletedPO: boolean = false;
  public isActive;
  public purchaseInfo: boolean = false;
  public productInfo: boolean = false;
  public imageSrc: any;
  public heightOfY;
  public maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  public minDate = new Date(2018, 9, 17);
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean;
  public hasAnotherDropZoneOver: boolean;
  public response: string;
  public purchaseOrderData: any;
  public rawData: any;
  public arrayOfFiles = [];
  public filesOfarray = [];
  public warehouse = []; //new
  public options = { prefix: '$ ', thousands: ',', decimal: '.', align: 'center', nullable: true, allowZero: false }
  constructor(private route: ActivatedRoute, private fb: UntypedFormBuilder, public dialog: MatDialog, public refVar: ChangeDetectorRef, private api: PurchaseOrderService, public utility: UtilsServiceService) {
    this.fileUploader();
    this.utility.indexofTab = 0;
  }

  //#region******************* File *****************//
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
  /*************** Delete File ********************* */
  deleteFile(file, index) {
    this.utility.confirmDialog({ title: 'Delete Document', message: 'Are you sure want to delete document?' }).subscribe((result: any) => {
      if (Boolean(result)) {
        if (index !== -1 && file == 0) {
          let file_index = index - (this.arrayOfFiles.length - this.filesOfarray.length);
          this.arrayOfFiles.splice(file_index, 1);
          this.filesOfarray.splice(index, 1);

          this.form.get('file_input').setValue(null);
        }
        else if (index !== -1 && file != 0) {
          var param = { _method: 'delete' }
          this.api.deleteDoc(file, param)
            .subscribe((response: any) => {
              if (response.success) {
                this.utility.showSnackBar(response.message);
                this.arrayOfFiles.splice(index, 1);
              }
            },
              err => {
              });
        }
      }
    })
  }

  public fileDragged(type) {
    this.uploader.queue.forEach(element => {
      this.arrayOfFiles.push({ id: 0, original_name: element.file.name, document_path: element.file });
      this.filesOfarray.push(element.file.rawFile);
    });
    this.uploader.clearQueue()

  }
  public fileOverBase(e: any, type): void {
    this.hasBaseDropZoneOver = e;
    this.fileDragged(type);
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
  //#endregion

  //#region**************** FormGroup ***************/
  viewOnly() {
    this.purchaseInfo = false;
    this.purchaseForm.disable();
    this.productInfo = false;
  }
  isEditable(key) {
    switch (key) {
      case 1:
        this.viewOnly();
        this.purchaseForm.enable()
        this.purchaseInfo = true;
        break;
      case 2:
        this.viewOnly();
        this.productInfo = true;
        break;

      default:
        break;
    }
  }

  /* form group */
  purchaseInfoForm() {
    this.purchaseForm.patchValue({
      purchase_order_no: this.purchaseOrderData.po_detail.purchase_order_no,
      vendor_id: this.purchaseOrderData.po_detail.vendor_id,
      total: this.purchaseOrderData.po_detail.total,
      received_by: this.purchaseOrderData.po_detail.received_by,
      date: this.purchaseOrderData.po_detail.received_on,
      received_on: this.purchaseOrderData.po_detail.received_on,
      description: this.purchaseOrderData.po_detail.description,

      storage_id: this.purchaseOrderData.po_detail.storage_id,
      taxrate_id: this.purchaseOrderData.po_detail.taxrate_id,
      freight_charge: this.purchaseOrderData.po_detail.freight_charge,
      provincial_tax_amount: this.purchaseOrderData.po_detail.provincial_tax_amount,
      country_tax_amount: this.purchaseOrderData.po_detail.country_tax_amount,

      contact: this.purchaseOrderData.po_detail.contact,
      invoice_date: this.purchaseOrderData.po_detail.invoice_date,
      phone: this.purchaseOrderData.po_detail.phone,

      email: this.purchaseOrderData.po_detail.email,
      address: this.purchaseOrderData.po_detail.address,
    });
  }
  /* form group */

  //#endregion

  /* tax rate */
  public tax_rate: any;
  public gst_val: any;
  public pst_val: any;
  taxrate(storeID,chainID, event) {
    if (event.isUserInput) {
      let storeid = storeID;
      let chainid = chainID;
      if (this.rawData && this.rawData.stores){
        this.tax_rate = _.filter(this.rawData.stores, function (o) { return o.store_id == storeid; });
        this.tax_rate = this.tax_rate[0].taxrates;
        
        if (this.tax_rate.length > 0) {
          this.purchaseForm.patchValue({ tax_rate: this.tax_rate[0].id });
        }
      }
      if(chainid){
        // this.purchaseForm.controls['chain_id'].setValue(chainid);
      }
      if(storeid){
        // this.purchaseForm.controls['store_id'].setValue(storeid);
      }
    }
  }

  //#region*********** Form Submit ********************//
  onSubmit(form) {
    this.utility.confirmDialog({ title: 'Please confirm the action', message: 'Do you really want to proceed to save the Purchase Order or do you still want to make sure everything is well checked for selling?', okButton:'SAVE', cancelButton: 'REVIEW' }).subscribe((result: any) => {
      if (Boolean(result)) {
        let date = this.purchaseForm.get('date').value;
        let formatedDate = _moment(date).format("YYYY-MM-DD");
        this.purchaseForm.get('received_on').setValue(formatedDate);
        const formData = new FormData();
        Object.keys(this.purchaseForm.controls).forEach(key => {
          if (key != 'cannabisProducts' && key != 'cannabisProductsAccessories' && key != 'noncannabisProducts') {
            if (key == "document") {
              Object.keys(this.filesOfarray).forEach(key => {
                if (this.filesOfarray.length > 0)
                  formData.append("documents[]", this.filesOfarray[key])
              });
            }
            else {
              formData.append(key, this.purchaseForm.controls[key].value)
            }
          }
        });
        let VariantData: any = [];
        VariantData = this.purchaseForm.controls.cannabisProducts.value.concat(this.purchaseForm.controls.cannabisProductsAccessories.value);
        VariantData = VariantData.concat(this.purchaseForm.controls.noncannabisProducts.value);
        formData.append('variants', JSON.stringify(VariantData));
        if (this.purchaseForm.valid) {
          this.barButtonOptions.active = true;
          this.barButtonOptions.text = 'Saving Data...';
          this.api.editPo(formData, this.po_id).subscribe((response: any) => {
            if (response.success) {
              this.utility.showSnackBar(response.message);
              this.getPobyId();
              this.barButtonOptions.active = false;
              this.barButtonOptions.text = 'SAVE CHANGES';

              var cannabisControl: any = <UntypedFormArray>this.purchaseForm.controls['cannabisProducts'];
              var nonCannabisControl: any = <UntypedFormArray>this.purchaseForm.controls['noncannabisProducts'];
              var accessoriesControl: any = <UntypedFormArray>this.purchaseForm.controls['cannabisProductsAccessories'];

              var i;
              /* set actual quantity field value 0 after submit form */
              for (i = 0; i < accessoriesControl.value.length; i++) {
                accessoriesControl.at(i).controls['value_added'].setValue(0);
              }

              for (i = 0; i < nonCannabisControl.value.length; i++) {
                nonCannabisControl.at(i).controls['value_added'].setValue(0);
              }
              /* set actual quantity field value 0 after submit form */
            }
            else {
              this.utility.showSnackBar(response.message);
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
    })
    
  }
  //#endregion

  //#region*********** API ********************//
  public cannabisProducts: any = [];
  public cannabisProductsAccessories: any = [];
  public noncannabisProducts: any = [];

  fillProductProperties(data) {
    
    return this.fb.group({
      is_received: [data.is_received],
      received_qty: [data.received_qty],
      value_added: [0],
      po_product_id: [data.po_product_id],
      source_page: ['add_po'], //add source of stock
    });
  }
  getPobyId() {
    this.api.getPobyId(this.po_id)
      .subscribe((response: any) => {
        if (response.success) {
          if (response.data.po_detail.received_on) {
            response.data.po_detail.received_on = _moment(response.data.po_detail.received_on, 'YYYY-MM-DD');
          }
          this.purchaseOrderData = response.data;

          this.cannabisProducts = _.filter(response.data.variants, function (o) { return o.product_type_slug == 'cannabis' });
          this.cannabisProductsAccessories = _.filter(response.data.variants, function (o) { return o.product_type_slug == 'cannabis accessories' });
          this.noncannabisProducts = _.filter(response.data.variants, function (o) { return o.product_type_slug != 'cannabis' && o.product_type_slug != 'cannabis accessories' });
          var cannabisControl: any = <UntypedFormArray>this.purchaseForm.controls['cannabisProducts'];
          var nonCannabisControl: any = <UntypedFormArray>this.purchaseForm.controls['noncannabisProducts'];
          var accessoriesControl: any = <UntypedFormArray>this.purchaseForm.controls['cannabisProductsAccessories'];
          this.cannabisProducts.forEach(element => {
            cannabisControl.push(this.fillProductProperties(element))
          });
          this.noncannabisProducts.forEach(element => {
            nonCannabisControl.push(this.fillProductProperties(element))
          });
          this.cannabisProductsAccessories.forEach(element => {
            accessoriesControl.push(this.fillProductProperties(element))
          });
          this.isCompletedPO = false;
          // this.isCompletedPO = (this.purchaseOrderData.po_detail.status == "completed");
          this.arrayOfFiles = this.purchaseOrderData.documents;
          this.purchaseInfoForm();
          if (this.purchaseOrderData && this.purchaseOrderData.po_detail && this.purchaseOrderData.po_detail.status == 'RECEIVED')
            this.viewOnly();
        }
      });
  }
  getRawData() {
    this.api.getRawDetails()
      .subscribe((response: any) => {
        if (response.success) {
          this.rawData = response.data;
          this.getWarehouse()
        }
      });
  }
  public cID: any;
  getWarehouse() {
    this.api.getWarehouse()
      .subscribe((response: any) => {
        if (response.data.length > 0) {
          this.warehouse = _.filter(response.data, function (o) { return o.subtype == 'Store Front'; });
          
          // this.purchaseForm.controls.storage_id.setValue(this.warehouse[0].storage_id)
          this.cID = this.warehouse[0].chain_id;
        }
      });
  }
  //#endregion



  ngOnInit() {
    this.route.params.subscribe(params => {
      this.po_id = +params['id'];
    });
    this.getPobyId();
    this.getRawData();
    this.purchaseForm = this.fb.group({
      purchase_order_no: [''],
      vendor_id: [null, Validators.compose([Validators.required])],
      total: [null, Validators.compose([Validators.required])],
      final_total: [0], //new
      storage_id: [''], //new
      taxrate_id: [''], //new
      received_by: ['', Validators.compose([Validators.required])],
      date: [''],
      received_on: ['', Validators.compose([Validators.required])],
      file_input: [''],
      delete_file: [''],
      document: [''],
      freight_charge: [null],
      provincial_tax_amount: [null],
      country_tax_amount: [null],
      list_of_file: [''],
      contact: [''],
      invoice_date: [''],
      phone: [''],
      email: [''],
      address: [''],
      description: ['', Validators.compose([Validators.required])],
      _method: ["put"],
      cannabisProductsAccessories: this.fb.array([]),
      cannabisProducts: this.fb.array([]),
      noncannabisProducts: this.fb.array([]),
    });
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
  openFilter(POdata): void {
    let poId = this.po_id
    const dialogRef = this.dialog.open(PrintPoComponent, {
      width: '70%',
      maxWidth: "700px",
      disableClose: true,
      data: { POdata, poId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (Boolean(result)) {
        console.log("data send");
      }
    });
  }

  /* print barcode */
  public variantDetail: any;
  printBarcode(index,v_id,formname): void {
    
    let productVariantData: any
    var formControl: any
    if(formname == 'cannabisProductsAccessories'){
      formControl = this.cannabisProductsAccessories;
    }else if(formname == 'noncannabisProducts'){
      formControl = this.noncannabisProducts;
    }else{
      formControl = this.cannabisProducts;
    }
    productVariantData = _.find(formControl, function (o) { return o.variant_id === v_id });
    
    productVariantData.variant_price = productVariantData.selling_price;
    this.variantDetail = productVariantData;
    let vData = [this.variantDetail];
    
    let vId = v_id;
    const dialogRef = this.dialog.open(PrintBarcodeComponent, {
      width: '70%',
      maxWidth: "700px",
      disableClose: true,
      data: { vData, vId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (Boolean(result)) {
        // console.log("data send");
      }
    });
  }
  /* print barcode */

  /* checked checkbox */
  checked_checkbox(index, control_name) {
    const rControl = (<UntypedFormArray>this.purchaseForm.controls[control_name]).at(index).get('is_received');
    const control1 = (<UntypedFormArray>this.purchaseForm.controls[control_name]).at(index).get('value_added') as UntypedFormArray;
    if(control1.value){
      rControl.setValue(true);
    }else{
      rControl.setValue(false);
    }
  }
  /* checked checkbox */

  /* canDeactivate code */
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
    if(this.purchaseForm.dirty){
      filled_data = 1;
    }

    if (filled_data) {
      return this.utility.confirmDialog({ title: 'Please confirm the action', message: 'Are you sure you\'d like to leave the page? You\'ll lose all your progress?', okButton: 'LEAVE', cancelButton: 'CANCEL' }).toPromise();
    } else {
      return true;
    }
    
  }
  /* canDeactivate code */

}
