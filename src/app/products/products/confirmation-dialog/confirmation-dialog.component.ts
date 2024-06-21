import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilsServiceService } from 'src/app/shared/services/utils-service.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  public form: FormGroup;
  public currentUser: any;
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private fb: FormBuilder,
    private api: ApiService,
    public utility: UtilsServiceService
  ) { }

  ngOnInit() {
    this.currentUser = this.utility.getSessionData("currentUser");
    this.form = this.fb.group({
      key: ['', Validators.compose([Validators.required])]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.api.post('checkAuth', this.form.value).subscribe((result: any) => {
        if (result.success) {
          this.dialogRef.close(result);
        }
      })
    }
  }
}
