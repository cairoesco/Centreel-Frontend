import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../report.service';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime } from "rxjs/operators";
import * as _ from 'lodash';
import { UtilsServiceService } from "../../shared/services/utils-service.service";

import * as moment from 'moment';

@Component({
  selector: 'app-low-sales',
  templateUrl: './low-sales.component.html',
  styleUrls: ['./low-sales.component.scss']
})
export class LowSalesComponent implements OnInit {
  @ViewChild('myDatatable') table: any;
  public inProgress: boolean = false;
  public dynamicHeight = "";
  public temp: any = [];
  public export_date = moment().format('MMMDDYYYY');
  public lowsalesForm: UntypedFormGroup;
	public storeList: any[] = [];
	public productTypeList: any[] = [];
	public tempRows: any[] = [];
  public product_type = "";
  public store_id = "";
	public rows: any = {};
  public variant_sku = "";

  constructor(
    public reportService: ReportService,
    private formBuilder: UntypedFormBuilder,
    public utils: UtilsServiceService
  ) { }

  public search = new UntypedFormControl("");

  ngOnInit() {   
    this.lowsalesForm = this.formBuilder.group({
			store_id: ["", Validators.required],
			product_type: [""],
		});
    this.getStores();
    this.onChanges();
  }

  	/* onchange event */
	onChanges(): void {
		this.inProgress = true;
		this.lowsalesForm.valueChanges.subscribe((val) => {
      this.product_type = val.product_type
      this.store_id = val.store_id
			this.getLowSales();
		});
	}

  /* Get Low Sales report */
	getLowSales() {
		this.inProgress = true;
		let url = `&store_id=${this.store_id}`;
		if (this.product_type &&  this.product_type !== 'all') url = `${url}&product_type=${this.product_type}`;
		if (this.variant_sku) url = `${url}&variant_sku=${this.variant_sku}`;

		this.reportService.getLowSalesReport(url).subscribe((response: any) => {
			const temp = [];
			for (const sales in response.data) {
				temp.push(response.data[sales]);
			}
			this.rows = temp;
			this.tempRows = this.rows;
			this.inProgress = false;
		});
	}

  applyFilter(val) {
		this.search.valueChanges.pipe(debounceTime(1000)).subscribe((val) => {
			if (!val){
				this.rows = this.tempRows;
			} else {
				this.variant_sku = val;
				this.getLowSales()
			}
		});
	}

  getStores() {
    this.reportService.getStores()
      .subscribe((response: any) => {
        this.storeList = response.data.stores;
				this.productTypeList = [{product_type_slug:'all', product_name: 'All'},{product_type_slug:'cannabis', product_name: 'Cannabis'},{product_type_slug:'non cannabis', product_name: 'Non-Cannabis'}]

        if (response.data.stores.length > 0) {
          this.lowsalesForm.patchValue({ store_id: this.storeList[0].store_id });
        }
				this.lowsalesForm.patchValue({ product_type: 'all' });
      });
  }

  getExport(ext) {
		let url = `store_id=${this.store_id}`;
		if (this.product_type && this.product_type !== 'all') url = `${url}?product_type=${this.product_type}`;
		if (this.variant_sku) url = `${url}&variant_sku=${this.variant_sku}`;
		this.reportService.exportLowSalesReport(url).subscribe((response: any) => {
			if (ext == "csv") {
				this.reportService.downloadFile(response.body, "text/csv", "Low sales Report " + this.export_date);
			} else if (ext == "xls") {
				this.reportService.downloadFile(response.body, "application/vnd.ms-excel", "Low sales Report " + this.export_date);
			} else if (ext == "pdf") {
				this.reportService.downloadFile(response.body, "application/pdf", "Low sales Report " + this.export_date);
			}
		});
	}
}