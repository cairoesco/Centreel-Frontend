import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-time-tracking',
  templateUrl: './time-tracking.component.html',
  styleUrls: ['./time-tracking.component.scss']
})
export class TimeTrackingComponent implements OnInit {

  inProgress: boolean = false;
  timesheet: UntypedFormGroup;
  storeList = [];
  type: any = new Object();
  rows = [];
  formobj: any = new Object();
  minDate = moment("2018-01-01");
  maxDate = moment();
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  public dynamicHeight = "";
  public export_date = moment().format('MMMDDYYYY');
  public store_id: any = "";

  //datepicker
  selected = {  start: moment(), end: moment().subtract(1, 'days') };
  alwaysShowCalendars: boolean;
  //datepicker
  isInvalidDate = (m: moment.Moment) =>  m.isAfter(moment())
  
  constructor(private router: Router,
    public reportService: ReportService,
    private formBuilder: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private utils: UtilsServiceService) {
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    this.getStores();
    this.timesheet = this.formBuilder.group({
      store_id: ['', Validators.required],
      selected: { start: moment().format('DD/MM/YYYY') , end: moment().format('DD/MM/YYYY') }
    });
    this.onChanges();
  }

  /* Get Store list */
  getStores() {
    this.reportService.getStores()
      .subscribe((response: any) => {
        this.storeList = response.data.stores;
        if (response.data && response.data.stores.length > 0) {
          this.timesheet.patchValue({ store_id: this.storeList[0].store_id });
          this.store_id = this.storeList[0].store_id; 
        }
      });
  }

  /* onchange event */
  onChanges(): void {
    this.inProgress = true;
    var TZ = this.utils.getTimeZone(); //timezone
    this.timesheet.valueChanges.subscribe(val => {
      this.formobj.store_id = val.store_id || this.store_id;
      this.formobj.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.formobj.tz = encodeURIComponent(TZ);
     var sdate = val.selected.start.format('YYYY-MM-DD HH:mm:ss');
      var edate = val.selected.end.format('YYYY-MM-DD HH:mm:ss');
      if (sdate == edate) {
        edate = val.selected.end.add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      }
      this.formobj.from_date = this.utils.get_utc_from_to_date(sdate);
      this.formobj.to_date = this.utils.get_utc_from_to_date(edate);
      
      let params = 'store_id=' + this.formobj.store_id + '&from_date=' + this.formobj.from_date + '&to_date=' + this.formobj.to_date + '&tz=' + encodeURIComponent(TZ) + '&timezone=' + this.formobj.timezone; 
      // this.reportService.getTimesheetEmployeeReport(this.formobj)
      if(this.formobj.store_id){
      this.reportService.getTimesheetEmployeeReport(params)
        .subscribe((response: any) => {
          this.inProgress = false;
          this.rows = response.data;
          this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 2) * 48 + 10) + "px" : '';
        },
          err => {
            this.inProgress = false;
          }
        );
        }
    });
  }
  /* onchange event */

  /* download pdf */
  getExportPDF() {
    this.reportService.exportReport("users/userReportpdf", this.formobj).then(
      (res: HttpResponse<any>) => {
        this.reportService.downloadFile(res.body, 'application/pdf', 'Time Tracking Report '+this.export_date);
      });
  }
  /* download pdf */

  /* download CSV and EXCEL */
  getExportCSV(ext) {
    this.formobj.ext = ext;
    this.reportService.exportReport("users/userReportcsv", this.formobj).then(
      (res: HttpResponse<any>) => {
        if (ext == 'csv') {
          this.reportService.downloadFile(res.body, 'text/csv', 'Time Tracking Report '+this.export_date);
        } else if (ext == 'xls') {
          this.reportService.downloadFile(res.body, 'application/vnd.ms-excel', 'Time Tracking Report '+this.export_date);
        }
      });
  }
  /* download CSV and EXCEL */

  reset_form() {
    this.timesheet.patchValue({selected:{  start: moment(), end: moment().subtract(1, 'days') }});
  }

}
