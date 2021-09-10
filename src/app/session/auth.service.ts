import { Injectable } from '@angular/core';
import { MenuService } from '../core/menu/menu.service';
import { UtilsServiceService } from '../shared/services/utils-service.service';

@Injectable()
export class AuthService {

  private tokenKey = 'currentUser';
  public session: any = {
    access_token: '',
    name: '',
    user_role: '',
    user_email: '',
    user_image: '',
    user_id: '',
    role_id: '',
    chain_id: '',

  };
  constructor(
    public utility: UtilsServiceService,
    private menu: MenuService
  ) {
    var currentUser: any = this.utility.getSessionData(this.tokenKey);
    if (currentUser) {
      this.doSignIn(currentUser);
    }
  }

  public isSignedIn() {
    return !!this.utility.getSessionData('currentUser');
  }

  public doSignOut() {
    this.utility.removeSessionData(this.tokenKey);
    this.utility.removeSessionData('isLock');
    this.utility.removeSessionData('rememberMe');
  }

  public doSignIn(data: any) {
    if ((!data.access_token) || (!data.name)) {
      return;
    }
    this.session = {
      access_token: data.access_token,
      name: data.name,
      user_role: data.user_role,
      user_email: data.user_email,
      user_image: data.user_image,
      user_id: data.user_id,
      role_id: data.role_id,
      chain_id: data.chain_id,
    };
    if (data.rememberMe) {
      localStorage.setItem(this.tokenKey, JSON.stringify(this.session));
      localStorage.setItem('rememberMe', data.rememberMe)
    } else {
      sessionStorage.setItem(this.tokenKey, JSON.stringify(this.session));
    }
    this.menu.getAclMenu();
  }
}