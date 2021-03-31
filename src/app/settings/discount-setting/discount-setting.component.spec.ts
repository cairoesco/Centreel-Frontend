import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountSettingComponent } from './discount-setting.component';

describe('DiscountSettingComponent', () => {
  let component: DiscountSettingComponent;
  let fixture: ComponentFixture<DiscountSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
