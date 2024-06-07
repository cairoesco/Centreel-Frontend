import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ReportService } from '../report.service';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { formatNumber } from '@angular/common';
import { Logs } from 'selenium-webdriver';

@Component({
  selector: 'app-tax-report',
  templateUrl: './tax-report.component.html',
  styleUrls: ['./tax-report.component.scss']
})
export class TaxReportComponent implements OnInit {

  public inProgress: boolean = false;
  public taxForm: UntypedFormGroup;
  public storeList: any = [];
  public resultdata = [];
  public submitted: boolean = false;
  public type: any = new Object();
  public rows = [];
  public formobj: any = new Object();
  public grand_total: number = 0;
  public minDate = moment("2018-01-01");
  public maxDate = moment();
  public localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  public dynamicHeight = "";
  public store_ids: any = [];
  public export_date = moment().format('MMMDDYYYY');
  @ViewChild('myTable') table: any;
  //datepicker
  public selected = {  start: moment().startOf('month'), end: moment() };
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
  
  constructor(private formBuilder: UntypedFormBuilder,
    public reportService: ReportService,
    public utility: UtilsServiceService) {
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    this.getStores();
    this.taxForm = this.formBuilder.group({
      store_ids: [''],
      selected: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') }
    });
    this.onChanges();
  }
  change(evt, event) {

  }
  headerList: any = [];
  /* onchange event */
  onChanges(): void {
    this.inProgress = true;
    this.taxForm.valueChanges.subscribe(val => {
      this.formobj.store_ids = JSON.stringify(val.store_ids);
     var sdate = val.selected.start.format('YYYY-MM-DD HH:mm:ss');
      var edate = val.selected.end.format('YYYY-MM-DD HH:mm:ss');
      if (sdate == edate) {
        edate = val.selected.end.add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      }
      var start_date = moment(sdate).format('YYYY-MM-DD HH:mm:ss');
      var to_date = moment(edate).format('YYYY-MM-DD HH:mm:ss');
      this.formobj.from_date = this.utility.get_utc_from_to_date(start_date);
      this.formobj.to_date = this.utility.get_utc_from_to_date(to_date);
      if (val.store_ids && val.store_ids.length > 0) {
        this.reportService.getTaxReport(this.formobj)
          .subscribe((response: any) => {
            this.headerList = [];
            this.inProgress = false;
            // let headers =  Object.keys(response.data[0]);
            // let data: any;
            // let headerData: any = [];
            if (response.data.length > 0)
              Object.keys(response.data[0]).forEach(key => {
                if (key != 'tax_type' && key != 'store_id' && key != 'tax_amount')
                  this.headerList.push(key)
              })
            response.data.forEach(element => {
              if (element.tax_type.length > 0) {
                element.tax_type.forEach(taxType => {
                  element[taxType.type] = taxType.amount;
                  if (this.headerList.indexOf(taxType.type) == -1) {
                    this.headerList.push(taxType.type);
                  }
                });
              }
            });

            if (this.headerList.length > 0)
              this.headerList.push('tax_amount');
            // this.columnList = ['Store Name','Tax No']
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
    this.reportService.exportReport('taxespdf', this.formobj).then(
      (res: HttpResponse<any>) => {
        this.reportService.downloadFile(res.body, 'application/pdf', 'Tax Report '+this.export_date);
      });
  }
  /* download pdf */

  /* download CSV */
  getExportCSV(ext) {
    this.formobj.ext = ext;
    this.reportService.exportReport('taxescsv', this.formobj).then(
      (res: HttpResponse<any>) => {
        if (ext == 'csv') {
          this.reportService.downloadFile(res.body, 'text/csv', 'Tax Report '+this.export_date);
        } else if (ext == 'xls') {
          this.reportService.downloadFile(res.body, 'application/vnd.ms-excel', 'Tax Report '+this.export_date);
        }
      });
  }
  /* download CSV */

  /* Get Store list */
  getStores() {
    this.reportService.getStores()
      .subscribe((response: any) => {
        if (response.data.stores.length > 0) {
          this.storeList = response.data.stores;
          this.store_ids = response.data.stores.map(x => x.store_id)
          this.taxForm.patchValue({ store_ids: this.store_ids });
        }
      });
  }
  reset_form() {
    this.taxForm.controls['selected'].setValue({ start: moment().startOf('month'), end: moment() });
    this.taxForm.controls['store_ids'].setValue(this.store_ids);
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }
  onActivate(event) {
    if (event.type == 'click') {
      this.table.rowDetail.toggleExpandRow(event.row);
    }
  }
}
