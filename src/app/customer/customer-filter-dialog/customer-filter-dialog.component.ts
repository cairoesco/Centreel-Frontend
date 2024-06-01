import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { CustomerService } from '../customer.service';
import { from } from 'rxjs';
@Component({
  selector: 'app-customer-filter-dialog',
  templateUrl: './customer-filter-dialog.component.html',
  styleUrls: ['./customer-filter-dialog.component.scss']
})
export class CustomerFilterDialogComponent implements OnInit {


  public filterList: any;
  public form: UntypedFormGroup;
  public rawDetail: any;
  public minDate = moment("2017-01-01");
  public maxDate = moment();
  public localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  //datepicker
  selected = {  start: moment().startOf('month'), end: moment() };
  public alwaysShowCalendars: boolean;
  public ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  //datepicker
  isInvalidDate = (m: moment.Moment) =>  m.isAfter(moment())
  constructor(public dialogRef: MatDialogRef<CustomerFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public utility: UtilsServiceService,
    public customerService: CustomerService,
    public fb: UntypedFormBuilder) {
    this.filterList = this.data.data
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    //Close dialog on route change
    this.router.events.subscribe(() => {
      this.dialogRef.close();
    });
    this.initializeForm();
    if (this.data.data)
      this.form.patchValue({
        selected: this.data.data.selected,
        selected_transaction: this.data.data.selected_transaction,
        tags: JSON.parse(this.data.data.tags),
        from: this.data.data.from,
        to: this.data.data.to,
        start_txn_date: this.data.data.start_txn_date,
        end_txn_date: this.data.data.end_txn_date,
        stores: JSON.parse(this.data.data.stores),
        platform: ['web']
      });
    this.getRawData();
  }

  initializeForm() {
    this.form = this.fb.group({
      selected: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') },
      selected_transaction: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') },
      tags: [[]],
      from: [''],
      to: [''],
      start_txn_date: [''],
      end_txn_date: [''],
      stores: [[]],
      platform: ['web']
    });
  }

  getRawData() {
    this.customerService.getRawDetail()
      .subscribe((response: any) => {
        if (response.success) {
          this.rawDetail = response.data
        }
      });
  }

  applyFilter() {

    if (this.form.controls.selected.value.start)
      var sdate = this.form.controls.selected.value.start.format('YYYY-MM-DD');
    if (this.form.controls.selected.value.end)
      var edate = this.form.controls.selected.value.end.format('YYYY-MM-DD');
    if (sdate == edate) {
      if (this.form.controls.selected.value.end)
        edate = this.form.controls.selected.value.end.add(1, 'day').format('YYYY-MM-DD');
    }

    if (this.form.controls.selected_transaction.value.start)
      var transaction_start_date = this.form.controls.selected_transaction.value.start.format('YYYY-MM-DD');
    if (this.form.controls.selected_transaction.value.end)
      var transaction_end_date = this.form.controls.selected_transaction.value.end.format('YYYY-MM-DD');
    if (transaction_start_date == transaction_end_date) {
      if (this.form.controls.selected_transaction.value.end)
        transaction_end_date = this.form.controls.selected_transaction.value.end.add(1, 'day').format('YYYY-MM-DD');
    }
    this.form.controls.start_txn_date.setValue(transaction_start_date);
    this.form.controls.end_txn_date.setValue(transaction_end_date);
    this.form.controls.from.setValue(sdate);
    this.form.controls.to.setValue(edate);
    this.dialogRef.close(this.form.value);
  }

  clearFilter() {
    this.form.reset();
    this.form.patchValue({
      selected: '',
      selected_transaction: '',
      platform: 'web',
      tags: [],
      stores: []
    })
    // this.applyFilter();
  }
}
