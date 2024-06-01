import {
  Component,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
  Input,
} from "@angular/core";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarDirective,
  PerfectScrollbarComponent,
} from "ngx-perfect-scrollbar";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormArray,
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { FileUploader } from "ng2-file-upload";
import { PurchaseOrderService } from "../purchase-order.service";
import * as _moment from "moment";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import { UtilsServiceService } from "../../shared/services/utils-service.service";
import { MatProgressButtonOptions } from "mat-progress-buttons";
import * as _ from "lodash";
import * as XLSX from "xlsx";
import { debounceTime } from "rxjs/operators";
import { PrintBarcodeComponent } from "../../products/products/print-barcode/print-barcode.component";
import { CreateProductComponent } from "../create-product/create-product.component";
import { PurchaseOrderComponent } from "../purchase-order.component";
import { SharedService } from "src/app/shared/shared.service";
import { Observable, timer } from "rxjs";
import { map, startWith, switchMap } from "rxjs/operators";
@Component({
  selector: "app-create-po",
  templateUrl: "./create-po.component.html",
  styleUrls: ["./create-po.component.scss"],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter },
  ],
})
export class CreatePoComponent implements OnInit {
  @ViewChild("searchInput") searchInput: ElementRef;
  name = "Angular";
  @ViewChild(PurchaseOrderComponent) hello: PurchaseOrderComponent;

  ngAfterViewInit() {
    // console.log('Hello ', this.hello.name);
  }
  public config: PerfectScrollbarConfigInterface = {};
  public innerHeight: any;
  public type: string = "component";
  public selected: any = [];
  public indexofTab = 0;
  public form: UntypedFormGroup;
  public purchaseForm: UntypedFormGroup;
  public arrayOfFiles = [];
  public filesOfarray = [];
  public rawData: any;
  public imageSrc: any;
  public heightOfY;
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean;
  public hasAnotherDropZoneOver: boolean;
  public isScanning: boolean = false;
  public isImported: boolean = false;
  public response: string;
  public maxDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
  public minDate = new Date(2018, 9, 17);
  public options = {
    prefix: "$ ",
    thousands: ",",
    decimal: ".",
    align: "center",
    nullable: true,
    allowZero: false,
  };
  public cannabis_dynamicHeight = "";
  public cannabis_accessories_dynamicHeight = "";
  public non_cannabis_dynamicHeight = "";
  public warehouse = [];
  public editing = {};
  public rows = [];
  public formobj: any = new Object();
  public variantObj: any = new Object();
  public isTrue: boolean = true;
  public importSheet: boolean = false;

  public tempWarehouse: any = {};

