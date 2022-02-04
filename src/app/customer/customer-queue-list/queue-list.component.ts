import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { CustomerService } from "../customer.service";
import * as _moment from "moment";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { FormControl } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { UtilsServiceService } from "../../shared/services/utils-service.service";
import * as _ from "lodash";

@Component({
	selector: "app-customer-queue-list",
	templateUrl: "./queue-list.component.html",
	styleUrls: ["./queue-list.component.scss"],
	encapsulation: ViewEncapsulation.None,
	providers: [
		{ provide: MAT_DATE_LOCALE, useValue: "en-GB" },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
		{ provide: DateAdapter, useClass: MomentDateAdapter },
	],
})
export class CustomerQueueListComponent implements OnInit {

	public inProgress: boolean = false;
	public innerHeight: any;
	public type: string = "component";
	public dynamicHeight = "";
	public selected = false;
	public indexofTab = 0;
	public heightOfY;
	public store_id: any;
	public rows: any[] = [];
	public tempRows: any[] = [];

	readonly headerHeight = 50;
	readonly rowHeight = 50;

	constructor(
		public dialog: MatDialog,
		public refVar: ChangeDetectorRef,
		private api: CustomerService,
		public utility: UtilsServiceService,
		private router: Router
	) {
		this.utility.indexofTab = 0;
	}

	public search = new FormControl("");

	getQueueList() {
		this.inProgress = true;
		this.api.getCustomerQueueList(this.store_id).subscribe((response: any) => {
			if (response.success) {
				this.rows = response.data;
				this.tempRows = this.rows;
				this.dynamicHeight = this.rows.length < 12 ? (this.rows.length + 1) * 48 + 140 + "px" : "";
				this.inProgress = false;
			}
		});
	}

	removeCustomerFromQueue(user) {
		this.inProgress = true;
		const queue_status = 0;
		this.api.updateCustomerQueue(queue_status, user.patient_id, this.store_id).subscribe((response: any) => {
			if (response.success) {
				this.utility.showSnackBar(response.message);
				this.rows = [];
				this.getQueueList();
			}
			this.inProgress = false;
		});
	}

	ngOnInit() {
		this.api.GetStores().subscribe((response: any) => {
			this.store_id = response.data[0].store_id;
			this.getQueueList();
		});
		this.onChanges();
	}

	getRowHeight({ store_name, designation }) {
		if ((Boolean(store_name) && store_name.length > 70) || (Boolean(designation) && designation.length > 40)) {
			if (window.innerWidth < 1700) return 70;
		}
		return 48;
	}

	ngDoCheck() {
		this.innerHeight = window.innerHeight - 192;
	}

	onChanges(): void {
		this.search.valueChanges.pipe(debounceTime(500)).subscribe((val) => {
			if (!val) this.rows = this.tempRows;
			const tempArray = [];
			const newVal = val.toLowerCase();
			for (const user of this.rows) {
				if (
					user.patient_fname?.toLowerCase().includes(newVal) ||
					user.patient_lname?.toLowerCase().includes(newVal) ||
					user.middle_name?.toLowerCase().includes(newVal) ||
					user.patient_mobile?.includes(newVal) ||
					(user.patient_email?.toLowerCase().includes(newVal) && !tempArray.includes(user))
				) {
					tempArray.push(user);
				}
			}
			this.rows = tempArray;
		});
	}
}
