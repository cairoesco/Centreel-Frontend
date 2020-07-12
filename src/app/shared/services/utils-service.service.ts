import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DeleteConfirmComponent } from 'src/app/dialog/delete-confirm/delete-confirm.component';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilsServiceService {
  constructor(private snackBar: MatSnackBar, public dialog: MatDialog) { }

  //Show snackbar notification
  showSnackBar(message, options: MatSnackBarConfig = {}) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = Boolean(options.verticalPosition) ? options.verticalPosition : 'top';
    config.horizontalPosition = Boolean(options.horizontalPosition) ? options.horizontalPosition : 'right';
    config.duration = Boolean(options.duration) ? options.duration : 4000;
    config.panelClass = Boolean(options.panelClass) ? options.panelClass : '';
    this.snackBar.open(message, '', config);
  }

  //Only number allow 
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && (charCode < 48 || charCode > 57)) || (!Boolean(event.target.value) && charCode == 48)) {
      return false;
    }
    return true;
  }

  //Only number and character allow 
  alphanumericOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) || (!Boolean(event.target.value) && charCode == 48)) {
      return false;
    }
    return true;
  }

  //Only number allow with 0 value
  numberOnlyValue(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && (charCode < 47 || charCode > 57))) {
      return false;
    }
    return true;
  }

  // Stock Validation
  stockValidation(event: any, value: any, unit: string) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && ((charCode < 48 || charCode > 57) && charCode != 46))) {
      return false;
    }
    if (charCode == 46 && unit == 'pcs') {
      return false;
    }
    if (value && unit != 'pcs' && typeof value == 'string') {
      let n = value.indexOf('.');
      let zeroIndex = value.indexOf('0');
      if (zeroIndex == 0 && n == -1 && charCode == 48) {
        return false;
      }
      if (n != -1) {
        let result = value.substring(n + 1);
        if (result.length > 1 || charCode == 46) {
          return false;
        }
      }
    }
    return true;
  }

  // Stock Validation for reconcile stock
  reconcile_stockValidation(event: any, value: any, unit: string) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && ((charCode < 45 || charCode > 57) && charCode != 46))) {
      return false;
    }
    if (charCode == 46 && unit == 'pcs') {
      return false;
    }
    if (value && unit != 'pcs' && typeof value == 'string') {
      let n = value.indexOf('.');
      let zeroIndex = value.indexOf('0');
      if (zeroIndex == 0 && n == -1 && charCode == 48) {
        return false;
      }
      if (n != -1) {
        let result = value.substring(n + 1);
        if (result.length > 1 || charCode == 46) {
          return false;
        }
      }
    }
    return true;
  }

  numberAndDotOnly(event: any, value: any): boolean {
    value = ''+value;
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && ((charCode < 48 || charCode > 57) && charCode != 46))) {
      return false;
    }
    if (value) {
      let n = value.indexOf('.');
      let zeroIndex = value.indexOf('0');
      if (zeroIndex == 0 && n == -1 && charCode == 48) {
        return false;
      }
      if (n != -1) {
        let result = value.substring(n + 1);
        if (result.length > 1 || charCode == 46) {
          return false;
        }
      }
    }
    return true;
  }

  priceOnly(event: any, value: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && ((charCode < 48 || charCode > 57) && charCode != 46)) || (!Boolean(event.target.value) && charCode == 48)) {
      return false;
    }
    if (value) {
      let n = value.indexOf('.');
      if (n != -1) {
        let result = value.substring(n + 1);
        if (result.length > 1 || charCode == 46) {
          return false;
        }
      }
    }
    return true;
  }
  /* 
  * this function is used to conver local time to UTC as well as UTC to Local
  * for local to utc : set toUTC = true
  * for utc to local : set toUTC = false
  */
  convertLocalDateToUTCDate(date: any, toUTC: any) {
    date = moment(date, 'YYYY-MM-DD HH:mm').toDate();
    let localOffset = date.getTimezoneOffset() * 60000;
    let localTime = date.getTime();
    if (toUTC) {
      date = localTime + localOffset;
    } else {
      date = localTime - localOffset;
    }
    date = new Date(date);
    return date;
  }

  //Scroll tab 
  indexofTab: number = 0;
  isTabClick: boolean = false;
  scrollTo(section: any) {
    this.isTabClick = true;
    document.querySelector('#' + section)
      .scrollIntoView();
    setTimeout(() => {
      this.isTabClick = false;
    }, 100);
  }

  onScrollContent(event: any) {
    if (!this.isTabClick) {
      this.indexofTab = event.index;
    }
  }

  //Confimation dialog 
  confirmDialog(options) {
    const confirmDialogRef = this.dialog.open(DeleteConfirmComponent, {
      data: options
    });
    return confirmDialogRef.afterClosed();
  }

  //Date conversation for Reports 

  get_utc_from_to_date(date: any) {
    let userzone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let user_date = date.toLocaleString('en-US', { timeZone: userzone });
    let new_dt = moment(this.convertLocalDateToUTCDate(user_date, true)).format('YYYY-MM-DD HH:mm:ss');
    return new_dt;
  }

  get_date_format_from_to_date(date: any) {
    let userzone1 = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let user_date = date.toLocaleString('en-US', { timeZone: userzone1 });
    let new_dt = moment(this.convertLocalDateToUTCDate(user_date, true)).format('YYYY-MM-DD');
    return new_dt;
  }
  //Get loggin user settion data
  getSessionData(key: string) {
    if (Boolean(sessionStorage.getItem(key))) {
      try {
        return JSON.parse(sessionStorage.getItem(key));
      } catch (e) {
        return sessionStorage.getItem(key);
      }
    } else {
      if (Boolean(localStorage.getItem(key))) {
        try {
          return JSON.parse(localStorage.getItem(key));
        } catch (e) {
          return localStorage.getItem(key);
        }
      } else {
        return false;
      }
    }
  }

  //Set data session
  setSessionData(key: string, value: any) {
    if (this.getSessionData('rememberMe')) {
      localStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, value);
    }
  }

  removeSessionData(key: string) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  /* get time zone */
  getTimeZone() {
    var offset = new Date().getTimezoneOffset(),
      o = Math.abs(offset);
    return (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2);
  }
  /* get time zone */

  /* set scroll to error */
  scrollToelement(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  scrollToError(): void {
    const firstElementWithError = document.querySelector('.ng-invalid[formControlName]');
    // console.log("aa:", firstElementWithError);

    this.scrollToelement(firstElementWithError);
  }
  /* set scroll to error */
}
