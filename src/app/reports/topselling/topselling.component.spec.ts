import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopsellingComponent } from './topselling.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from 'src/app/api.service';

describe('TopsellingComponent', () => {
  let component: TopsellingComponent;
  let fixture: ComponentFixture<TopsellingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        SharedModule,
        NgxDaterangepickerMd.forRoot({
            applyLabel: 'ok',
            separator: ' To '
        })
      ],
      declarations: [ TopsellingComponent ],
      providers:[ApiService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopsellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
