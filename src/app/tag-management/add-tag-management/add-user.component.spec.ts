import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {  AddTagManagementComponent } from './add-tag-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { ApiService } from 'src/app/api.service';
import { TagManagementService } from '../tag-management.service';

describe('AddUserComponent', () => {
  let component: AddTagManagementComponent;
  let fixture: ComponentFixture<AddTagManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule,
        FileUploadModule
      ],
      declarations: [AddTagManagementComponent],
      providers: [ApiService, TagManagementService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTagManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
