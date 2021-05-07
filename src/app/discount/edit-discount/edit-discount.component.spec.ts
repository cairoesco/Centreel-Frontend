import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDiscountComponent } from './edit-discount.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from 'src/app/api.service';
import { DiscountService } from '../discount.service';
import { FileUploadModule } from 'ng2-file-upload';

describe('EditDiscountComponent', () => {
  let component: EditDiscountComponent;
  let fixture: ComponentFixture<EditDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule,
        FileUploadModule
      ],
      declarations: [ EditDiscountComponent ],
      providers:[ApiService,DiscountService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
