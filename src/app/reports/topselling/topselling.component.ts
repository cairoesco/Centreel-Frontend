import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ReportService } from '../report.service';
import { UtilsServiceService } from '../../shared/services/utils-service.service';

@Component({
  selector: 'app-topselling',
  templateUrl: './topselling.component.html',
  styleUrls: ['./topselling.component.scss']
})
export class TopsellingComponent implements OnInit {

  inProgress: boolean = false;
  topSelling: UntypedFormGroup;
  productTypes = [];
  productCategory = [];
  warehouse = [];
  type: any = new Object();
  rows = [];
  formobj: any = new Object();
  minDate = moment("2018-01-01");
  maxDate = moment();
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  public dynamicHeight = "";
  public export_date = moment().format('MMMDDYYYY');
  public storage_id: any = "";

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
    public utils: UtilsServiceService) { 
      this.alwaysShowCalendars = true;
    }

  ngOnInit() {
    this.getProductTypes();
    this.getWarehouse();
    this.topSelling = this.formBuilder.group({
      product_type_id: [0],
      product_category_id: [0],
      storage_id: ['', Validators.required],
      selected: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') }
    });
    this.onChanges();
  }

  /* onchange event */
  onChanges(): void {
    this.inProgress = true;
    this.topSelling.valueChanges.subscribe(val => {
      this.formobj.storage_id = val.storage_id || this.storage_id
     var sdate = val.selected.start.format('YYYY-MM-DD HH:mm:ss');
      var edate = val.selected.end.format('YYYY-MM-DD HH:mm:ss');
      if(sdate == edate){
        edate = val.selected.end.add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      }
      this.formobj.from_date = this.utils.get_utc_from_to_date(sdate);
      this.formobj.to_date = this.utils.get_utc_from_to_date(edate);
      
      if (Boolean(val.product_type_id)) {
        this.formobj.product_type_id = val.product_type_id;
      } else {
        delete this.formobj.product_type_id;
      }
      if (Boolean(val.product_category_id)) {
        this.formobj.product_category_id = val.product_category_id;
      } else {
        delete this.formobj.product_category_id;
      }
      if(this.formobj.storage_id){
      this.reportService.getTopsellingReport(this.formobj)
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
  /* get product types */
  getProductTypes() {
    this.reportService.getProductTypes()
      .subscribe((response: any) => {
        this.productTypes = response.data;
      });
  }
  /* get warehouse */
  getWarehouse() {
    this.reportService.getWarehouse()
      .subscribe((response: any) => {
        /* filter only store front data */
        this.warehouse = _.filter(response.data, function (o) { return o.subtype == 'Store Front'; });
        /* filter only store front data */
        if (response.data.length > 0) {
          this.topSelling.patchValue({ storage_id: this.warehouse[0].storage_id });
          this.storage_id = this.warehouse[0].storage_id
        }
      });
  }

  /* get prodcut category by type id */
  getCategory(event) {
    if(Boolean(event.value)){
      this.reportService.getCategory(event)
      .subscribe((response: any) => {
        this.productCategory = response.data;
      });
    }else{
      this.topSelling.controls['product_category_id'].setValue(0);
      this.productCategory = [];
    }
  }

  /* download pdf */
  getExportPDF() {
    this.reportService.exportReport("topsellingspdf", this.formobj).then(
      (res: HttpResponse<any>) => {
        this.reportService.downloadFile(res.body, 'application/pdf', 'Top Selling Report '+this.export_date);
      });
  }

  /* download excel */
  getExportCSV(ext) {
    this.formobj.ext = ext;
    this.reportService.exportReport("topsellingscsv", this.formobj).then(
      (res: HttpResponse<any>) => {
        if (ext == 'csv') {
          this.reportService.downloadFile(res.body, 'text/csv', 'Top Selling Report '+this.export_date);
        } else if (ext == 'xls') {
          this.reportService.downloadFile(res.body, 'application/vnd.ms-excel', 'Top Selling Report '+this.export_date);
        }
      });
  }

  reset_form() {
    this.topSelling.controls['selected'].setValue({ start: moment().startOf('month'), end: moment() });
    this.topSelling.controls['product_type_id'].reset();
    this.topSelling.controls['product_category_id'].reset();
  }
}
