import { Component, OnInit } from '@angular/core';
import { UtilsServiceService } from '../../shared/services/utils-service.service'
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { SettingsService } from '../settings.service';
import { resource } from 'selenium-webdriver/http';

@Component({
  selector: 'app-store-setting',
  templateUrl: './store-setting.component.html',
  styleUrls: ['./store-setting.component.scss']
})
export class StoreSettingComponent implements OnInit {

  public innerHeight: any;
  public posForm: UntypedFormGroup;
  public kioskForm: UntypedFormGroup;
  public timetrackingForm: UntypedFormGroup;
  public storeId: any;
  LoginUser: any;
  constructor(
    private fb: UntypedFormBuilder,
    private settingsService: SettingsService,
    public utility: UtilsServiceService,
  ) {

    // this.LoginUser = this.utility.getSessionData("currentUser")

  }

  //#region ______________________ Store Settings Form Section ______________________/

  storeSettingForm() {
    this.posForm = this.fb.group({
      store_ids: [''],
      geo_fencing: ['0'],
      idle_time: ['', [Validators.required]],
      cannabis_discount: ['', [Validators.required]],
      non_cannabis_discount_by_staff: ['', [Validators.required]],
      cannabis_discount_by_manager: ['', [Validators.required]],
      non_cannabis_discount_by_manager: ['', [Validators.required]],
      order_checkout_pin_verify: ['0'],
      store_close_notify: ['0'],
      store_close_notify_time: ['0'],
      section: [1],
      cannabis_customer_require: [0],
      non_cannabis_customer_require: [0],
      customer_statistics: ['0'],
      dry_weight_limit: ['0'],
    });
    this.kioskForm = this.fb.group({
      store_ids: [''],
      enable_kiosk: ['0'],
      video: [''],
      kiosk_promo_timeout: ['', [Validators.required]],
      section: [2],
      video_upload: ['']
    });
    this.timetrackingForm = this.fb.group({
      store_ids: [''],
      employee_clock_in_out: ['0'],
      auto_clock_out_notify: ['0'],
      auto_clock_out: ['0'],
      auto_clock_out_time: ['', [Validators.required, Validators.pattern('^[0-1][0-9]:[0-5][0-9]$|^[2][0-3]:[0-5][0-9]$|^[2][3]:[0][0]$')]],
      auto_clock_out_hour: [''],
      section: [3],
    });
  }
  //#endregion

  //#region ______________________ Section Enable-Disable ______________________/

  posData: boolean = false
  kioskData: boolean = false
  timeTrackingData: boolean = false
  viewOnly() {
    this.posData = false;
    this.posForm.disable();

    this.kioskData = false;
    this.kioskForm.disable();

    this.timeTrackingData = false;
    this.timetrackingForm.disable();
  }

  isEditable(key) {
    this.viewOnly();
    switch (key) {
      case 1:
        this.posForm.enable()
        this.posData = true;
        break;
      case 2:
        this.kioskForm.enable()
        this.kioskData = true;
        break;
      case 3:
        this.timetrackingForm.enable()
        this.isAutoClockOut(0);
        this.timeTrackingData = true;
        break;
      default:
        break;
    }
  }
  //#endregion

  //#region ______________________ Submit Form  ______________________/
  posStore(event) {
    var cannabis = this.posForm.controls.cannabis_customer_require;
    var noncannabis = this.posForm.controls.non_cannabis_customer_require;
    cannabis.value? cannabis.setValue(1) : cannabis.setValue(0);
    noncannabis.value? noncannabis.setValue(1) : noncannabis.setValue(0);
    
    this.posForm.controls.store_ids.setValue([this.storeId])
    const formData = new FormData();
    Object.keys(this.posForm.value).forEach(key => {
      if (this.posForm.value[key] instanceof Object) {
        formData.append(key, JSON.stringify(this.posForm.value[key]));
      } else {
        formData.append(key, this.posForm.value[key]);
      }
    });

    //  formData.append('section', event)
    if (this.posForm.valid)
      this.updateStoreSettings(formData);

  }
  kioskStore(event) {
    this.kioskForm.controls.store_ids.setValue([this.storeId])

    const formData = new FormData();
    Object.keys(this.kioskForm.value).forEach(key => {
      if (key == "video") {
        formData.append(key, this.kioskForm.value[key]);
      } else {

        if (this.kioskForm.value[key] instanceof Object) {
          formData.append(key, JSON.stringify(this.kioskForm.value[key]));
        } else {
          formData.append(key, this.kioskForm.value[key]);
        }
      }
    });
    //formData.append('section', event)
    if (this.kioskForm.valid)
      this.updateStoreSettings(formData);
  }
  timeTrackingStore(event) {
    if(this.timetrackingForm.controls.auto_clock_out_time.value){
      let minutes = this.convert_hour_to_min(this.timetrackingForm.controls.auto_clock_out_time.value)
      this.timetrackingForm.controls.auto_clock_out_hour.setValue(minutes);
    }
    if (this.timetrackingForm.valid)
      

    this.timetrackingForm.controls.store_ids.setValue([this.storeId])

    const formData = new FormData();
    Object.keys(this.timetrackingForm.value).forEach(key => {
      if (this.timetrackingForm.value[key] instanceof Object) {
        formData.append(key, JSON.stringify(this.timetrackingForm.value[key]));
      } else {
        formData.append(key, this.timetrackingForm.value[key]);
      }
    });
    //  formData.append('section', event)
    if (this.timetrackingForm.valid)
      this.updateStoreSettings(formData);
  }
  updateStoreSettings(formData) {
    this.settingsService.updateStoreSettings(formData)
      .subscribe((response: any) => {
        if (response.success) {
          this.utility.showSnackBar(response.message);
          this.viewOnly();
          this.barButtonOptions.active = false;
          this.barButtonOptions.text = 'SAVE CHANGES';
        }
        else {
          this.utility.showSnackBar(response.message, { panelClass: 'error' });
          this.barButtonOptions.active = false;
          this.barButtonOptions.text = 'SAVE CHANGES';
        }
      },
        err => {
          this.barButtonOptions.active = false;
          this.barButtonOptions.text = 'SAVE CHANGES';
        });
  }

