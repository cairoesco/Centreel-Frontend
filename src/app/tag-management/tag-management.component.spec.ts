import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagManagementComponent } from './tag-management.component';

describe('CustomerComponent', () => {
  let component: TagManagementComponent;
  let fixture: ComponentFixture<TagManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TagManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
