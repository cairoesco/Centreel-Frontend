import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTagManagementComponent } from './edit-tag-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { ApiService } from 'src/app/api.service';
import { TagManagementService } from '../tag-management.service';

describe('AddUserComponent', () => {
  let component: TagManagementService;
  let fixture: ComponentFixture<TagManagementService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule,
        FileUploadModule
      ],
      declarations: [TagManagementService],
      providers: [ApiService, TagManagementService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagManagementService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
