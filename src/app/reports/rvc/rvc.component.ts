import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { ReportService } from '../report.service';
import { UtilsServiceService } from '../../shared/services/utils-service.service';

@Component({
  selector: 'app-rvc',
  templateUrl: './rvc.component.html',
  styleUrls: ['./rvc.component.scss']
})
export class RvcComponent implements OnInit {

  inProgress: boolean = false;
  rvc: UntypedFormGroup;
  storeList = [];
  resultdata = [];
  submitted: boolean = false;
  type: any = new Object();
  rows: any = {};
  formobj: any = new Object();
  grand_total: number = 0;
  minDate = moment("2018-01-01");
  maxDate = moment();
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  public dynamicHeight = "";
  public export_date: any;
  public store_id: any = "";
  //datepicker range
  selected = {  start: moment(), end: moment().subtract(1, 'days') };
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
  
  constructor(private router: Router,
    public reportService: ReportService,
    private formBuilder: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    public utils: UtilsServiceService) {
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    this.getStores();
    this.rvc = this.formBuilder.group({
      store_id: ['', Validators.required],
      selected: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') }
    });
    this.onChanges();
  }

  /* onchange event */
  onChanges(): void {
    this.inProgress = true;
    this.rvc.valueChanges.subscribe(val => {
      this.formobj.store_id = val.store_id || this.store_id
     var sdate = val.selected.start.format('YYYY-MM-DD HH:mm:ss');
      var edate = val.selected.end.format('YYYY-MM-DD HH:mm:ss');
      if (sdate == edate) {
        edate = val.selected.end.add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      }
      this.formobj.from_date = this.utils.get_utc_from_to_date(sdate);
      //this.formobj.end_date = this.utils.get_utc_from_to_date(edate);
      this.formobj.to_date = this.utils.get_utc_from_to_date(edate);

      var display_date = val.selected.start.format('DD/MM/YYYY');
      this.export_date = val.selected.start.format('MMMDDYYYY');

      this.formobj.date = display_date;
      if(this.formobj.store_id){
      this.reportService.getRVCReport(this.formobj)
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
    this.reportService.exportReport("rvcpdf", this.formobj).then(
      (res: HttpResponse<any>) => {
        this.reportService.downloadFile(res.body, 'application/pdf', 'Closeout Report ' + this.export_date);
      });
  }
  /* download pdf */

  /* download CSV */
  getExportCSV(ext) {
    this.formobj.ext = ext;
    this.reportService.exportReport("rvccsv", this.formobj).then(
      (res: HttpResponse<any>) => {
        if (ext == 'csv') {
          this.reportService.downloadFile(res.body, 'text/csv', 'Closeout Report ' + this.export_date);
        } else if (ext == 'xls') {
          this.reportService.downloadFile(res.body, 'application/vnd.ms-excel', 'Closeout Report ' + this.export_date);
        }
      });
  }
  /* download CSV */

  /* Get Store list */
  getStores() {
    this.reportService.getStores()
      .subscribe((response: any) => {
        this.storeList = response.data.stores;
        if (response.data.stores.length > 0) {
          this.rvc.patchValue({ store_id: this.storeList[0].store_id });
          this.store_id = this.storeList[0].store_id
        }
      });
  }

  reset_form() {
    this.rvc.patchValue({selected : {  start: moment(), end: moment().subtract(1, 'days') }  });
  }
}