import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountFilterDialogComponent } from './discount-filter-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApiService } from 'src/app/api.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('UserFilterDialogComponent', () => {
  let component: DiscountFilterDialogComponent;
  let fixture: ComponentFixture<DiscountFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [DiscountFilterDialogComponent],
      providers: [
        ApiService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
