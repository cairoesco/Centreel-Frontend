import { Injectable } from '@angular/core';
import { LockScreenComponent } from './lock-screen.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UtilsServiceService } from '../../shared/services/utils-service.service'
@Injectable({
  providedIn: 'root'
})
export class LockScreenService {
  public lockDialogRef: MatDialogRef<LockScreenComponent>;
  public isLock: boolean = false;
  constructor(public dialog: MatDialog, public utility: UtilsServiceService) { }

  openLockDialog() {
    this.closeLockDialog();
    let userData = this.utility.getSessionData('currentUser');
    if (userData) {
      this.isLock = true;
      this.lockDialogRef = this.dialog.open(LockScreenComponent, {
        // width: '30vw',
        closeOnNavigation: false,
        disableClose: true,
        panelClass: 'lock-screen-dialog',
        data: {}
      });
      this.lockDialogRef.afterClosed().subscribe((result: any) => {
        this.isLock = false;
      })
    }
    else {
      this.closeLockDialog();
    }

  }
  closeLockDialog() {
    this.isLock = false;
    if (this.lockDialogRef)
      this.lockDialogRef.close();
  }
}
