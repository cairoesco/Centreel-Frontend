import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePoComponent } from './create-po.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from 'src/app/api.service';
import { FileUploadModule } from 'ng2-file-upload';
import { PurchaseOrderService } from '../purchase-order.service';

describe('CreatePoComponent', () => {
  let component: CreatePoComponent;
  let fixture: ComponentFixture<CreatePoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule,
        FileUploadModule
      ],
      declarations: [ CreatePoComponent ],
      providers:[ApiService,PurchaseOrderService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
