import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {SharedModule} from '../shared/shared.module'
import { SessionRoutes } from './session.routing';
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';
import { ForgotComponent } from './forgot/forgot.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AgreementComponent } from './agreement/agreement.component';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(SessionRoutes),
    SignaturePadModule 
  ],
  declarations: [
    NotFoundComponent,
    ErrorComponent,
    ForgotComponent,
    SigninComponent,
    SignupComponent,
    ResetPasswordComponent,
    AgreementComponent,
  ]
})

export class SessionModule {}
