import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmComponent } from './delete-confirm.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';

describe('DeleteConfirmComponent', () => {
  let component: DeleteConfirmComponent;
  let fixture: ComponentFixture<DeleteConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [ 
        DeleteConfirmComponent,
      ],
        providers:[
          ApiService,
          { provide: MAT_DIALOG_DATA, useValue: {} },
          { provide: MatDialogRef, useValue: {} },
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
