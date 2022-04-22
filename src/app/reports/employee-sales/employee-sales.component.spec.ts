import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeSalesComponent } from './employee-sales.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ApiService } from 'src/app/api.service';

describe('OrdersComponent', () => {
  let component: EmployeeSalesComponent;
  let fixture: ComponentFixture<EmployeeSalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule,
        NgxDaterangepickerMd.forRoot({
          applyLabel: 'ok',
          separator: ' To '
        })
      ],
      declarations: [ EmployeeSalesComponent ],
      providers: [ApiService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
