import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { UtilsServiceService } from '../../shared/services/utils-service.service';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  name: string;
  module: string;
  method: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  module: string;
  method: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

const MENUITEMS = [
  {
    state: '/',
    name: 'HOME',
    type: 'link',
    icon: 'menu-home-svg',
    module: 'dashboard',
    method: 'index'
  },
  {
    state: 'products',
    name: 'Inventory',
    type: 'sub',
    icon: 'menu-product-svg',
    module: 'products',
    method: 'index',
    children: [
      { state: 'allproducts', name: 'Products', module: 'products', method: 'index' },
      { state: 'reconcile', name: 'Reconcile Inventory', module: 'products', method: 'index' },
      { state: 'stock', name: 'Stock', module: 'stock', method: 'index' },
    ]
  },
  // {
  //   state: 'chains',
  //   name: 'CHAINS',
  //   type: 'link',
  //   icon: 'menu-chain-svg',
  //   module: 'vendors',
  //   method: 'index'
  // },
  {
    state: 'stores',
    name: 'STORES',
    type: 'link',
    icon: 'menu-store-svg',
    module: 'stores',
    method: 'index'
  },

  {
    state: 'users',
    name: 'EMPLOYEE',
    type: 'link',
    icon: 'menu-employee-svg',
    module: 'users',
    method: 'index'
  },
  {
    state: 'customer',
    name: 'CUSTOMER',
    type: 'link',
    icon: 'menu-employee-svg',
    module: 'users',
    method: 'index'
  },
  // {
  //   state: 'purchaseorder',
  //   name: 'purchase Receive',
  //   type: 'link',
  //   icon: 'chrome_reader_mode',
  //   module: 'purchase_receive',
  //   method: 'index'
  // },
  {
    state: 'purchaseorder',
    name: 'Purchase Order',
    type: 'sub',
    icon: 'menu-product-svg',
    module: 'products',
    method: 'index',
    children: [
      { state: 'po-list', name: 'Purchase Receive', module: 'purchase_receive', method: 'index' },
      { state: 'po-draft', name: 'Purchase Draft', module: 'purchase_receive', method: 'index' },
    ]
  },
  // {
  //   state: 'mail',
  //   name: 'Send Mail',
  //   type: 'link',
  //   icon: 'send',
  //   module: 'breakdown', //Add here permission for marketing module
  //   method: 'index',
  // },

  {
    state: 'reports',
    name: 'Reports',
    type: 'sub',
    icon: 'report',
    module: 'reports',
    method: 'sales',
    children: [
      // { state: 'cashout', name: 'Cash Out', module: 'reports', method: 'sales' },
      { state: 'brandsales', name: 'Brand sales', module: 'reports', method: 'sales' },
      { state: 'closeout', name: 'Closeout', module: 'reports', method: 'sales' },
      { state: 'cogsreport', name: 'Cogs Report', module: 'reports', method: 'sales' },
      { state: 'customsales', name: 'Custom sales', module: 'reports', method: 'sales' },
      { state: 'employee-sales', name: 'Employee Sales', module: 'reports', method: 'sales' },
      { state: 'low-sales', name: 'Low Sales', module: 'reports', method: 'sales' },
      // { state: 'monthly-report', name: 'Monthly Report', module: 'reports', method: 'sales' },
      { state: 'inventory', name: 'Inventory Report', module: 'reports', method: 'sales' },
      { state: 'inventory-audit', name: 'Inventory Audit Report', module: 'reports', method: 'sales' },
      { state: 'orders', name: 'Orders', module: 'reports', method: 'sales' },
      { state: 'printable-menu', name: 'Printable Menu', module: 'reports', method: 'sales' },
      { state: 'reconcilehistory', name: 'Reconcile History', module: 'reports', method: 'sales' },
      { state: 'refund-report', name: 'Refund Report', module: 'reports', method: 'sales' },
      { state: 'sales', name: 'Sales Per Category', module: 'reports', method: 'sales' },
      { state: 'stocktransfer', name: 'Stock Transfer', module: 'reports', method: 'sales' },
      { state: 'tax', name: 'Tax', module: 'reports', method: 'sales' },
      { state: 'timesheet', name: 'Timesheet', module: 'reports', method: 'sales' },
      { state: 'timetracking', name: 'Time Tracking', module: 'reports', method: 'sales' },
      { state: 'topselling', name: 'Top Selling', module: 'reports', method: 'sales' },
      { state: 'waste', name: 'Waste', module: 'reports', method: 'sales' },
    ]
  },
  {
    state: 'incident-report',
    name: 'Incident Report',
    type: 'link',
    icon: 'report',
    module: 'reports',
    method: 'sales'
  },
  {
    state: 'settings',
    name: 'Settings',
    type: 'link',
    icon: 'settings',
    // module: 'vendors',
    // method: 'index'
    module: 'reports',
    method: 'sales'
  },
  // {
  //   state: 'compliance-report',
  //   name: 'Compliance Report',
  //   type: 'link',
  //   icon: 'settings',
  //   // module: 'vendors',
  //   // method: 'index'
  //   module: 'reports',
  //   method: 'sales'
  // },

];

