import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DiscountService } from '../discount.service';
import { ApiService } from '../../api.service';


@Component({
  selector: 'app-discount-filter-dialog',
  templateUrl: './discount-filter-dialog.component.html',
  styleUrls: ['./discount-filter-dialog.component.scss']
})
export class DiscountFilterDialogComponent implements OnInit {

  public filterForm: FormGroup;

  alltags: string[] = [];
  allcategories: string[] = [];
  specialPrice: string[] = [];

  form_obj: any = new Object();

  public rawDetail: any;
  public stores: any;
  public discount_types: any;
  public discount_value: any;

  constructor(private api: DiscountService, private tagapi: ApiService,public dialogRef: MatDialogRef<DiscountFilterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public router: Router, public fb: FormBuilder) {
    
  }

  ngOnInit() {
    this.initializeForm()
    this.getRawDetails();

    if (this.data.fdata)
      this.filterForm.patchValue(this.data.fdata);
    
  }


  initializeForm() {
    this.filterForm = this.fb.group({
      store_id: [[]],
      type: [[]],
      values: [[]],
    });
  }
  applyFilter() {
    this.form_obj = this.filterForm.getRawValue();
    if (!((this.form_obj.store_id) && (this.form_obj.store_id.length) > 0)) {
      delete this.form_obj.store_id;
    }

    if (!((this.form_obj.type) && (this.form_obj.type.length) > 0)) {
      delete this.form_obj.type;
    }

    if (!( (this.form_obj.values) && (this.form_obj.values.length) > 0)) {
      delete this.form_obj.values;
    }
    this.dialogRef.close(this.form_obj);
  }


  getRawDetails() {
    this.api.GetDiscountFilterData()
      .subscribe((response: any) => {
        if (response.success) {
          this.rawDetail = response.data;
          this.stores = response.data.stores;
          this.discount_types = response.data.discounts_types;
          this.discount_value = response.data.discount_values;
        }
      });
  }

  close(){
    this.filterForm.reset();
    this.applyFilter();
  }

}