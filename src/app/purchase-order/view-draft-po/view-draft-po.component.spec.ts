import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewDraftPoComponent } from './view-draft-po.component';

describe('ViewDraftPoComponent', () => {
  let component: ViewDraftPoComponent;
  let fixture: ComponentFixture<ViewDraftPoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDraftPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDraftPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