  public temp_thc: any = "";
  public temp_cbd: any = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public refVar: ChangeDetectorRef,
    private api: PurchaseOrderService,
    public utility: UtilsServiceService
  ) {
    this.fileUploader();
    this.utility.indexofTab = 0;
    // @ts-ignore
    // console.log(this.router, 'line 124')
    if (this.router.getCurrentNavigation().extras && this.router.getCurrentNavigation().extras.target) {
      this.importSheet = true;
      this.uploadFile(this.router.getCurrentNavigation().extras);
    }
  }
  focusOnSearch() {
    this.searchInput.nativeElement.focus();
  }
  noncannabisProducts: any = [];
  //#region*****************Apply filter************//
  applyFilterProducts(event) {
    let value = event.target.value;
    let data: any = value.split(" ") || [];
    let selfProducts = this.purchaseForm.controls.noncannabisProducts.value;
    if (data.length > 0) {
      let filteredData: any = [];
      data.forEach((element, index) => {
        if (element) {
          let val = element;
          let temp =
            this.purchaseForm.controls.noncannabisProducts.value.filter(
              function (d) {
                let value = false;
                selfProducts.forEach((element) => {
                  if (index == 0 || element.product_id != d.product_id) {
                    value = true;
                  }
                });
                if (value)
                  return d.product_name.toLowerCase().indexOf(val) !== -1;
              }
            );
          if (!temp) {
            this.noncannabisProducts = [];
            return false;
          }
          filteredData = filteredData.concat(temp);
          filteredData = [...filteredData];
        }
      });
      if (filteredData.length) this.noncannabisProducts = filteredData;
      else {
        this.noncannabisProducts = [];
      }
    }
  }

  //#region******************* File *****************//
  fileUploader() {
    this.uploader = new FileUploader({
      disableMultipart: true,
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        return new Promise((resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date(),
          });
        });
      },
    });
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
    this.response = "";
  }
  /*************** Delete File ********************* */
  deleteFile(index) {
    if (index !== -1) {
      this.arrayOfFiles.splice(index, 1);
      this.filesOfarray.splice(index, 1);
    }
  }

  public fileDragged() {
    this.uploader.queue.forEach((element) => {
      let file_id = this.arrayOfFiles.length + 1;
      this.arrayOfFiles.push({
        id: 0,
        original_name: element.file.name,
        document_path: element.file,
      });
      this.filesOfarray.push(element.file.rawFile);
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
  //#endregion

  //#region**************** FormGroup ***************/
  purchaseInfoForm() {
    this.purchaseForm = this.fb.group({
      purchase_order_no: [
        "",
        [Validators.required],
        [this.customAsyncValidator()],
      ],
      address: [""],
      contact: [""],
      phone: [""],
      invoice_date: ["", Validators.required],
      provincial_no: [""],
      country_no: [""],
      taxrate_id: [""],
      total: [0, Validators.required],
      final_total: [0, Validators.required],
      description: [""],
      documents: [""],
      freight_charge: [0],
      provincial_tax_amount: [0],
      country_tax_amount: [0],
      action: ["store"],
      email: [""],
      search: [""],
      vendor_id: [""],
      received_by: [""],
      date: [""],
      file_input: [""],
      delete_file: [""],
      // status: ['1'],
      storage_id: [""],
      poProducts: this.fb.array([]),
      cannabisProductsAccessories: this.fb.array([]),
      cannabisProducts: this.fb.array([]),
      noncannabisProducts: this.fb.array([]),
      chain_id: [""],
      store_id: [""],
      po_no: [""],
    });
  }

  fillProductProperties(data) {
    let barcodeVal = data.barcodes
      ? data["barcodes"].split(",").length
        ? data["barcodes"].split(",")[data["barcodes"].split(",").length - 1]
        : ""
      : "";
    return this.fb.group({
      product_name: [data.product_name],
      product_id: [data.product_id],
      variant_id: [data.variant_id],
      variant_name: [data.variant_name],
      variant_sku: [data.variant_sku],
      value_added: [""], //required
      package_capacity: [data.package_capacity],
      package_price: [""],
      is_received: [true],
      total_qty: [1],
      actual_qty: [1],
      stock_price: [0, Validators.required], //required
      selling_price: [data.selling_price, Validators.required], //required
      special_price: [data.special_price], //required
      margin: [null],
      // batch_no: ['--', Validators.required],
      // storage_id: [this.purchaseForm.controls.storage_id.value],
      storage_id: [this.tempWarehouse.storage_id],
      // cost: [0, Validators.required],
      barcodes: [data.barcodes],
      barcode_number: [barcodeVal], //barcode number
      barcode: [""], //barcode number
      // batch_no: ['', Validators.required], //batch number
      // total_selling_price: [data.selling_price, Validators.required],
      source_page: ["add_po"],
    });
  }

  // stock price change
  // stockPrice(index, control_name) {
  //   const control = (<FormArray>this.purchaseForm.controls[control_name]).at(index).get('stock_price') as FormArray;
  //   const control1 = (<FormArray>this.purchaseForm.controls[control_name]).at(index).get('cost') as FormArray;
  //   const control2 = (<FormArray>this.purchaseForm.controls[control_name]).at(index).get('value_added') as FormArray;
  //   let value: any = control1.value / control2.value;
  //   control.setValue(value)
  // };
  //#endregion

  //#region*********** Form Submit ********************//

  prevent_enter(event: any) {
    if (event.keyCode == 13) {
      return false;
    }
  }

  /* SAVE DRAFT */
  draft_po_number: boolean = false;
  saveDraft() {
    /* save draft data */
    if (this.purchaseForm.value.purchase_order_no != "") {
      this.draft_po_number = true;
      /* invoice date format */
      if (this.purchaseForm.get("invoice_date").value) {
        let invoicedate = this.purchaseForm.get("invoice_date").value;
        let formatedDate = _moment(invoicedate).format("YYYY-MM-DD");
        this.purchaseForm.get("invoice_date").setValue(formatedDate);
      }

      // let cid = this.purchaseForm.value.storage_id.chain_id;
      // let sid = this.purchaseForm.value.storage_id.store_id;
      let poid = this.purchaseForm.value.purchase_order_no;
      // this.purchaseForm.get('storage_id').setValue(this.purchaseForm.value.storage_id.storage_id);
      // this.purchaseForm.get('chain_id').setValue(cid);
      // this.purchaseForm.get('store_id').setValue(sid);
      this.purchaseForm.get("po_no").setValue(poid);

      /* invoice date format */

      // if (this.purchaseForm.valid) {
      //   this.barButtonOptions.active = true;
      //   this.barButtonOptions.text = 'Saving Data...';
      // }

      let VariantData: any = [];
      VariantData = this.purchaseForm.controls.cannabisProducts.value.concat(
        this.purchaseForm.controls.cannabisProductsAccessories.value
      );
      VariantData = VariantData.concat(
        this.purchaseForm.controls.noncannabisProducts.value
      );
      const formData = new FormData();

      if (this.isImported)
        formData.append(
          "variants",
          JSON.stringify(this.purchaseForm.controls.poProducts.value)
        );
      else formData.append("variants", JSON.stringify(VariantData));

      Object.keys(this.purchaseForm.value).forEach((key) => {
        if (
          key != "cannabisProducts" &&
          key != "cannabisProductsAccessories" &&
          key != "noncannabisProducts" &&
          key != "poProducts"
        ) {
          if (key == "documents") {
            Object.keys(key).forEach((key) => {
              if (this.filesOfarray[key])
                formData.append("documents[]", this.filesOfarray[key]);
            });
          } else {
            formData.append(key, this.purchaseForm.value[key]);
          }
        }
      });

      if (this.purchaseForm.controls.purchase_order_no.status == "VALID") {
        this.api.createDraft(formData).subscribe(
          (response: any) => {
            if (response.success) {
              let po_id = response.data.id;
              this.utility.showSnackBar(response.message);
              this.router.navigateByUrl("purchaseorder/po-list");
              // this.barButtonOptions.active = false;
              // this.barButtonOptions.text = 'SAVE ALL';
            } else {
              // this.barButtonOptions.active = false;
              // this.barButtonOptions.text = 'SAVE ALL';
            }
          },
          (err) => {
            // this.barButtonOptions.active = false;
            // this.barButtonOptions.text = 'SAVE ALL';
          }
        );
      }
      /* save draft data */
    } else {
      this.draft_po_number = false;
      this.utility.showSnackBar("Please enter PO number for reference", {
        panelClass: "error",
      });
    }
  }
  /* SAVE DRAFT */

  isSubmitted: boolean = false;
  onSubmit(form) {
    this.isSubmitted = true;
    var string = "";
    var selling_error = false;
    if (this.purchaseForm.valid) {
      /* check validation for selling price equal or greater than purchase price */
      var variant_data = _.filter(
        this.purchaseForm.value.poProducts,
        function (o) {
          if (o.stock_price > o.selling_price) {
            string += o.product_desc + " , ";
            selling_error = true;
          }
        }
      );
      if (selling_error) {
        this.utility.showSnackBar(
          "The selling price for " +
            string +
            " must be equal to or higher than it’s purchase price. ",
          { panelClass: "error" }
        );
      } else {
        /* check validation for selling price equal or greater than purchase price */
        this.utility
          .confirmDialog({
            title: "Please confirm the action",
            message:
              "Do you really want to proceed to save the Purchase Order or do you still want to make sure everything is well checked for selling?",
            okButton: "SAVE",
            cancelButton: "REVIEW",
          })
          .subscribe((result: any) => {
            if (Boolean(result)) {
              /* invoice date format */
              let invoicedate = this.purchaseForm.get("invoice_date").value;
              let formatedDate = _moment(invoicedate).format("YYYY-MM-DD");
              this.purchaseForm.get("invoice_date").setValue(formatedDate);
              /* invoice date format */

              if (this.purchaseForm.valid) {
                this.barButtonOptions.active = true;
                this.barButtonOptions.text = "Saving Data...";
              }
              let VariantData: any = [];
              VariantData =
                this.purchaseForm.controls.cannabisProducts.value.concat(
                  this.purchaseForm.controls.cannabisProductsAccessories.value
                );
              VariantData = VariantData.concat(
                this.purchaseForm.controls.noncannabisProducts.value
              );
              const formData = new FormData();

              if (this.isImported)
                formData.append(
                  "variants",
                  JSON.stringify(this.purchaseForm.controls.poProducts.value)
                );
              else formData.append("variants", JSON.stringify(VariantData));

              Object.keys(this.purchaseForm.value).forEach((key) => {
                if (
                  key != "cannabisProducts" &&
                  key != "cannabisProductsAccessories" &&
                  key != "noncannabisProducts" &&
                  key != "poProducts"
                ) {
                  if (key == "documents") {
                    Object.keys(key).forEach((key) => {
                      if (this.filesOfarray[key])
                        formData.append("documents[]", this.filesOfarray[key]);
                    });
                  } else {
                    formData.append(key, this.purchaseForm.value[key]);
                  }
                }
              });

              if (this.purchaseForm.valid) {
                this.api.createPo(formData).subscribe(
                  (response: any) => {
                    if (response.success) {
                      let po_id = response.data.id;
                      this.utility.showSnackBar(response.message);
                      this.router.navigateByUrl(
                        "purchaseorder/po-list/" + po_id + "/view"
                      );
                      this.barButtonOptions.active = false;
                      this.barButtonOptions.text = "SAVE ALL";
                    } else {
                      this.barButtonOptions.active = false;
                      this.barButtonOptions.text = "SAVE ALL";
                    }
                  },
                  (err) => {
                    this.barButtonOptions.active = false;
                    this.barButtonOptions.text = "SAVE ALL";
                  }
                );
              }
            }
          });
      }
    } else {
      this.utility.showSnackBar(
        "Whoops, looks like your missing something important. Please fill in the remaining fields.",
        { panelClass: "error" }
      );
    }
  }
  //#endregion

  //#region*********** API ********************//
  getRawData() {
    this.api.getRawDetails().subscribe((response: any) => {
      if (response.success) {
        this.rawData = response.data;
        this.getWarehouse();
      }
    });
  }
  public cID: any;
  getWarehouse() {
    this.api.getWarehouse().subscribe((response: any) => {
      if (response.data.length > 0) {
        this.warehouse = _.filter(response.data, function (o) {
          return o.subtype == "Store Front";
        });
        this.purchaseForm.controls.storage_id.setValue(
          this.warehouse[0].storage_id
        );
        this.cID = this.warehouse[0].chain_id;
        this.tempWarehouse = this.warehouse[0];
      }
    });
  }
  //#endregion

  /* tax rate */
  public tax_rate: any;
  public gst_val: any;
  public pst_val: any;
  taxrate(storeID, chainID, event) {
    if (event.isUserInput) {
      let storeid = storeID;
      let chainid = chainID;
      this.tempWarehouse = this.warehouse.find((wh) => wh.store_id == storeID);
      if (this.rawData && this.rawData.stores) {
        this.tax_rate = _.filter(this.rawData.stores, function (o) {
          return o.store_id == storeid;
        });
        this.tax_rate = this.tax_rate[0].taxrates;
        if (this.tax_rate.length > 0) {
          // this.purchaseForm.patchValue({ tax_rate: this.tax_rate[0].id });
        }
      }
      if (chainid) {
        this.purchaseForm.controls["chain_id"].setValue(chainid);
      }
      if (storeid) {
        this.purchaseForm.controls["store_id"].setValue(storeid);
      }
      for (let item of this.purchaseForm.controls["poProducts"].value) {
        item.storage_id = this.tempWarehouse.storage_id;
      }
      // console.log('mk',this.tax_rate);
    }
  }

  public taxrateValue: any;
  current_taxrate(val, event) {
    if (event.isUserInput) {
      this.taxrateValue = val;
      this.gst_val = +val.country_rate;
      this.pst_val = +val.provincial_rate;
      let sumofpurchase = this.purchaseForm.get("total").value;

      // if(sumofpurchase){
      let GST = (sumofpurchase * this.gst_val) / 100;
      let PST = (sumofpurchase * this.pst_val) / 100;

      // this.purchaseForm.controls['country_tax_amount'].setValue(this.gst_val);
      // this.purchaseForm.controls['provincial_tax_amount'].setValue(this.pst_val);
      this.purchaseForm.controls["country_tax_amount"].setValue(GST);
      this.purchaseForm.controls["provincial_tax_amount"].setValue(PST);
      this.total_value();
      // }
    }
  }

  /* clone function */
  current_taxrate1(val) {
    this.taxrateValue = val;
    this.gst_val = +val.country_rate;
    this.pst_val = +val.provincial_rate;
    let sumofpurchase = this.purchaseForm.get("total").value;

    // if(sumofpurchase){
    let GST = (sumofpurchase * this.gst_val) / 100;
    let PST = (sumofpurchase * this.pst_val) / 100;

    this.purchaseForm.controls["country_tax_amount"].setValue(GST);
    this.purchaseForm.controls["provincial_tax_amount"].setValue(PST);
    this.total_value();
    // }
  }
  /* clone function */

  tax_rate_none() {
    this.purchaseForm.controls["country_tax_amount"].setValue(0);
    this.purchaseForm.controls["provincial_tax_amount"].setValue(0);
    this.total_value();
  }

  /* fintal total with gst pst frieght rate */
  total_value() {
    let gst = this.purchaseForm.get("country_tax_amount").value;
    let pst = this.purchaseForm.get("provincial_tax_amount").value;
    let freight = this.purchaseForm.get("freight_charge").value;
    let total = this.purchaseForm.get("total").value;

    let final_sum = gst + pst + freight + total;
    // if (final_sum > 0) {
    this.purchaseForm.controls["final_total"].setValue(final_sum);
    // }
  }
  /* fintal total with gst pst frieght rate */

  /* tax rate */

  ngOnInit() {
    this.purchaseInfoForm();
    this.getRawData();
    // this.getWarehouse();
    //this.GetSearchResult();
    this.onChanges();
  }
  ngDoCheck() {
    this.innerHeight = window.innerHeight - 192;
  }
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: "SAVE ALL",
    barColor: "primary",
    raised: true,
    stroked: false,
    mode: "indeterminate",
    value: 0,
    disabled: false,
  };

  updateValue(cell, rowIndex) {
    cell.map((item) => {
      this.editing[rowIndex + "-" + item] = false;
    });
  }
  deleteVariant(index, control) {
    var mainControl: any = <UntypedFormArray>this.purchaseForm.controls[control];
    var pprice = mainControl.at(index).get("stock_price").value;
    let total = this.purchaseForm.get("total").value;
    if (pprice > 0) {
      let newTotal = total - pprice;
      this.purchaseForm.controls["total"].setValue(newTotal);
    }
    (<UntypedFormArray>this.purchaseForm.controls[control]).removeAt(index);
    // .at(index).get('stock_price') as FormArray;
  }
  public productData: any = [];
  productDisplay(product?: any) {
    return product ? product.product_name : undefined;
  }

  public isPOnumber: boolean = false;
  onChanges(): void {
    this.purchaseForm
      .get("search")
      .valueChanges.pipe(debounceTime(500))
      .subscribe((val) => {
        this.formobj.storage_id = this.purchaseForm.controls.storage_id.value;
        this.formobj.search = this.purchaseForm.get("search").value;
        this.productData = [];
        if (typeof this.purchaseForm.get("search").value != "object") {
          if (this.formobj.search) {
            this.api
              .getSearchResult(this.formobj)
              .subscribe((response: any) => {
                if (response.success) {
                  this.productData = response.data;
                }
              });
          }
        }
      });
    //on change of total value
    this.purchaseForm.get("total").valueChanges.subscribe((val) => {
      let total = this.purchaseForm.get("total").value;
      let tax_rate = this.purchaseForm.get("taxrate_id").value;
      if (tax_rate) {
        this.current_taxrate1(this.taxrateValue);
      }

      this.total_value();
    });
    //on change of freight value
    this.purchaseForm.get("freight_charge").valueChanges.subscribe((val) => {
      this.total_value();
    });
  }
  //************************ add product *******************//
  add_product(value, flag) {
    var cannabisControl: any = <UntypedFormArray>(
      this.purchaseForm.controls["cannabisProducts"]
    );
    var nonCannabisControl: any = <UntypedFormArray>(
      this.purchaseForm.controls["noncannabisProducts"]
    );
    var accessoriesControl: any = <UntypedFormArray>(
      this.purchaseForm.controls["cannabisProductsAccessories"]
    );

    let product;
    if (value) {
      product = value;
    } else {
      product = this.purchaseForm.get("search").value;
    }
    // let product = this.purchaseForm.get('search').value
    let data: any;
    if (typeof product == "object") data = this.fillProductProperties(product);

    let repeatedData: any;
    let index: any = null;
    if (data && data.status == "VALID") {
      data.get("value_added").setValidators([Validators.required]); // set require validation for value added field
      switch (product.product_type_slug) {
        case "cannabis":
          repeatedData = _.find(cannabisControl.value, function (o) {
            return o.variant_id === product.variant_id;
          });
          index = cannabisControl.value.indexOf(repeatedData);
          if (!repeatedData) {
            cannabisControl.push(data);
          } else {
            cannabisControl
              .at(index)
              .controls["value_added"].setValue(
                cannabisControl.at(index).controls["value_added"].value + 1
              );
          }
          this.cannabis_dynamicHeight =
            this.purchaseForm.controls.cannabisProducts.value.length < 12
              ? (this.purchaseForm.controls.cannabisProducts.value.length + 1) *
                  48 +
                20 +
                "px"
              : "";
          break;
        case "cannabis accessories":
          repeatedData = _.find(accessoriesControl.value, function (o) {
            return o.variant_id === product.variant_id;
          });
          index = accessoriesControl.value.indexOf(repeatedData);
          data.controls.stock_price.setValue(""); //set stock price to blank
          if (!repeatedData) {
            accessoriesControl.push(data);
          } else {
            accessoriesControl
              .at(index)
              .controls["value_added"].setValue(
                accessoriesControl.at(index).controls["value_added"].value + 1
              );
          }
          this.cannabis_accessories_dynamicHeight =
            this.purchaseForm.controls.cannabisProductsAccessories.value
              .length < 12
              ? (this.purchaseForm.controls.cannabisProductsAccessories.value
                  .length +
                  2) *
                  48 +
                10 +
                "px"
              : "";

          if (flag == "by_search") {
            this.isEditable[accessoriesControl.value.length - 1] = true;
            this.edit_row(accessoriesControl.value.length - 1);
            var i;
            for (i = 0; i < accessoriesControl.value.length; i++) {
              if (i == accessoriesControl.value.length - 1) {
                // console.log('match');
              } else {
                this.updateValue(
                  [
                    "product_name",
                    "variant_name",
                    "value_added",
                    "stock_price",
                    "selling_price",
                    "special_price",
                    "batch",
                    "storage_id",
                    "cost",
                    "total_selling_price",
                    "margin",
                    "package_capacity",
                    "barcode_number",
                  ],
                  i
                );
                this.isEditable[i] = false;
              }
            }
          } else {
            this.isEditable[accessoriesControl.value.length - 1] = true;
            this.edit_row(accessoriesControl.value.length - 1);
          }

          break;

        default:
          repeatedData = _.find(nonCannabisControl.value, function (o) {
            return o.variant_id === product.variant_id;
          });
          index = nonCannabisControl.value.indexOf(repeatedData);
          data.controls.stock_price.setValue(""); //set stock price to blank
          if (!repeatedData) {
            nonCannabisControl.push(data);
          } else {
            nonCannabisControl
              .at(index)
              .controls["value_added"].setValue(
                nonCannabisControl.at(index).controls["value_added"].value + 1
              );
          }

          this.non_cannabis_dynamicHeight =
            this.purchaseForm.controls.noncannabisProducts.value.length < 12
              ? (this.purchaseForm.controls.noncannabisProducts.value.length +
                  2) *
                  48 +
                10 +
                "px"
              : "";

          if (flag == "by_search") {
            this.isEditable[nonCannabisControl.value.length - 1] = true;
            this.edit_row(nonCannabisControl.value.length - 1);
            var i;
            for (i = 0; i < nonCannabisControl.value.length; i++) {
              if (i == nonCannabisControl.value.length - 1) {
              } else {
                this.updateValue(
                  [
                    "product_name",
                    "variant_name",
                    "value_added",
                    "stock_price",
                    "selling_price",
                    "special_price",
                    "batch",
                    "storage_id",
                    "cost",
                    "total_selling_price",
                    "margin",
                    "package_capacity",
                    "barcode_number",
                  ],
                  i
                );
                this.isEditable[i] = false;
              }
            }
          } else {
            this.isEditable[nonCannabisControl.value.length - 1] = true;
            this.edit_row(nonCannabisControl.value.length - 1);
          }
          this.noncannabisProducts =
            this.purchaseForm.controls.noncannabisProducts.value;

          break;
      }
      this.selectedResult = false;
    } else {
      this.utility.showSnackBar("You can only add existing products!!", {
        panelClass: "error",
      });
    }

    // productPropertiesControl.insert(0, data)
    // this.isEditable[0] = true
    // this.edit_row(0);
    this.purchaseForm.get("search").setValue("");
  }
  /* add product */

  public isEditable: any[] = [];
  edit_row(rowIndex) {
    this.editing[rowIndex + "-product_name"] = true;
    this.editing[rowIndex + "-variant_name"] = true;
    this.editing[rowIndex + "-value_added"] = true;
    this.editing[rowIndex + "-stock_price"] = true;
    this.editing[rowIndex + "-selling_price"] = true;
    this.editing[rowIndex + "-special_price"] = true;
    this.editing[rowIndex + "-batch_no"] = true;
    this.editing[rowIndex + "-storage_id"] = true;
    this.editing[rowIndex + "-cost"] = true;
    this.editing[rowIndex + "-total_selling_price"] = true;
    this.editing[rowIndex + "-margin"] = true;
    this.editing[rowIndex + "-package_capacity"] = true;
    this.editing[rowIndex + "-barcode_number"] = true;
  }

  uploadFile(event) {
    if (event.target.files.length > 0) {
      this.getWarehouse();
      this.purchaseInfoForm();
      this.isImported = false;
      let file: any = event.target.files[0];
      let rows: any;
      let detailObj = new Object();
      const reader: FileReader = new FileReader();
      this.arrayOfFiles.push({
        id: 0,
        original_name: file.name,
        document_path: file,
      });
      this.filesOfarray.push(file);

      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
        let headers: any = [];
        let dataTable: any = [];
        this.isImported = true;
        rows.forEach((element, i) => {
          let name_index = element.indexOf("Customer Name:");
          let invoice_index = element.indexOf("Invoice # :");
          let address_index = element.indexOf("Ship To Address:");
          let invoice_date_index = element.indexOf("Invoice Date:");
          let contact_index = element.indexOf("Contact: ");
          let order_index = element.indexOf("Order Number:");
          let phone_index = element.indexOf("Phone#");
          let gst_index = element.indexOf("LDB GST#:");
          let email_index = element.indexOf("Email:");
          let pst_index = element.indexOf("PST#:");
          let sku_index = element.indexOf("SKU");
          let total_index = element.indexOf(
            "Total Extended Customer Price Excl. Tax:"
          );
          let charge_index = element.indexOf("Freight Charges:");
          let gst_tax_index = element.indexOf("GST:");
          let pst_tax_index = element.indexOf("PST:");
          let invoice_total_index = element.indexOf("Invoice Total:");
          let vendor_index = element.indexOf("vendor:"); // vendor name field

          if (name_index != -1)
            detailObj["customer_name"] = element[name_index + 1];

          if (invoice_index != -1)
            detailObj["purchase_order_no"] = element[invoice_index + 1];

          if (address_index != -1) {
            detailObj["address"] =
              element[address_index + 1] + rows[i + 1][address_index + 1]
                ? rows[i + 1][address_index + 1]
                : "";
          }

          if (invoice_date_index != -1) {
            let date = element[invoice_date_index + 1];
            date = _moment(date, "DD-MMM-YYYY");
            detailObj["invoice_date"] = date;
          }

          if (contact_index != -1)
            detailObj["contact"] = element[contact_index + 1];

          if (order_index != -1) detailObj["order"] = element[order_index + 1];

          if (phone_index != -1) detailObj["phone"] = element[phone_index + 1];

          if (gst_index != -1) detailObj["country_no"] = element[gst_index + 1];

          if (email_index != -1) detailObj["email"] = element[email_index + 1];

          if (pst_index != -1)
            detailObj["provincial_no"] = element[pst_index + 1];

          if (total_index != -1)
            detailObj["total_invoice"] = element[total_index + 3];

          if (charge_index != -1)
            detailObj["freight_charge"] = element[charge_index + 1];

          if (gst_tax_index != -1)
            detailObj["country_tax_amount"] = element[gst_tax_index + 1];

          if (pst_tax_index != -1)
            detailObj["provincial_tax_amount"] = element[pst_tax_index + 1];

          if (invoice_total_index != -1)
            detailObj["total"] = element[invoice_total_index + 1];

          if (vendor_index != -1)
            detailObj["vendor_id"] = element[vendor_index + 1];

          detailObj["action"] = "import";
          // detailObj['vendor_id'] = 'BC Cannabis Wholesale';
          if (sku_index != -1) {
            headers = element;
          }
          if (headers.length > 0 && sku_index == -1) {
            let tableObject = new Object();

            var eleIndex = 5;
            if (
              headers.indexOf("Deposit") != -1 ||
              headers.indexOf("deposit") != -1
            ) {
              eleIndex = 6;
            }
            element.forEach((obj, objIndex) => {
              if (element[0] && element[eleIndex]) {
                if (headers[objIndex] == "Size") {
                  tableObject["variant_size"] = obj;
                  let test = obj.split("X");
                  tableObject["package_capacity"] = test[0];
                  tableObject["variant_name"] = test[1];
                  if (test[1]) {
                    let unit = test[1].split(" ");
                    tableObject["dry_weight"] = unit[0];
                    tableObject["variant_unit"] = unit[1];
                  }
                } else if (headers[objIndex] == "Product Category") {
                  tableObject["product_category"] = obj;
                } else if (headers[objIndex] == "Product Description") {
                  tableObject["product_desc"] = obj;
                } else if (headers[objIndex] == "Price") {
                  tableObject["package_price"] = obj;
                } else {
                  tableObject[headers[objIndex]] = obj;
                }
              }
            });

            if (element[0] && element[eleIndex]) {
              dataTable.push(tableObject);
            }
            this.purchaseForm.patchValue(detailObj);
          }
        });
        let SKU = dataTable.map((x) => x.SKU);
        if (SKU) {
          const formData = new FormData();
          const control: any = this.purchaseForm.controls["poProducts"];
          formData.append("variant_sku", JSON.stringify(SKU));
          this.api.getSellingPrice(formData).subscribe((response: any) => {
            if (response.success) {
              this.skuData = response.data;
              dataTable.forEach((element, i) => {
                element["stock_price"] =
                  element.package_price / element.package_capacity;
                //control.push(this.fillImportedProductProperties(element, response.data[i]))
                control.push(
                  this.fillImportedProductProperties(element, response.data[i])
                );
              });
            }
          });
        }
      };
      reader.readAsBinaryString(file);
    }
  }

  public skuData: any;
  // onSelect({ selected }) {
  //   this.selected.splice(0, this.selected.length);
  //   this.selected.push(...selected);
  // }

  fillImportedProductProperties(data, response_data) {
    let sheet_price = data.stock_price.toFixed(2);
    let new_price = (+response_data.purchase_price).toFixed(2);
    // console.log(sheet_price,'--',new_price);

    return this.fb.group({
      variant_sku: [data.SKU],
      variant_size: [data.variant_size],
      package_capacity: [data.package_capacity],
      package_price: [data.package_price],
      variant_name: [data.variant_name],
      value_added: [data.package_capacity * data.Qty, Validators.required],
      no_of_package: [data.Qty, Validators.required], //no of package
      total_package: [data.Qty], //for compare with no of package
      total_qty: [data.package_capacity * data.Qty, Validators.required],
      actual_qty: [data.package_capacity * data.Qty],
      stock_price: [data.stock_price],
      extended_price: [data.package_price * data.Qty],
      selling_price: [
        response_data.selling_price
          ? sheet_price != new_price
            ? 0
            : response_data.selling_price
          : 0,
        Validators.required,
      ],
      special_price: [response_data.special_price ?? 0],
      is_received: [false],
      product_desc: [data.product_desc],
      // storage_id: [this.warehouse[0].storage_id],
      storage_id: [this.tempWarehouse.storage_id],
      dry_weight: [data.dry_weight],
      product_category: [data.product_category],
      // batch: ['--'],
      variant_unit: [data.variant_unit],
      margin: [
        response_data.selling_price &&
        response_data.selling_price != null &&
        response_data.selling_price != 0.0 &&
        sheet_price == new_price
          ? (
              ((response_data.selling_price - data.stock_price) /
                response_data.selling_price) *
              100
            ).toFixed(2)
          : "",
      ],
      barcode_number: [response_data.barcode, Validators.required], //barcode number
      barcode: [""], //barcode number
      batch_no: [data.batch_no, [Validators.required, spaceValidator]], //batch number
      source_page: ["add_po"],
      thc: [""],
      cbd: [""],
      variant_id: [response_data.variant_id],
      expiry_date: [""],
    });
  }

  test(stock_price, margin) {
    alert(margin);
    var total = (stock_price * margin) / 100 + stock_price;
    alert(total);
  }

  totalQty(index, control_name) {
    const control = (<UntypedFormArray>this.purchaseForm.controls[control_name])
      .at(index)
      .get("total_qty") as UntypedFormArray;
    const control1 = (<UntypedFormArray>this.purchaseForm.controls[control_name])
      .at(index)
      .get("value_added") as UntypedFormArray;
    control.setValue(control1.value);
  }
  /* change selling price according margin */
  margin(index, control_name) {
    const control = (<UntypedFormArray>this.purchaseForm.controls[control_name])
      .at(index)
      .get("stock_price") as UntypedFormArray;
    const control1 = (<UntypedFormArray>this.purchaseForm.controls[control_name])
      .at(index)
      .get("margin") as UntypedFormArray;
    const control2 = (<UntypedFormArray>this.purchaseForm.controls[control_name])
      .at(index)
      .get("selling_price") as UntypedFormArray;

    // let value: any = (control.value * control1.value) / 100 + control.value;
    // value = +value;
    // control2.setValue(value.toFixed(2))

    if (control1.value > 0 && control1.value <= 100) {
      let margin_value: any = control1.value / 100;
      margin_value = 1 - margin_value;
      let value: any;
      if (margin_value != 0) {
        value = control.value / margin_value;
      } else {
        value = control.value / 0.00001;
      }
      control2.setValue(value.toFixed(2)); // set selling price according to profit margin
    } else if (control1.value == "") {
      let value: any = "";
      control2.setValue(value);
    }
  }

  /* change margin according purchase price */
  stockprice(index, control_name) {
    const control = (<UntypedFormArray>this.purchaseForm.controls[control_name])
      .at(index)
      .get("stock_price") as UntypedFormArray;
    const control1 = (<UntypedFormArray>this.purchaseForm.controls[control_name])
      .at(index)
      .get("margin") as UntypedFormArray;
    const control2 = (<UntypedFormArray>this.purchaseForm.controls[control_name])
      .at(index)
      .get("selling_price") as UntypedFormArray;
    const control3 = (<UntypedFormArray>this.purchaseForm.controls[control_name])
      .at(index)
      .get("package_price") as UntypedFormArray;
    const control4 = (<UntypedFormArray>this.purchaseForm.controls[control_name])
      .at(index)
      .get("package_capacity") as UntypedFormArray;
    const rControl = (<UntypedFormArray>this.purchaseForm.controls[control_name])
      .at(index)
      .get("is_received");
    // let packagePrice: any = (control.value) * (control4.value);
    // let margin_value: any = ((control2.value - control.value) * 100) / control.value;
    // margin_value = +margin_value;
    // control1.setValue(margin_value.toFixed(2));
    // control3.setValue(packagePrice)

    let stockprice = +control.value;
    let sellingprice = +control2.value;

    let packagePrice: any = stockprice * control4.value;
    control3.setValue(packagePrice);
    if (sellingprice > 0) {
      rControl.setValue(true);
      let margin_value: any = (sellingprice - stockprice).toFixed(2);
      margin_value = (margin_value / sellingprice) * 100;
      margin_value = +margin_value;
      control1.setValue(margin_value.toFixed(2));
    } else {
      rControl.setValue(false);
      let margin_value: any;
      control1.setValue(margin_value);
      if (stockprice > 0) {
        rControl.setValue(true);
      } else {
        rControl.setValue(false);
      }
    }
    this.findTotal();
  }
  changeBarcode(index, formname) {
    const mainControl: any = this.purchaseForm.controls[formname];
    const barcodeControl = mainControl.at(index).get("barcode");

    barcodeControl.setValue("");
  }
  getGTIN(index, formname) {
    const mainControl: any = this.purchaseForm.controls[formname];
    const control = mainControl.at(index).get("barcode_number");
    const barcodeControl = mainControl.at(index).get("barcode");
    const batchControl = mainControl.at(index).get("batch_no");

    const rControl = mainControl.at(index).get("is_received");

    if (control.value) {
      rControl.setValue(true);
      let value = control.value;
      let index1 = value.indexOf("(01)");
      let index2 = value.indexOf("01");
      let barcode: any;
      let exp_date: any;
      let batch_num: any;
      if (index1 == 0 && value.length > 17) {
        barcode = value.substring(4, 18);
        exp_date = value.substring(22, 28);
        batch_num = value.substring(32);
      } else if (index2 == 0 && value.length > 15) {
        barcode = value.substring(2, 16);
        exp_date = value.substring(18, 24);
        batch_num = value.substring(26);
      } else {
        barcode = value;
      }

      barcodeControl.setValue(barcode);
      if (formname == "poProducts") {
        batchControl.setValue(batch_num);
      }

      /* pass expiry date only for po import and GS1 barcode */
      if (formname == "poProducts") {
        if (exp_date && exp_date != "") {
          mainControl.at(index).get("expiry_date").setValue(exp_date);
        }
      }
      /* pass expiry date only for po import and GS1 barcode */
    } else {
      rControl.setValue(false);
    }
  }
  debounceTime = 500;
  getBatch(index) {
    const mainControl: any = this.purchaseForm.controls["poProducts"];
    const batchControl = mainControl.at(index).get("batch_no");
    const rControl = mainControl.at(index).get("is_received");
    let dTime = this.debounceTime + batchControl.value.length * 150;
    const variantControl = mainControl.at(index).get("variant_id");
    const thc = mainControl.at(index).get("thc");
    const cbd = mainControl.at(index).get("cbd");

    if(thc.value){
      this.temp_thc = thc.value;
    }
    
    if(cbd.value){
     this.temp_cbd = cbd.value;
     }


    if (batchControl.value) {
      rControl.setValue(true);
    } else {
      rControl.setValue(false);
    }

    // batchControl.valueChanges.
    //   pipe(
    //     debounceTime(dTime),
    //   ).subscribe(val => {
    if (batchControl.value) {
      // rControl.setValue(true);
      let value = batchControl.value;
      let index1 = value.indexOf("(01)");
      let index2 = value.indexOf("01");
      // let barcode: any;
      // let exp_date: any;
      let batch_num: any;
      if (index1 == 0 && value.length > 17) {
        batch_num = value.substring(32);
        // barcode = value.substring(4, 18)
        // exp_date = value.substring(22, 28)
      } else if (index2 == 0 && value.length > 15) {
        batch_num = value.substring(26);
        // barcode = value.substring(2, 16)
        // exp_date = value.substring(18, 24)
      } else {
        batch_num = value;
      }
      batchControl.setValue(batch_num);

      if (batch_num && batch_num != "") {
        this.variantObj["batch_no"] = batch_num;
        let variant_id = variantControl.value;

        if (this.variantObj["batch_no"] != "") {
          this.api
            .getBatchDetails(variant_id, this.variantObj)
            .subscribe((response: any) => {
              if (response.success) {
               if(response.data.thc){
                thc.setValue(response.data.thc);
               } else {
                thc.setValue(this.temp_thc);
               }
                
               if(response.data.cbd){
                cbd.setValue(response.data.cbd);
                } else {
                  cbd.setValue(this.temp_cbd);
                }
              }
            });
        } else {
          thc.setValue(this.temp_thc);
          cbd.setValue(this.temp_cbd);
          // thc.setValue("");
          // cbd.setValue("");
        }
      }
    } else {
      // rControl.setValue(false);
    }
    // })
  }

  /* total_product_qty */
  total_product_qty(index, formname) {
    const mainControl: any = this.purchaseForm.controls[formname];

    const valueaddedControl = mainControl.at(index).get("value_added");
    const packagesizeControl = mainControl.at(index).get("package_capacity");
    const actualqtyControl = mainControl.at(index).get("actual_qty");
    const rControl = mainControl.at(index).get("is_received");

    if (valueaddedControl.value && packagesizeControl.value) {
      rControl.setValue(true);
      let newActulqty = valueaddedControl.value * packagesizeControl.value;
      actualqtyControl.setValue(newActulqty);
    } else {
      rControl.setValue(false);
    }
    this.findTotal();
  }
  /* total_product_qty */

  change_qty(index) {
    const mainControl: any = this.purchaseForm.controls["poProducts"];
    const packageControl = mainControl.at(index).get("no_of_package");
    const packagesizeControl = mainControl.at(index).get("package_capacity");
    const actualqtyControl = mainControl.at(index).get("actual_qty");
    const totalqtyControl = mainControl.at(index).get("total_qty");
    const valueaddedControl = mainControl.at(index).get("value_added");
    const total_package = mainControl.at(index).get("total_package"); //actual case qty while import sheet

    if (packageControl.value > total_package.value) {
      this.utility.showSnackBar(
        "Please enter quantity between 0 and " + total_package.value,
        { panelClass: "error" }
      );
    }
    let newActulqty = packageControl.value * packagesizeControl.value;
    actualqtyControl.setValue(newActulqty);
    totalqtyControl.setValue(newActulqty);
    valueaddedControl.setValue(newActulqty);
  }

  /* find total of purchse price for all category */
  findTotal() {
    if (!this.isImported) {
      let noncannabisProductsTotal = 0;
      this.purchaseForm.controls.noncannabisProducts.value.forEach(
        (element) => {
          noncannabisProductsTotal =
            +element.stock_price * element.value_added +
            +noncannabisProductsTotal;
        }
      );
      let cannabisProductsAccessoriesTotal = 0;
      this.purchaseForm.controls.cannabisProductsAccessories.value.forEach(
        (element) => {
          cannabisProductsAccessoriesTotal =
            +element.stock_price * element.value_added +
            +cannabisProductsAccessoriesTotal;
        }
      );
      let totalValue =
        noncannabisProductsTotal + cannabisProductsAccessoriesTotal;
      this.purchaseForm.controls["total"].setValue(totalValue);
    }
  }
  /* find total of purchse price for all category */

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
    if (this.purchaseForm.dirty) {
      filled_data = 1;
    }

    if (this.draft_po_number) {
      if (filled_data && !this.draft_po_number) {
        return this.utility
          .confirmDialog({
            title: "Please confirm the action",
            message:
              "Are you sure you'd like to leave the page? You'll lose all your progress?",
            okButton: "LEAVE",
            cancelButton: "CANCEL",
          })
          .toPromise();
      } else {
        return true;
      }
    } else {
      if (filled_data && !this.purchaseForm.valid) {
        return this.utility
          .confirmDialog({
            title: "Please confirm the action",
            message:
              "Are you sure you'd like to leave the page? You'll lose all your progress?",
            okButton: "LEAVE",
            cancelButton: "CANCEL",
          })
          .toPromise();
      } else {
        return true;
      }
    }
  }
  /* canDeactivate code */

  /* check po number exists */
  check_po_number(val) {
    console.log(val);
  }
  /* check po number exists */

  /* search selected */
  public selectedResult: boolean = false;
  selected_result(val) {
    if (val != "") {
      if (typeof val === "object") {
        this.selectedResult = true;
      } else {
        this.selectedResult = false;
      }
    }
  }
  /* search selected */

  /* print barcode */
  public variantDetail: any;
  printBarcode(index, v_id, formname): void {
    let productVariantData: any;
    var formControl: any = <UntypedFormArray>this.purchaseForm.controls[formname];
    productVariantData = _.find(formControl.value, function (o) {
      return o.variant_id === v_id;
    });

    productVariantData.variant_price = productVariantData.selling_price;
    this.variantDetail = productVariantData;
    let vData = [this.variantDetail];

    let vId = v_id;
    const dialogRef = this.dialog.open(PrintBarcodeComponent, {
      width: "70%",
      maxWidth: "700px",
      disableClose: true,
      data: { vData, vId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (Boolean(result)) {
        // console.log("data send");
      }
    });
  }
  /* print barcode */

  /* create new product */
  public variantDetail1: any;
  add_new_product(data): void {
    const dialogRef = this.dialog.open(CreateProductComponent, {
      width: "90%",
      maxWidth: "900px",
      disableClose: true,
      data: {
        storage_id: this.purchaseForm.controls.storage_id.value
          ? this.purchaseForm.controls.storage_id.value
          : 0,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (Boolean(result)) {
        const formData = new FormData();
        Object.keys(result.value).forEach((key) => {
          if (result.value[key] instanceof Object) {
            formData.append(key, JSON.stringify(result.value[key]));
          } else {
            formData.append(key, result.value[key]);
          }
        });
        formData.append("product_status", "1");

        if (formData) {
          this.api.createProduct(formData).subscribe(
            (response: any) => {
              if (response.success) {
                this.utility.showSnackBar(response.message);

                /* automatically add this product to table */
                if (result.value.is_product_variant == 0) {
                  // if without variant
                  this.formobj.storage_id =
                    this.purchaseForm.controls.storage_id.value;
                  this.formobj.search = result.value.product_sku;
                  this.productData = [];
                  if (
                    typeof this.purchaseForm.get("search").value != "object"
                  ) {
                    if (this.formobj.search) {
                      this.api
                        .getSearchResult(this.formobj)
                        .subscribe((response: any) => {
                          if (response.success) {
                            this.productData = response.data;
                            this.add_product(this.productData[0], "by_new");
                          }
                        });
                    }
                  }
                } else {
                  // if with variant
                  let VariantData = result.value.variants;
                  for (let i = 0; i < VariantData.length; i++) {
                    this.formobj.storage_id =
                      this.purchaseForm.controls.storage_id.value;
                    this.formobj.search = result.value.variants[i].variant_sku;
                    this.productData = [];
                    if (
                      typeof this.purchaseForm.get("search").value != "object"
                    ) {
                      if (this.formobj.search) {
                        this.api
                          .getSearchResult(this.formobj)
                          .subscribe((response: any) => {
                            if (response.success) {
                              let searchSku =
                                result.value.variants[i].variant_sku;
                              this.productData = response.data;
                              this.productData = _.filter(
                                response.data,
                                function (o) {
                                  return o.variant_sku == searchSku;
                                }
                              );
                              this.add_product(this.productData[0], "by_new");
                            }
                          });
                      }
                    }
                  }
                }
                /* automatically add this product to table */
              } else {
                this.utility.showSnackBar(response.message, {
                  panelClass: "error",
                });
              }
            },
            (err) => {
              // this.barButtonOptions.active = false;
              // this.barButtonOptions.text = 'SAVE ALL';
            }
          );
        } else {
          this.utility.scrollToError();
        }
      }
    });
  }
  /* create new product */

  customAsyncValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<ValidationErrors | null>
      | Observable<ValidationErrors | null> => {
      this.formobj.po_no = control.value;
      this.formobj.chain_id = this.cID;

      if (control.value != "") {
        return timer(1000).pipe(
          switchMap(() => {
            return this.api.isExist(this.formobj).pipe(
              map((res) => {
                if (res.data.length > 0) {
                  return { asyncValidation: "failed" };
                }
                return null;
              })
            );
          })
        );
      }
      // return null;
    };
  }
}

/* space validator for batch number field */
export function spaceValidator(control: AbstractControl) {
  if (control && control.value && !control.value.replace(/\s/g, "").length) {
    control.setValue("");
    // console.log(control.value);
    return { required: true };
  } else {
    return null;
  }
}
/* space validator for batch number field */
