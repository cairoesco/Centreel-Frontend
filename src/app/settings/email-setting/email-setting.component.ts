import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-setting',
  templateUrl: './email-setting.component.html',
  styleUrls: ['./email-setting.component.scss']
})
export class EmailSettingComponent implements OnInit {

  public form: UntypedFormGroup;
  filter_name: any;
  portList: any = [];


  constructor(private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<EmailSettingComponent>, @Inject(MAT_DIALOG_DATA) public data: FilterDialogData) {
    this.form = this.fb.group({
      host: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
      port: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
      subject: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])],
    });
  }

  onNoClick(): void {
    this.dialogRef.close(this.form.value);
  }
  ngOnInit() {
    // this.form = this.fb.group({
    //   filter_name: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
    // });
  }

  /* close dialog box */
  close() {
    this.dialogRef.close();
  }
  /* close dialog box */

}
export interface FilterDialogData {
  animal: string;
  name: string;
}