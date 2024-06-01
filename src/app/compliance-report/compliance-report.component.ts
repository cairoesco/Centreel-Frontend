import { Component, OnInit } from '@angular/core';
import { ComplianceReportService } from './compliance-report.service'
import { UntypedFormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { UtilsServiceService } from '../shared/services/utils-service.service'
const moment = _moment;
import { HttpResponse } from '@angular/common/http';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-compliance-report',
  templateUrl: './compliance-report.component.html',
  styleUrls: ['./compliance-report.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ComplianceReportComponent implements OnInit {
  public rows: any = [];
  provinceList: any;
  public dynamicHeight = "";
  minDate = moment("2018-01-01");
  maxDate = moment(new Date());
  public inProgress: boolean = false;
  rowData: any = [];
  constructor(public service: ComplianceReportService, public utility: UtilsServiceService) { }

  ngOnInit() {
    this.getLocationList('state', 1)
    this.getRowData();
    this.getCurrentDate();
  }
  getCurrentDate() {
    let date = moment();
    this.dateObject.month = + date.format('M');
    this.dateObject.year = + date.format('YYYY');
    this.dateObject.s_date = new Date(this.dateObject.year, this.dateObject.month, 1);
    this.dateObject.e_date = new Date(this.dateObject.year, this.dateObject.month + 1, 0);
    this.params.from_date = _moment(this.dateObject.s_date).format("YYYY-MM-DD") + " 00:00:00"
    this.params.to_date = _moment(this.dateObject.e_date).format("YYYY-MM-DD") + " 23:59:59";
  }
  date = new UntypedFormControl(moment());
  public dateObject: any = {
    s_date: 1,
    e_date: 30,
    month: 6,
    year: 2019
  }
  public params: any = {
    from_date: '2019-06-01 00:00:00',
    to_date: '2019-06-31 23:59:59',
    store_id: 21,
  }


  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.dateObject.year = normalizedYear.year();
  }
  applyFilter(filterValue: string) {
    const val = filterValue.toLowerCase();
    const temp = this.rowData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || d.city.location_name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
  }
  exportCTLS(store_id, store_name) {
    this.params.store_id = store_id;

    this.service.exportExcel(this.params).then(
      (res: HttpResponse<any>) => {

        this.downloadFile(res.body, 'application/pdf',store_name);
      });
  }
  downloadFile(data: any, type, store_name) {
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

    // var filename = +(new Date()) + ext;
    var filename = "Monthly Inventory Report " + store_name +' '+ ((this.dateObject.month < 10)?'0'+this.dateObject.month:this.dateObject.month) + '-' + this.dateObject.year + ext;

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

  chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    this.dateObject.month = normlizedMonth.month();
    this.dateObject.e_date = new Date(this.dateObject.year, normlizedMonth.month() + 1, 0);
    this.dateObject.s_date = new Date(this.dateObject.year, normlizedMonth.month(), 1);
    this.params.from_date = _moment(this.dateObject.s_date).format("YYYY-MM-DD") + " 00:00:00"
    this.params.to_date = _moment(this.dateObject.e_date).format("YYYY-MM-DD") + " 23:59:59";
    const ctrlValue = this.date.value;
    ctrlValue.month(normlizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }


  getLocationList(type, parent_id) {
    this.service.getLocationList(type, parent_id)
      .subscribe((response: any) => {
        if (response.success == true) {
          this.provinceList = response.data;
        }
      });
  }
  getRowData() {
    this.inProgress = true;
    this.service.getCannabiesStores()
      .subscribe((response: any) => {
        this.inProgress = false;
        if (response.success == true) {
          this.rowData = response.data;
          this.rows = response.data;
        }
      });
  }
}




