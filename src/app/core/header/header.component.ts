import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { ApiService } from '../../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsServiceService } from 'src/app/shared/services/utils-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  searchCtrl: UntypedFormControl;
  searchResult = [];
  LoginUser: any;
  constructor(private router: Router, private api: ApiService, public snackBar: MatSnackBar,public utility:UtilsServiceService) {
    this.searchCtrl = new UntypedFormControl();
    this.searchCtrl.valueChanges
      .debounceTime(400)
      .subscribe(data => {
        if (!data) return;
        this.api.get('search/' + data).subscribe((response: any) => {
          this.searchResult = response.data;
        })
      })
    this.LoginUser = this.utility.getSessionData('currentUser');
  }
  searchSelected($event, res, obj): void {
    this.router.navigateByUrl(res.state + '/' + obj.id);
  }

  doSignOut(): void {
    this.router.navigateByUrl('session/signin');
  }

  onSend(feedback) {
    feedback.requested_by = 'USER';
    this.api.post('feedback', feedback)
      .subscribe((response: any) => {
        if (response.success) {
          this.snackBar.open(response.message, '', { duration: 5000 });
        }
      },
        err => {
          this.snackBar.open(err.error.error, '', { duration: 5000 });
        });
  }
}
