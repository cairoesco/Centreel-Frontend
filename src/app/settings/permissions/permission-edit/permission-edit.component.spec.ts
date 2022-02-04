import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionEditComponent } from './permission-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from 'src/app/api.service';

describe('PermissionEditComponent', () => {
  let component: PermissionEditComponent;
  let fixture: ComponentFixture<PermissionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [ PermissionEditComponent ],
      providers:[ApiService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
