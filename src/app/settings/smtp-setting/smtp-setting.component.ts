import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { EmailSettingComponent } from '../email-setting/email-setting.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-smtp-setting',
  templateUrl: './smtp-setting.component.html',
  styleUrls: ['./smtp-setting.component.scss']
})
export class SmtpSettingComponent implements OnInit {
  portList: any = ['25', '465', '587'];
  settingForm: UntypedFormGroup;

  constructor(public fb: UntypedFormBuilder, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.InitializeForm();
  }
  openEmailSetting() {
    let formData = this.settingForm.value;
    const dialogRef = this.dialog.open(EmailSettingComponent, {
      width: '70%',
      maxWidth: "700px",
      data: { formData }
    });
    //Call after delete confirm model close
    dialogRef.afterClosed().subscribe(result => {
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
      host: ['', Validators.compose([Validators.required])],
      port: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      connection_type: ['']
    })
  }

  //Save settings data
  SaveSettings(data) {
    if (Boolean(this.settingForm.valid)) {
      console.log(data);
    }

  }
}
