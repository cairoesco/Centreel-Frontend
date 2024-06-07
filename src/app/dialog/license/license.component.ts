import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {
  public form: UntypedFormGroup;
  license_name:any;
  license_number:any;

  constructor(private fb: UntypedFormBuilder,public dialogRef: MatDialogRef<LicenseComponent>, @Inject(MAT_DIALOG_DATA) public data: LicenseDialogData) { }

  onAddClick(): void {
    if(this.form.valid)
    {
      this.dialogRef.close(this.form.value);
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      license_name: [null, Validators.compose([Validators.required])],
      license_number: [null, Validators.compose([Validators.required])],
    });
  }

  close() {
    this.dialogRef.close();
  }

}
export interface LicenseDialogData {
  name: string;
}
