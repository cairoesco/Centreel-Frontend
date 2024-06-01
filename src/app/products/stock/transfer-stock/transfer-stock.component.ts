import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ViewEncapsulation, Inject, OnInit } from '@angular/core';
import { Validators, UntypedFormBuilder, UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { StockService } from '../stock.service'
import { UtilsServiceService } from '../../../shared/services/utils-service.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-transfer-stock',
  templateUrl: './transfer-stock.component.html',
  styleUrls: ['./transfer-stock.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class TransferStockComponent implements OnInit {
  public productVariantStockTransferForm: UntypedFormGroup;
  public dataArray: any = [];
  public indexofSourceStock: number;
  public sourceStock: any;
  public availableStockTransfer: any;
  public storage_name: string;
  public product_unit: string;
  public header: any;
  public changes: any = {};
  public showMessage: boolean = false;
  public countStock: number = 0;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<TransferStockComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public stockService: StockService,
    public decimalPipe: DecimalPipe,
    public utility: UtilsServiceService
  ) {
    this.dataArray = [];
    this.dataArray.push(data);
    this.indexofSourceStock = data.index;
    this.header = data.header;
    this.sourceStock = data.data;
    this.storage_name = data.storage_name;
    this.product_unit = data.product_unit;
    this.productVariantStockTransferForm = this.createProductVariantStockTransferForm();
    const control = <UntypedFormArray>this.productVariantStockTransferForm.controls['products'];
    this.dataArray.forEach((element:any) => {
      control.push(this.addproducts(element.data));
    });
  }

  ngOnInit() {
    //Close dialog on route change
    this.router.events.subscribe(() => {
      this.dialogRef.close();
    });
  }

  transferStock(event) {
    this.countStock = 0;
    var tempData = this.productVariantStockTransferForm.get('products').value;
    var tempData2 = tempData[0].productVariants;
    tempData2.forEach(element => {
      this.countStock = +this.countStock + +element.value_added;
    });

    if (this.countStock > this.availableStockTransfer) {
      this.showMessage = true;
      event.target.value = "";
    } else {
      this.showMessage = false;
    }
  }

  createProductVariantStockTransferForm() {
    return this._formBuilder.group({
      products: this._formBuilder.array([])
    });
  }

  private addproducts(parentData:any) {
    let variant_name='';
    let storage_stock=0;
    let variant_id;
    if(Boolean(parentData)){
      variant_name=Boolean(parentData.variant_name)?parentData.variant_name:'';
      storage_stock=Boolean(parentData.storage_stock)?parentData.storage_stock:0;
      variant_id=Boolean(parentData.variant_id)?parentData.variant_id:0;
    }
    return this._formBuilder.group({
      name: [variant_name],
      productVariants: this.addproductVariants(storage_stock, variant_id)
    });
  }

  private addproductVariants(variants, variantsID) {
    let regx=(this.product_unit!='pcs')?'^[0-9]+(\.[0-9][0-9]?)?':'^[0-9]*$';
    let arr = new UntypedFormArray([])
    for (var j = 0; j < variants.length; j++) {
      arr.push(this._formBuilder.group({
        variant_id: [variantsID],
        product_id: [this.data.productId],
        storage_id: [this.header[j].storage_id],
        store_id: [this.header[j].store_id],
        location_short: [this.header[j].location_short],
        latitude: [this.header[j].latitude],
        longitude: [this.header[j].longitude],
        storage_name: [this.header[j].storage_name],
        total_stock: [variants[j], [Validators.required]],
        value_added: ['',Validators.compose([Validators.pattern(regx)])],
        index: [this.data.index],
        source_page: ['stock_transfer'],
      }))
    }
    return arr;
  }

  onSubmit() {
    let source = JSON.stringify(this.productVariantStockTransferForm.get('products').value[0].productVariants);
    let sourceStore = JSON.parse(source).splice(this.indexofSourceStock - 2, 1);
    let destination = this.productVariantStockTransferForm.get('products').value[0].productVariants;
    
    if (this.productVariantStockTransferForm.valid) {
      if (this.countStock > 0) {
        if (this.countStock <= +(sourceStore[0].total_stock)) {
          sourceStore[0].trf_qty = this.countStock;
          let form_data = new FormData();
          let destinationStore = [];
          destination.forEach(element => {
            if (Boolean(element.value_added) && element.value_added != "0") {
              destinationStore.push(element);
            }
          });
          form_data.append("source", JSON.stringify(sourceStore));
          form_data.append("destination", JSON.stringify(destinationStore));
          this.stockService.transferStock(form_data).subscribe((response: any) => {
            if (response.success) {
              this.utility.showSnackBar(response.message);
              this.dialogRef.close(destinationStore);
            }
          })
        } else {
          this.utility.showSnackBar('Cannot transfer more than available stock!', { panelClass: 'error' });
        }
      } else {
        this.utility.showSnackBar('Please enter quantity greater than 0', { panelClass: 'error' });
      }
    }
  }

  //Format number in decimal format
  formatNumber(n, product_unit) {
    if (product_unit == 'pcs')
      return this.decimalPipe.transform(parseInt(n), '1.0');
    else
      return this.decimalPipe.transform(parseFloat(n), '1.2-2');
  }
}