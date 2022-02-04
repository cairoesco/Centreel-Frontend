import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionAddComponent } from './permission-add.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApiService } from 'src/app/api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('PermissionAddComponent', () => {
  let component: PermissionAddComponent;
  let fixture: ComponentFixture<PermissionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [ PermissionAddComponent ],
      providers:[ApiService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
