import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

const password = new UntypedFormControl('', Validators.required);
const confirmPassword = new UntypedFormControl('', CustomValidators.equalTo(password));

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public form: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group( {
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      password: password,
      confirmPassword: confirmPassword
    } );
  }

  onSubmit() {
    this.router.navigate( ['/dashboard'] );
  }
}
