import { Routes } from '@angular/router';
import { AdminLayoutComponent, AuthLayoutComponent } from './core';
import { AuthGuardService } from './session/authguard.service';

export const AppRoutes: Routes = [{
  path: '',
  component: AdminLayoutComponent,
  canActivate: [AuthGuardService],
  children: [{
    path: '',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    data: { title: 'Dashboard' }
  },
  {
    path: 'users',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    data: { title: 'Employee', breadcrumb: {name:'Employee',url:"users"}  }
  },
  // Purchase order routing
  {
    path: 'purchaseorder',
    loadChildren: () => import('./purchase-order/purchase-order.module').then(m => m.PurchaseOrderModule),
    data: { title: 'Purchase Order', breadcrumb: {name:'Purchase Order',url:"purchaseorder"}  }
  },
 
  {
    path: 'chains',
    loadChildren: () => import('./chain/chain.module').then(m => m.ChainModule),
    data: { title: 'Chains',breadcrumb: {name:'Chains',url:"chains"} },
  },
  // marketing mail
  {
    path: 'mail',
    loadChildren: () => import('./marketing-mail/marketing-mail.module').then(m => m.MarketingMailModule),
    data: { title: 'Mail',breadcrumb: {name:'Marketing Mail',url:"mail"} }
  },
  {
    path: 'products',
    loadChildren: () => import('../../products.module').then(m => m.ProductsModule),
    data: { title: 'Products' }
  },
  {
    path:'stores',
    loadChildren:() => import('./store/store.module').then(m => m.StoreModule),
    data: { title: 'Stores', breadcrumb: {name:'Stores',url:"stores"} }
    // data: { title: 'Stores' }
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
    data: { title: 'Reports', breadcrumb: {name:'Reports',url:"reports"} }
  }, {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
    data: { title: 'Settings', breadcrumb: {name:'Settings',url:"settings"} }
  },
  {
    path: 'incident-report',
    loadChildren: () => import('./incident-report/incident-report.module').then(m => m.IncidentReportModule),
    data: { title: 'Incident Report', breadcrumb: {name:'Incident Report',url:"settings"} }
  },
  {
    path: 'reports',
    loadChildren: () => import('./compliance-report/compliance-report.module').then(m => m.ComplianceReportModule),
    data: { title: 'Compliance Report', breadcrumb: {name:'Compliance Report',url:"settings"} }
  },
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
    data: { title: 'Customer' }
  },
]
}, {
  path: '',
  component: AuthLayoutComponent,
  children: [{
    path: 'session',
    loadChildren: () => import('./session/session.module').then(m => m.SessionModule),
    data: { title: 'Session', breadcrumb: {name:'Session',url:"session"} }
  }]
}, {
  path: '**',
  redirectTo: 'session/404',
  data: { title: 'Page Not Found' }
}];
