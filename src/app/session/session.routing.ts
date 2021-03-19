import { Routes } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';
import { ForgotComponent } from './forgot/forgot.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AgreementComponent } from './agreement/agreement.component';

export const SessionRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '404',
      component: NotFoundComponent
    }, {
      path: 'error',
      component: ErrorComponent
    }, {
      path: 'forgot',
      component: ForgotComponent
    }, {
      path: 'signin',
      component: SigninComponent,
      data: { title: 'Sign In' }
    }, {
      path: 'signup',
      component: SignupComponent
    }, {
      path: 'reset/:id',
      component: ResetPasswordComponent
    }, {
      path: 'agreement/:id',
      component: AgreementComponent
    }]
  }
];
