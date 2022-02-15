import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-waste',
  templateUrl: './waste.component.html',
  styleUrls: ['./waste.component.scss']
})
export class WasteComponent implements OnInit {

  inProgress: boolean = false;
  waste: FormGroup;
  warehouse = [];
  type: any = new Object();
  rows = [];
  formobj: any = new Object();
  minDate = moment("2018-01-01");
  maxDate = moment();
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  public dynamicHeight = "";
  public export_date = moment().format('MMMDDYYYY');

  //datepicker range
  selected: any;
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

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    public reportService: ReportService,
    private snackBar: MatSnackBar,
    private utils: UtilsServiceService) {
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    this.getWarehouse();
    this.waste = this.formBuilder.group({
      storage_id: ['', Validators.required],
      waste_type: ['ALL'],
      selected: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') }
    });
    this.onChanges();
  }

  /* onchange event */
  onChanges(): void {
    this.inProgress = true;
    this.waste.valueChanges.subscribe(val => {
      this.formobj.storage_id = val.storage_id;
      this.formobj.type = val.waste_type;
      var sdate = moment(val.selected.start, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      var edate = moment(val.selected.end, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      if (sdate == edate) {
        edate = moment(val.selected.end, 'DD/MM/YYYY HH:mm:ss').add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      }
      this.formobj.from_date = this.utils.get_utc_from_to_date(sdate);
      this.formobj.to_date = this.utils.get_utc_from_to_date(edate);
      
      this.reportService.getWasteReport(this.formobj)
        .subscribe((response: any) => {
          this.inProgress = false;
          this.rows = response.data;
          this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 2) * 55 + 10) + "px" : '';
        },
          err => {
            this.inProgress = false;
          }
        );
    });
  }
  /* onchange event */

  /* get warehouse */
  getWarehouse() {
    this.reportService.getWarehouse()
      .subscribe((response: any) => {
        /* filter only store front data */
        this.warehouse = _.filter(response.data, function (o) { return o.subtype == 'Store Front' || o.subtype == 'Store Display'; });
        /* filter only store front data */
        if (response.data.length > 0) {
          this.waste.patchValue({ storage_id: this.warehouse[0].storage_id });
        }
      });
  }
  /* get warehouse */

  /* download pdf */
  // getExportPDF() {
  //   this.reportService.exportReport("wastepdf", this.formobj).then(
  //     (res: HttpResponse<any>) => {
  //       this.reportService.downloadFile(res.body, 'application/pdf', 'Waste Report '+this.export_date);
  //     });
  // }
  /* download pdf */

  /* download CSV */
  getExport(ext) {
    this.formobj.ext = ext;
    this.reportService.exportReport("wastecsv", this.formobj).then(
      (res: HttpResponse<any>) => {
        if (ext == 'csv') {
          this.reportService.downloadFile(res.body, 'text/csv', 'Waste Report '+this.export_date);
        } else if (ext == 'xls') {
          this.reportService.downloadFile(res.body, 'application/vnd.ms-excel', 'Waste Report '+this.export_date);
        } else if (ext == 'pdf') {
          this.reportService.downloadFile(res.body, 'application/pdf', 'Waste Report '+this.export_date);
        }
      });
  }
  /* download CSV */

  reset_form() {
    this.waste.controls['selected'].setValue({ start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') });
    this.waste.controls['waste_type'].setValue('ALL');
  }
}




