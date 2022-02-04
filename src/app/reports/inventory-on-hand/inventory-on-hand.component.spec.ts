import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOnHandComponent } from './inventory-on-hand.component';

describe('InventoryOnHandComponent', () => {
  let component: InventoryOnHandComponent;
  let fixture: ComponentFixture<InventoryOnHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryOnHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryOnHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
