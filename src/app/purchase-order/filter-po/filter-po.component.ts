import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { PurchaseOrderService } from '../purchase-order.service';
import * as moment from 'moment';
import { UtilsServiceService } from '../../shared/services/utils-service.service';

@Component({
  selector: 'app-filter-po',
  templateUrl: './filter-po.component.html',
  styleUrls: ['./filter-po.component.scss']
})
export class FilterPoComponent implements OnInit {

  public filterForm: UntypedFormGroup;
  form_obj: any = new Object();

  user_ids: any;
  po_status: any;
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
  
  constructor(private api: PurchaseOrderService, public dialogRef: MatDialogRef<FilterPoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public router: Router, public fb: UntypedFormBuilder, private utils: UtilsServiceService) {
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    this.getFilterData();
    this.initializeForm()
    if (this.data.fdata)
      this.filterForm.patchValue(this.data.fdata);
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      user_ids: [[]],
      po_status: [],
      // selected: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') },
      selected: [''],
    });
  }
  applyFilter(evt) {
    this.form_obj = this.filterForm.getRawValue();
    // if (evt != 'clear' && !this.form_obj.selected.start && !this.form_obj.selected.start) {
    //   this.filterForm.controls['selected'].setValue({ start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') });
    //   this.form_obj = this.filterForm.getRawValue();
    // }
    
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
    this.dialogRef.close(this.form_obj);
  }


  close() {
    this.filterForm.reset();
    this.applyFilter('clear');
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
}
