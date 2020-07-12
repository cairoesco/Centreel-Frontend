import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {
  public filterForm: FormGroup;
  product_categories = [];
  product_types = [];
  public producttypeFormArray: any = [];
  productSubCategory = [];
  alltags: string[] = [];
  form_obj: any = new Object();

  product_type_id: any;
  product_category_id: any;

  constructor(private api: ApiService, public dialogRef: MatDialogRef<FilterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public router: Router, public fb: FormBuilder) {

  }

  ngOnInit() {
    this.initializeForm()
    this.getAlldetail();
    this.getTags();
    if (this.data.fdata)
      this.filterForm.patchValue(this.data.fdata);
  }
  initializeForm() {
    this.filterForm = this.fb.group({
      product_type_id: [[]],
      product_category_id: [[]],
      tags: [[]],
    });
  }
  applyFilter() {
    this.form_obj = this.filterForm.getRawValue();
    if (!((this.form_obj.product_category_id) && (this.form_obj.product_category_id.length) > 0)) {
      delete this.form_obj.product_category_id;
    }

    if (!((this.form_obj.product_type_id) && (this.form_obj.product_type_id.length) > 0)) {
      delete this.form_obj.product_type_id;
    }

    if (!((this.form_obj.tags) && (this.form_obj.tags.length) > 0)) {
      delete this.form_obj.tags;
    }
    this.dialogRef.close(this.form_obj);
  }

  getAlldetail() {
    this.api.get('reports/sales/create')
      .subscribe((response: any) => {
        this.product_categories = response.data.product_categories;
        this.product_types = response.data.product_types;
      });
  }
  getTags() {
    this.api.get('tags?type=' + 'variant').subscribe((result: any) => {
      if (Boolean(result.success)) {
        this.alltags = result.data;
      }
    })
  }
  /* Bind multiple sub category when multiple category is selected */
  change(event) {
    if (event.source.selected) {
      this.producttypeFormArray.push(event.source.value);
    } else {
      let index = this.producttypeFormArray.indexOf(event.source.value);
      this.producttypeFormArray.splice(index, 1);
    }
    this.productSubCategory = _.filter(this.product_categories, (o) => { return this.producttypeFormArray.indexOf(o.product_type_id) > -1; });
  }
  /* Bind multiple sub category when multiple category selected */

  close() {
    this.filterForm.reset();
    this.applyFilter();
  }
}
