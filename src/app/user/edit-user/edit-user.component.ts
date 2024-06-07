import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { TagComponent } from '../../dialog/tag/tag.component'
import { MatDialog } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { UserService } from '../user.service';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { environment } from '../../../environments/environment';
import { UtilsServiceService } from 'src/app/shared/services/utils-service.service';
import * as _ from 'lodash';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter }
  ],
})
export class EditUserComponent implements OnInit {

  public innerHeight: any;
  public type: string = 'component';
  public selected = false;
  public indexofTab = 0;
  public form: UntypedFormGroup;
  public generalInfosForm: UntypedFormGroup;
  public tagsForm: UntypedFormGroup;
  public hoursForm: UntypedFormGroup;
  public licenceForm: UntypedFormGroup;
  public storeForm: UntypedFormGroup;
  public addStore: UntypedFormGroup;
  public imageSrc: any = '/assets/images/default-image.png';
  public heightOfY;
  public deleteFileArray = [];
  public arrayOfFiles = [];
  public filesOfarray = [];
  public selectable: boolean = true;
  public removable: boolean = true;
  public removeTagArray = [];
  public tagName: string = "tag entry";
  public index: any = 'ALL';
  public tagArray: any = [];
  public isActive;
  public generalInfo: boolean = false;
  public tags: boolean = false;
  public ArrayOfTags: any = [];
  public licenceInfo: boolean = false;
  public storeInfo: boolean = false;
  public hours: boolean = false;
  public API_URL = environment.baseUrl + "api/";
  public cityList: any;
  public stateList: any;
  public rawDetail: any;
  public userData: any;
  public maxDate = new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate());
  public certification_Expiry_MinDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  public license_names: any[] = [{ id: 1, name: "Driving License" }, { id: 2, name: "Passport" }, { id: 3, name: "Health Insurance Identification Card" }]
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean;
  public hasAnotherDropZoneOver: boolean;
  public response: string;
  public user_id: any;
  public store_ids = [];
  public uploadDocForm: UntypedFormGroup;
  public dynamicHeight = "";
  public from: any;
  public to: any;
  public shift_error: string;
  public priceOptions = { prefix: '$ ', thousands: ',', decimal: '.', align: 'left', nullable: true, allowZero: false }

  employment_minDate = new Date(2000, 0, 1);
  employment_maxDate = new Date();

  LoginUser: any;
  public isAuthorized = false; //new
  public reset_type: any;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE CHANGES',
    //buttonColor: 'primary',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }
  constructor(
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public refVar: ChangeDetectorRef,
    private api: UserService,
    public utility: UtilsServiceService,
  ) {
    this.fileUploader();
    this.utility.indexofTab = 0;
    this.LoginUser = this.utility.getSessionData('currentUser');
    /* find admin */
    if (this.LoginUser.user_role && (this.LoginUser.user_role.findIndex(e => ['admin', 'superadmin'].includes(e)) > -1)) {
      this.isAuthorized = true;
    } else {
      this.isAuthorized = false;
    }
    /* find admin */
  }

  checkHeight() {
    this.innerHeight = window.innerHeight - 192;
  }
  //******* End new tag add  ******************/
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.user_id = +params['id'];
      this.initialiseState();
    });
    this.getUserbyId();
    this.getRawDetails();
    this.viewOnly();
  }

  ngDoCheck() {
    this.checkHeight();
  }

  initialiseState() {
    this.editUserFormGroup()
    this.getUserbyId();
    this.getRawDetails();
    this.viewOnly();
  }

  /**************************** Files Upload********************************** */

  fileUploader() {
    this.uploader = new FileUploader({
      disableMultipart: true,
      formatDataFunctionIsAsync: true,
      formatDataFunction: async item => {
        return new Promise((resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
    this.response = '';
  }

  //*************** Delete File ********************* */
  deleteFile(file?, index?) {
    this.utility.confirmDialog({ title: 'Delete Document', message: 'Are you sure want to delete document?' }).subscribe((result: any) => {
      if (Boolean(result)) {
        if (index !== -1 && file == 0) {
          let file_index = index - (this.arrayOfFiles.length - this.filesOfarray.length);
          this.filesOfarray.splice(file_index, 1);
          this.arrayOfFiles.splice(index, 1);

          this.licenceForm.get('file_input').setValue('');
        }
        else if (index !== -1 && file != 0) {
          var param = { _method: 'delete' }
          this.api.deleteDocument(file, param)
            .subscribe((response: any) => {
              if (response.success) {
                this.utility.showSnackBar(response.message);
                this.userDocumentArray.splice(index, 1);

              }
            });
        }
      }
    })
  }
  public isFormSubmitted: boolean = false;
  public uploadedDocName: any = "";

  uploadFile() {
    Object.keys(this.uploadDocForm.controls).forEach(key => {
      this.uploadDocForm.controls[key].markAsTouched();
    })
    this.isFormSubmitted = true;
    if (this.uploadDocForm.valid) {
      let uploadDocData = this.uploadDocForm.get('document_type_data').value
      this.uploadDocForm.get('document_type').setValue(uploadDocData.id_card_type_id);
      this.arrayOfFiles.push(this.uploadDocForm.value);
      this.filesOfarray.push(this.tempFile);
      this.uploadedDocName = "";
      this.isFormSubmitted = false;
      this.uploadDocForm.reset();
    }

    else
      return
  }
  public tempFile: any;
  onDocumentChange(event) {
    this.tempFile = event.target.files[0];
    this.uploadedDocName = event.target.files[0].name;
  }
  public fileCheck(input) {
    let self = this;
    if (input.target.files.length > 0) {
      let file = input.target.files[0];
      const reader = new FileReader();
      self.arrayOfFiles.push({ id: 0, file_name: file.name, file_path: file });
      self.filesOfarray.push(file);
      this.form.get('file_input').setValue('');
      reader.onload = () => { }
      reader.readAsDataURL(file);

    }
  }
  public fileDragged() {
    this.uploader.queue.forEach(element => {
      this.arrayOfFiles.push({ id: 0, original_name: element.file.name, file_path: element.file });
      this.filesOfarray.push(element.file.rawFile);
    });
    this.uploader.clearQueue()


  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    this.fileDragged();
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  onFileChange(event) {
    this.generalInfosForm.get('employee_image').setValue('');
    if (event.target.files.length > 0) {
      let image = event.target.files[0];
      if (["image/jpeg", "image/jpg", "image/png", 'image/gif'].indexOf(image.type) > -1) {
        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result;
        reader.readAsDataURL(image);
        this.refVar.detectChanges();
        this.generalInfosForm.get('employee_image').setValue(image);
      }
      else {
        this.utility.showSnackBar("Unsupported file format", { panelClass: 'error' });
      }
    }
  }
  //*********** Files Upload End*****************/


  //************ Remove tag ********************/
  removeTag(index, tag) {
    if (index !== -1) {
      this.tagArray.filter(tagArray => {
        if (tagArray.id != 0 && tagArray.id == tag && tag) {
          this.removeTagArray.push(tagArray.id);
        }
      })
      this.ArrayOfTags.splice(index, 1);
      this.tagArray.splice(index, 1);
    }
  }

  //******* Add new tag popup **************  */
  AddNewTag(): void {
    const dialogRef = this.dialog.open(TagComponent, {
      width: '550px',
      disableClose: true,
      data: { name: this.tagName, type: 'user' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (Boolean(result) && result.length > 0) {
        result.forEach(tag_name => {
          if (!Boolean(_.find(this.tagArray, function (o) { return o.tag_name.toLowerCase() == tag_name.toLowerCase(); }))) {
            this.tagArray.push({ id: 0, tag_name: tag_name })
            this.ArrayOfTags.push(tag_name)
          }
        })
      }
    });
  }
  //******* End new tag add  ******************/

  /************************** Editable Mode ******************************/
  viewOnly() {
    this.shiftFormsubmit = false;
    this.isFormSubmitted = false;
    this.generalInfo = false;
    this.tags = false;
    this.licenceInfo = false;
    this.storeInfo = false;
    this.hours = false;
    this.generalInfosForm.disable();
    this.licenceForm.disable();
    this.storeForm.disable();
    this.tagsForm.disable();
    this.uploadDocForm.disable();
    this.hoursForm.disable();
  }
  isEditable(key) {
    switch (key) {
      case 1:
        this.viewOnly();
        this.generalInfo = true;
        this.generalInfosForm.enable();
        this.generalInfosForm.controls['user_id'].disable();
        break;

      case 2:
        this.viewOnly();
        this.tagsForm.enable()
        this.tags = true;
        break;

      case 3:
        this.viewOnly();
        this.licenceForm.enable()
        this.uploadDocForm.enable()
        this.licenceInfo = true;
        break;

      case 4:
        this.viewOnly();
        this.storeForm.enable();
        this.storeForm.controls['role_level'].disable();
        this.storeInfo = true;
        break;
      case 5:
        this.viewOnly();
        this.hoursForm.enable()
        this.hours = true;
        break;

      default:
        break;
    }
  }

  /************************** End of Editable Mode ******************************/

  //***************** All Form Group *****************************/

  licenceInfoForm(user?: any) {
    this.licenceForm.patchValue({
      document_id: user.certificate_info.id,
      // license_name: user.certificate_info.document_name,
      // certification_number: user.certificate_info.certificate_number,
      // certification_country: user.certificate_info.certification_province,
      // c_e_date: user.certificate_info.expiry_date,
    });
  }
  storeAssignmentForm(store_id, user?: any) {
    this.storeForm = this.fb.group({
      store_ids: [store_id, [Validators.required]],
      store_details: this.getStoreDetail(user),
      role_level: [user.selected_role],
      designation: [user.designation],
      chain_name: [''],
      assign_multiple_store: [''],
      enable_timesheet: [''],
      enable_auto_clockout: [''],
      job_responsibilities: [user.job_responsibilities]
    });
  }
  editUserFormGroup() {
    this.generalInfosForm = this.fb.group({
      employee_image: [''],
      image: [''],
      user_id: [{ value: "", disabled: true }],
      user_fname: ['', Validators.compose([Validators.required])],
      user_lname: ['', Validators.compose([Validators.required])],
      user_nickname: [''],
      dob: ['', Validators.compose([Validators.required, CustomValidators.date])],
      address: ['', Validators.compose([Validators.required])],
      address_unit: [''],
      city: ['', Validators.compose([Validators.required])],
      zipcode: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      user_mobile: ['', Validators.compose([Validators.required])],
      user_email: ['', Validators.compose([Validators.required, CustomValidators.email])],
      salary: [null],
      date_of_employment: ['', [Validators.required]],
    });

    this.licenceForm = this.fb.group({
      document_id: [''],

      // license_name: ['', Validators.compose([Validators.required])],
      //certification_number: [''],
      // certification_expiry_date: [''],
      // certification_country: ['', Validators.compose([Validators.required])],
      file_input: [''],
      delete_file: [''],
      insert_file: [''],
      document_details: [[]],
      //c_e_date: ['', Validators.compose([Validators.required])],
      list_of_file: [''],
    });
    this.storeForm = this.fb.group({
      // store_details: [''],
      store_ids: ['', [Validators.required]],
      store_details: this.fb.array([]),
      role_level: [''],
      designation: [''],
      chain_name: [''],
      assign_multiple_store: [''],
      enable_timesheet: [''],
      enable_auto_clockout: [''],
      job_responsibilities: ['']
    });
    this.tagsForm = this.fb.group({
      tags: [''],
      add_tag: [''],
      remove_tag: ['']
    });
    this.uploadDocForm = this.fb.group({
      document: ['', [Validators.required]],
      document_title: ['', [Validators.required]],
      document_type: [''],
      document_type_data: ['', [Validators.required]],
      document_expiry_date: ['', [Validators.required]],
      certification_province: ['', [Validators.required]],

    });
    this.hoursForm = this.fb.group({
      shift: this.ShiftTimings(this.shiftDays),
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      store_id: ['', [Validators.required]]
    }, { validator: this.checkTimes });
  }

  //***************** End of All Form Group *****************************/

  storeDetail(event, store, index) {
    const control: any = this.storeForm.get('store_details');
    if (event.isUserInput) {
      if (event.source._selected) {
        control.push(this.addStoreDetail(store));
      } else {
        let tempControl = this.storeForm.controls.store_details.value;
        let updateItem = _.find(tempControl, { 'store_id': store.store_id });
        let dataindex = tempControl.indexOf(updateItem);
        const tempData: any = this.storeForm.get('store_details');
        tempData.removeAt(dataindex);
      }
    }
  }
  private addStoreDetail(data) {
    return this.fb.group({
      store_id: [data.store_id],
      store_name: [data.name],
    });
  }

  private getStoreDetail(data) {
    let array = new UntypedFormArray([])
    this.userData.stores.forEach(data => {
      array.push(this.fb.group({
        store_id: [data.store_id],
        store_name: [data.name],
      }));
    });
    return array;
  }

  //****************** Get State List **************/
  getStateList(type, parent) {
    this.api.getLocationList(type, parent)
      .subscribe((response: any) => {
        if (response.success) {
          this.stateList = response.data;
        }
      });
  }

  //****************** Get City List **************/
  getCityList(type, parent) {
    this.api.getLocationList(type, parent)
      .subscribe((response: any) => {
        if (response.success) {
          this.cityList = response.data;
        }
      });
  }

  //****************** Get raw Details **************/
  getRawDetails() {
    this.api.getRawDetail()
      .subscribe((response: any) => {
        if (response.success) {
          this.rawDetail = response.data;
        }
      });
  }

  public userDocumentArray: any = [];
  //****************** Get User Details **************/
  getUserbyId() {
    this.api.getUserDetailById(this.user_id)
      .subscribe((response: any) => {
        if (response.success) {

          if (response.data) {
            response.data.dob = _moment(response.data.dob, 'YYYY-MM-DD');
            response.data.certificate_info.expiry_date = _moment(response.data.certificate_info.expiry_date, 'YYYY-MM-DD');
          }
          this.userData = response.data;

          this.store_ids = this.userData.stores.map(x => x.store_id)
          this.userDocumentArray = [];
          this.filesOfarray = [];
          this.arrayOfFiles = [];
          this.removeTagArray = [];
          this.ArrayOfTags = [];
          this.userDocumentArray = this.userData.documents;
          if (Boolean(this.userData.user_image))
            this.imageSrc = this.userData.user_image;
          this.tagArray = this.userData.tags;
          this.getStateList("state", this.userData.country);
          this.getCityList("city", this.userData.state);
          //this.generalInfoForm(this.userData)
          this.storeAssignmentForm(this.store_ids, this.userData)
          this.licenceInfoForm(this.userData);
          this.hoursInfoForm(this.userData.shift);


          if (response.data) {
            // this.licenceForm.patchValue(this.userData);
            this.generalInfosForm.patchValue(this.userData)
            // this.form.disable()
          }

          this.viewOnly();
        }
      });
  }
  //********** General Info Section Store **************/
  generalInfoStore() {
    var data;
    let date = this.generalInfosForm.get('dob').value;
    let formatedDate = _moment(date).format("YYYY-MM-DD");
    this.generalInfosForm.get('dob').setValue(formatedDate);

    let emp_date = this.generalInfosForm.get('date_of_employment').value;
    let formatedEmpDate = _moment(emp_date).format("YYYY-MM-DD");
    this.generalInfosForm.get('date_of_employment').setValue(formatedEmpDate);

    if (this.generalInfosForm.get('employee_image').value) {
      data = {
        basic_details: JSON.stringify(this.generalInfosForm.value),
        employee_image: this.generalInfosForm.get('employee_image').value
      }
    }
    else {
      data = {
        basic_details: JSON.stringify(this.generalInfosForm.value),
      }
    }

    const formData = new FormData();

    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    });

    if (this.generalInfosForm.valid) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';
      this.SaveEditEmployee(formData);
    }else{
      this.utility.scrollToError();
    }
  }

  //********** Tag Section Store **************/

  tagsInfoStore() {
    const formData = new FormData();
    let tags = {
      tags: JSON.stringify({
        add_tag: this.ArrayOfTags,
        remove_tag: this.removeTagArray
      })
    }
    Object.keys(tags).forEach(key => {
      formData.append(key, tags[key])
    });
    if (this.tagArray.length > 0 || this.removeTagArray.length > 0) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';
      this.SaveEditEmployee(formData);
    }
  }



  //********** Shift Timing Section **************/
  from_time = ['00:00', '00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45', '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45', '24:00'];
  to_time = ['00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45', '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45', '24:00'];

  ShiftTimings(data) {
    let arr = new UntypedFormArray([])
    data.forEach(data => {
      arr.push(this.fb.group({
        id: [0],
        day_of_week: [data.day_of_week],
        name: [this.shiftDayNames[data.day_of_week - 1]],
        store_id: [data.store_id],
        isSelected: [false]
      }));
    })
    return arr;
  }

  /* validation for start time and end time not same and to time greater than start time */
  checkTimes(group: UntypedFormGroup) {
    let stime = group.controls.start_time.value;
    let etime = group.controls.end_time.value;
    if (stime && etime) {
      return stime >= etime ? { Same: true } : null;
    }
  }

  shiftTimes: any = []
  public shiftFormsubmit: boolean = false;
  public checkedDays: any;
  public err: boolean = true;
  public records: boolean = false;
  AddShiftTime() {
    this.shiftFormsubmit = true;
    this.records = false;
    this.from = this.hoursForm.controls['start_time'].value;
    this.to = this.hoursForm.controls['end_time'].value;
    this.checkedDays = Boolean(_.find(this.hoursForm.controls['shift'].value, (data: any) => data.isSelected));


    if (this.hoursForm.valid) {
      this.hoursForm.controls['shift'].value.map(item => item).filter(item => {
        if (item.isSelected) {
          //this.daysSelected = true;
          item.start_time = this.hoursForm.controls['start_time'].value
          item.end_time = this.hoursForm.controls['end_time'].value
          item.store_id = this.hoursForm.controls['store_id'].value.store_id
          item.store_name = this.hoursForm.controls['store_id'].value.name

          this.err = true;
          if (this.shiftTimes.find(data => data.day_of_week == item.day_of_week)) {
            this.shiftTimes.map(data => {
              if (data.day_of_week == item.day_of_week) {
                if (data.store_id == item.store_id) {
                  /* update the time */
                  data.start_time = item.start_time;
                  data.end_time = item.end_time;
                  data.store_id = item.store_id;
                  data.store_name = item.store_name;
                  this.shiftFormsubmit = false;
                  this.hoursForm.reset();
                  this.err = false;
                  /* update the time */

                } else {
                  if (data.start_time == item.start_time) {
                    if (data.end_time == item.end_time) {
                      this.shift_error = 'Employee is already occupied for this time with another Store!!';
                      this.err = false;
                    } else {
                      this.shift_error = 'Employee is already occupied for this  start time with another Store!!';
                      this.err = false;
                    }
                  } else {
                    if (data.end_time == item.end_time) {
                      this.shift_error = 'The end time is already selected for another store';
                      this.err = false;
                    } else {
                      if (item.start_time < data.end_time) {
                        if (item.start_time > data.start_time) {
                          this.shift_error = 'Invalid range selected';
                          this.err = false;
                        } else if (item.start_time < data.start_time) {

                          if (item.end_time > data.start_time) {
                            this.shift_error = 'Invalid range selected';
                            this.err = false;
                          }
                        }
                      }
                    }
                  }
                }
              }
            })
            /* push data to array */
            if (this.err) {
              this.shiftTimes.push(item);
              this.dynamicHeight = this.shiftTimes.length < 12 ? ((this.shiftTimes.length + 1) * 48 + 10) + "px" : '';
              this.shift_error = "";
              this.shiftFormsubmit = false;
              this.records = true;
              this.hoursForm.controls['shift'].setValue(this.shiftDays);
            }
            /* push data to array */
          }
          else {
            this.shiftTimes.push(item)
            this.dynamicHeight = this.shiftTimes.length < 12 ? ((this.shiftTimes.length + 1) * 48 + 10) + "px" : '';
            this.shiftFormsubmit = false;
            this.shift_error = "";
            this.records = true;
          }
          /* push data to array */
        }
      })
      this.shiftTimes = [...this.shiftTimes];
      if (this.records) {
        this.hoursForm.reset();
      }
      this.hoursForm.controls['shift'].setValue(this.shiftDays);
    }
  }


  shiftDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  hoursInfoForm(data?: any) {
    this.shiftTimes = [];
    data.forEach(item => {
      item.name = this.shiftDayNames[item.day_of_week - 1]
      this.shiftTimes.push(item);
      this.dynamicHeight = this.shiftTimes.length < 12 ? ((this.shiftTimes.length + 1) * 48 + 10) + "px" : '';
    })
  }

  shiftTimingInfoStore() {
    const formData = new FormData();
    var data;
    data = {
      shift: JSON.stringify(this.shiftTimes)
    }
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    });

    if (this.hoursForm) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';
      this.SaveEditEmployee(formData);
    }
  }

  DeleteShiftTime(index, id) {
    this.utility.confirmDialog({ title: 'Delete Timing', message: 'Are you sure want to delete store time?' }).subscribe((result: any) => {
      if (Boolean(result)) {
        if (id > 0) {
          this.api.deleteShiftTiming(id)
            .subscribe((response: any) => {
              if (response.success) {
                this.utility.showSnackBar(response.message);
                this.shiftTimes.splice(index, 1);
                this.shiftTimes = [...this.shiftTimes];
                this.dynamicHeight = this.shiftTimes.length < 12 ? ((this.shiftTimes.length + 1) * 48 + 10) + "px" : '';
              }
            });
        }
        else {
          this.shiftTimes.splice(index, 1);
          this.shiftTimes = [...this.shiftTimes];
          this.dynamicHeight = this.shiftTimes.length < 12 ? ((this.shiftTimes.length + 1) * 48 + 10) + "px" : '';
        }
      }
    })
  }

  shiftDays = [
    { "id": 0, "day_of_week": 1, "name": "Sunday", "store_id": "", isSelected: false },
    { "id": 0, "day_of_week": 2, "name": "Monday", "store_id": "", isSelected: false },
    { "id": 0, "day_of_week": 3, "name": "Tuesday", "store_id": "", isSelected: false },
    { "id": 0, "day_of_week": 4, "name": "Wednesday", "store_id": "", isSelected: false },
    { "id": 0, "day_of_week": 5, "name": "Thursday", "store_id": "", isSelected: false },
    { "id": 0, "day_of_week": 6, "name": "Friday", "store_id": "", isSelected: false },
    { "id": 0, "day_of_week": 7, "name": "Saturday", "store_id": "", isSelected: false },
  ]

  //********** Licence Section Store **************/
  licenceInfoStore() {
    // let certificationDate = this.licenceForm.get('c_e_date').value;
    // let cerificationFormatedDate = _moment(certificationDate).format("YYYY-MM-DD");
    // this.licenceForm.get('certification_expiry_date').setValue(cerificationFormatedDate);
    let licenceDetail = {
      //licenceDetail: JSON.stringify(this.licenceForm.value),
      documents: this.filesOfarray,
      document_details: JSON.stringify(this.arrayOfFiles)
    }

    let formData = new FormData();
    Object.keys(licenceDetail).forEach(key => {
      if (key == "documents") {
        if (this.filesOfarray.length > 0)
          Object.keys(this.filesOfarray).forEach(key => formData.append("documents[]", this.filesOfarray[key]));
      }
      else {
        formData.append(key, licenceDetail[key])
      }
    });

    if (this.licenceForm.valid) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';
      this.SaveEditEmployee(formData);
    }
  }

  //************ Store Info Store ****************/
  storeInfoStore() {
    this.storeForm.value.role_level = this.userData.selected_role;
    let data = {
      store_details: JSON.stringify(this.storeForm.value),
    }
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    });

    if (this.storeForm.valid) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';
      this.SaveEditEmployee(formData);
    }else{
      this.utility.scrollToError();
    }
  }

  //********** All Section Store **************/  

  //**************** API call for save emplyoee changes *******************/
  SaveEditEmployee(data) {
    data.append('chain_id', this.rawDetail.chains[0].chain_id)
    this.api.EditEmployee(data, this.user_id)
      .subscribe((response: any) => {
        this.viewOnly();
        if (response.success) {
          this.utility.showSnackBar(response.message);
          this.barButtonOptions.active = false;
          this.barButtonOptions.text = 'SAVE CHANGES';
          this.getUserbyId();

        }
        else {
          this.barButtonOptions.active = false;
          this.barButtonOptions.text = 'SAVE CHANGES';
        }
      },
        err => {
          this.barButtonOptions.active = false;
          this.barButtonOptions.text = 'SAVE CHANGES';
        });
  }

  //**************** Submit function to call Edit employee as per Sections and Save all *************************/
  onSubmit(event) {
    switch (event) {
      case "generalInfo":
        this.generalInfoStore();
        break;

      case "tagsInfo":
        this.tagsInfoStore();
        break;

      case "storeTimingInfo":
        this.shiftTimingInfoStore();
        break;

      case "licenceInfo":
        this.licenceInfoStore();
        break;

      case "storeInfo":
        this.storeInfoStore();
        break;

      default:
        break;
    }
  }

  resendMailToUnverifiedUser(email, type, message) {
    this.utility.confirmDialog({ title: 'Confirm', message: message, okButton: 'Yes', cancelButton: 'No' }).subscribe(result => {
      if (Boolean(result)) {
        const forgotData = new FormData();
        forgotData.append("email", email);
        forgotData.append("type", type);
        this.api.sendVerification(forgotData).subscribe((response: any) => {
          if (response.success) {
            this.utility.showSnackBar(response.message, { duration: 4000 });
          }
          else {
            this.utility.showSnackBar(response.message);
          }
        });
      }
    })
  }

  /* change password and pin by admin */
  public filter_data: any;
  openDialogue(user_id, email, chain_id, type): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '45%',
      maxWidth: "450px",
      data: { user_id: user_id, user_email: email, chain_id: chain_id, type: type }
    });
    //Call after delete confirm model close
    dialogRef.afterClosed().subscribe(result => {
      if (Boolean(result)) {
        
        this.reset_type = result.field_type == 'PIN' ? 'Pin' : 'Password';
        this.api.resetData(result).subscribe((response: any) => {
          if (response.success) {
            this.utility.showSnackBar( this.reset_type +" updated successfully!", { duration: 4000 });
          }
          else {
            this.utility.showSnackBar(response.message);
          }
        });

        // this.inProgress = true;
        // this.isLoading = true;
        // this.productobj['pageSize'] = 20;
        // this.productobj['pageIndex'] = 0;
        // result.product_type_id ? this.productobj['product_type_id'] = result.product_type_id ? JSON.stringify(result.product_type_id) : '' : delete this.productobj['product_type_id'];
        // result.product_category_id ? this.productobj['product_category_id'] = result.product_category_id ? JSON.stringify(result.product_category_id) : '' : delete this.productobj['product_category_id'];
        // result.tags ? this.productobj['tags'] = result.tags ? JSON.stringify(result.tags) : '' : delete this.productobj['tags'];
        
        // this.filter_data = result;
        // this.getVariantData();
      }
    });
  }
  /* change password and pin by admin */

}