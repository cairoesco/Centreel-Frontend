import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceSettingsComponent } from './province-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApiService } from 'src/app/api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ProvinceSettingsComponent', () => {
  let component: ProvinceSettingsComponent;
  let fixture: ComponentFixture<ProvinceSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [ ProvinceSettingsComponent ],
      providers:[ApiService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvinceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
