import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagManagementFilterDialogComponent } from './tag-management-filter-dialog.component';

describe('TagManagementFilterDialogComponent', () => {
  let component: TagManagementFilterDialogComponent;
  let fixture: ComponentFixture<TagManagementFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagManagementFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagManagementFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
