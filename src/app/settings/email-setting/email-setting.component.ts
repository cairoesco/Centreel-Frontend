import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SettingsService } from "../settings.service";

import { UtilsServiceService } from "../../shared/services/utils-service.service";
@Component({
	selector: "app-email-setting",
	templateUrl: "./email-setting.component.html",
	styleUrls: ["./email-setting.component.scss"],
})
export class EmailSettingComponent implements OnInit {
	public emailSettingsForm: FormGroup;
  public inProgress: boolean = false;
	filter_name: any;
	portList: any = [];
  	messageTypeList: any = ["free"];

	constructor(
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<EmailSettingComponent>,
		@Inject(MAT_DIALOG_DATA) public data: FilterDialogData,
    private utils: UtilsServiceService,
    private settingsService: SettingsService,
	) 
	{
		this.emailSettingsForm = this.fb.group({
			to: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
			message_type: ["free", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
			subject: [null, Validators.compose([Validators.required])],
			body: [null, Validators.compose([Validators.required])],
		});
	}

	onNoClick() {
    this.inProgress = true;
		let formData = this.emailSettingsForm.getRawValue();
		let errorMsg = "";
		for (const item in formData) {
			if (!formData[item] || formData[item] == "") {
				switch (item) {
					case "to":
						errorMsg = "Please provide recipient's email";
						break;
					case "subject":
						errorMsg = "Please provide email subject";
						break;
					case "body":
						errorMsg = "Please provide email body";
						break;
					default:
						errorMsg = "";
				}
				this.utils.showSnackBar(`${errorMsg}`, { panelClass: "error" });
				return;
			}
		}
    const query = `?to=${formData.to}&message_type=${formData.message_type}&subject=${formData.subject}&body=${formData.body}`;

    this.settingsService.sendEmailConfiguration({query, body: this.data }).subscribe((response: any) => {
			console.log(response);
			this.utils.showSnackBar(response.message);
    })
    // sendEmailConfiguration
    	this.inProgress = false;
		this.dialogRef.close(this.emailSettingsForm.value);
	}
	ngOnInit() {
		// this.form = this.fb.group({
		//   filter_name: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
		// });
	}

	/* close dialog box */
	close() {
		this.dialogRef.close();
	}
	/* close dialog box */
}
export interface FilterDialogData {
	animal: string;
	name: string;
}
