import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundReportComponent } from './refund-report.component';
import { SharedModule } from '../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
// import { ApiService } from '../api.service';
// import { DiscountService } from './discount.service';

describe('UserComponent', () => {
  let component: RefundReportComponent;
  let fixture: ComponentFixture<RefundReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [ RefundReportComponent ],
      // providers:[ApiService,DiscountService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