  /* file upload */
  onFileChange(event) {
    if (event.target.files) {
      let video_file = event.target.files[0];
      if (["video/mp4", "video/quicktime", "video/mpeg", 'video/x-matroska'].indexOf(video_file.type) > -1) {
        this.kioskForm.get('video').setValue(video_file);
      } else {
        this.utility.showSnackBar("Unsupported file format", { panelClass: 'error' });
      }
      this.kioskForm.get('video_upload').setValue('');
    }
  }
  /* file upload */

  /* converts hours to minutes */
  convert_hour_to_min(hours) {
    let total;
    let hh = hours.split(":");
    //console.log(hh[0]); return false;
    if (hh[0] != '00') {
      hh[0] = +hh[0]
      hh[1] = +hh[1]
      total = (hh[0] * 60 + hh[1]);
    } else {
      total = hh[1];
    }
    return total;
    console.log(total);
  }
  /* converts hours to minutes */

  onSubmit(event) {
    switch (event) {
      case "posData":
        this.posStore(event);
        break;

      case "kioskData":
        this.kioskStore(event);
        break;

      case "timeTrackingData":
        this.timeTrackingStore(event);
        break;

      default:
        break;
    }
  }
  //#endregion

  ngDoCheck() {
    this.innerHeight = window.innerHeight - 192;
  }
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE CHANGES',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }

  //---------- Get store setting ------------

  getStoreSettingDetails(storeId) {
    this.settingsService.getStoreSettings(storeId).subscribe((response: any) => {
      if (response.success && response.data.length > 0) {
        response.data[0].geo_fencing = ""+response.data[0].geo_fencing
        response.data[0].enable_kiosk = ""+response.data[0].enable_kiosk
        response.data[0].store_close_notify = ""+response.data[0].store_close_notify
        response.data[0].order_checkout_pin_verify = ""+response.data[0].order_checkout_pin_verify
        response.data[0].auto_clock_out = ""+response.data[0].auto_clock_out
        response.data[0].auto_clock_out_notify = ""+response.data[0].auto_clock_out_notify
        response.data[0].employee_clock_in_out = ""+response.data[0].employee_clock_in_out
        response.data[0].auto_clock_out_time = response.data[0].auto_clock_out_time.substring(0, 5);
        response.data[0].customer_statistics = ""+response.data[0].customer_statistics //customer statistics
        response.data[0].dry_weight_limit = ""+response.data[0].dry_weight_limit //dry weight
        response.data[0].cannabis_discount = ""+response.data[0].flower_discount
        response.data[0].non_cannabis_discount_by_staff = ""+response.data[0].paraphernalia_discount_by_staff
        response.data[0].cannabis_discount_by_manager = ""+response.data[0].flower_discount_by_manager
        response.data[0].non_cannabis_discount_by_manager = ""+response.data[0].paraphernalia_discount_by_manager
        response.data[0].cannabis_customer_require = +response.data[0].flower_customer_require
        response.data[0].non_cannabis_customer_require = +response.data[0].paraphernalia_customer_require

        this.posForm.patchValue(response.data[0])
        this.kioskForm.patchValue(response.data[0])
        this.timetrackingForm.patchValue(response.data[0])
      }
    })
  }

  //-------------- Get store for ddl ----------
  stores: any[];
  getStoreList() {
    this.settingsService.getStoreList().subscribe((response: any) => {
      if (response.success) {
        this.stores = response.data.stores;
        this.storeId = this.stores[0].store_id;
        this.changeStore(this.storeId)
      }
    })
  }

  changeStore(storeId) {
    //this.storeSettingForm();
    this.getStoreSettingDetails(storeId);
  }

  ngOnInit() {
    this.storeSettingForm();
    this.viewOnly();
    this.getStoreList();
  }

  isAutoClockOut(val){
    if(val == '0'){
      this.timetrackingForm.get('auto_clock_out_time').disable();
      this.timetrackingForm.controls.auto_clock_out_time.setValue('00:00');
    }else{
      this.timetrackingForm.get('auto_clock_out_time').enable();
    }
  }
}
