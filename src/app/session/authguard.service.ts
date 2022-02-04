import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { MenuService } from '../core/menu/menu.service';
import { UtilsServiceService } from '../shared/services/utils-service.service';
import { LockScreenService } from '../dialog/lock-screen/lock-screen.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private menuService: MenuService, public utility: UtilsServiceService, private lockService: LockScreenService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isSignedIn()) {
      let found = false;
      // this.menuService.menus.forEach(m => {
      //   //debugger;
      //   // we need to prevent access based on menu assigned and not as the routes assigned
      // });     
      if (Boolean(this.utility.getSessionData('isLock'))) {
        this.lockService.openLockDialog();
        return true;
      }
      return true;
    } else {
      this.router.navigate(['/session/signin'], {
        queryParams: {
          return: state.url
        }
      });
      return false;
    }
  }
}