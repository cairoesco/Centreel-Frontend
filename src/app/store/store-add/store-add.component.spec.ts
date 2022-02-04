import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAddComponent } from './store-add.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from 'src/app/api.service';
import { StoreService } from '../store.service';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

describe('StoreAddComponent', () => {
  let component: StoreAddComponent;
  let fixture: ComponentFixture<StoreAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule,
        FileUploadModule,
        NgxMaterialTimepickerModule.forRoot()
      ],
      declarations: [ StoreAddComponent ],
      providers:[ApiService,StoreService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
