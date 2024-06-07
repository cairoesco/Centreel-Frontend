import { Component, OnInit , Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators,AbstractControl } from '@angular/forms';
import { MustMatch } from '../password-validator/password-validator.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public form: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder,public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  changeUserDetail(){
    this.form = this.fb.group({
      password: [''],
      confirmPassword: [''],
      pin: ['']
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }
  ngOnInit() {
    this.changeUserDetail();
    this.updateValidation()
    
  }

  updateValidation(){
    if(this.data.type == 'PIN'){
      this.form.get('pin').setValidators([Validators.required]);
      this.form.get('password').clearValidators();
      this.form.get('confirmPassword').clearValidators();
    }else{
      this.form.get('pin').clearValidators();
      this.form.get('password').setValidators([Validators.required]);
      this.form.get('confirmPassword').setValidators([Validators.required]);
    }
    this.form.get('pin').updateValueAndValidity();
    this.form.get('password').updateValueAndValidity();
    this.form.get('confirmPassword').updateValueAndValidity();
  }

  form_obj: any = new Object();
  onSubmit(): void {
    if (this.form.valid) {
      this.form_obj = this.form.getRawValue();

      if (!((this.form_obj.password) && (this.form_obj.password != ''))) {
        delete this.form_obj.password;
      }
  
      if (!((this.form_obj.pin) && (this.form_obj.pin != ''))) {
        delete this.form_obj.pin;
      }
      this.form_obj.chain_id = this.data.chain_id;
      this.form_obj.email = this.data.user_email;
      this.form_obj.id = this.data.user_id;
      this.form_obj.type = 'web';
      this.form_obj.field_type = this.data.type;

      this.dialogRef.close(this.form_obj);
    }
  }

  close() {
    this.dialogRef.close();
  }

}
