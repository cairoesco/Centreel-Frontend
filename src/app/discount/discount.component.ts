import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TagComponent } from '../dialog/tag/tag.component'
import { DiscountService } from './discount.service'
import * as _ from 'lodash';
import { DeleteConfirmComponent } from '../dialog/delete-confirm/delete-confirm.component';
import { UtilsServiceService } from '../shared/services/utils-service.service';
import { DiscountFilterDialogComponent } from './discount-filter-dialog/discount-filter-dialog.component';
import { AddDiscountComponent } from './add-discount/add-discount.component';


@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
})

export class DiscountComponent {
  public inProgress: boolean = false;
  public name: string;
  public Discounts: any[] = [];
  public rows: any[] = [];
  public expanded: any = {};
  public timeout: any;
  public selected = [];
  public temp: any = [];
  public expandedall: boolean = false;
  public dynamicHeight = "";

  public temp_storeID: any;
  public temp_discountType: any;
  public temp_status: any;
  public temp_discountValue: any;

  @ViewChild('myTable') table: any;
  constructor(public dialog: MatDialog,
    private discountService: DiscountService,
    private utils: UtilsServiceService,
    public refVar: ChangeDetectorRef) {

  }
  ngOnInit() {
    this.GetDiscounts();
  }

  GetDiscounts() {
    this.inProgress = true;
    this.discountService.GetStores()
      .subscribe((response: any) => {
        if(response.success) {
           this.discountService.GetDiscountList(response.data[0].store_id)
            .subscribe(( payload: any) => {
              if(payload.success){

              this.Discounts = payload.data;
              this.rows = this.Discounts;
              this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 1) * 48 + 140) + "px" : '';
             this.temp = this.Discounts;
              }
            })

        }
        this.inProgress = false;
      });
      
  }

  applyFilter(filterValue: string) {
    const val = filterValue.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.title.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 1) * 48 + 140) + "px" : '';
    if (this.rows.length > 0 && this.table)
      this.table.offset = 0;
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onActivate(event) {
    if (event.type == 'click') {
      this.table.rowDetail.toggleExpandRow(event.row);
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  //******************************** Change discount status **************************/

  public changeDiscountStatus(discountId, evt) {
    
    // var data = {
    const  status = evt.checked ? 1 : 0
    // }
    this.discountService.changeDiscountStatus(discountId, {status})
   
      .subscribe((response: any) => {
        this.utils.showSnackBar(response.message);
      });
  }




  //******************************** Change user status End**************************/

   //******************************** Delete discounts **************************/

   public deleteDiscount(discountId){
     this.discountService.DeleteDiscount(discountId)
     .subscribe((response: any) => {
      this.utils.showSnackBar(response.message);
    });
    this.GetDiscounts();
   }

   //******************************** Delete discounts end **************************/

  //******************************** Filter popup start **************************/
  public filter_data: any;
  ApplyMultipleFilter(fdata): void {
    const dialogRef = this.dialog.open(DiscountFilterDialogComponent, {
      width: '70%',
      maxWidth:"700px",
      data: { fdata }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (Boolean(result)) {
        let filterObject = new Object();
        filterObject['store_id'] = result.store_id?JSON.stringify(result.store_id):'';
        filterObject['type'] = result.type?JSON.stringify(result.type):'';
        filterObject['values'] = result.values?JSON.stringify(result.values):'';
        filterObject['status'] = result.status?JSON.stringify(result.status):'';

        this.filter_data = result;
        this.discountService.GetDiscountFilterList(filterObject)
          .subscribe((response: any) => {
            this.inProgress = false;
            if (response.success) {
             
              this.Discounts = response.data;
              this.rows = this.Discounts;
              this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 1) * 48 + 140) + "px" : '';
              this.temp = this.Discounts;
            }
            else {
              this.utils.showSnackBar(response.message, { panelClass: 'error' });
            }
        });
      } 
    });
  }

  //******************************** Add new Discount **************************/
  // public filter_data: any;
  AddNewDiscount(): void {
    const dialogRef = this.dialog.open(AddDiscountComponent, {
      width: '70%',
      maxWidth:"700px",
     
      // data: { fdata }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (Boolean(result)) {        
        this.discountService.AddNewDiscount(result)
          .subscribe((response: any) => {
            this.inProgress = false;
            if (response.success) {
              this.GetDiscounts();
            }
            else {
              this.utils.showSnackBar(response.message, { panelClass: 'error' });
            }
        });
      } 
    });
  }

}


