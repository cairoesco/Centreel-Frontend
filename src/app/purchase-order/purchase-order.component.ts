import { Component, OnInit, ElementRef,Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { FilterComponent } from '../dialog/filter/filter.component'
import { Router } from '@angular/router';
import { PurchaseOrderService } from './purchase-order.service';
import { UtilsServiceService } from '../shared/services/utils-service.service';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { FilterPoComponent } from './filter-po/filter-po.component';
import { SharedService } from '../shared/shared.service';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PurchaseOrderComponent implements OnInit {
  @Input() name: string = "Abdul";
  public purchaseOrderData: any;
  public rows = [];
  public total_count;
  public dynamicHeight = "";
  public inProgress: boolean = false;
  constructor(public dialog: MatDialog, private router: Router, private api: PurchaseOrderService, public utils: UtilsServiceService,private el: ElementRef,public fb: UntypedFormBuilder) { }

  readonly headerHeight = 50;
  readonly rowHeight = 50;
  isLoading: boolean;

  public newrows: any[] = [];
  productobj: any = new Object();

  public pageSize: any = 20;
  public pageIndex: any = 0;

  //new
  public filterForm: UntypedFormGroup;
  form_obj: any = new Object();

  minDate = moment("2018-01-01");
  maxDate = moment();
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };


  //datepicker range
  selected = {  start: moment().startOf('month'), end: moment() };
  alwaysShowCalendars: boolean;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  //datepicker range
  isInvalidDate = (m: moment.Moment) =>  m.isAfter(moment())
  //new

  /***************** List of PO ********************/
  scrollEnable : boolean = false;
  onScroll(offsetY: number) {
    const viewHeight = this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;
    if ((offsetY + viewHeight) >= (this.newrows.length * this.rowHeight)) {
      if(!this.scrollEnable){
        this.scrollEnable = true;
        this.pageIndex = this.productobj.pageIndex + 1;
        this.getPOList(this.pageSize, this.pageIndex);
      }
    }

  }
  getPOList(pageSize, pageIndex) {
    this.inProgress = true;
    if (this.newrows.length == 0) {
      this.isLoading = true;
    }
    this.productobj.pageSize = pageSize;
    this.productobj.pageIndex = pageIndex;

    this.api.getPoDetails(this.productobj)
      .subscribe((response: any) => {
        this.inProgress = false;
        this.scrollEnable = false;
        if (response.success) {
          this.total_count = response.total_count;
          this.purchaseOrderData = response.data;
          this.rows = this.purchaseOrderData;

          if (this.rows.length == 0 && this.productobj.pageIndex == 0)
            this.newrows = this.rows
          else
            this.newrows.push(...this.rows)
          // this.newrows.push(...this.rows)
          this.newrows = [...this.newrows]
          this.dynamicHeight = this.newrows.length < 12 ? ((this.newrows.length + 1) * 48 + 10) + "px" : '';
          this.isLoading = false;
        }
      });
  }

  purchaseStatusChange(po_id) {
    let formData = new FormData();
    formData.append('status',"completed");
    this.api.purchaseStatus(po_id,formData)
      .subscribe((response: any) => {
        if (response.success) {
          this.utils.showSnackBar(response.message);
          const targetIdx = this.purchaseOrderData.map(item => item.id).indexOf(po_id);
          this.purchaseOrderData[targetIdx].status ="completed";
        }
      });
  }

  /*************** Search Filter *********************/
  applyFilter1(filterValue: string) {

    this.productobj['search'] = filterValue.toLowerCase();
    this.productobj['pageIndex'] = 0;

    this.api.getPoDetails(this.productobj)
    .subscribe((response: any) => {
      this.inProgress = false;
      if (response.success) {
        this.total_count = response.total_count;
        this.purchaseOrderData = response.data;
          this.rows = this.purchaseOrderData;
          this.newrows = this.rows
          this.newrows = [...this.newrows]
          this.dynamicHeight = this.newrows.length < 12 ? ((this.newrows.length + 1) * 48 + 10) + "px" : '';
          this.isLoading = false;
      }
      else {
        this.utils.showSnackBar(response.message, { panelClass: 'error' });
      }
    });
  }
  ngOnInit() {
    this.getPOList(this.pageSize, this.pageIndex);
    this.getFilterData();
    this.initializeForm();
    this.onChanges();
  }

  //new
  initializeForm() {
    this.filterForm = this.fb.group({
      user_ids: [[]],
      po_status: [],
      // selected: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') },
      selected: [''],
    });
  }

  /* for filters */
  public filterData: any;
  public employeeData: any;
  public statusData: any;
  getFilterData() {
    this.api.getRawDetails()
      .subscribe((response: any) => {
        if (response.success) {
          this.filterData = response.data;
          this.employeeData = response.data.employees;
          this.statusData = response.data.po_status;
        }
      });
  }
  /* for filters */
 
  public filter_count= 0;
  applyFilter(evt) {
    this.form_obj = this.filterForm.getRawValue();
    
    if (this.form_obj.selected.start && this.form_obj.selected.start != null)
      var sdate = moment(this.form_obj.selected.start, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (this.form_obj.selected.end && this.form_obj.selected.end != null)
      var edate = moment(this.form_obj.selected.end, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (sdate == edate) {
      if (this.form_obj.selected.end)
        edate = moment(this.form_obj.selected.end, 'DD/MM/YYYY HH:mm:ss').add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
    }

    if (this.form_obj.selected.start && this.form_obj.selected.end && this.form_obj.selected.start != null && this.form_obj.selected.end != null) {
      this.form_obj.from_date = this.utils.get_utc_from_to_date(sdate);
      this.form_obj.to_date = this.utils.get_utc_from_to_date(edate);
    }else{
      delete this.form_obj.selected;
    }

    if (!((this.form_obj.po_status) && (this.form_obj.po_status.length) > 0)) {
      delete this.form_obj.po_status;
    }

    if (!((this.form_obj.user_ids) && (this.form_obj.user_ids.length) > 0)) {
      delete this.form_obj.user_ids;
    }
    /* filter count */
    this.filter_count = Object.keys(this.form_obj).length;
    if((this.form_obj).hasOwnProperty('selected')){
      this.filter_count = this.filter_count - 2;
    }
    /* filter count */
    
    
    this.inProgress = true;
        this.isLoading = true;
        this.productobj['pageSize'] = 20;
        this.productobj['pageIndex'] = 0;
        this.form_obj.user_ids ? this.productobj['user_ids'] = this.form_obj.user_ids ? JSON.stringify(this.form_obj.user_ids) : '' : delete this.productobj['user_ids'];
        this.form_obj.po_status ? this.productobj['po_status'] = this.form_obj.po_status ? (this.form_obj.po_status) : '' : delete this.productobj['po_status'];
        this.form_obj.from_date ? this.productobj['from_date'] = this.form_obj.from_date ? (this.form_obj.from_date) : '' : delete this.productobj['from_date'];
        this.form_obj.to_date ? this.productobj['to_date'] = this.form_obj.to_date ? (this.form_obj.to_date) : '' : delete this.productobj['to_date'];
        
        // this.filter_data = result;
        this.getPoFilterData();
    // this.dialogRef.close(this.form_obj);
  }

  close() {
    this.filterForm.reset();
    this.applyFilter('clear');
  }

  clear_date_filter(){
    this.filterForm.controls['selected'].reset();
  }

  clear_status_filter(){
    this.filterForm.controls['po_status'].reset();
  }

  clear_user_filter(){
    this.filterForm.controls['user_ids'].reset();
  }
  //new

  public search =new UntypedFormControl('');
  userChecked : boolean = false;
  statusChecked : boolean = false;
  dateChecked : boolean = false;
  onChanges(): void {
    /* filter data */
    this.filterForm.valueChanges.subscribe(val => {
      this.form_obj = this.filterForm.getRawValue();
    if (this.form_obj.selected.start && this.form_obj.selected.start != null)
      var sdate = moment(this.form_obj.selected.start, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (this.form_obj.selected.end && this.form_obj.selected.end != null)
      var edate = moment(this.form_obj.selected.end, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (sdate == edate) {
      if (this.form_obj.selected.end)
        edate = moment(this.form_obj.selected.end, 'DD/MM/YYYY HH:mm:ss').add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
    }

    if (this.form_obj.selected.start && this.form_obj.selected.end && this.form_obj.selected.start != null && this.form_obj.selected.end != null) {
      this.form_obj.from_date = this.utils.get_utc_from_to_date(sdate);
      this.form_obj.to_date = this.utils.get_utc_from_to_date(edate);
      this.dateChecked = true;
    }else{
      delete this.form_obj.selected;
      this.dateChecked = false;
    }

    if (!((this.form_obj.po_status) && (this.form_obj.po_status.length) > 0)) {
      delete this.form_obj.po_status;
      this.statusChecked = false;
    }else{
      this.statusChecked = true;
    }

    if (!((this.form_obj.user_ids) && (this.form_obj.user_ids.length) > 0)) {
      delete this.form_obj.user_ids;
      this.userChecked = false;
    }else{
      this.userChecked = true;
    }
    /* filter count */
    this.filter_count = Object.keys(this.form_obj).length;
    if((this.form_obj).hasOwnProperty('selected')){
      this.filter_count = this.filter_count - 2;
    }
    /* filter count */
    
    
    this.inProgress = true;
        this.isLoading = true;
        this.productobj['pageSize'] = 20;
        this.productobj['pageIndex'] = 0;
        this.form_obj.user_ids ? this.productobj['user_ids'] = this.form_obj.user_ids ? JSON.stringify(this.form_obj.user_ids) : '' : delete this.productobj['user_ids'];
        this.form_obj.po_status ? this.productobj['po_status'] = this.form_obj.po_status ? (this.form_obj.po_status) : '' : delete this.productobj['po_status'];
        this.form_obj.from_date ? this.productobj['from_date'] = this.form_obj.from_date ? (this.form_obj.from_date) : '' : delete this.productobj['from_date'];
        this.form_obj.to_date ? this.productobj['to_date'] = this.form_obj.to_date ? (this.form_obj.to_date) : '' : delete this.productobj['to_date'];
        
        // this.filter_data = result;
        this.getPoFilterData();
    });
    /* filter data */
    this.search.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(val => {
      this.productobj['search'] = this.search.value;
      this.productobj['pageIndex'] = 0;
      
      this.api.getPoDetails(this.productobj)
      .subscribe((response: any) => {
        this.inProgress = false;
        if (response.success) {
          this.total_count = response.total_count;
          this.purchaseOrderData = response.data;
            this.rows = this.purchaseOrderData;
            this.newrows = this.rows
            this.newrows = [...this.newrows]
            this.dynamicHeight = this.newrows.length < 12 ? ((this.newrows.length + 1) * 48 + 10) + "px" : '';
            this.isLoading = false;
        }
        else {
          this.utils.showSnackBar(response.message, { panelClass: 'error' });
        }
      });
      
    })
  }

  /* filter popup */
  public filter_data: any;
  openFilter(fdata): void {
    const dialogRef = this.dialog.open(FilterPoComponent, {
      width: '70%',
      maxWidth: "700px",
      data: { fdata }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (Boolean(result)) {
        this.inProgress = true;
        this.isLoading = true;
        this.productobj['pageSize'] = 20;
        this.productobj['pageIndex'] = 0;
        result.user_ids ? this.productobj['user_ids'] = result.user_ids ? JSON.stringify(result.user_ids) : '' : delete this.productobj['user_ids'];
        result.po_status ? this.productobj['po_status'] = result.po_status ? (result.po_status) : '' : delete this.productobj['po_status'];
        result.from_date ? this.productobj['from_date'] = result.from_date ? (result.from_date) : '' : delete this.productobj['from_date'];
        result.to_date ? this.productobj['to_date'] = result.to_date ? (result.to_date) : '' : delete this.productobj['to_date'];
        
        this.filter_data = result;
        this.getPoFilterData();
      }
    });
  }

  getPoFilterData(){
    this.api.getPoDetails(this.productobj)
    .subscribe((response: any) => {
      this.inProgress = false;
      if (response.success) {
        this.total_count = response.total_count;
        this.purchaseOrderData = response.data;
          this.rows = this.purchaseOrderData;
          this.newrows = this.rows
          this.newrows = [...this.newrows]
          this.dynamicHeight = this.newrows.length < 12 ? ((this.newrows.length + 1) * 48 + 10) + "px" : '';
          this.isLoading = false;
      }
      else {
        this.utils.showSnackBar(response.message, { panelClass: 'error' });
      }
    });
  }
  /* filter popup */

  uploadFile(event){
    this.router.navigate(['purchaseorder/po-list/create'], event);
  }
}
