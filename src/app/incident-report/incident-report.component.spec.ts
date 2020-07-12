import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentReportComponent } from './incident-report.component';
import { SharedModule } from '../shared/shared.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from '../api.service';

describe('IncidentReportComponent', () => {
  let component: IncidentReportComponent;
  let fixture: ComponentFixture<IncidentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        SharedModule,
        NgxDaterangepickerMd.forRoot({
            applyLabel: 'ok',
            separator: ' To '
        }),
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule],
      declarations: [ IncidentReportComponent ],
      providers:[ApiService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
