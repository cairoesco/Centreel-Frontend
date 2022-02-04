import { Routes } from '@angular/router';
import { ComplianceReportComponent } from './compliance-report.component'

export const ComplianceReportRoutes: Routes = [
    { path: 'monthly-report', component: ComplianceReportComponent, data: { title: 'Monthly Report' } },
];
