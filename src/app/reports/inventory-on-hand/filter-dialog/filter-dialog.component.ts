import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReportService } from '../../report.service';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {
  public filterForm: FormGroup;
  public product_categories = [];
  public product_types = [];
  public producttypeFormArray: any = [];
  public productSubCategory = [];
  public alltags: string[] = [];
  public form_obj: any = new Object();
  public inventory_report: FormGroup;
  public storeList: any = [];
  public storageList: any = [{storage_id:'all', name: 'All'}];
  public product_type_id: any;
  public product_category_id: any;
  public product_type = [{product_type_slug:'all', product_name: 'All'},{product_type_slug:'cannabis', product_name: 'Cannabis'},{product_type_slug:'non cannabis', product_name: 'Non-Cannabis'}]

  constructor(
    private formBuilder: FormBuilder,
    public reportService: ReportService,
    public dialogRef: MatDialogRef<FilterDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router, 
    public fb: FormBuilder) {
    this.inventory_report = this.formBuilder.group({
      product_type: ['non cannabis'],
      store_id: [this.data.fdata.store_id],
      storage_id: [this.data.fdata.storage_id],
      has_stock: [true],
    });
  }

  ngOnInit() {
   
    this.getStores();
    this.getFilterData();
  }
  getFilterData(){
    console.log(this.data, 'line 44')
    this.reportService.getInventoryFilterData().subscribe((response: any) => {
    this.storageList = [...this.storageList, ...response.data.warehouse];
      if (this.storageList.length > 0) {
        this.inventory_report.controls.storage_id.setValue(this.storageList[0].storage_id);
      }
    })
  }

  getStores() {
    this.reportService.getStores()
      .subscribe((response: any) => {
        this.storeList = response.data.stores;
        if (this.storeList.length > 0) {
          this.data.fdata.has_stock = this.data.fdata.has_stock;
          this.data.fdata.product_type = this.data.fdata.type;
          
          this.inventory_report.patchValue(this.data.fdata);
        }
      });
  }
  applyFilter() {
    this.form_obj = this.inventory_report.getRawValue();
    this.dialogRef.close(this.form_obj);
  }

  close() {
    this.inventory_report.controls.store_id.setValue(this.storeList[0].store_id);
    this.inventory_report.controls.product_type.setValue('non cannabis');
    this.inventory_report.controls.storage_id.setValue(this.storageList[0].storage_id);
    this.inventory_report.controls.has_stock.setValue(true);
    this.applyFilter();
  }
}
