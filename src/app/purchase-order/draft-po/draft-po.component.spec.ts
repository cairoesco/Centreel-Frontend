import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftPoComponent } from './draft-po.component';

describe('DraftPoComponent', () => {
  let component: DraftPoComponent;
  let fixture: ComponentFixture<DraftPoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
