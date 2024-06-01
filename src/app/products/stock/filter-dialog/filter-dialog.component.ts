import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {
  public filterForm: UntypedFormGroup;
  constructor(public dialogRef: MatDialogRef<FilterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public router: Router, public fb: UntypedFormBuilder) {
    data.filterList = JSON.parse(data.filterList);
    data.filterList.stores = _.filter(data.filterList.stores, (chain: any) => chain.chain_id == this.data.selectedFilter.chain_id);
  }

  public setSubcategory: boolean = false;
  ngOnInit() {
    this.initializeForm()
    if (this.data.selectedFilter.product_type_id && this.data.selectedFilter.product_type_id.length > 0) {
      this.setSubcategory = true;
    } else {
      this.setSubcategory = false;
    }
  }
  initializeForm() {
    this.filterForm = this.fb.group({
      chain_id: [this.data.selectedFilter.chain_id],
      store_ids: [Boolean(this.data.selectedFilter) ? this.data.selectedFilter.store_ids : 0],
      product_type_id: [Boolean(this.data.selectedFilter) ? this.data.selectedFilter.product_type_id : 0],
      product_category_id: [Boolean(this.data.selectedFilter) ? this.data.selectedFilter.product_category_id : 0]
    });
  }
  applyFilter() {
    this.filterForm.patchValue({ chain_id: this.data.selectedFilter.chain_id });
    this.dialogRef.close(this.filterForm.value);
  }

  close() {
    this.filterForm.reset();
    this.applyFilter();
  }

  /* find subcategory from product type */
  public categoryList: any = [];
  subCategory(type_id, event) {
    if (event.isUserInput) {
      let control = this.filterForm.controls['product_type_id'].value || [];
      if (event.source._selected) {
        control.push(type_id)
      }
      else {
        let index = control.indexOf(type_id);
        control.splice(index, 1);
      }
      let value: any;
      let data = []
      control.forEach(element => {
        value = this.data.filterList.product_types.find(x => x.type_id === element);
        data = data.concat(value.product_categories)
      });
      this.categoryList = data;
    }
    if (this.setSubcategory) {
      let value = this.data.filterList.product_types.find(x => x.type_id === type_id);
      this.categoryList = value.product_categories
    }
  }
  /* find subcategory from product type */
}