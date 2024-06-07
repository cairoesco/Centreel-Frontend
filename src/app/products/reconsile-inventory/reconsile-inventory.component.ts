import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpResponse } from '@angular/common/http';
import { ProductService } from '../product.service';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { FilterReconcileDialogComponent } from './filter-dialog/filter-dialog.component';

// import { CollectionView } from 'wijmo/wijmo';
// import * as wjcGrid from 'wijmo/wijmo.grid';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { HotTableRegisterer } from '@handsontable/angular';
import * as moment from 'moment';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-reconsile-inventory',
  templateUrl: './reconsile-inventory.component.html',
  styleUrls: ['./reconsile-inventory.component.scss']
})
export class ReconsileInventoryComponent implements OnInit {
  inProgress: boolean = false;
  sales_template = [];
  formobj: any = new Object();
  result_data: any = [];
  public dynamicHeight = "";
  public temp: any = [];
  public storeList: any = [];
  public storeID: any;
  inventory_reconcile: UntypedFormGroup;
  isCannabis: boolean = true;

  dataObject: any;
  settings: any;

  minDate = moment("2018-01-01");
  maxDate = moment();
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };

  //datepicker
  selected = {  start: moment().startOf('month'), end: moment() };
  alwaysShowCalendars: boolean;
  //datepicker
  isInvalidDate = (m: moment.Moment) =>  m.isAfter(moment())
  private hotRegisterer = new HotTableRegisterer();
  id = 'hotInstance';

  public barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    //buttonColor: 'primary',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }

  constructor(public dialog: MatDialog,
    public productService: ProductService,
    public utility: UtilsServiceService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    this.getStores();
    this.inventory_reconcile = this.formBuilder.group({
      product_type: ['cannabis'],
      store_id: [''],
      has_stock: [false],
      selected: { start: moment().format('DD/MM/YYYY HH:mm:ss'), end: moment().format('DD/MM/YYYY') }
    });
  }
  openFilter(): void {
    let fdata = this.formobj
    const dialogRef = this.dialog.open(FilterReconcileDialogComponent, {
      width: '70%',
      maxWidth: "700px",
      data: { fdata }
    });
    dialogRef.afterClosed().subscribe(val => {
      if (Boolean(val)) {
        this.onChanges(val)
      }
    });
  }

  /* onchange event */
  onChanges(data): void {

    this.inProgress = true;
    let val = data;
    this.formobj.type = val.product_type
    this.formobj.store_id = val.store_id
    val.has_stock = val.has_stock ? 0 : 1;
    this.formobj.has_stock = val.has_stock


    this.productService.getInventoryData(this.formobj)
      .subscribe((response: any) => {
        this.inProgress = false;
        //this.result_data = response.data;
        if (val.product_type == 'cannabis') {
          this.result_data = _.filter(response.data, function (o) {
            // if (o.product_type_slug == val.product_type)
            //   o.selling_price = '$ ' + o.selling_price
            return o.product_type_slug == val.product_type;
          });
          this.isCannabis = true;
        }
        else if (val.product_type == 'all') {
          this.result_data = response.data;
          this.isCannabis = true;
        }
        else {
          this.result_data = _.filter(response.data, function (o) { return o.product_type_slug != 'cannabis'; });
          this.isCannabis = false;
        }


        this.settings = {
          //data: this.result_data, 
          columns: [
            // {
            //   data: 'variant_sku',
            //   editor: false,
            //   width: 100
            // },
            // {
            //   data: 'description',
            //   width: 300,
            //   editor: false
            // },
            // {
            //   data: 'variant_name',
            //   width: 200,
            //   editor: false
            // },
            // {
            //   data: 'available_qty',
            //   editor: false
            // },
            // {
            //   data: 'total_selling_amount',
            //   editor: false,
            //   width: 100
            // },
            // {
            //   data: 'product_category_name',
            //   editor: false,
            //   width: 100
            // },
            // {
            //   data: 'vendor_name',
            //   editor: false,
            //   width: 100
            // },
            // {
            //   data: 'batch_no',
            //   editor: false
            // },
            // {
            //   data: 'storage_name',
            //   width: 200,
            //   editor: false
            // },
            // {
            //   data: 'reorder',
            //   editor: false
            // },
            // {
            //   data: 'available_qty',
            //   width: 100
            // },
            // {
            //   data: 'reason',
            //   type: 'dropdown',
            //   source: ["Damaged", "Theft", "Destroyed"],
            // }
          ],

          // stretchH: 'all',
          // autoWrapRow: true,
          // maxRows: 22,
          // manualRowResize: true,
          // manualColumnResize: true,
          // manualRowMove: true,
          // manualColumnMove: true,
          // contextMenu: true,
          // dropdownMenu: true,
          //   width: 1600,
          //   height: 700,
          //   rowHeaders: true,
          //   colHeaders: [
          //     'SKU',
          //     'DESCRIPTION',
          //     'SIZE',
          //     'ON HAND',
          //     'TOTAL BY SELLING PRICE',
          //     'CATEGORY',
          //     'VENDOR',
          //     'BATCH',
          //     'WAREHOUSE',
          //     'REORDER',
          //     'ACTUAL QUANTITY',
          //     'REASON'
          //   ],
          //  filters: true,
        }


        this.dynamicHeight = this.result_data.length < 12 ? ((this.result_data.length + 2) * 55 + 20) + "px" : '';

        this.temp = this.result_data;
      },
        err => {
          this.inProgress = false;
        }
      );
  }
  /* onchange event */

  getStores() {
    this.productService.getStoresList()
      .subscribe((response: any) => {
        this.storeList = response.data.stores;
        if (this.storeList.length > 0) {
          //this.getInventoryReportData(this.storeList[0].store_id);
          this.inventory_reconcile.patchValue({ store_id: this.storeList[0].store_id });
          this.formobj.type = 'cannabis';
          this.onChanges(this.inventory_reconcile.value)
        }
      });
  }
  getInventoryReportData(store_id) {
  }
  applyFilter(filterValue: string) {
    const val = filterValue.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.description.toLowerCase().indexOf(val) !== -1 || d.variant_sku.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.result_data = temp;
    this.dynamicHeight = this.result_data.length < 12 ? ((this.result_data.length + 2) * 55 + 20) + "px" : '';
  }

  data: any;
  not_number: boolean = false;
  submittedData: any = [];
  onSubmit() {
    this.submittedData = this.hotRegisterer.getInstance(this.id).getData()
    var sdate = moment(this.inventory_reconcile.controls.selected.value.start, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    // let date = this.utility.get_utc_from_to_date(sdate);
    var date;

    let selected_date = moment(this.inventory_reconcile.controls.selected.value.start, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD');
    let today = moment().format('YYYY-MM-DD'); 
    
    if(selected_date == today){
      date = this.utility.get_utc_from_to_date(sdate);
    }else{
      let current_time = moment().format('HH:mm:ss');
      let pastDate = selected_date +' '+ current_time;
      date = this.utility.get_utc_from_to_date(pastDate);
    }
    
    let displayDate = moment(this.inventory_reconcile.controls.selected.value.start, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY');

    let updatedData: any = [];
    this.submittedData.forEach((element, i) => {
      let data: any = new Object();
      if(element[3] != '' || element[3] == 0){
        if (element[3] || element[3] == 0) {
          data['reason'] = element[4];
          data['storage_id'] = this.result_data[i].storage_id;
          data['variant_id'] = this.result_data[i].variant_id;
          data['stock'] = (element[3] - this.result_data[i].available_qty);
          data['batch_no'] = this.result_data[i].batch_no;
          data['source_page'] = 'add_reconcile';
          if ((element[3]) && isNaN(element[3])) {
            this.not_number = true;
          } else {
            this.not_number = false;
          }
          updatedData.push(data);
        }
      }
    });
    if (updatedData.length>0) {
      let product_count = updatedData.length;
      let userData = this.utility.getSessionData('currentUser');
      // let uname = (userData.name).toUpperCase();
      let uname = (userData.name).bold();

      // let new_message = "<p>Hey "+ uname +", <br/>Please confirm that you’ve selected the correct date for your reconcile, <b>"+ displayDate +"</b> <br/>Double check, there’s no going back once you click confirm!</p>"
      let new_message = "<p>"+ uname +", <br/>Have you selected the correct date for your reconcile?<br/><b>"+ displayDate +"</b> <br/>Please double-check, you can’t undo this action</p>"
      
      /* confirmation dialogue */
      this.utility.confirmDialog({ title: 'Confirm Inventory Adjustments', message: new_message, okButton: 'SAVE', cancelButton: 'REVIEW' }).subscribe((result: any) => {
        if (Boolean(result)) {
          if (this.not_number) {
            this.utility.showSnackBar("Please add valid quantity", { panelClass: 'error' });
          } else {
            const formData = new FormData();
            formData.append('store_id', this.formobj.store_id);
            formData.append('date', date);
            formData.append('reconcile_data', JSON.stringify(updatedData));
            this.barButtonOptions.active = true;
            this.barButtonOptions.text = 'Saving...';
            this.productService.reconsileInventoryData(formData).subscribe((response: any) => {
              if (response.success) {
                this.barButtonOptions.active = false;
                this.barButtonOptions.text = 'SAVE';
                this.utility.showSnackBar(response.message);
                // this.getInventoryReportData(this.storeID)
                let pro_type = this.inventory_reconcile.get('product_type').value;
                this.inventory_reconcile.patchValue({ product_type: pro_type });
                this.getStores();
                //this.onChanges();
              } else {
                this.barButtonOptions.active = false;
                this.barButtonOptions.text = 'SAVE';
              }
            },
              err => {
                this.barButtonOptions.active = false;
                this.barButtonOptions.text = 'SAVE';
              });
          }
        }
      })
      /* confirmation dialogue */
    } else {
      // this.utility.showSnackBar("Please select reason and add quantity", { panelClass: 'error' });
      this.utility.showSnackBar("No changes detected", { panelClass: 'error' });
    }
  }

  // @HostListener('window:beforeunload', ['$event'])
  //  onWindowClose(event: any): void {
  //    this.canDeactivate();
  // }

  /* my code */
  async canDeactivate() {
    var result_dt = await this.getConfirmData();
    if (Boolean(result_dt)) {
      return true;
    } else {
      return false;
    }
  }

  async getConfirmData(): Promise<any> {

    let filled_data = 0;
    this.submittedData = this.hotRegisterer.getInstance(this.id).getData();
    this.submittedData.forEach((element, i) => {
      if (element[3] || element[3] == 0) {
        filled_data = 1;
      }
    })

    if (filled_data) {
      return this.utility.confirmDialog({ title: 'Please confirm the action', message: 'Are you sure you\'d like to leave the page? You\'ll lose all your progress?', okButton: 'LEAVE', cancelButton: 'CANCEL' }).toPromise();
    } else {
      return true;
    }
  }
  /* my code */

  // product type dropdown
  product_type = [{ product_type_slug: 'non cannabis', product_name: 'Non-Cannabis' }, { product_type_slug: 'cannabis', product_name: 'Cannabis' }, { product_type_slug: 'all', product_name: 'All' }]
}
