import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IncidentReportRoutes } from './incident-report.routing';
import { IncidentReportComponent } from './incident-report.component';
import { IncidentReportAddComponent } from './incident-report-add/incident-report-add.component';
import {SharedModule} from '../shared/shared.module'
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IncidentReportEditComponent } from './incident-report-edit/incident-report-edit.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
    imports: [
        RouterModule.forChild(IncidentReportRoutes),
        MatDatepickerModule,
        MatNativeDateModule,
        SharedModule,
        NgxDaterangepickerMd.forRoot({
            applyLabel: 'ok',
            separator: ' To '
        })
    ],
    declarations: [
        IncidentReportComponent,
        IncidentReportAddComponent,
        IncidentReportEditComponent
    ],
    providers: [  
        MatDatepickerModule,  
        MatNativeDateModule
    ]
})
export class IncidentReportModule {
}
