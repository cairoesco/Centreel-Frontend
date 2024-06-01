import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpResponse } from "@angular/common/http";
import * as moment from "moment";
import { UntypedFormControl } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { ReportService } from "../report.service";
import { UtilsServiceService } from "../../shared/services/utils-service.service";

@Component({
	selector: "app-brandsales",
	templateUrl: "./brandsales.component.html",
	styleUrls: ["./brandsales.component.scss"],
})
export class BrandSalesComponent implements OnInit {
	inProgress: boolean = false;
	public brandForm: UntypedFormGroup;
	public storeList: any[] = [];
	public rows: any = {};
	public tempRows: any[] = [];
	public formobj: any = new Object();
  public dynamicHeight = "";
	public export_date: any;
	public from = moment().format("YYYY-MM-DD");
	public to = moment().format("YYYY-MM-DD");

	minDate = moment("2018-01-01");
	maxDate = moment();
	localconfi: any = {
		applyLabel: "ok",
		separator: " To ",
		format: "DD/MM/YYYY",
		direction: "ltr",
		weekLabel: "W",
		cancelLabel: "Cancel",
		customRangeLabel: "Custom range",
		daysOfWeek: moment.weekdaysMin(),
		monthNames: moment.monthsShort(),
		firstDay: moment.localeData().firstDayOfWeek(),
	};
	selected = {  start: moment().startOf('month'), end: moment() };
	alwaysShowCalendars: boolean;
	ranges: any = {
		Today: [moment(), moment()],
		Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
		"Last 7 Days": [moment().subtract(6, "days"), moment()],
		"Last 30 Days": [moment().subtract(29, "days"), moment()],
		"This Month": [moment().startOf("month"), moment().endOf("month")],
		"Last Month": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
	};

	isInvalidDate = (m: moment.Moment) =>  m.isAfter(moment())
	constructor(
		public reportService: ReportService,
		private formBuilder: UntypedFormBuilder,
		public utils: UtilsServiceService
	) {
		this.alwaysShowCalendars = true;
	}

	public search = new UntypedFormControl("");

	ngOnInit() {
		this.getStores();
		this.brandForm = this.formBuilder.group({
			store_id: ["", Validators.required],
			selected: { start: moment().format("DD/MM/YYYY"), end: moment().format("DD/MM/YYYY") },
		});
		this.onChanges();
	}

	/* onchange event */
	onChanges(): void {
		this.inProgress = true;
		this.brandForm.valueChanges.subscribe((val) => {
			let sdate = val.selected.start.format("YYYY-MM-DD HH:mm:ss");
			let edate = val.selected.end.format("YYYY-MM-DD HH:mm:ss");

			let start_date = sdate;
			let to_date = edate;
			// let start_date = moment(sdate).format("YYYY-MM-DD HH:mm:ss");
			// let to_date = moment(edate).format("YYYY-MM-DD HH:mm:ss");
			this.formobj.from_date = this.utils.get_utc_from_to_date(start_date);
			this.formobj.to_date = this.utils.get_utc_from_to_date(to_date);

			this.from = this.utils.get_utc_from_to_date(start_date);
			this.to = this.utils.get_utc_from_to_date(to_date);

			this.getBrandSales();
		});
	}
	/* onchange event */

	/* Get Brand Sales report */
	getBrandSales() {
		this.inProgress = true;
		let url = "";
		if (this.from) url = `${url}?from=${this.from}`;
		if (this.to) url = `${url}&to=${this.to}`;
		this.reportService.getBrandSalesReport(url).subscribe((response: any) => {
			const temp = [];
			for (const brand in response.data) {
				temp.push(response.data[brand]);
			}
			this.rows = temp;
			this.tempRows = this.rows;
			this.inProgress = false;
		});
	}

	applyFilter(val) {
		this.search.valueChanges.pipe(debounceTime(500)).subscribe((val) => {
			if (!val) this.rows = this.tempRows;
			const tempArray = [];
			const newVal = val.toLowerCase();
			for (const brand of this.rows) {
				if (brand.brand?.toLowerCase().includes(newVal) && !tempArray.includes(brand)) {
					tempArray.push(brand);
				}
			}
			this.rows = tempArray;
		});
	}

	/* Get Store list */
	getStores() {
		this.reportService.getStores().subscribe((response: any) => {
			this.storeList = response.data.stores;
			if (response.data.stores.length > 0) {
				this.brandForm.patchValue({ store_id: this.storeList[0].store_id });
			}
		});
	}
	getExport(ext) {
		let url = `?from=${this.from}&to=${this.to}&ext=${ext}`;
		this.reportService.exportBrandSalesReport(url).subscribe((response: any) => {
			if (ext == "csv") {
				this.reportService.downloadFile(response.body, "text/csv", "Brand sales Report " + this.export_date);
			} else if (ext == "xls") {
				this.reportService.downloadFile(response.body, "application/vnd.ms-excel", "Brand sales Report " + this.export_date);
			} else if (ext == "pdf") {
				this.reportService.downloadFile(response.body, "application/pdf", "Brand sales Report " + this.export_date);
			}
		});
	}
}
