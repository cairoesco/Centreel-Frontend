import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SalesFilterDialogComponent } from './sales-filter-dialog/sales-filter-dialog.component';
import { SaleshareFilterDialogComponent } from './saleshare-filter-dialog/saleshare-filter-dialog.component';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { ReportService } from '../report.service';
import * as moment from 'moment';

@Component({
  selector: 'app-customsales',
  templateUrl: './customsales.component.html',
  styleUrls: ['./customsales.component.scss']
})
export class CustomsalesComponent implements OnInit {

  inProgress: boolean = false;
  sales_template = [];
  formobj: any = new Object();
  public columns: any = [];
  public dataHeader: any = [];
  selected_report: number;
  customReport: UntypedFormGroup;
  reportDetails: [];
  result_data: any = [];
  vendors: any = [];
  public dynamicHeight = "";
  public temp: any = [];
  public export_date = moment().format('MMMDDYYYY');

  constructor(public dialog: MatDialog,
    public reportService: ReportService,
    private utils: UtilsServiceService,
    private formBuilder: UntypedFormBuilder,
  ) { }

  ngOnInit() {
    this.getTemplates();
    this.customReport = this.formBuilder.group({
      report_id: [''],
      vendor_id: [''],
    });
    this.onChanges();
  }

  applyFilter(filterValue: string) {
    const val = filterValue.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.txn_id.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.result_data = temp;
    this.dynamicHeight = this.result_data.length < 12 ? ((this.result_data.length + 2) * 48 + 10) + "px" : '';
  }

  /* Create New Search Filter */
  createSearchFilter(data = 0): void {
    const dialogRef = this.dialog.open(SalesFilterDialogComponent, {
      width: '40%',
      data: { report_id: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (Boolean(result)) {
        if (result.title) {
          var last_id = result.id;
          var title = result.title;
          this.sales_template.push({ 'id': last_id, 'title': title });
          this.selected_report = last_id;
          this.customReport.patchValue({ report_id: last_id });
        } else {
          var rid = JSON.parse(result.id) //remove double quotes
          this.selected_report = rid;
          this.customReport.patchValue({ report_id: rid });
        }
      }
    });
  }

  /* Create Share Filter */
  shareFilter(): void {
    const dialogRef = this.dialog.open(SaleshareFilterDialogComponent, {
      width: '30%',
      data: { data: '' }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  /* Create Share Filter */

  /* get Template title */
  getTemplates() {
    this.inProgress = true;
    this.reportService.getSalesReportFilterData()
      .subscribe((response: any) => {
        this.inProgress = false;
        this.sales_template = response.data.sales_template;
        this.vendors = response.data.vendors;
        if (response.data.sales_template.length > 0) {
          this.selected_report = this.sales_template[0].id;
          this.customReport.patchValue({ report_id: this.sales_template[0].id });
        }
      },
        err => {
          this.inProgress = false;
        });
  }

  /* on change */
  onChanges(): void {
    this.customReport.valueChanges.subscribe(val => {
      this.inProgress = true;
      this.formobj.id = val.report_id;
      this.selected_report = val.report_id;
      if ((val.vendor_id.length) > 0) {
        this.formobj.vendor = JSON.stringify(val.vendor_id);
      } else {
        delete this.formobj.vendor;
      }
      this.reportService.getCustomsalesReport(this.formobj)
        .subscribe((response: any) => {
          this.columns = response.data.columns;
          this.inProgress = false;
          if (response.success) {
            this.dataHeader = response.data.columns;
            this.result_data = response.data.data;
            this.dynamicHeight = this.result_data.length < 12 ? ((this.result_data.length + 2) * 48 + 10) + "px" : '';
            this.temp = this.result_data;
          }
        }, error => {
          this.inProgress = false;
        });
    });
  }
  /* on change */

  getObjKeys(){
    return Object.keys(this.result_data[0]);
  }

  /* details for single report */
  getReportDetails(report_id) {
    this.reportService.getReportDetails(report_id)
      .subscribe((response: any) => {
        if (response.success) {
          this.reportDetails = response.data;
        }
      });
  }

  /* Delete Custom Report */
  deleteReport(rid) {
    this.utils.confirmDialog({ title: 'Delete Report', message: 'Are you sure want to delete this Report?' }).subscribe((result: any) => {
      if (Boolean(result)) {
        this.reportService.deleteReport( rid)
          .subscribe((response: any) => {
            if (response.success) {
              this.utils.showSnackBar(response.message);
              this.getTemplates();
            }
          });
      }
    })
  }
  /* Delete Custom Report */

  /* export Functionality */

  /* download pdf */
  getExportPDF() {
    this.reportService.exportReport("sales/generatePDF", this.formobj).then(
      (res: HttpResponse<any>) => {
        this.reportService.downloadFile(res.body, 'application/pdf', 'Custom sales Report '+this.export_date);
      });
  }

  /* download csv and excel */
  getExportCSV(ext) {
    this.formobj.ext = ext;
    this.reportService.exportReport("sales/exportCSV", this.formobj).then(
      (res: HttpResponse<any>) => {
        if (ext == 'csv') {
          this.reportService.downloadFile(res.body, 'text/csv', 'Custom sales Report '+this.export_date);
        } else if (ext == 'xls') {
          this.reportService.downloadFile(res.body, 'application/vnd.ms-excel', 'Custom sales Report '+this.export_date);
        }
      });
  }
  /* export Functionality */
}
