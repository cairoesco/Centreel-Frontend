import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferredProductDialogComponent } from './preferred-product-dialog.component';

describe('PreferredProductDialogComponent', () => {
  let component: PreferredProductDialogComponent;
  let fixture: ComponentFixture<PreferredProductDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferredProductDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferredProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
