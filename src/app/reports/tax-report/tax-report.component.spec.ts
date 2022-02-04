import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxReportComponent } from './tax-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from 'src/app/api.service';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ReportService } from '../report.service';

describe('TaxReportComponent', () => {
  let component: TaxReportComponent;
  let fixture: ComponentFixture<TaxReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule,
        NgxDaterangepickerMd.forRoot({
          applyLabel: 'ok',
          separator: ' To '
        })
      ],
      declarations: [TaxReportComponent],
      providers: [ApiService, ReportService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
