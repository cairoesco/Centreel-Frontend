import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementComponent } from './agreement.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApiService } from 'src/app/api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('AgreementComponent', () => {
  let component: AgreementComponent;
  let fixture: ComponentFixture<AgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [ AgreementComponent ],
      providers:[ApiService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
