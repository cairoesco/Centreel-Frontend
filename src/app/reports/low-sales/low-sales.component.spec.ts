import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LowSalesComponent } from './low-sales.component';

describe('InventoryOnHandComponent', () => {
  let component: LowSalesComponent;
  let fixture: ComponentFixture<LowSalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LowSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});