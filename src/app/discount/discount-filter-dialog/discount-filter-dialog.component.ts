import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, ElementRef, HostListener, HostBinding, Input, OnDestroy, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,  } from '@angular/material/dialog';
import { MAT_OPTION_PARENT_COMPONENT, MatOptgroup, MatOption, MatOptionParentComponent } from "@angular/material/core";
import { AbstractControl } from '@angular/forms';
import { MatPseudoCheckboxState } from '@angular/material/core/selection/pseudo-checkbox/pseudo-checkbox';
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
  public discount_filter_form: FormGroup;
  alltags: string[] = [];
  allcategories: string[] = [];
  specialPrice: string[] = [];
  form_obj: any = new Object();

  public rawDetail: any;
  public stores: any = [];
  public discount_types: any;
  public discount_value: any;
  public discount_status: any;

  constructor(
    private api: DiscountService,
    private tagapi: ApiService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DiscountFilterDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public fb: FormBuilder
    ) {
      
  }

  ngOnInit() {
   this.initializeForm();
   this.getRawDetails();    

   if (this.data.fdata)
      this.filterForm.patchValue(this.data.fdata);
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      store_id: [''],
      type: [],
      values: [],
      status: [],
    });
  }

getRawDetails() {
    this.api.GetDiscountFilterData()
      .subscribe((response: any) => {
        if (response.success) {
          const tempDiscountTypes =  [{value: [], item: 'All'}];
          const tempDiscountValues = [];
          // const tempDiscountValues = [{value: [], item: 'All'}];
          const tempDiscountStatus = [{value: [], item: 'All'}];
          if(response.data.discounts_types.length > 0){
            const tempData = response.data.discounts_types.sort();
            for(let i in tempData){
            
              const obj = {
                item : tempData[i].charAt(0).toUpperCase() + tempData[i].slice(1),
                value: [tempData[i]]
              }
              tempDiscountTypes[0].value.push(tempData[i]);
              tempDiscountTypes.push(obj)
            }
          }
          if(response.data.discount_values.length > 0){
            const tempValueData = response.data.discount_values.sort();
            for(let i in tempValueData){

              const obj = {
                item : `${parseInt(tempValueData[i])}%`,
                value: [tempValueData[i]]
              }
              // tempDiscountValues[0].value.push(tempValueData[i]);
              tempDiscountValues.push(obj)
            }
          }
          if(response.data.discount_statuses.length > 0){
            const tempStatusData = response.data.discount_statuses.sort();
            for(let i in tempStatusData){
              const obj = {
                item : tempStatusData[i] == 1 ? 'Active' : 'Inactive',
                value: [tempStatusData[i]]
              }
              tempDiscountStatus[0].value.push(tempStatusData[i]);
              tempDiscountStatus.push(obj)
            }
          }
          this.rawDetail = response.data;
          this.stores = response.data.stores;
         
         
          this.discount_types = tempDiscountTypes;
          this.discount_value = tempDiscountValues;
          this.discount_status = tempDiscountStatus;

          
         
          this.filterForm.controls.store_id.setValue(this.stores[0].store_id)
         this.filterForm.controls.type.setValue(this.discount_types[0].value)
          // this.filterForm.controls.values.setValue(this.discount_value[0].value)
          this.filterForm.controls.status.setValue(this.discount_status[0].value)
        
        }
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


  // getRawDetails() {
  //   this.api.GetDiscountFilterData()
  //     .subscribe((response: any) => {
  //       if (response.success) {
  //         const tempDiscountTypes = [];
  //         if(response.data.discounts_types.length > 0){
  //           const tempData = response.data.discounts_types.sort();
  //           for(let i in tempData){

  //             const obj = {
  //               item : tempData[i].charAt(0).toUpperCase() + tempData[i].slice(1),
  //               value: tempData[i]
  //             }
  //             tempDiscountTypes.push(obj)
  //           }
  //         }
  //         this.rawDetail = response.data;
  //         this.stores = response.data.stores;
  //         this.discount_types = tempDiscountTypes;
  //         this.discount_value = response.data.discount_values;
  //       }
  //     });
  // }

  close(){
    this.applyFilter();
    this.filterForm.reset();
  }

  storeTempValue(name){

    if(name === 'type'){
      console.log( this.discount_types[this.filterForm.controls.type.value])
      console.log(this.filterForm.controls.type.value, 'this.filterForm.controls.type.value.type, this.filterForm.controls.type')
      this.filterForm.controls.type.setValue(this.filterForm.controls.type.value)
    }
    
  // return obj[name]
    //  console.log({name}, "check for the type here line 149")
    //  console.log(this.filterForm.controls.type.value, 'this.filterForm.controls.type.value.type, this.filterForm.controls.type')
  }
}
