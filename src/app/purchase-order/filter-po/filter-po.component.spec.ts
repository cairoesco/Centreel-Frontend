import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterPoComponent } from './filter-po.component';

describe('FilterPoComponent', () => {
  let component: FilterPoComponent;
  let fixture: ComponentFixture<FilterPoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
