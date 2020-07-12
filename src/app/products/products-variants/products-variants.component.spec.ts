import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsVariantsComponent } from './products-variants.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../product.service';
import { ApiService } from 'src/app/api.service';

describe('ProductsVariantsComponent', () => {
  let component: ProductsVariantsComponent;
  let fixture: ComponentFixture<ProductsVariantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [ ProductsVariantsComponent ],
      providers: [ProductService, ApiService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsVariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
