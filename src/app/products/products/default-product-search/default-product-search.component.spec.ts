import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DefaultProductSearchComponent } from './default-product-search.component';

describe('DefaultProductSearchComponent', () => {
  let component: DefaultProductSearchComponent;
  let fixture: ComponentFixture<DefaultProductSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultProductSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultProductSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
