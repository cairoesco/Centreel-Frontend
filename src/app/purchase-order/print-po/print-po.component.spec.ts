import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrintPoComponent } from './print-po.component';

describe('PrintPoComponent', () => {
  let component: PrintPoComponent;
  let fixture: ComponentFixture<PrintPoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
