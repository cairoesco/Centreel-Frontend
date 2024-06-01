import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-saleshare-filter-dialog',
  templateUrl: './saleshare-filter-dialog.component.html',
  styleUrls: ['./saleshare-filter-dialog.component.scss']
})
export class SaleshareFilterDialogComponent implements OnInit {
  public form: UntypedFormGroup;
  
  constructor(private fb: UntypedFormBuilder,public dialogRef: MatDialogRef<SaleshareFilterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
  }

  mail_as = [
    { name: "Email As PDF" }, 
    { name: "Email As CSV" }, 
    { name: "Email As EXCEL Spredsheet" }
  ];

  close(){
    this.dialogRef.close();
  }

  ngOnInit() {
    this.form = this.fb.group({
      mail_to: [null, Validators.compose([Validators.required])],
      mail_as: [null, Validators.compose([Validators.required])],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.getRawValue())
      // this.form = this.form.getRawValue();
      // console.log(this.form);
      this.close();
    }else{
      alert('in valid')
    }
  }

}
