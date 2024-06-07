import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import * as _ from 'lodash';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-stocktransfer',
  templateUrl: './stocktransfer.component.html',
  styleUrls: ['./stocktransfer.component.scss']
})
export class StocktransferComponent implements OnInit {

  inProgress: boolean = false;
  transfer: UntypedFormGroup;
  type: any = new Object();
  rows = [];
  formobj: any = new Object();
  minDate = moment("2018-01-01");
  maxDate = moment();
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  public dynamicHeight = "";
  warehouse = [];
  users = [];
  public sourceFormArray: any = [];
  public destFormArray: any = [];
  sourceStorage = [];
  destinationStorage = [];
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
  
  constructor(private router: Router,
    public reportService: ReportService,
    private formBuilder: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private utils: UtilsServiceService) {
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    this.transfer = this.formBuilder.group({
      variant_name: [''],
      source_storage_id: [''],
      destination_storage_id: [''],
      transfer_by_id: [''],
      selected: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') }
    });
    this.getWarehouse();
    this.getAllUsers();
    this.onChanges();
    this.transfer.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }

  /* warehouse dropdown */
  getWarehouse() {
    this.reportService.getWarehouse()
      .subscribe((response: any) => {
        this.warehouse = response.data;
        this.sourceStorage = this.warehouse;
        this.destinationStorage = this.warehouse;
      });
  }
  /* warehouse dropdown */

  /* user list */
  getAllUsers() {
    this.reportService.getSalesReportFilterData()
      .subscribe((response: any) => {
        this.users = response.data.employees;
      });
  }
  /* user list */

  /* Bind source destination data */
  change(event, target) {
    if (target == 'source') {
      if (event.source.selected) {
        this.sourceFormArray.push(event.source.value);
      } else {
        let index = this.sourceFormArray.indexOf(event.source.value);
        this.sourceFormArray.splice(index, 1);
      }
      this.destinationStorage = _.filter(this.warehouse, (o) => { return this.sourceFormArray.indexOf(o.storage_id) < 0; });
    } else {
      if (event.source.selected) {
        this.destFormArray.push(event.source.value);
      } else {
        let index = this.destFormArray.indexOf(event.source.value);
        this.destFormArray.splice(index, 1);
      }
      this.sourceStorage = _.filter(this.warehouse, (o) => { return this.destFormArray.indexOf(o.storage_id) < 0; });
    }
  }

  /* Bind source destination data */

  /* onchange event */
  onChanges() {
    this.inProgress = true;
    this.transfer.valueChanges.subscribe(val => {
     var sdate = val.selected.start.format('YYYY-MM-DD HH:mm:ss');
      var edate = val.selected.end.format('YYYY-MM-DD HH:mm:ss');
      if (sdate == edate) {
        edate = val.selected.end.add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      }
      this.formobj.from_date = this.utils.get_utc_from_to_date(sdate);
      this.formobj.to_date = this.utils.get_utc_from_to_date(edate);

      if (Boolean(val.variant_name)) {
        this.formobj.search = val.variant_name;
      } else {
        delete this.formobj.search;
      }

      if ( (val.source_storage_id) && (val.source_storage_id.length) > 0) {
        this.formobj.source_storage_id = JSON.stringify(val.source_storage_id);
      } else {
        delete this.formobj.source_storage_id;
      }

      if ( (val.destination_storage_id) && (val.destination_storage_id.length) > 0) {
        this.formobj.destination_storage_id = JSON.stringify(val.destination_storage_id);
      } else {
        delete this.formobj.destination_storage_id;
      }

      if ( (val.transfer_by_id) && (val.transfer_by_id.length) > 0) {
        this.formobj.transfer_by = JSON.stringify(val.transfer_by_id);
      } else {
        delete this.formobj.transfer_by;
      }

      this.reportService.getStockTransferReport(this.formobj)
        .subscribe((response: any) => {
          this.inProgress = false;
          this.rows = response.data.data;
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
    this.reportService.exportReport("transferpdf", this.formobj).then(
      (res: HttpResponse<any>) => {
        this.reportService.downloadFile(res.body, 'application/pdf', 'Stock Transfer History Report '+this.export_date);
      });
  }
  /* download pdf */

  /* download CSV */
  getExportCSV(ext) {
    this.formobj.ext = ext;
    this.reportService.exportReport("transfercsv", this.formobj).then(
      (res: HttpResponse<any>) => {
        if (ext == 'csv') {
          this.reportService.downloadFile(res.body, 'text/csv', 'Stock Transfer History Report '+this.export_date);
        } else if (ext == 'xls') {
          this.reportService.downloadFile(res.body, 'application/vnd.ms-excel', 'Stock Transfer History Report '+this.export_date);
        }
      });
  }
  /* download CSV */

  reset_form() {
    this.transfer.controls['selected'].setValue({ start: moment().startOf('month'), end: moment() });
    this.transfer.controls['variant_name'].reset();
    this.transfer.controls['source_storage_id'].reset();
    this.transfer.controls['destination_storage_id'].reset();
    this.transfer.controls['transfer_by_id'].reset();
  }
}
