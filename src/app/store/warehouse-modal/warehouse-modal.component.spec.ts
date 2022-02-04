import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseModalComponent } from './warehouse-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreService } from '../store.service';
import { ApiService } from 'src/app/api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('WarehouseModalComponent', () => {
  let component: WarehouseModalComponent;
  let fixture: ComponentFixture<WarehouseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [ WarehouseModalComponent ],
      providers:[
        ApiService,
        StoreService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
