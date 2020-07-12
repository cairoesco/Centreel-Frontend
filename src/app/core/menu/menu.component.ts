import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { MenuService } from './menu.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  providers: [MenuService, ApiService]
})
export class MenuComponent implements OnInit {
  currentLang = 'en';

  constructor(
    public menuService: MenuService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public translate: TranslateService) {

    this.matIconRegistry.addSvgIcon(`menu-product-svg`, this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icon/menu-product.svg"));
    this.matIconRegistry.addSvgIcon(`menu-chain-svg`, this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icon/menu-chain.svg"));
    this.matIconRegistry.addSvgIcon(`menu-employee-svg`, this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icon/menu-employee.svg"));
    this.matIconRegistry.addSvgIcon(`menu-home-svg`, this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icon/menu-home.svg"));
    this.matIconRegistry.addSvgIcon(`menu-store-svg`, this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icon/menu-store.svg"));
    this.matIconRegistry.addSvgIcon(`trash-svg`, this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icon/trash.svg"));
    this.matIconRegistry.addSvgIcon(`summary-list-svg`, this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icon/summary-list.svg"));
    this.matIconRegistry.addSvgIcon(`move-stock-svg`, this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icon/move-stock.svg"));
    this.matIconRegistry.addSvgIcon(`new-product-svg`, this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icon/icons8-new-product.svg"));
    this.matIconRegistry.addSvgIcon(`add-stock-svg`, this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icon/plus.svg"));
    this.matIconRegistry.addSvgIcon(`padlock-svg`, this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icon/padlock.svg"));    
  }

  ngOnInit() {
    this.menuService.getAclMenu();
  }

  addMenuItem(): void {
    this.menuService.add({
      state: 'menu',
      name: 'MENU',
      type: 'sub',
      icon: 'trending_flat',
      children: [
        { state: 'menu', name: 'MENU' },
        { state: 'timeline', name: 'MENU' }
      ]
    });
  }
}
