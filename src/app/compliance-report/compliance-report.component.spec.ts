import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceReportComponent } from './compliance-report.component';
import { SharedModule } from '../shared/shared.module';
import { ComplianceReportService } from './compliance-report.service';
import { ApiService } from '../api.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ComplianceReportComponent', () => {
  let component: ComplianceReportComponent;
  let fixture: ComponentFixture<ComplianceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        SharedModule,
        HttpClientModule,
        BrowserAnimationsModule
      ],
      declarations: [ ComplianceReportComponent ],
      providers: [ApiService,ComplianceReportService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
