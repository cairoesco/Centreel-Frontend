import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerFilterDialogComponent } from './customer-filter-dialog.component';

describe('CustomerFilterDialogComponent', () => {
  let component: CustomerFilterDialogComponent;
  let fixture: ComponentFixture<CustomerFilterDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
