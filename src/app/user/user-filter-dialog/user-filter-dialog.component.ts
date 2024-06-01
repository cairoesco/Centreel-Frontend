import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { UserService } from '../user.service';
import { ApiService } from '../../api.service';
@Component({
  selector: 'app-user-filter-dialog',
  templateUrl: './user-filter-dialog.component.html',
  styleUrls: ['./user-filter-dialog.component.scss']
})
export class UserFilterDialogComponent implements OnInit {

  public filterForm: UntypedFormGroup;
  alltags: string[] = [];
  form_obj: any = new Object();

  public rawDetail: any;
  public stores: any;
  public user_designations: any;

  constructor(private api: UserService, private tagapi: ApiService,public dialogRef: MatDialogRef<UserFilterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public router: Router, public fb: UntypedFormBuilder) {
    
  }

  ngOnInit() {
    this.initializeForm()
    this.getRawDetails();
    this.getTags();
    if (this.data.fdata)
      this.filterForm.patchValue(this.data.fdata);
    
  }
  initializeForm() {
    this.filterForm = this.fb.group({
      store_id: [[]],
      designation_id: [[]],
      tags: [[]],
    });
  }
  applyFilter() {
    this.form_obj = this.filterForm.getRawValue();
    if (!((this.form_obj.store_id) && (this.form_obj.store_id.length) > 0)) {
      delete this.form_obj.store_id;
    }

    if (!((this.form_obj.designation_id) && (this.form_obj.designation_id.length) > 0)) {
      delete this.form_obj.designation_id;
    }

    if (!( (this.form_obj.tags) && (this.form_obj.tags.length) > 0)) {
      delete this.form_obj.tags;
    }
    this.dialogRef.close(this.form_obj);
  }


  getRawDetails() {
    this.api.GetUserList()
      .subscribe((response: any) => {
        if (response.success) {
          this.rawDetail = response.data;
          this.stores = response.data.filters.stores;
          this.user_designations = response.data.filters.user_designations;
        }
      });
  }
  getTags(){
    this.tagapi.get('tags?type=' + 'user').subscribe((result: any) => {
      if (Boolean(result.success)) {
        this.alltags = result.data;
      }
    })
  }

  close(){
    this.filterForm.reset();
    this.applyFilter();
  }

}
