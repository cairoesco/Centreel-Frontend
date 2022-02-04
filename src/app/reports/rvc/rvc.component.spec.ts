import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RvcComponent } from './rvc.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ApiService } from 'src/app/api.service';

describe('RvcComponent', () => {
  let component: RvcComponent;
  let fixture: ComponentFixture<RvcComponent>;

  beforeEach(async(() => {
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
      declarations: [ RvcComponent ],
      providers: [ApiService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RvcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
