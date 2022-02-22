import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReconsileInventoryComponent } from './reconsile-inventory.component';

describe('ReconsileInventoryComponent', () => {
  let component: ReconsileInventoryComponent;
  let fixture: ComponentFixture<ReconsileInventoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconsileInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconsileInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
