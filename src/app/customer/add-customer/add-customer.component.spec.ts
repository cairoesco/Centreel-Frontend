import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerComponent } from './add-customer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { ApiService } from 'src/app/api.service';
import { UserService } from './../../user/user.service';

describe('AddUserComponent', () => {
  let component: AddCustomerComponent;
  let fixture: ComponentFixture<AddCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule,
        FileUploadModule
      ],
      declarations: [AddCustomerComponent],
      providers: [ApiService, UserService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});