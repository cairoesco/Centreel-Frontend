import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import * as _ from 'lodash';
import { ReportService } from '../report.service';


@Component({
  selector: 'app-refund-report',
  templateUrl: './refund-report.component.html',
  styleUrls: ['./refund-report.component.scss'],
})
export class RefundReportComponent implements OnInit {

  public inProgress: boolean = false;
  refundFilterForm: UntypedFormGroup;
  type: any = new Object();
  rows = [];
  temp: any = [];
  formobj: any = new Object();
  minDate = moment("2018-01-01");
  maxDate = moment();
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  public dynamicHeight = "";

  public export_date = moment().format('MMMDDYYYY');

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
   
  constructor(
    public reportService: ReportService,
    private formBuilder: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private utils: UtilsServiceService,
   
    ) 
    {
      this.alwaysShowCalendars = true;
  }
  ngOnInit() {
    this.getFilterData();
    this.refundFilterForm = this.formBuilder.group({
      store_id: [''], 
      selected: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') },
    });
    this.onChanges();
  }

  /* onchange event */
  onChanges() {
    let TZ = this.utils.getTimeZone(); //timezone
    this.refundFilterForm.valueChanges.subscribe(val => {
    
      let sdate = val.selected.start.format('YYYY-MM-DD HH:mm:ss');
      let edate = val.selected.end.format('YYYY-MM-DD HH:mm:ss');
      if (sdate == edate) {
        edate = val.selected.end.add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      }
      this.formobj.from_date = this.utils.get_utc_from_to_date(sdate);
      this.formobj.to_date = this.utils.get_utc_from_to_date(edate);

      if ( (val.store_id) && (val.store_id) > 0) {
        this.formobj.store_id = JSON.stringify(val.store_id);
      } else {
        delete this.formobj.store_id;
      }

  
      this.inProgress = true;
      let params = 'search=' + '' + '&from_date=' + this.formobj.from_date + '&to_date=' + this.formobj.to_date + '&store_id=' + this.formobj.store_id
      this.reportService.getRefundReport(params)
      .subscribe((response: any) => {
        this.inProgress = false;
        this.rows = response.data;
        this.temp = this.rows;
        this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 2) * 48 + 10) + "px" : '';
      },
        err => {
          this.inProgress = false;
        }
      );
  });
    }


    /* new code */
  public chains: any = [];
  public stores: any = [];
  public warehouses: any = [];
  public warehouseList: any = [];
  getFilterData(){
    this.reportService.getRefundReportStores()
    .subscribe((response: any) => {
      if (response.success) {
      
        this.stores = response.data;
 
        if (this.stores.length > 0) {
          this.refundFilterForm.patchValue({ store_id: this.stores[0].store_id });
        }
      }
      else {
        this.utils.showSnackBar(response.message, { panelClass: 'error' });
      }
    });
  }
  
  applyFilter(filterValue: string) {
    const val = filterValue.toLowerCase();
    const temp = this.temp.filter(function (d) {
      if(d.product_name.toLowerCase().indexOf(val) !== -1){
       return d.product_name.toLowerCase().indexOf(val) !== -1

      } else if(d.variant_name.toLowerCase().indexOf(val) !== -1) {
        return d.variant_name.toLowerCase().indexOf(val) !== -1

      } else if(d.order_id.toString().indexOf(val) !== -1) {
        return d.order_id.toString().indexOf(val) !== -1

      } else {
        return !val;
      }
     
    });

    this.rows = temp;
  }

  /* export Functionality */

  /* download pdf */
  getExportPDF() {
    let params = 'store_id=' + this.formobj.store_id + '&from_date=' + this.formobj.from_date + '&to_date=' + this.formobj.to_date
    this.reportService.refund_exportReportPdf(params).then(
      (res: HttpResponse<any>) => {
        this.downloadFile(res.body, 'application/pdf');
      });
  }

  /* download csv */
  getExportCSV(ext) {
    this.formobj.ext = ext;
    let params = 'ext=' + ext + '&store_id=' + this.formobj.store_id + '&from_date=' + this.formobj.from_date + '&to_date=' + this.formobj.to_date
    this.reportService.refund_exportReportCsv(params).then(
      (res: HttpResponse<any>) => {
        if (ext == 'csv') {
          this.downloadFile(res.body, 'text/csv');
        } else if (ext == 'xls') {
          this.downloadFile(res.body, 'application/vnd.ms-excel');
        }
      });
  }

  downloadFile(data: any, type) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let ext;
    switch (type) {
      case 'text/csv':
        ext = '.csv';
        break;
      case 'application/pdf':
        ext = '.pdf';
        break;
      case 'application/vnd.ms-excel':
        ext = '.xls';
        break;
    }

    var filename = +(new Date()) + ext;

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);

  }

  reset_form() {
    this.refundFilterForm.controls['selected'].setValue({ start: moment().startOf('month'), end: moment() });
  }



}


