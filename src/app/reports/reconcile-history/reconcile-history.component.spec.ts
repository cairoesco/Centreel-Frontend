import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReconcileHistoryComponent } from './reconcile-history.component';

describe('ReconcileHistoryComponent', () => {
  let component: ReconcileHistoryComponent;
  let fixture: ComponentFixture<ReconcileHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconcileHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconcileHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
