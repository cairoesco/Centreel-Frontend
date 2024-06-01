import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {

  public form: UntypedFormGroup;
  name:any;
  type:any;
  phone:any;
  email:any;

  constructor(private fb: UntypedFormBuilder,public dialogRef: MatDialogRef<WarehouseComponent>, @Inject(MAT_DIALOG_DATA) public data: WarehouseDialogData) { }

  onNoClick(): void {
    this.dialogRef.close(this.form.value);
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      type: [null, Validators.compose([Validators.required])],
      phone: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
    });
  }

  /* close dialog box */
  close() {
    this.dialogRef.close();
  }
  /* close dialog box */

}
export interface WarehouseDialogData {
  animal: string;
  name: string;
}
