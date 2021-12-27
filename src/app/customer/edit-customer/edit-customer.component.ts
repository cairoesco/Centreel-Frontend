import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { CustomValidators } from "ng2-validation";
import { TagComponent } from "../../dialog/tag/tag.component";
import { MatDialog } from "@angular/material/dialog";
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { CustomerService } from "../customer.service";
import * as _moment from "moment";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { UtilsServiceService } from "../../shared/services/utils-service.service";
import * as _ from "lodash";
import { MatProgressButtonOptions } from "mat-progress-buttons";

@Component({
	selector: "app-edit-customer",
	templateUrl: "./edit-customer.component.html",
	styleUrls: ["./edit-customer.component.scss"],
	encapsulation: ViewEncapsulation.None,
	providers: [
		{ provide: MAT_DATE_LOCALE, useValue: "en-GB" },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
		{ provide: DateAdapter, useClass: MomentDateAdapter },
	],
})
export class EditCustomerComponent implements OnInit {
	filteredCountryOptions: Observable<any>;

	public innerHeight: any;
	public type: string = "component";
	public selected = false;
	public indexofTab = 0;
	public uploadDocForm: FormGroup;
	public shiftForm: FormGroup;
	public form: FormGroup;
	public addStore: FormGroup;
	public imageSrc: any = "/assets/images/default-image.png";
	public heightOfY;
	public arrayOfFiles = [];
	public filesOfarray = [];
	public selectable: boolean = true;
	public removable: boolean = true;
	public removeTagArray = [];
	public tagName: string = "tag entry";
	public index: any = "ALL";
	public tagArray: any = [];
	public ArrayOfTags: any = [];
	public stateList: any;
	public isActive;
	public generalInfo: boolean = false;
	public tags: boolean = false;
	public licenceInfo: boolean = false;
	public storeInfo: boolean = false;
	public showExtraCardInfo: boolean = false;
	public cityList: any;
	public rawDetail: any;
	public uploadedDocName: any = "";
	public dynamicHeight = "";
	public from: any;
	public to: any;
	public shift_error: string;
	public genderArr: any;
	public patientTypeArr: any;
	public cardTypeArr: any;
	public IDCardArr: any;
	public countryArr: any;
	public store_id: any;
	public chain_id: any;
	public defaultGender: any;
	public priceOptions = { prefix: "$ ", thousands: ",", decimal: ".", align: "left", nullable: true, allowZero: false };
	currentUserDetail: any;

	public tempState: any;
	public tempCity: any;

	public isEditing: boolean = false;

	public editable: boolean = false;
	public isContactInfoEditable: boolean = false;
	public isCardDetailsEditable: boolean = false;

