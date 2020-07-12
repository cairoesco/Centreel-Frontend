import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { viewPoComponent } from './view-po.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from 'src/app/api.service';
import { PurchaseOrderService } from '../purchase-order.service';
import { FileUploadModule } from 'ng2-file-upload';

describe('AddPoComponent', () => {
  let component: viewPoComponent;
  let fixture: ComponentFixture<viewPoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule,
        FileUploadModule
      ],
      declarations: [ viewPoComponent ],
      providers:[ApiService,PurchaseOrderService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(viewPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
