import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainSettingsComponent } from './chain-settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from 'src/app/api.service';
import { SettingsService } from '../settings.service';

describe('ChainSettingsComponent', () => {
  let component: ChainSettingsComponent;
  let fixture: ComponentFixture<ChainSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [ ChainSettingsComponent ],
      providers:[ApiService,SettingsService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
