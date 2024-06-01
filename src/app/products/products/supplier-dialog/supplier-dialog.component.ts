import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UtilsServiceService } from '../../../shared/services/utils-service.service';
import { CustomValidators } from 'ng2-validation';
import { ProductService } from '../../product.service';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-supplier-dialog',
  templateUrl: './supplier-dialog.component.html',
  styleUrls: ['./supplier-dialog.component.scss']
})
export class SupplierDialogComponent implements OnInit {
  public form: UntypedFormGroup;
  public countryList: any;
  public provinceList: any;
  public cityList: any;
  public minDate = new Date(2018, 9, 17);
  public maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  public isEditMode: boolean = false;
  barButtonEditOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Edit',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: true
  }
  barButtonAddOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Add',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }
  constructor(private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<SupplierDialogComponent>,
    private api: ProductService,
    public utils: UtilsServiceService,
    @Inject(MAT_DIALOG_DATA) public data: SupplierDialogData) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      address1: [''],
      address2: [''],
      business_no: [''],
      tax_no: [''],
      //min_order: [''],
      state_id: [''],
      city_id: [''],
      postal_code: [''],
      contact_person_email: [''],
      contact_person_phone: [''],
      job_title: [''],
      chain_id: [this.data.chain_id]
    });

    if (this.data.supplierData && this.data.supplierData.id) {
      this.isEditMode = true;
      this.form.patchValue(this.data.supplierData)
      this.form.disable()
    }
    this.getProvince();
  }
  isEditForm: boolean = true;
  viewMode(data) {
    data ? this.form.disable() : this.form.enable();
    data ? (this.isEditForm = true) : (this.isEditForm = false);
    data ? (this.barButtonEditOptions.disabled = true) : (this.barButtonEditOptions.disabled = false);
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

  close() {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      let formData = new FormData();
      Object.keys(this.form.value).forEach(key => {
        if (this.form.value[key] instanceof Object) {
          formData.append(key, JSON.stringify(this.form.value[key]));
        }
        else {
          formData.append(key, this.form.value[key]);
        }
      });
      if (this.data.supplierData) {
        this.barButtonEditOptions.active = true;
        formData.append('_method', 'put');
        this.api.viewSupplier(formData, this.data.supplierData.id)
          .subscribe((response: any) => {
            if (response.success) {
              this.barButtonEditOptions.active = false;
              this.utils.showSnackBar(response.message);
              this.dialogRef.close(response);
            }
          });
      }
      else {
        this.barButtonAddOptions.active = true;
        this.api.addSupplier(formData)
          .subscribe((response: any) => {
            if (response.success) {
              this.barButtonAddOptions.active = false;

              this.utils.showSnackBar(response.message);
              this.dialogRef.close(response);
            }
          });
      }
    }
  }
}
export interface SupplierDialogData {
  supplierData: any;
  type: string;
  chain_id: any;
}
