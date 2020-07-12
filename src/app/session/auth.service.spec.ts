import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { MenuService } from '../core/menu/menu.service';
import { SharedService } from '../shared/shared.service';
import { ApiService } from '../api.service';
import { AuthGuardService } from './authguard.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule,
        MatSnackBarModule
      ],
      providers: [AuthService,MenuService,SharedService,ApiService,AuthGuardService]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
