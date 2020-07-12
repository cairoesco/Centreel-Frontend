import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferStockComponent } from './transfer-stock.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { StockService } from '../stock.service';
import { ApiService } from 'src/app/api.service';
import { DecimalPipe } from '@angular/common';

describe('TransferStockComponent', () => {
  let component: TransferStockComponent;
  let fixture: ComponentFixture<TransferStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientModule,
        SharedModule],
      declarations: [ TransferStockComponent ],
      providers:[
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        StockService,ApiService,DecimalPipe
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
