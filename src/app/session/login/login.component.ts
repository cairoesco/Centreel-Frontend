import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ApiService, AuthService]
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public isBusy = false;
  return: string = '';

  constructor(private fb: FormBuilder, private router: Router,
    private auth: AuthService,
    private api: ApiService, public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private utils: UtilsServiceService) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.compose([Validators.required])],
      // password: ['', Validators.compose([Validators.required])],
      // rememberMe:[false]
    });

    // reset login status
    this.auth.doSignOut();
    this.route.queryParams
      .subscribe(params => this.return = params['return'] || '/');
  }

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Validate Chain',
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
  onSubmit(admin?) {
    this.barButtonOptions.active = true;
    this.barButtonOptions.text = 'Loading...';
    let value = admin ? { username: 'admin' } : this.form.value
    this.api.validateChain(value).subscribe((response: any) => {
      if (response.data.length) {
        console.log(response);
        console.log(response.data);
        localStorage.setItem('chain_data', JSON.stringify(response.data[0]))
        this.router.navigateByUrl('session/signin');
        this.utils.showSnackBar(response.message, { panelClass: 'success' });
        this.barButtonOptions.active = false;
        this.barButtonOptions.text = 'Success';
        // response.data.rememberMe=this.form.value.rememberMe;
        // this.auth.doSignIn(response.data);
        // this.router.navigateByUrl(this.return);
      } else {
        this.barButtonOptions.active = false;
        this.barButtonOptions.text = 'Validate Chain';
        this.utils.showSnackBar(response.message, { panelClass: 'error' });
      }
    },
      err => {
        this.barButtonOptions.active = false;
        this.barButtonOptions.text = 'Sign in';
      });
  }
}
