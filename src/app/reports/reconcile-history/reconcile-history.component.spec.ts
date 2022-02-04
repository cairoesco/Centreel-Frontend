import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconcileHistoryComponent } from './reconcile-history.component';

describe('ReconcileHistoryComponent', () => {
  let component: ReconcileHistoryComponent;
  let fixture: ComponentFixture<ReconcileHistoryComponent>;

  beforeEach(async(() => {
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
