import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { ReportService } from '../report.service';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-cashout',
  templateUrl: './cashout.component.html',
  styleUrls: ['./cashout.component.scss']
})
export class CashoutComponent implements OnInit {
  inProgress: boolean = false;
  cashout: UntypedFormGroup;
  tillList = [];
  type: any = new Object();
  rows = [];
  formobj: any = new Object();
  minDate = moment("2018-01-01");
  maxDate = moment();
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  public dynamicHeight = "";
  params: any = new Object();
  LoginUser: any;

  //datepicker
  selected = {  start: moment().startOf('month'), end: moment() };
  alwaysShowCalendars: boolean;
  //datepicker
  isInvalidDate = (m: moment.Moment) =>  m.isAfter(moment())
  
  constructor(private router: Router,
    public reportService: ReportService,
    private formBuilder: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    public utils: UtilsServiceService) {
      this.alwaysShowCalendars = true;
      this.LoginUser = this.utils.getSessionData('currentUser');
     }

  ngOnInit() {
    this.getTills();
    this.cashout = this.formBuilder.group({
      till_id: ['', Validators.required],
      selected: { start: moment().format('DD/MM/YYYY') , end: moment().format('DD/MM/YYYY') }
    });
    this.onChanges();
  }

  /* onchange event */
  onChanges(): void {
    this.inProgress = true;
    this.cashout.valueChanges.subscribe(val => {
      this.formobj.till_id = val.till_id
     var sdate = val.selected.start.format('YYYY-MM-DD HH:mm:ss');
      var edate = val.selected.end.format('YYYY-MM-DD HH:mm:ss');
      if (sdate == edate) {
        edate = val.selected.end.add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      }
      this.formobj.from_date = this.utils.get_utc_from_to_date(sdate);
      this.formobj.end_date = this.utils.get_utc_from_to_date(edate);
      
      this.reportService.getCashoutReport(this.formobj)
        .subscribe((response: any) => {
          this.inProgress = false;
          this.rows = response.data;
          this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 2) * 48 + 10) + "px" : '';
        },
          err => {
            this.inProgress = false;
          }
        );
    });
  }
  /* onchange event */

  /* download pdf */
  getExportPDF() {
    this.reportService.exportReport("rvcpdf", this.formobj).then(
      (res: HttpResponse<any>) => {
        this.reportService.downloadFile(res.body, 'application/pdf');
      });
  }
  /* download pdf */

  /* download CSV */
  getExportCSV(ext) {
    this.formobj.ext = ext;
    this.reportService.exportReport("rvccsv", this.formobj).then(
      (res: HttpResponse<any>) => {
        if (ext == 'csv') {
          this.reportService.downloadFile(res.body, 'text/csv');
        } else if (ext == 'xls') {
          this.reportService.downloadFile(res.body, 'application/vnd.ms-excel');
        }
      });
  }
  /* download CSV */

  /* Get Store list */
  getTills() {
    this.params.chain_id = this.LoginUser.chain_id;
    this.params.platform = 'WEB';
    this.reportService.getTills(this.params)
      .subscribe((response: any) => {
        this.tillList = _.filter(response.data, function (o) { return o.subtype == 'till'; });
        if (response.data.length > 0) {
          this.cashout.patchValue({ till_id: this.tillList[0].till_id });
        }
      });
  }

  reset_form() {
    this.cashout.patchValue({selected:{ start: moment().format('DD/MM/YYYY'),end: moment().format('DD/MM/YYYY') }});
  }

}
