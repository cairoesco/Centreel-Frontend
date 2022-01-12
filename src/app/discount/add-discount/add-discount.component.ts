import { Component, OnInit, Inject, ChangeDetectorRef, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DiscountService } from "../discount.service";
import * as _moment from "moment";
import { UtilsServiceService } from "../../shared/services/utils-service.service";
import * as _ from "lodash";
import { LEFT_ARROW } from "@angular/cdk/keycodes";

@Component({
	selector: "app-add-discount",
	templateUrl: "./add-discount.component.html",
	styleUrls: ["./add-discount.component.scss"],
})
export class AddDiscountComponent implements OnInit {
	public tags: any = [];
	public stores: any = [];
	public discount_types: any = [];
	public categories: any = [];
	public minQtyArray: any = [];
	public productWeightArray: any = [];
	public discountModeArray: any = [];
	public rawDetail: any;

	public selectedDiscountType: any;

	public discountForm: FormGroup;
	form_obj: any = new Object();
	constructor(
		private fb: FormBuilder,
		public dialog: MatDialog,
		public refVar: ChangeDetectorRef,
		private api: DiscountService,
		public utility: UtilsServiceService,
		private router: Router,
		public discountDialogRef: MatDialogRef<AddDiscountComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.utility.indexofTab = 0;
	}

	ngOnInit() {
		this.minQtyArray = [
			{
				item: 1,
				value: 1,
			},
			{
				item: 2,
				value: 2,
			},
			{
				item: 3,
				value: 3,
			},
			{
				item: 4,
				value: 4,
			},
			{
				item: 5,
				value: 5,
			},
		];
		this.discountModeArray = [
			// {
			// 	value: "$",
			// 	item: "Amount ($)",
			// },
			{
				item: "Percentage (%)",
				value: "%",
			},
		];
		this.addDiscountForm();
		this.getRawDetails();
	}

	handleSelectDiscountType(type) {
		this.selectedDiscountType = type;
	}

	/***************** Form Group *****************************/
	addDiscountForm() {
		this.discountForm = this.fb.group({
			store_id: ["", [Validators.required]],
			discount_title: ["", [Validators.required]],
			value: ["", [Validators.required, Validators.min(1)]],
			discount_type: ["", [Validators.required]],
			discount_mode: ["$", [Validators.required]],
			parameters: [[], [Validators.required]],
			min_qty: ["", [Validators.required]],
			product_Weight: ["", [Validators.required]],
		});
	}

	getRawDetails() {
		this.api.GetAddDiscountData().subscribe((response: any) => {
			if (response.success) {
				const tempDiscountTypes = [];
				if (response.data.discounts_types.length > 0) {
					const tempData = response.data.discounts_types.sort();
					for (let i in tempData) {
						const obj = {
							item: tempData[i].charAt(0).toUpperCase() + tempData[i].slice(1),
							value: tempData[i],
						};
						tempDiscountTypes.push(obj);
					}
				}

				this.rawDetail = response.data;
				this.stores = response.data.stores.sort();
				this.discount_types = tempDiscountTypes;
				this.tags = response.data.tags;
				this.categories = response.data.categories;
				this.discountForm.patchValue({
					store_id: this.stores[0].store_id,
				});
			}
		});
	}

	addNewDiscount() {
		this.form_obj = this.discountForm.getRawValue();
		if(!this.form_obj.discount_title){
			this.utility.showSnackBar('Please enter a valid discount title');
		return
		}
		if(!this.form_obj.value){
			this.utility.showSnackBar('Discount value is a mandatory field');
		return
		}
		if(!this.form_obj.discount_type){
			this.utility.showSnackBar('Please select a discount type');
		return
		}
		if(!this.selectedDiscountType){
			this.utility.showSnackBar('Discount parameter is a mandatory field');
		return
		}
		const tag = [];
		const cat = [];
		for (const params of this.form_obj.parameters) {
			if (this.selectedDiscountType == "tag") {
				const data = { tag_id: params.toString() };
				tag.push(data);
			} else if (this.selectedDiscountType == "category") {
				const data = { cat_id: params.toString() };
				cat.push(data);
			}
		}

		const payload = {
			store_id: this.form_obj.store_id,
			discount_title: this.form_obj.discount_title,
			status: 1,
			value: this.form_obj.value,
			discount_type: this.form_obj.discount_type,
			min_qty: this.form_obj.min_qty,
			discount_mode: this.form_obj.discount_mode,
			product_Weight: this.form_obj.product_Weight,
			parameter: this.selectedDiscountType == "tag" ? tag : this.selectedDiscountType == "category" ? cat : "",
		};
		this.discountDialogRef.close(payload);
	}

	//******************************** Add discount popup start **************************/
	public filter_data: any;
	AddDiscountPopup(fdata): void {
		const dialogRef = this.dialog.open(AddDiscountComponent, {
			width: "70%",
			maxWidth: "700px",
			data: { fdata },
		});

		dialogRef.afterClosed().subscribe((result: any) => {});
	}

	close() {
		this.discountForm.reset();
		this.discountDialogRef.close();
	}

	handleParameterChange(evt) {
		if (!evt) {
			this.form_obj = this.discountForm.getRawValue();
			this.api.GetProductDryWeightData(this.form_obj.parameters).subscribe((response: any) => {
				if (response.success) {
					let temp_array = [{ item: "All", value: "all" }];
					for (const weight in response.data.product_weight) {
						const obj = {
							item: response.data.product_weight[weight],
							value: response.data.product_weight[weight],
						};
						temp_array.push(obj);
					}
					this.productWeightArray = temp_array;
					temp_array = [];
				}
			});
		}
	}
}
