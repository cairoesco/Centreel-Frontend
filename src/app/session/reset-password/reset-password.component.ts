import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from '../../api.service';
import { UtilsServiceService } from 'src/app/shared/services/utils-service.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public form: UntypedFormGroup;
  public encryptedKey;
  public isValidToken: boolean = false;
  public requestType: any;
  public message: any;
  constructor(private fb: UntypedFormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private api: ApiService, private utility: UtilsServiceService) { }

  ngOnInit() {
    let password = new UntypedFormControl('', Validators.required);
    this.form = this.fb.group({
      password: password,
      confirmPassword: ['', CustomValidators.equalTo(password)],
      email: [''],
      otp: [''],
      type: [''],
      pin: ['', Validators.required]
    });
    this.activatedRoute.params.subscribe((params) => {
      let id: any = params['id'];
      this.encryptedKey = id;
      let parmeters = Boolean(id) ? atob(id) : id;
      let request = Boolean(parmeters) ? parmeters.split(":") : [];
      this.requestType = request[3];
      this.form.patchValue({ email: request[0], otp: request[1], type: request[2] })

      if (this.requestType == 'PASSWORD') {
        this.form.controls['password'].setValidators([Validators.required]);
        this.form.controls['pin'].setValidators([]);
        this.form.updateValueAndValidity();
      } else if (this.requestType == 'PIN') {
        this.form.controls['password'].setValidators([]);
        this.form.controls['pin'].setValidators([Validators.required, Validators.maxLength(4), Validators.minLength(4)]);
        this.form.updateValueAndValidity();
      }
      this.getUserAuthentication();
    });

  }
  getUserAuthentication() {
    this.api.get("verifyToken/" + this.encryptedKey, this.form)
      .subscribe((response: any) => {
        if (response.success) {
          this.isValidToken = true;
        } else {
          this.utility.showSnackBar(response.message);
          this.message = response.message;
        }
      }, error => {
        this.message = "This link has been expired. Please make reset password request again"
      });
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.requestType == 'PASSWORD') {
        delete this.form.value.pin;
      } else if (this.requestType == 'PIN') {
        delete this.form.value.password;
        delete this.form.value.confirmPassword;
      }
      this.api.post("resetPassword", this.form.value).subscribe((response: any) => {
        if (response.success) {
          this.utility.showSnackBar(response.message);
          this.router.navigate(['/session/signin']);
        } else {
          this.utility.showSnackBar(response.message);
        }
      });
    }
  }
}
