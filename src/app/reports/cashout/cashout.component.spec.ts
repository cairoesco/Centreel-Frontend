import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CashoutComponent } from './cashout.component';

describe('CashoutComponent', () => {
  let component: CashoutComponent;
  let fixture: ComponentFixture<CashoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CashoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
