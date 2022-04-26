import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { EmailSettingComponent } from "../email-setting/email-setting.component";
import { UtilsServiceService } from "../../shared/services/utils-service.service";
import { SettingsService } from '../settings.service';
@Component({
	selector: "app-smtp-setting",
	templateUrl: "./smtp-setting.component.html",
	styleUrls: ["./smtp-setting.component.scss"],
})
export class SmtpSettingComponent implements OnInit {
	portList: any = ["25", "465", "587"];

	settingForm: FormGroup;

	constructor(public fb: FormBuilder, 
		public dialog: MatDialog, 
		private settingsService: SettingsService,
		private utils: UtilsServiceService) {}

	ngOnInit() {
		this.InitializeForm();
	}
	openEmailSetting() {
		let formData = this.settingForm.getRawValue();
		let errorMsg = "";
		for (const item in formData) {
			if (!formData[item] || formData[item] == "") {
				switch (item) {
					case "mail_host":
						errorMsg = "SMTP server";
						break;
					case "mail_port":
						errorMsg = "Port";
						break;
					case "mail_username":
						errorMsg = "Username";
						break;
					case "mail_password":
						errorMsg = "Password";
						break;
					case "mail_security":
						errorMsg = "Connection Security type";
						break;
					case "driver":
						errorMsg = "Driver type";
						break;
					default:
						errorMsg = "";
				}
				this.utils.showSnackBar(`${errorMsg} is required.`, { panelClass: "error" });
				return;
			}
		}

		const dialogRef = this.dialog.open(EmailSettingComponent, {
			width: "70%",
			maxWidth: "700px",
			data: { formData },
		});
		//Call after delete confirm model close
		dialogRef.afterClosed().subscribe((result) => {
			if (Boolean(result)) {
				//   this.inProgress = true;
				// this.isLoading = true;
				//   this.productobj['pageSize'] = 20;
				//   this.productobj['pageIndex'] = 0;
				//   result.product_type_id ? this.productobj['product_type_id'] = result.product_type_id ? JSON.stringify(result.product_type_id) : '' : delete this.productobj['product_type_id'];
				//   result.product_category_id ? this.productobj['product_category_id'] = result.product_category_id ? JSON.stringify(result.product_category_id) : '' : delete this.productobj['product_category_id'];
				//   result.tags ? this.productobj['tags'] = result.tags ? JSON.stringify(result.tags) : '' : delete this.productobj['tags'];
				//   this.filter_data = result;
				//   this.getVariantData();
			}
		});
	}
	//Initialize setting form
	InitializeForm() {
		this.settingForm = this.fb.group({
			mail_host: ["", Validators.compose([Validators.required])],
			mail_port: ["", Validators.compose([Validators.required])],
			mail_username: ["", Validators.compose([Validators.required])],
			mail_password: ["", Validators.compose([Validators.required])],
			mail_security: [""],
			driver: [""],
		});
	}

	//Save settings data
	SaveSettings(data) {
		if (Boolean(this.settingForm.valid)) {
			this.settingsService.storeMailConfiguration(data)
			.subscribe((response: any) => {
				if (response.success) {
					this.utils.showSnackBar(response.message);
				}
		});
	}
}
}
