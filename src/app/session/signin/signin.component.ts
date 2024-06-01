import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  providers: [ApiService, AuthService]
})
export class SigninComponent implements OnInit {

  public form: UntypedFormGroup;
  public isBusy = false;
  return: string = '';

  constructor(private fb: UntypedFormBuilder, private router: Router,
    private auth: AuthService,
    private api: ApiService, public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private utils: UtilsServiceService) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.compose([Validators.required])], 
      password: ['', Validators.compose([Validators.required])],
      rememberMe:[false]
    });

    // reset login status
    this.auth.doSignOut();
    this.route.queryParams
      .subscribe(params => this.return = params['return'] || '/');
  }

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Sign in',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    fullWidth: true,
    buttonColor: 'primary',
    disabled: false
  }

  //Login user 
  onSubmit() {
    this.barButtonOptions.active = true;
    this.barButtonOptions.text = 'Loading...';
    this.api.getAccessToken(this.form.value).subscribe((response: any) => {
      if (response.success) {
        this.barButtonOptions.active = false;
        this.barButtonOptions.text = 'Success';
        response.data.rememberMe=this.form.value.rememberMe;
        this.auth.doSignIn(response.data);
        this.router.navigateByUrl(this.return);
      }else{
        this.barButtonOptions.active = false;
        this.barButtonOptions.text = 'Sign in';
      }
    },
    err=>{
      this.barButtonOptions.active = false;
        this.barButtonOptions.text = 'Sign in';
    });
  }
}
