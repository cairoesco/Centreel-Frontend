import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, ElementRef, HostListener, HostBinding, Input, OnDestroy, Optional } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MAT_OPTION_PARENT_COMPONENT, MatOptgroup, MatOption, MatOptionParentComponent } from "@angular/material/core";
import { AbstractControl } from "@angular/forms";
import { MatPseudoCheckboxState } from "@angular/material/core/selection/pseudo-checkbox/pseudo-checkbox";
import * as _ from "lodash";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { DiscountService } from "../discount.service";
import { ApiService } from "../../api.service";

@Component({
	selector: "app-discount-filter-dialog",
	templateUrl: "./discount-filter-dialog.component.html",
	styleUrls: ["./discount-filter-dialog.component.scss"],
})
export class DiscountFilterDialogComponent implements OnInit {
	public filterForm: FormGroup;
	public discount_filter_form: FormGroup;
	alltags: string[] = [];
	allcategories: string[] = [];
	specialPrice: string[] = [];
	form_obj: any = new Object();
	temp_form_obj: any = new Object();

	public rawDetail: any;
	public stores: any = [];
	public discount_types: any;
	public discount_value: any;
	public discount_status: any;
	public parameter_values: any;

	public temp_storeID: any;
	public temp_discountType: any = [];
	public temp_status: any = [];
	public temp_discountValue: any = [];
	public temp_paramvalues: any = [];
	public tempParamValues: any = [];

	constructor(
		private api: DiscountService,
		private tagapi: ApiService,
		private formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<DiscountFilterDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public router: Router,
		public fb: FormBuilder
	) {}

	ngOnInit() {
		this.initializeForm();
		this.getRawDetails();

		if (this.data.fdata) this.filterForm.patchValue(this.data.fdata);
	}

	initializeForm() {
		this.filterForm = this.fb.group({
			store_id: [""],
			type: [],
			values: [],
			status: [],
			parameters: [],
		});
	}

	getRawDetails() {
		this.api.GetDiscountFilterData().subscribe((response: any) => {
			if (response.success) {
				const tempDiscountTypes = [{ value: [], item: "All" }];
				const tempDiscountValues = [];
				const tempDiscountStatus = [{ value: [], item: "All" }];

				if (response.data.discounts_types.length > 0) {
					const tempData = response.data.discounts_types.sort();
					for (let i in tempData) {
						const obj = {
							item: tempData[i].charAt(0).toUpperCase() + tempData[i].slice(1),
							value: [tempData[i]],
						};
						tempDiscountTypes[0].value.push(tempData[i]);
						tempDiscountTypes.push(obj);

						if (!this.temp_discountType) {
							this.temp_discountType.push(obj.value);
						}
					}
				}
				if (response.data.categories.length > 0) {
					const tempData = response.data.categories.sort();
					for (let i in tempData) {
						const obj = {
							item: tempData[i].product_category_name,
							value: tempData[i].product_category_id,
							type: "category",
						};
						this.tempParamValues.push(obj);
					}
				}
				if (response.data.tags.length > 0) {
					const tempData = response.data.tags.sort();
					for (let i in tempData) {
						const obj = {
							item: tempData[i].tag_name,
							value: tempData[i].id,
							type: "tag",
						};
						this.tempParamValues.push(obj);
					}
				}
				if (response.data.discount_values.length > 0) {
					const tempValueData = response.data.discount_values.sort();
					for (let i in tempValueData) {
						const obj = {
							item: `${parseInt(tempValueData[i])}%`,
							value: [tempValueData[i]],
						};
						tempDiscountValues.push(obj);
						if (!this.temp_discountValue) {
							this.temp_discountValue.push(obj.value);
						}
					}
				}
				if (response.data.discount_statuses.length > 0) {
					const tempStatusData = response.data.discount_statuses.sort();
					for (let i in tempStatusData) {
						const obj = {
							item: tempStatusData[i] == 1 ? "Active" : "Inactive",
							value: [tempStatusData[i]],
						};
						tempDiscountStatus[0].value.push(tempStatusData[i]);
						tempDiscountStatus.push(obj);
						if (!this.temp_status) {
							this.temp_status.push(obj.value);
						}
					}
				}
				this.rawDetail = response.data;
				this.stores = response.data.stores;

				this.discount_types = tempDiscountTypes;
				this.discount_value = tempDiscountValues;
				this.discount_status = tempDiscountStatus;
				this.parameter_values = this.tempParamValues;

				// setting default filter parameters with previously selected parameters
				if (!this.temp_storeID) {
					this.temp_storeID = [this.stores[0].store_id];
				}

				this.filterForm.controls.store_id.setValue(this.stores[0].store_id);
				this.filterForm.controls.type.setValue(this.discount_types[0].value);
				if (this.temp_discountValue) {
					this.filterForm.controls.values.setValue(this.temp_discountValue[0]?.value);
				} else {
					this.filterForm.controls.values.setValue(this.discount_value[0].value);
				}

				this.filterForm.controls.status.setValue(this.discount_status[0].value);
				this.filterForm.controls.parameters.setValue(this.parameter_values);
			}
		});
	}

	applyFilter() {
		this.form_obj = this.filterForm.getRawValue();
	
		if (!(this.form_obj.store_id && this.form_obj.store_id.length > 0)) {
			 this.form_obj.store_id = [this.temp_storeID];
		}

		if (!(this.form_obj.type && this.form_obj.type.length > 0)) {
			delete this.form_obj.type;
		}

		if (!(this.form_obj.values && this.form_obj.values.length > 0)) {
			delete this.form_obj.values;
		}
		if (!(this.form_obj.status && this.form_obj.status.length > 0)) {
			delete this.form_obj.status;
		}

		// if (!(this.form_obj.parameters && this.form_obj.parameters.length > 0)) {
		// 	delete this.form_obj.parameters;
		// }

		if (Object.keys(this.form_obj).length < 1) {
			this.form_obj.store_id = this.temp_storeID;
			this.form_obj.type = this.temp_discountType;
			this.form_obj.values = this.temp_discountValue;
			this.form_obj.parameters = this.temp_paramvalues;
		}
		this.dialogRef.close(this.form_obj);
	}

	close() {
		this.applyFilter();
		// this.filterForm.reset();
	}

	storeTempValue(name) {
		if (name === "type") {
			this.filterForm.controls.type.setValue(this.filterForm.controls.type.value);
		}
	}

	setSelectedChanges(evt) {
		switch (evt?.source?.ngControl.name) {
			case "store_id":
				this.temp_storeID = evt.value;
				break;
			case "type":
				this.temp_discountType = evt.value;
				const tempData = [];
				for (let i in this.tempParamValues) {
					if (evt.value.includes(this.tempParamValues[i].type)) {
						tempData.push(this.tempParamValues[i]);
						this.parameter_values = tempData;
					}
				}
				break;
			case "status":
				this.temp_status = evt.value;
				break;
			case "parameters":
				this.temp_paramvalues = evt.value;
				break;
			case "values":
				this.temp_discountValue = evt.value;
				break;
			default:
				break;
		}
	}
}
