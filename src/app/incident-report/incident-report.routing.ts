import { Routes } from '@angular/router';

import { IncidentReportComponent } from './incident-report.component';
import { IncidentReportAddComponent } from './incident-report-add/incident-report-add.component';
import { IncidentReportEditComponent } from './incident-report-edit/incident-report-edit.component';

export const IncidentReportRoutes: Routes = [
    {
        path: '',
        component: IncidentReportComponent
    },
    {
        path: 'create',
        component: IncidentReportAddComponent,
        data: { title: 'Create Incident Report' }
    },
    {
        path: ':id/view',component: IncidentReportEditComponent,
        data: { title: 'View Incident Report' }
      }
];