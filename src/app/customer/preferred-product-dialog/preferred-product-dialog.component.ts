import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsServiceService } from 'src/app/shared/services/utils-service.service';
import {CustomerService} from '../customer.service'

@Component({
  selector: 'app-preferred-product-dialog',
  templateUrl: './preferred-product-dialog.component.html',
  styleUrls: ['./preferred-product-dialog.component.scss']
})
export class PreferredProductDialogComponent implements OnInit {

  public products:any[];

  products_temp = [
    { id: 1, 
      product_id: 1,
      variant_id:1 ,
      variant_name:'',
      product_name: 'RENEW', 
      product_highlights: 'Solei Renew ',
      price: 123, 
      type:'indica',
      product_unit:'pcs' ,
      product_type_name:'Cannabis',
      product_thc:'0.00',product_cbd:'0.00',
      product_category_name:'Concentrates - CO2 Oil',
      product_category_theme:'#E7F5FD',
      product_category_font_color:'#0099F2',
      image: 'https://cdn.shopify.com/s/files/1/0007/0215/2760/products/1002740_ALT1_700x700.progressive.png.jpg?v=1547050778' 
      },
  ]

  constructor(private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<PreferredProductDialogComponent>,
    public utils: UtilsServiceService,
    @Inject(MAT_DIALOG_DATA) public data: PreferredProductDialogComponent, public customerService:CustomerService) {
  }
  ngOnInit() {
    this.GetCustomerPreferredProductList();
  }

  GetCustomerPreferredProductList(){
    this.customerService.getCustomerPreferredProductList(this.data.data).subscribe((response:any)=>{
        if(response.success)
        {
          this.products= response.data
        }
    })
  }
}
