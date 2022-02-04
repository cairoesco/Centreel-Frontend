import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule, DecimalPipe} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ChartsModule} from 'ng2-charts';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {DashboardComponent} from './dashboard.component';
import {DashboardRoutes} from './dashboard.routing';
import {DashboardService} from './dashboard.service';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatListModule,
        MatProgressBarModule,
        MatMenuModule,
        ChartsModule,
        NgxDatatableModule,
        FlexLayoutModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        MatTabsModule
    ],
    declarations: [DashboardComponent],
    providers:[DashboardService,DecimalPipe]
})

export class DashboardModule {
}
