import { Component, OnInit } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { UserIdleService } from 'angular-user-idle';
import { ApiService } from 'src/app/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilsServiceService } from 'src/app/shared/services/utils-service.service';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss']
})
export class LockScreenComponent implements OnInit {
  public form: UntypedFormGroup;
  public currentUser: any;
  constructor(
    public dialogRef: MatDialogRef<LockScreenComponent>,
    private userIdle: UserIdleService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private location: PlatformLocation,
    private api: ApiService,
    public utility:UtilsServiceService
  ) {
    //Disable back button
    location.onPopState(() => {
      console.log('pressed back in add!!!!!');
      history.forward();
    });
  }

  ngOnInit() {
    this.currentUser = this.utility.getSessionData("currentUser");
    this.form = this.fb.group({
      key: ['', Validators.compose([Validators.required])]
    });
    this.userIdle.stopWatching();
  }

  onSubmit() {
    if (this.form.valid) {
      this.api.post('checkAuth', this.form.value).subscribe((result: any) => {
        if (result.success) {
          this.userIdle.stopTimer();
          this.userIdle.startWatching();
          this.utility.removeSessionData('isLock');
          this.dialogRef.close();
        }
      })
    }
  }
  goToSignIn() {
    this.router.navigate(['/session/signin'])
    this.dialogRef.close();
  }
}
