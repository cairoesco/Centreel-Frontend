import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpResponse } from "@angular/common/http";
import * as moment from "moment";
import { FormControl } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { ReportService } from "../report.service";
import { UtilsServiceService } from "../../shared/services/utils-service.service";

@Component({
	selector: "app-monthly-report",
	templateUrl: "./monthly-report.component.html",
	styleUrls: ["./monthly-report.component.scss"],
})
export class MonthlyReportComponent implements OnInit {
	inProgress: boolean = false;
	public monthlyReportForm: FormGroup;
	public storeList: any[] = [];
	public rows: any = {};
	public tempRows: any[] = [];
	public formobj: any = new Object();
  public dynamicHeight = "";
	public export_date: any;
	public from = moment().format("YYYY-MM-DD");
	public to = moment().format("YYYY-MM-DD");
	public store_id: any;

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


	selected = { start: moment().startOf('month'), end: moment().endOf('month') };

	alwaysShowCalendars: boolean;
	ranges: any = {
		Today: [moment(), moment()],
		Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
		"Last 7 Days": [moment().subtract(6, "days"), moment()],
		"Last 30 Days": [moment().subtract(29, "days"), moment()],
		"This Month": [moment().startOf("month"), moment().endOf("month")],
		"Last Month": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
	};

	constructor(
		public reportService: ReportService,
		private formBuilder: FormBuilder,
		public utils: UtilsServiceService
	) {
		this.alwaysShowCalendars = true;
	}

	public search = new FormControl("");

	ngOnInit() {
		this.getStores();
		this.monthlyReportForm = this.formBuilder.group({
			store_id: ["", Validators.required],
			selected: { start: moment().format("DD/MM/YYYY"), end: moment().format("DD/MM/YYYY") },
		});
		this.onChanges();
	}

	/* onchange event */
	onChanges(): void {
		this.inProgress = true;
		this.monthlyReportForm.valueChanges.subscribe((val) => {
			let sdate = val.selected.start.format("YYYY-MM-DD HH:mm:ss");
			let edate = val.selected.end.format("YYYY-MM-DD HH:mm:ss");

			let start_date = sdate;
			let to_date = edate;
			this.formobj.from_date = this.utils.get_utc_from_to_date(start_date);
			this.formobj.to_date = this.utils.get_utc_from_to_date(to_date);

			this.from = this.utils.get_utc_from_to_date(start_date);
			this.to = this.utils.get_utc_from_to_date(to_date);

			this.getMonthlyReport();
		});
	
	}
	/* onchange event */

	/* Get Monthly report */
	getMonthlyReport() {
		this.inProgress = true;
		let url = `?store_id=${this.store_id}`;
		if (this.from) url = `${url}&from_date=${this.from}`;
		if (this.to) url = `${url}&to_date=${this.to}`;
		console.log(url);
		this.reportService.getMonthlyReport(url).subscribe((response: any) => {
			console.log(response);
			const temp = [];
			for (const item in response.data) {
				response.data[item].type = item
				temp.push(response.data[item]);
			}
			console.log(temp);
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
			for (const item of this.rows) {
				if (item.type?.toLowerCase().includes(newVal) && !tempArray.includes(item)) {
					tempArray.push(item);
				}
			}
			this.rows = tempArray;
		});
	}

	/* Get Store list */
	getStores() {
		this.reportService.getStores().subscribe((response: any) => {
			this.storeList = response.data.stores;
			this.store_id = response.data.stores[0].store_id;
			console.log(this.store_id);
			if (response.data.stores.length > 0) {
				this.monthlyReportForm.patchValue({ store_id: this.storeList[0].store_id });
			}
		});
	}
	getExport(ext) {
		let url = `?store_id=${this.store_id}&from_date=${this.from}&to_date=${this.to}&ext=${ext}`;
		this.reportService.exportMonthlyReport(url).subscribe((response: any) => {
			if (ext == "csv") {
				this.reportService.downloadFile(response.body, "text/csv", "Monthly Report " + this.export_date);
			} else if (ext == "xls") {
				this.reportService.downloadFile(response.body, "application/vnd.ms-excel", "Monthly Report " + this.export_date);
			} else if (ext == "pdf") {
				this.reportService.downloadFile(response.body, "application/pdf", "Monthly Report " + this.export_date);
			}
		});
	}
}
