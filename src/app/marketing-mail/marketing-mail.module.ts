import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { marketingMailRoutingModule } from './marketing-mail.routing';
import { SharedModule } from '../shared/shared.module'
import { QuillModule } from 'ngx-quill';
import { MatNativeDateModule } from '@angular/material/core';

import { MarketingMailComponent } from './marketing-mail.component';
import { MarketingMailService } from './marketing-mail.service';

@NgModule({
  declarations: [
    MarketingMailComponent
  ],
  imports: [
    marketingMailRoutingModule,
    SharedModule,
    CommonModule,
    NgxDatatableModule,
    QuillModule,
    MatNativeDateModule,
  ],
  providers: [MarketingMailService]
})
export class MarketingMailModule { }
