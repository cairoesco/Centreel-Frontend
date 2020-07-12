import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintableMenuComponent } from './printable-menu.component';

describe('PrintableMenuComponent', () => {
  let component: PrintableMenuComponent;
  let fixture: ComponentFixture<PrintableMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintableMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintableMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
