import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { DiscountService } from '../discount.service';
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
import { DefaultDiscountSearchComponent } from '../default-discount-search/default-discount-search.component';

@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrls: ['./add-discount.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter }
  ],
})

export class AddDiscountComponent implements OnInit {

  public innerHeight: any;
  public type: string = 'component';
  public indexofTab = 0;
  public form: FormGroup;
  public addStore: FormGroup;
  public imageSrc: any;
  public heightOfY;
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public numOfSuppliers = 0;
  public hasBaseDropZoneOver: boolean;
  public hasAnotherDropZoneOver: boolean;
  public response: string;
  public deleteFileArray = [];
  public rawDetail;
  public cityList: any;
  public isGreaterThc: any;
  public is_add_discount: boolean = false;
  public is_edit_discount: boolean = false;
  public createDiscountForm: FormGroup;
  public radio_option = [{ name: 'Category', value: 1 }, { name: 'xdc ', value: 0 }];
  public isAuthorized = false;
  public isSubmitted = false;
  public isCanabis = false;
  public stores = [];
  public createDiscount: boolean = false;
  public selectedData = [];

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
    text: 'SAVE',
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
    private api: DiscountService,
    public formBuilder: FormBuilder,
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
  //#region ______________________ Default discount search dialog ______________________*/
  DefaultSearchDialogOpen() {
    const dialogRef = this.dialog.open(DefaultDiscountSearchComponent, {
      disableClose: true,
      data: { categoryList: this.rawDetail.discount_types }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

  //#endregion ______________________ End of Identification and Inventory section all functions ______________________*/

  //#region ______________________ Add Discount Form group ______________________/
  addDiscountFormGroup() {
    this.addDiscountForm = this.formBuilder.group({
      discount_name: ['', Validators.required],
      store_id: ['', [Validators.required]],
      type_id: ['', Validators.required],
      discount_category: ['', Validators.required],
      default_image: [''],
      discountProperties: this.formBuilder.array([]),
    });
  }

  //#endregion

  //#region ______________________ General section all functions ______________________/

  removeChip(i, fruit): void {
    const index = i.value.option_values.indexOf(fruit);
    const control = <FormArray>this.addDiscountForm.controls['variant_properties'];
    if (index >= 0) {
      i.value.option_values.splice(index, 1);
      var temparray = [];
      for (var j = 0; j < control.length; j++) {
        temparray.push(control.value[j].option_values)
      }
      const controlVariants = <FormArray>this.addDiscountForm.controls['variants'];
      var variantsArray = this.generateVariants(temparray);
      controlVariants.controls = [];
      variantsArray.forEach(element => {
        controlVariants.push(this.addUnitsVariantOptions(element));
      });
    }
  }

  addChip(i, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const control = <FormArray>this.addDiscountForm.controls['variant_properties'];
    if ((value || '').trim()) {
      if (_.find(i.value.option_values, function (o) { return o.toLowerCase() == value.toLowerCase(); }) == undefined) {
        i.value.option_values.push(value.trim());
        var temparray = [];
        for (var j = 0; j < control.length; j++) {
          temparray.push(control.value[j].option_values);
        }


        const controlVariants = <FormArray>this.addDiscountForm.controls['variants'];
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

  //#endregion ______________________ End of API section all functions ______________________*/

  //#region ______________________ Discount create ______________________*/

  onSubmit(formDirective) {
    let discountAttribute = [];
    this.isSubmitted = true;

    this.addDiscountForm.get('discountProperties').value.forEach(element => {
      if (element.selected_discount_attribute_properties.length > 0) {
        element.selected_discount_attribute_properties.forEach(element => {
          discountAttribute.push(element);
        });
      }
    });
    this.addDiscountForm.get('discount_attributes').setValue(discountAttribute);
    let inventoryData = [];
    if (Boolean(Boolean(this.addDiscountForm.valid) && this.addDiscountForm.get('variants')) && this.addDiscountForm.get('variants').value) {
      let selectedVariant = [];
      let index = 0;
      this.addDiscountForm.controls['variants'].value.forEach(element => {
        if (element.is_active_variant) {
          selectedVariant.push(element);
        }
        else {
          const control = <FormArray>this.addDiscountForm.controls.variants;
          control.removeAt(index);
          index = index - 1;
        }
        index = index + 1;
      });
      this.addDiscountForm.value.variants = selectedVariant;
      selectedVariant = []
    }
    if (Boolean(Boolean(this.addDiscountForm.valid) && this.addDiscountForm.get('variants')) && this.addDiscountForm.get('variants').value.length) {
      Object.keys(this.addDiscountForm.value.variants).forEach(key => {
        if (this.addDiscountForm.value.variants[key].inventory && this.addDiscountForm.value.variants[key].inventory.length > 0) {
          this.addDiscountForm.value.variants[key].inventory.forEach(inventory => {
            if (inventory.inventory && inventory.inventory.length > 0) {
              inventoryData = inventoryData.concat(inventory.inventory);
            }
          });
          this.addDiscountForm.value.variants[key].inventory = inventoryData;
          inventoryData = [];
        }
      })
    }
    if (Boolean(this.addDiscountForm.valid) && Boolean(this.addDiscountForm.get('inventory')) && this.addDiscountForm.get('inventory').value.length) {
      this.addDiscountForm.get('inventory').value.forEach(element => {
        if (element.inventories.length > 0) {
          element.inventories.forEach(inventory => {
            inventoryData.push(inventory);
          });
        }
      });
    }
    if (this.addDiscountForm.controls.discount_suppliers_data.value) {
      let suppliers_ids = this.addDiscountForm.controls.discount_suppliers_data.value.map(x => x.id)
      this.addDiscountForm.controls.discount_suppliers_ids.setValue(suppliers_ids);
    }
    const formData = new FormData();
    if (this.addDiscountForm.valid) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';
    }
    Object.keys(this.addDiscountForm.value).forEach(key => {
      if (key == "inventory") {
        formData.append("inventory", JSON.stringify(inventoryData));
      }
      else if (key == "discount_image" && this.imagesOfarray.length > 0) {
        Object.keys(this.imagesOfarray).forEach(images => {
          if (images)
            formData.append("discount_images[]", this.imagesOfarray[images])
        });
      }
      else {
        if (this.addDiscountForm.value[key] instanceof Object) {
          formData.append(key, JSON.stringify(this.addDiscountForm.value[key]));
        }
        else {
          formData.append(key, this.addDiscountForm.value[key]);
        }
      }
    });
    formData.append("discount_status", '1');
    let variant = this.addDiscountForm.get('variants').value;
    if (variant.length > 0) {
      formData.append("discount_variant", '1');
    }
    if (this.addDiscountForm.get('default_image').value)
      formData.append("default_image", '1');
    if (this.addDiscountForm.valid) {

      this.api.createDiscount(formData)
        .subscribe((response: any) => {
          if (response.success) {
            this.utility.showSnackBar(response.message);
            if (this.createDiscount) {
              this.resetFormValues(formDirective)
            }
            else {
              this.router.navigateByUrl('discounts/alldiscounts');
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
      this.createDiscount = true;
    }
    else {
      this.createDiscount = false;
    }
  }
  resetFormValues(formDirective) {
    this.arrayOfImages = [];
    this.imagesOfarray = [];
    this.addDiscountForm.reset();
    formDirective.resetForm();
    this.ngOnInit();
  }
  ngOnInit() {
    this.addDiscountFormGroup();
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
    if (this.addDiscountForm.dirty) {
      filled_data = 1;
    }
    if (filled_data && !this.addDiscountForm.valid) {
      return this.utility.confirmDialog({ title: 'Please confirm the action', message: 'Are you sure you\'d like to leave the page? You\'ll lose all your progress?', okButton: 'LEAVE', cancelButton: 'CANCEL' }).toPromise();
    } else {
      return true;
    }
  }
}