	employment_minDate = new Date(2000, 0, 1);
	employment_maxDate = new Date();

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
	barUploadButtonOptions: MatProgressButtonOptions = {
		active: false,
		text: "UPLOAD DOCUMENT",
		barColor: "primary",
		raised: true,
		stroked: false,
		mode: "indeterminate",
		value: 0,
		disabled: false,
	};
	maxDate = new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate());
	certification_Expiry_MinDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

	constructor(
		private fb: FormBuilder,
		public dialog: MatDialog,
		public refVar: ChangeDetectorRef,
		private api: CustomerService,
		public utility: UtilsServiceService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
		this.utility.indexofTab = 0;
		this.currentUserDetail = this.utility.getSessionData("currentUser");
	}

	onSubmit() {
		let date = this.form.get("dob").value;
		let formatedDate = _moment(date).format("YYYY-MM");
		this.form.get("dob").setValue(formatedDate);

		this.form.get("store_id").setValue(this.store_id);
		this.form.get("chain_id").setValue(this.chain_id);

		const cardObj = [
			{
				id_card_type: this.form.value.id_card_type,
				id_number: this.form.value.id_number,
				source: this.form.value.source,
				id: "",
			},
		];
		this.form.get("id_cards").setValue(JSON.stringify(cardObj));

		const formData = new FormData();
		formData.append("chain_id", this.rawDetail.chains[0].chain_id);

		if (this.form.valid) {
			this.barButtonOptions.text = "Saving Data...";
			this.barButtonOptions.active = true;
			this.barButtonOptions.disabled = true;
			this.api.AddCustomer(this.form.value).subscribe(
				(response: any) => {
					if (response.success) {
						this.utility.showSnackBar(response.message);
						this.router.navigateByUrl("customer");
					}
				},
				(error) => {
					this.barButtonOptions.text = "SAVE ALL";
					this.barButtonOptions.active = false;
					this.barButtonOptions.disabled = false;
				}
			);
		} else {
			this.utility.scrollToError();
		}
	}

	//************ Remove tag ********************/
	removeTag(index, tag) {
		if (index !== -1) {
			this.tagArray.filter((tagArray) => {
				if (tagArray.id != 0 && tagArray.id == tag) {
					this.removeTagArray.push(tagArray.id);
				}
			});
			this.ArrayOfTags.splice(index, 1);
			this.tagArray.splice(index, 1);
		}
	}
	//******* Add new tag popup **************  */
	AddNewTag(): void {
		const dialogRef = this.dialog.open(TagComponent, {
			width: "550px",
			disableClose: true,
			data: { name: this.tagName, type: "user" },
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (Boolean(result) && result.length > 0) {
				result.forEach((tag_name) => {
					if (
						!Boolean(
							_.find(this.tagArray, function (o) {
								return o.tag_name.toLowerCase() == tag_name.toLowerCase();
							})
						)
					) {
						this.tagArray.push({ id: 0, tag_name: tag_name });
						this.ArrayOfTags.push(tag_name);
					}
				});
			}
		});
	}
	//******* End new tag add  ******************/

	/***************** Form Group *****************************/

	//********* Add new ID card *************/
	addNewIDCard() {
		const newIDCardObj = {
			id_card_type: "",
			id_number: "",
			id: "",
			source: "",
		};
		this.IDCardArr.push(newIDCardObj);
	}
	/*************End Add new ID card **********/

	//********* remove ID card *************/
	removeIDCard() {
		if (this.IDCardArr?.length > 1) {
			this.IDCardArr.pop();
		}
	}
	/*************End remove ID card **********/

	addCustomerForm() {
		this.form = this.fb.group({
			patient_id: [""],
			patient_fname: ["", [Validators.required, Validators.maxLength(16)]],
			patient_lname: ["", [Validators.required, Validators.maxLength(16)]],
			middle_name: [""],
			customer_nickname: [""],
			patient_type: [""],
			dob: [""],
			gender: ["", [Validators.required]],
			country_id: ["", [Validators.required]],
			state_id: ["", [Validators.required]],
			city_id: ["", [Validators.required]],
			patient_mobile: ["", Validators.compose([Validators.required, Validators.minLength(7)])],
			patient_email: ["", Validators.compose([Validators.required, CustomValidators.email])],
			id_card_type: [""],
			id_number: [""],
			patient_license_number: [""],
			caregiver_license_number: [""],
			id: [""],
			source: ["Manual"],
			store_id: "",
			chain_id: "",
			password: "",
			address: "",
			status: "",
			notes: "",
			zipcode: "",
			discount: "",
			id_cards: "",
		});
	}

	handleIsEditing() {
		this.isEditing = !this.isEditing;
	}        

	handleOnSubmitGeneralEdit() {
	const form_obj = this.form.getRawValue();
	console.log(form_obj)
	this.api.editCustomer(form_obj.patient_id, form_obj).subscribe((response: any) => {
		console.log(response)
	}	
)}

	storeDetail(event, store, index) {
		const control: any = this.form.get("store_details");
		if (event.isUserInput) {
			if (event.source._selected) {
				control.push(this.addStoreDetail(store));
			} else {
				const tempData: any = this.form.get("store_details");
				tempData.removeAt(index);
			}
		}
	}
	private addStoreDetail(data) {
		return this.fb.group({
			store_id: [data.store_id],
			store_name: [data.name],
			salary: [0],
		});
	}
	getStateList(type, parent) {
		this.api.getLocationList(type, parent).subscribe((response: any) => {
			if (response.success) {
				this.stateList = response.data;
			 
			}
		});
	}
	getCityList(type, parent) {
		this.api.getLocationList(type, parent).subscribe((response: any) => {
			if (response.success) {
				this.cityList = response.data;
			}
		});
	}

	dropdownFilters() {
		this.filteredCountryOptions = this.form.controls["country_id"].valueChanges.pipe(
			startWith(""),
			map((val) => this.countryFilter(val))
		);
	}
	countryFilter(val) {
		console.log(val, "value from country filter");
	}

	countryDisplay(country?: any): string | undefined {
		return country ? country.location_name : undefined;
	}
	handleShowExtraCardInfo(evt) {
		if (evt == 1) {
			this.showExtraCardInfo = true;
		} else {
			this.showExtraCardInfo = false;
		}
	}
	ngOnInit() {
		this.genderArr = [
			{
				gender: "Male",
				gender_id: 0,
			},
			{
				gender: "Female",
				gender_id: 1,
			},
			{
				gender: "Others",
				gender_id: 2,
			},
		];

		this.patientTypeArr = [
			{
				patient_type: "Consumer",
				patient_type_id: 0,
			},
			{
				patient_type: "Caregiver",
				patient_type_id: 1,
			},
			{
				patient_type: "Patient",
				patient_type_id: 2,
			},
		];

		this.activatedRoute.params.subscribe((params: Params) => {
			if (params?.id) {
				this.api.getRawDetail().subscribe((response: any) => {
					if (response.success) {
						this.countryArr = response.data.country; 
						this.store_id = response.data.stores[0].store_id;
						this.getStateList('state', this.countryArr[0].location_id);
						this.api.getCustomer(params?.id, this.store_id).subscribe((response: any) => {
							console.log(response)
							if (Object.keys(response.data).length > 0) {
								this.getCityList('state', response.data.state_id)
								this.form.get("patient_fname").setValue(response.data.patient_fname);
								this.form.get("patient_id").setValue(response.data.patient_id);
								this.form.get("patient_lname").setValue(response.data.patient_lname);
								this.form.get("customer_nickname").setValue(response.data.customer_nickname);
								this.form.get("middle_name").setValue(response.data.middle_name);
								this.form.get("patient_mobile").setValue(response.data.patient_mobile);
								this.form.get("patient_email").setValue(response.data.patient_email);
								this.form.get("country_id").setValue(this.countryArr[0].location_id);
								this.form.get("state_id").setValue(response.data.state_id);
								this.form.get("city_id").setValue(response.data.city_id);

								this.tempState = response.data.state_id;
								this.tempCity = response.data.city_id;

								const tempGender = this.genderArr.find((gender) => gender.gender_id == response.data.gender);

								if (tempGender) {
									this.defaultGender = tempGender.gender_id;
								}

								this.form.get("id_number").setValue(response.data.id_number);
								this.form.get("source").setValue(response.data.source);

								this.viewOnly();
								this.contactInfoViewOnly();
								this.cardDetailsViewOnly();
							}
						});
					}

				});
			}
		});
		this.addCustomerForm();
	}
	ngDoCheck() {
		this.innerHeight = window.innerHeight - 192;
	}

	selectEvent(event) {
		this.form.get("city_id").setValue(event);
	}

	onFocused(event) {
	}
	/* canDeactivate code */

	viewOnly() {
		this.form.get("patient_fname").disable();
		this.form.get("middle_name").disable();
		this.form.get("patient_lname").disable();
		this.form.get("customer_nickname").disable();
		this.form.get("dob").disable();
		this.form.get("gender").disable();
		this.form.get("patient_type").disable();
		this.editable = false;
	}
	isEditable() {
		this.form.get("patient_fname").enable();
		this.form.get("middle_name").enable();
		this.form.get("patient_lname").enable();
		this.form.get("customer_nickname").enable();
		this.form.get("dob").enable();
		this.form.get("gender").enable();
		this.form.get("patient_type").enable();
		this.editable = true;
	}

	contactInfoViewOnly() {
		this.form.get("country_id").disable();
		this.form.get("state_id").disable();
		this.form.get("city_id").disable();
		this.form.get("patient_mobile").disable();
		this.form.get("patient_email").disable();
		this.isContactInfoEditable = false;
	}

	contactInfoEditable() {
		this.form.get("country_id").enable();
		this.form.get("state_id").enable();
		this.form.get("city_id").enable();
		this.form.get("patient_mobile").enable();
		this.form.get("patient_email").enable();
		this.isContactInfoEditable = true;
	}

	cardDetailsViewOnly() {
		this.form.get("id_number").disable();
		this.form.get("id_card_type").disable();
		this.form.get("caregiver_license_number").disable();
		this.form.get("patient_license_number").disable();
		this.form.get("source").disable();
		this.isCardDetailsEditable = false;
	}

	cardDetailsEditable() {
		this.form.get("id_number").enable();
		this.form.get("id_card_type").enable();
		this.form.get("caregiver_license_number").enable();
		this.form.get("patient_license_number").enable();
		this.form.get("source").enable();
		this.isCardDetailsEditable = true;
	}
}
