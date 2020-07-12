import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingMailComponent } from './marketing-mail.component';
import { SharedModule } from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MarketingMailComponent', () => {
  let component: MarketingMailComponent;
  let fixture: ComponentFixture<MarketingMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[SharedModule,BrowserAnimationsModule],
      declarations: [ MarketingMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
