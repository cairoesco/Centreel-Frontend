import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import * as _moment from 'moment';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-chain-settings',
  templateUrl: './chain-settings.component.html',
  styleUrls: ['./chain-settings.component.scss']
})
export class ChainSettingsComponent implements OnInit {
  public form: UntypedFormGroup;
  public innerHeight: any;
  public taxForm: UntypedFormGroup;
  public barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE ALL',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }
  public encryptionList: any = [{ name: 'ssl', slug: 'ssl' }, { name: 'tls', slug: 'tls' }];
  public driverList: any = [{ name: 'smtp', slug: 'smtp' }, { name: 'mailgun', slug: 'mailgun' }];
  constructor(private fb: UntypedFormBuilder,
    private settingsService: SettingsService,
    public utility: UtilsServiceService,
    private router: Router) { }

  ngOnInit() {
    this.addChainSettingForm();
    this.taxSettingForm();
    this.viewOnly();
    this.GetChainData();
    this.GetFilterData();
    // this.GetTAxData();
  }
  addChainSettingForm() {
    this.form = this.fb.group({
      mail_username: ['', Validators.compose([Validators.required, CustomValidators.email])],
      mail_host: ['', Validators.required],
      mail_port: ['', Validators.required],
      mail_security: ['', Validators.required],
      mail_password: ['', Validators.required],
      driver: ['', [Validators.required, Validators.maxLength(16)]],
    });
  }

  /* TAX Setting form */
  taxSettingForm() {
    this.taxForm = this.fb.group({
      gst_exempt: [''],
      pst_exempt: [''],
      chain_id: [''],
    });
  }
  /* TAX Setting form */
  
  /* section enable disable */
  taxData: boolean = false
  emailData: boolean = false
  viewOnly() {
    this.taxData = false;
    this.taxForm.disable();

    this.emailData = false;
    this.form.disable();
  }
  isEditable(key) {
    this.viewOnly();
    switch (key) {
      case 1:
        this.form.enable()
        this.emailData = true;
        break;
      case 2:
        this.taxForm.enable()
        this.taxData = true;
        break;
      default:
        break;
    }
  }
  /* section enable disable */

  GetFilterData() {
    this.settingsService.getMailConfiguration().subscribe((response: any) => {
      if (response.success) {
        this.form.patchValue(response.data);
      }
    })
  }
  onSubmit() {
    const formData = new FormData();
    if (this.form.valid) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';
      Object.keys(this.form.value).forEach(key => {
        if (this.form.value[key] instanceof Object) {
          formData.append(key, JSON.stringify(this.form.value[key]));
        }
        else {
          formData.append(key, this.form.value[key]);
        }
      });

      this.settingsService.storeMailConfiguration(formData)
        .subscribe((response: any) => {
          if (response.success) {
            this.utility.showSnackBar(response.message);
            // this.router.navigateByUrl('settings');
            this.viewOnly();
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'SAVE ALL';

          }
          else {
            this.utility.showSnackBar(response.message, { panelClass: 'error' });
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'SAVE ALL';
          }
        },
          err => {
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'SAVE ALL';
          });

    }
  }

  /* get tax data */
  GetTAxData() {
    this.settingsService.gettaxData(this.chainID).subscribe((response: any) => {
      if (response.success) {
        this.taxForm.get('gst_exempt').patchValue(""+response.data[0].gst_exempt);
        this.taxForm.get('pst_exempt').patchValue(""+response.data[0].pst_exempt);
      }
    })
  }
  /* get tax data */

  /* get chain data */
  public chainID: any;
  GetChainData() {
    this.settingsService.getchainData().subscribe((response: any) => {
      if (response.success) {
        this.chainID = response.data.stores[0].chain_id;
        this.taxForm.get('chain_id').setValue(this.chainID);
        this.GetTAxData();
      }
    })
  }
  /* get tax data */


  onSubmit1() {
    const formData = new FormData();
    if (this.taxForm.valid) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';
      Object.keys(this.taxForm.value).forEach(key => {
        if (this.taxForm.value[key] instanceof Object) {
          formData.append(key, JSON.stringify(this.taxForm.value[key]));
        }
        else {
          formData.append(key, this.taxForm.value[key]);
        }
      });

      this.settingsService.taxformData(formData)
        .subscribe((response: any) => {
          if (response.success) {
            this.utility.showSnackBar(response.message);
            // this.router.navigateByUrl('settings');
            this.viewOnly();
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'SAVE ALL';

          }
          else {
            this.utility.showSnackBar(response.message, { panelClass: 'error' });
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'SAVE ALL';
          }
        },
          err => {
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'SAVE ALL';
          });

    }
  }

  ngDoCheck() {
    this.innerHeight = window.innerHeight - 190;
  }

}
