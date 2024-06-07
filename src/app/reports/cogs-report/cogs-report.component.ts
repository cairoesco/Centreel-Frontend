import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ReportService } from '../report.service';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { formatNumber } from '@angular/common';
import { Logs } from 'selenium-webdriver';

@Component({
  selector: 'app-cogs-report',
  templateUrl: './cogs-report.component.html',
  styleUrls: ['./cogs-report.component.scss']
})
export class CogsReportComponent implements OnInit {

  public inProgress: boolean = false;
  public cogsForm: UntypedFormGroup;
  public storeList = [];
  public resultdata = [];
  public submitted: boolean = false;
  public type: any = new Object();
  public rows = [];
  public formobj: any = new Object();
  public grand_total: number = 0;
  public minDate = moment("2018-01-01");
  public maxDate = moment();
  public store_id: any = "";
  public localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  public dynamicHeight = "";
  public export_date = moment().format('MMMDDYYYY');
  
  //datepicker
  public selected = { start: moment().startOf('month'), end: moment()};
  // public selected = { start: moment().format("DD/MM/YYYY"), end: moment().format("DD/MM/YYYY") };
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

  constructor(
    private formBuilder: UntypedFormBuilder,
    public reportService: ReportService,
    public utility: UtilsServiceService) {
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    this.getStores();
    this.cogsForm = this.formBuilder.group({
      store_id: ['', Validators.required],
      selected: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') }
    });
    this.onChanges();
  }


  /* onchange event */
  onChanges(): void {
    this.inProgress = true;
    var TZ = this.utility.getTimeZone(); //timezone
    this.cogsForm.valueChanges.subscribe(val => {
      this.formobj.store_id = val.store_id || this.store_id
      this.formobj.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.formobj.tz = encodeURIComponent(TZ);
      var sdate = val.selected.start.format('YYYY-MM-DD HH:mm:ss');
      var edate = val.selected.end.format('YYYY-MM-DD HH:mm:ss');
      this.formobj.startdate = sdate;
      this.formobj.enddate = edate;
      if (sdate == edate) {
        edate = val.selected.end.add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
        this.formobj.enddate = sdate;
      }
      this.formobj.from_date = this.utility.get_utc_from_to_date(sdate);
      //this.formobj.end_date = this.utils.get_utc_from_to_date(edate);
      this.formobj.to_date = this.utility.get_utc_from_to_date(edate);

      var display_date = val.selected.start.format('DD/MM/YYYY');
      this.export_date = val.selected.start.format('MMMDDYYYY');

      var start_date = sdate;
      var to_date = edate;
      // var start_date = moment(sdate).format('YYYY-MM-DD HH:mm:ss');
      // var to_date = moment(edate).format('YYYY-MM-DD HH:mm:ss');
      this.formobj.from_date = this.utility.get_utc_from_to_date(start_date);
      this.formobj.to_date = this.utility.get_utc_from_to_date(to_date);
      
      let params = 'store_id=' + this.formobj.store_id + '&from_date=' + this.formobj.from_date + '&to_date=' + this.formobj.to_date + '&tz=' + encodeURIComponent(TZ) + '&timezone=' + this.formobj.timezone;
      if(this.formobj.store_id){
      this.reportService.getCogsReport(params)
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
  // getExportPDF() {
  //   this.reportService.exportReport('cogspdf', this.formobj).then(
  //     (res: HttpResponse<any>) => {
  //       this.reportService.downloadFile(res.body, 'application/pdf', 'Cogs Report '+this.export_date);
  //     });
  // }
  /* download pdf */

  /* download CSV */
  getExport(ext) {
    this.formobj.ext = ext;
    this.reportService.exportReport('export/cogs', this.formobj).then(
      (res: HttpResponse<any>) => {
        if (ext == 'csv') {
          this.reportService.downloadFile(res.body, 'text/csv', 'Cogs Report '+this.export_date);
        } else if (ext == 'xls') {
          this.reportService.downloadFile(res.body, 'application/vnd.ms-excel', 'Cogs Report '+this.export_date);
        } else if (ext == 'pdf') {
          this.reportService.downloadFile(res.body, 'application/pdf', 'Cogs Report '+this.export_date);
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
          this.cogsForm.patchValue({ store_id: this.storeList[0].store_id });
          this.store_id = this.storeList[0].store_id
        }
      });
  }

  reset_form() {
    this.cogsForm.controls['selected'].setValue({ start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') });
  }
/*
  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }
  onActivate(event) {
    if (event.type == 'click') {
      this.table.rowDetail.toggleExpandRow(event.row);
    }
  }*/


  getHeight(records, row) {
    let inner_height = (records < 5 || records != null) ? ((records + 1) * 48 + 10) + "px" : '';
    return inner_height;
  }
  getRowHeight(sub_detail) {
    if(sub_detail){
     return sub_detail.order_detail.variants.length < 10 ? ((sub_detail.order_detail.variants.length + 1) * 48 + 32) : 0;
    }
  }
}
