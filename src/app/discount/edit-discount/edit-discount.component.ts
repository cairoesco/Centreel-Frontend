import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation, ElementRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { DiscountService } from "../discount.service";
import * as _moment from "moment";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { UtilsServiceService } from "../../shared/services/utils-service.service";
import * as _ from "lodash";
import { MatProgressButtonOptions } from "mat-progress-buttons";

@Component({
	selector: "app-edit-discount",
	templateUrl: "./edit-discount.component.html",
	styleUrls: ["./edit-discount.component.scss"],
	encapsulation: ViewEncapsulation.None,
	providers: [
		{ provide: MAT_DATE_LOCALE, useValue: "en-GB" },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
		{ provide: DateAdapter, useClass: MomentDateAdapter },
	],
})
export class EditDiscountComponent implements OnInit {
	@ViewChild("tagEntityInput") tagEntityInput: ElementRef<HTMLInputElement>;

	console = console;

	currentUserDetail: any;
	public innerHeight: any;
	public inProgress: boolean = false;
	public indexofTab = 0;
	public selectable: boolean = true;
	public removable: boolean = true;
	public removeTagArray = [];
	public tagArray: any = [];
	public ArrayOfTags: any = [];
	public tags: boolean = false;
	public store_id: any;
	public chain_id: any;
	public discount_id: any;
	public defaultStatus: any;
	public defaultParameters: any;
	public isEditing: boolean = false;
	public isEditingEntity: boolean = false;
	public addNewEntry: boolean = false;
	public customerInfo: boolean = false;
	public DiscountStatusArray: any = [];
	public DiscounParametersArray: any = [];
	public SelectedParameters: any = [];
	public tempEntityArray: any = [];
	public selectedTag: any = [];
	public discountForm: FormGroup;
	public index: any = "ALL";
	public rawDetail: any;
	separatorKeysCodes: number[] = [ENTER, COMMA];
	tagEntities: string[] = [];
	allTagEntities: any = [];
	tagEntityCtrl = new FormControl();
	filteredTagEntities: Observable<string[]>;

	state$: Observable<object>;

	barButtonOptions: MatProgressButtonOptions = {
		active: false,
		text: "SAVE ALL",
		barColor: "primary",
		raised: true,
		stroked: false,
		mode: "indeterminate",
		value: 0,
		disabled: false,
	};
	barEditButtonOptions: MatProgressButtonOptions = {
		active: false,
		text: "EDIT",
		barColor: "primary",
		raised: true,
		stroked: false,
		mode: "indeterminate",
		value: 0,
		disabled: false,
	};

	barSaveTagButtonOptions: MatProgressButtonOptions = {
		active: false,
		text: "SAVE CHANGES",
		barColor: "primary",
		raised: true,
		stroked: false,
		mode: "indeterminate",
		value: 0,
		disabled: false,
	};

	constructor(
		private fb: FormBuilder,
		public dialog: MatDialog,
		public refVar: ChangeDetectorRef,
		public utility: UtilsServiceService,
		private discountService: DiscountService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
		this.utility.indexofTab = 0;
	}

	onSubmit() {
		const formData = new FormData();
		if (this.discountForm.valid) {
			this.barButtonOptions.text = "Saving Data...";
			this.barButtonOptions.active = true;
			this.barButtonOptions.disabled = true;
		} else {
			this.utility.scrollToError();
		}
	}

	getDiscountForm() {
		this.discountForm = this.fb.group({
			discount_name: "",
			discount_type: [],
			status: [],
			parameters: [],
			discount_value: [],
			min_qty: [],
			product_weight: [],
		});
	}

	viewOnly() {
		this.isEditing = false;
		this.barSaveTagButtonOptions.disabled = true;
	}
	isEditable() {
		this.isEditing = true;
		this.barSaveTagButtonOptions.disabled = false;
	}

	handleAddNewEntry(status) {
		this.addNewEntry = status;
	}
	handleIsEditing() {
		this.isEditing = !this.isEditing;
	}

	handleOnSubmitGeneralEdit() {
		this.inProgress = true;
		this.discountService.updateDiscount(this.discount_id, this.discountForm.value).subscribe((payload: any) => {
			if (payload.success) {
			}
		});
		this.inProgress = false;
	}

	GetDiscount(id) {
		this.inProgress = true;
		this.discountService.GetStores().subscribe((response: any) => {
			if (response.success) {
				this.discountService.GetDiscountList(response.data[0].store_id).subscribe((payload: any) => {
					if (payload.success) {
						const tempDiscountData = payload.data.filter((discount) => discount.discount_id == id);
						console.log(tempDiscountData[0]);
						if (tempDiscountData) {
							this.discountForm.get("discount_name").setValue(tempDiscountData[0].title);
							this.discountForm.get("status").setValue(tempDiscountData[0].status);
							this.discountForm.get("discount_type").setValue(tempDiscountData[0].type);
							this.discountForm.get("parameters").setValue(tempDiscountData[0].paramters);
							this.discountForm.get("discount_value").setValue(tempDiscountData[0].value);
							this.discountForm.get("min_qty").setValue(tempDiscountData[0].min_qty);
							this.discountForm.get("product_weight").setValue(tempDiscountData[0].product_weight);

							this.DiscounParametersArray = tempDiscountData[0].paramters ?? [];

							this.SelectedParameters.push(this.DiscounParametersArray);
							this.discount_id = id;
						}
					}
				});
			}
			this.inProgress = false;
			this.viewOnly();
		});
	}

	ngOnInit() {
		this.DiscountStatusArray = [
			{
				status: "Inactive",
				status_id: 0,
			},
			{
				status: "Active",
				status_id: 1,
			},
		];

		this.activatedRoute.params.subscribe((params: Params) => {
			if (params?.id) {
				this.GetDiscount(params.id);
			}
		});
		this.getDiscountForm();
	}
	ngDoCheck() {
		this.innerHeight = window.innerHeight - 192;
	}

	selected(event: MatAutocompleteSelectedEvent): void {
		const selectedEntity = this.allTagEntities.find((entity) => entity.variant_name == event.option.value);
		this.tagEntityCtrl.setValue(null);
		if (selectedEntity) {
			const entityExists = this.tempEntityArray.find((entity) => entity.variant_id == selectedEntity.variant_id);
			if (entityExists) {
				return;
			}
			const tempObj = {
				tag_id: this.selectedTag.id,
				tag_name: this.selectedTag.tag_name,
				variant_id: selectedEntity.variant_id,
				variant_name: selectedEntity.variant_name,
				type: this.selectedTag.type,
			};
			this.tempEntityArray.push(tempObj);
		}
	}
}
