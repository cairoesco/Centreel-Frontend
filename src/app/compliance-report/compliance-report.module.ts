import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {SharedModule} from '../shared/shared.module'
import {ComplianceReportComponent} from './compliance-report.component'
import {ComplianceReportRoutes} from './compliance-report.routing'
import {ComplianceReportService} from './compliance-report.service'
@NgModule({
    imports: [
        RouterModule.forChild(ComplianceReportRoutes),
        SharedModule,
    ],

    declarations: [ComplianceReportComponent],
    providers: [ComplianceReportService]
})
export class ComplianceReportModule {
}