const MENUITEMS_FRANCHISE = [
  {
    state: '/',
    name: 'HOME',
    type: 'link',
    icon: 'menu-home-svg',
    module: 'dashboard',
    method: 'index'
  },
  {
    state: 'reports',
    name: 'Reports',
    type: 'sub',
    icon: 'report',
    module: 'reports',
    method: 'rvc_report',
    children: [
      { state: 'closeout', name: 'Closeout', module: 'reports', method: 'rvc_report' },
      // { state: 'customsales', name: 'Custom sales', module: 'reports', method: 'sales' },
      // { state: 'dailyinterim', name: 'Daily interim', module: 'reports', method: 'sales' },
      // { state: 'employee-sales', name: 'Employee Sales', module: 'reports', method: 'sales' },
      // { state: 'inventory', name: 'Inventory Report', module: 'reports', method: 'sales' },
      // { state: 'inventory-audit', name: 'Inventory Audit Report', module: 'reports', method: 'sales' },
      // { state: 'orders', name: 'Orders', module: 'reports', method: 'sales' },
      // { state: 'printable-menu', name: 'Printable Menu', module: 'reports', method: 'sales' },
      // { state: 'reconcilehistory', name: 'Reconcile History', module: 'reports', method: 'sales' },
      // { state: 'refund-report', name: 'Refund Report', module: 'reports', method: 'sales' },
      // { state: 'sales', name: 'Sales Per Category', module: 'reports', method: 'sales' },
      // { state: 'stocktransfer', name: 'Stock Transfer', module: 'reports', method: 'sales' },
      // { state: 'tax', name: 'Tax', module: 'reports', method: 'sales' },
      // { state: 'timesheet', name: 'Timesheet', module: 'reports', method: 'sales' },
      // { state: 'timetracking', name: 'Time Tracking', module: 'reports', method: 'sales' },
      // { state: 'topselling', name: 'Top Selling', module: 'reports', method: 'sales' },
      // { state: 'waste', name: 'Waste', module: 'reports', method: 'sales' },
    ]
  },
  // {
  //   state: 'incident-report',
  //   name: 'Incident Report',
  //   type: 'link',
  //   icon: 'report',
  //   module: 'reports',
  //   method: 'sales'
  // },
  // {
  //   state: 'settings',
  //   name: 'Settings',
  //   type: 'link',
  //   icon: 'settings',
  //   module: 'reports',
  //   method: 'sales'
  // },
  // {
  //   state: 'compliance-report',
  //   name: 'Compliance Report',
  //   type: 'link',
  //   icon: 'settings',
  //   // module: 'vendors',
  //   // method: 'index'
  //   module: 'reports',
  //   method: 'sales'
  // },

];

@Injectable()
export class MenuService {

  menus: Menu[] = [];

  constructor(public api: ApiService, public utility: UtilsServiceService, public snackBar: MatSnackBar) { }

  getAll(): Menu[] {
    const session = this.utility.getSessionData('currentUser')
    return session?.user_role.includes("Franchisee") ? MENUITEMS_FRANCHISE : MENUITEMS;
  }

  getAclMenu(): void {
    let menus = [];
    this.api.get('permissions')
      .subscribe((response: any) => {
        let all_menu = this.getAll();
        all_menu.forEach(m => {
          if (this.isPermissible(m.module, m.method, response.data)) {
            // if ((m.module, m.method, response.data)) {
            if (m.children) {
              let c2: ChildrenItems[] = [];
              m.children.forEach(c => {
                if (m.module == c.module && m.method == c.method) {
                  c2.push(c);
                  return true;
                }
                if (this.isPermissible(c.module, c.method, response.data)) {
                  //if ((c.module, c.method, response.data)) {
                  c2.push(c);
                }
              });
              m.children = c2;
            }
            menus.push(m);
          }
        });
        this.menus = menus;
      },
        err => {
          this.snackBar.open(err.message, '', { duration: 5000 });
          console.log('Unable to create menu. Error while getting permissions: ');
          console.log(err);
        });
  }

  isPermissible(module: string, method: string, permissions: any[]) {
    var allowed = false;
    permissions.forEach(p => {
      if (p.module_name == module && p.method_name == method) {
        allowed = true;
        return false;
      }
    });
    return allowed;
  }
  add(menu) {
    MENUITEMS.push(menu);
  }
}
