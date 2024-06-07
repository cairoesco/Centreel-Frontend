import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { TagComponent } from '../../dialog/tag/tag.component'
import { MatDialog } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import {  CustomerService } from '../customer.service';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import * as _ from 'lodash';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter }
  ],
})
export class AddCustomerComponent implements OnInit {

  public innerHeight: any;
  public type: string = 'component';
  public selected = false;
  public indexofTab = 0;
  public uploadDocForm: UntypedFormGroup;
  public shiftForm: UntypedFormGroup;
  public form: UntypedFormGroup;
  public generalInfosForm: UntypedFormGroup;
  public tagsForm: UntypedFormGroup;
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
  public ArrayOfTags: any = [];
  public stateList: any;
  public isActive;
  public generalInfo: boolean = false;
  public tags: boolean = false;
  public licenceInfo: boolean = false;
  public storeInfo: boolean = false;
  public cityList: any;
  public rawDetail: any;
  public uploadedDocName: any = "";
  public dynamicHeight = "";
  public from: any;
  public to: any;
  public shift_error: string;
  public genderArr: any;
  public cardTypeArr: any;
  public IDCardArr: any;
  public store_id: any;
  public chain_id: any;
  public priceOptions = { prefix: '$ ', thousands: ',', decimal: '.', align: 'left', nullable: true, allowZero: false }
  currentUserDetail: any;

  employment_minDate = new Date(2000, 0, 1);
  employment_maxDate = new Date();
  
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE ALL',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }
  barUploadButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'UPLOAD DOCUMENT',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }
  maxDate = new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate());
  certification_Expiry_MinDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  constructor(
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public refVar: ChangeDetectorRef,
    private api: CustomerService,
    public utility: UtilsServiceService,
    private router: Router
  ) {
    this.fileUploader();
    this.utility.indexofTab = 0;
    this.currentUserDetail = this.utility.getSessionData('currentUser');
  }

  /**************************** Files Upload********************************** */
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
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
  /*************** Delete File ********************* */
  deleteFile(index) {
    if (index !== -1) {
      this.arrayOfFiles.splice(index, 1);
      this.filesOfarray.splice(index, 1);
      this.form.get('file_input').setValue('');
    }
  }
  public fileDragged() {
    this.uploader.queue.forEach(element => {
      this.arrayOfFiles.push({ id: 0, original_name: element.file.name });
      this.filesOfarray.push(element.file.rawFile);
    });
    this.uploader.clearQueue()
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    this.fileDragged();
  }
  public isFormSubmitted: boolean = false;
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
  onFileChange(event) {
    if (event.target.files.length > 0) {
      let image = event.target.files[0];
      if (["image/jpeg", "image/jpg", "image/png", 'image/gif'].indexOf(image.type) > -1) {
        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result;
        reader.readAsDataURL(image);
        this.refVar.detectChanges();
        this.form.get('employee_image').setValue(image);
      }
      else {
        this.utility.showSnackBar("Unsupported file format", { panelClass: 'error' });
      }
      this.form.get('image').setValue('');
    }
  }
  /**************************** Files Upload End********************************** */



  /************************ Add Employee Section ************************************/
  onSubmit() {
    

    let date = this.form.get('dob').value;
    let formatedDate = _moment(date).format("YYYY-MM");
    this.form.get('dob').setValue(formatedDate);

    this.form.get('store_id').setValue(this.store_id);
    this.form.get('chain_id').setValue(this.chain_id);

    const cardObj = [
    {
      id_card_type: this.form.value.id_card_type,
      id_number: this.form.value.id_number,
      source: this.form.value.source,
      id: '',
    }
    ];
    this.form.get('id_cards').setValue(JSON.stringify(cardObj));


    const formData = new FormData();
    formData.append("chain_id", this.rawDetail.chains[0].chain_id);
    
    if (this.form.valid) {
      this.barButtonOptions.text = "Saving Data...";
      this.barButtonOptions.active = true;
      this.barButtonOptions.disabled = true;
      this.api.AddCustomer(this.form.value)
        .subscribe((response: any) => {
          if (response.success) {
            this.utility.showSnackBar(response.message);
            this.router.navigateByUrl('customer');
          }
        }, error => {
          this.barButtonOptions.text = "SAVE ALL";
          this.barButtonOptions.active = false;
          this.barButtonOptions.disabled = false;
        });
    }else{
      this.utility.scrollToError();
    }
  }

  //************ Remove tag ********************/
  removeTag(index, tag) {
    if (index !== -1) {
      this.tagArray.filter(tagArray => {
        if (tagArray.id != 0 && tagArray.id == tag) {
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

  /***************** Form Group *****************************/

  //********* Add new ID card *************/
    addNewIDCard() {
      const newIDCardObj = {
        id_card_type: '',
        id_number: '',
        id: '',
        source: ''
      }
      this.IDCardArr.push(newIDCardObj)
    }
  /*************End Add new ID card **********/

  //********* remove ID card *************/
    removeIDCard() {
     if(this.IDCardArr?.length > 1){
      this.IDCardArr.pop()
     }
      
    }
  /*************End remove ID card **********/

  addCustomerForm() {
    
    this.form = this.fb.group({
      patient_fname: ['', [Validators.required, Validators.maxLength(16)]],
      patient_lname: ['', [Validators.required, Validators.maxLength(16)]],
      middle_name: [''],
      customer_nickname: [''],
      dob: [''],
      gender: ['', [Validators.required]],

      country_id: [''],
      state_id: [''],
      city_id: [''],

      patient_mobile: ['', Validators.compose([Validators.required, Validators.minLength(7)])],
      patient_email: ['', Validators.compose([Validators.required, CustomValidators.email])],
      id_card_type: [''],
      id_number: [''],
      id: [''],
      source: ['Manual'],
      store_id: '',
      chain_id: '',
      password: '',
      address: '',
      status: '',
      notes: '',
      zipcode: '',
      discount: '',
      id_cards: ''


    });
  }

  storeDetail(event, store, index) {
    const control: any = this.form.get('store_details');
    if (event.isUserInput) {
      if (event.source._selected) {
        control.push(this.addStoreDetail(store));
      } else {
        const tempData: any = this.form.get('store_details');
        tempData.removeAt(index);
      }
    }
  }
  private addStoreDetail(data) {
    return this.fb.group({
      store_id: [data.store_id],
      store_name: [data.name],
      salary: [0]
    });
  }
  getStateList(type, parent) {
    this.api.getLocationList(type, parent)
      .subscribe((response: any) => {
        if (response.success) {
          this.stateList = response.data;
        }
      });
  }
  getCityList(type, parent) {
    this.api.getLocationList(type, parent)
      .subscribe((response: any) => {
        if (response.success) {
          this.cityList = response.data;
        }
      });
  }
  getRawDetails() {
    this.api.getRawDetail()
      .subscribe((response: any) => {

        if (response.success) {
          this.rawDetail = response.data;
          let user_role_id = this.currentUserDetail.role_id[0];
          this.store_id = response.data.stores[0].store_id;
          this.chain_id = response.data.stores[0].chain_id;

          this.cardTypeArr = response.data.id_card_types

          this.rawDetail.roles = _.filter(response.data.roles, function (o) { return o.role_id > user_role_id; });
        }
      });
  }
  ngOnInit() {
    this.addCustomerForm();
    this.getRawDetails();
    this.genderArr = [
      {
        gender: 'Male',
        gender_id: 0
      },
      {
        gender: 'Female',
        gender_id: 1
      },
      {
        gender: 'Others',
        gender_id: 2
      },
    ];

  }
  ngDoCheck() {
    this.innerHeight = window.innerHeight - 192;
  }

  /* Shift Timing */
  
  /* validation for start time and end time not same and to time greater than start time */
  checkTimes(group: UntypedFormGroup) { 
    let stime = group.controls.start_time.value;
    let etime = group.controls.end_time.value;
    if(stime && etime){  
      return stime >= etime ? { Same: true } : null; 
    }
  }

  from_time = ['00:00','00:15','00:30','00:45','01:00','01:15','01:30','01:45','02:00','02:15','02:30','02:45','03:00','03:15','03:30','03:45','04:00','04:15','04:30','04:45','05:00','05:15','05:30','05:45','06:00','06:15','06:30','06:45','07:00','07:15','07:30','07:45','08:00','08:15','08:30','08:45','09:00','09:15','09:30','09:45','10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45','16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45','18:00','18:15','18:30','18:45','19:00','19:15','19:30','19:45','20:00','20:15','20:30','20:45','21:00','21:15','21:30','21:45','22:00','22:15','22:30','22:45','23:00','23:15','23:30','23:45','24:00'];
  to_time = ['00:15','00:30','00:45','01:00','01:15','01:30','01:45','02:00','02:15','02:30','02:45','03:00','03:15','03:30','03:45','04:00','04:15','04:30','04:45','05:00','05:15','05:30','05:45','06:00','06:15','06:30','06:45','07:00','07:15','07:30','07:45','08:00','08:15','08:30','08:45','09:00','09:15','09:30','09:45','10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45','16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45','18:00','18:15','18:30','18:45','19:00','19:15','19:30','19:45','20:00','20:15','20:30','20:45','21:00','21:15','21:30','21:45','22:00','22:15','22:30','22:45','23:00','23:15','23:30','23:45','24:00'];
  ShiftTimings(shiftDays) {
    let arr = new UntypedFormArray([])
    shiftDays.forEach(data => {
      arr.push(this.fb.group({
        day_of_week: [data.day_of_week],
        name: [data.name],
        start_time: ['00:00'],
        end_time: ['00:00'],
        store_id: [data.store_id],
        isSelected: [false]
      }));
    })
    return arr;
  }

  shiftDays = [
    { "day_of_week": 1, "name": "Sunday", "start_time": "", "end_time": "", "store_id":"", isSelected: false },
    { "day_of_week": 2, "name": "Monday", "start_time": "", "end_time": "", "store_id":"", isSelected: false },
    { "day_of_week": 3, "name": "Tuesday", "start_time": "", "end_time": "", "store_id":"", isSelected: false },
    { "day_of_week": 4, "name": "Wednesday", "start_time": "", "end_time": "", "store_id":"", isSelected: false },
    { "day_of_week": 5, "name": "Thursday", "start_time": "", "end_time": "", "store_id":"", isSelected: false },
    { "day_of_week": 6, "name": "Friday", "start_time": "", "end_time": "", "store_id":"", isSelected: false },
    { "day_of_week": 7, "name": "Saturday", "start_time": "", "end_time": "", "store_id":"", isSelected: false },
  ]

  shiftTime: any = []
  public shiftFormsubmit: boolean = false;
  public checkedDays: any;
  public err: boolean = true;
  public records: boolean = false;
  AddShiftTime() {
    this.shiftFormsubmit = true;
    this.records = false;
    this.from = this.shiftForm.controls['start_time'].value;
    this.to = this.shiftForm.controls['end_time'].value;
    this.checkedDays = Boolean(_.find(this.shiftForm.controls['shift'].value,(data:any)=> data.isSelected));

    if (this.shiftForm.valid) {
    this.shiftForm.controls['shift'].value.map(item => item).filter(item => {
      if (item.isSelected) {
        
        item.start_time = this.shiftForm.controls['start_time'].value
        item.end_time = this.shiftForm.controls['end_time'].value
        item.store_id = this.shiftForm.controls['store_id'].value.store_id
        item.store_name = this.shiftForm.controls['store_id'].value.name

        this.err = true;
        if (this.shiftTime.find(data => data.day_of_week == item.day_of_week)) {
          this.shiftTime.map(data => {
            if (data.day_of_week == item.day_of_week) {
              if(data.store_id == item.store_id){
                /* update the time */
                data.start_time = item.start_time;
                data.end_time = item.end_time;
                data.store_id = item.store_id;
                data.store_name = item.store_name;
                this.shiftFormsubmit = false;
                this.records = true;
                //this.shiftForm.reset();
                this.err = false;
                /* update the time */
                
              }else{
                if(data.start_time == item.start_time){
                  if(data.end_time == item.end_time){
                    this.shift_error = 'Employee is already occupied for this time with another Store!!';
                    this.err = false;
                  }else{
                    this.shift_error = 'Employee is already occupied for this  start time with another Store!!';
                    this.err = false;
                  }
                }else{
                  if(data.end_time == item.end_time){
                    this.shift_error = 'The end time is already selected for another store';
                    this.err = false;
                  }else{
                    if(item.start_time < data.end_time){
                      if(item.start_time > data.start_time){
                        this.shift_error = 'Invalid range selected';
                        this.err = false;
                      }else if(item.start_time < data.start_time){
                        
                        if(item.end_time > data.start_time){
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
          if(this.err){
            this.shiftTime.push(item);
            this.dynamicHeight = this.shiftTime.length < 12 ? ((this.shiftTime.length + 1) * 48 + 10) + "px" : '';
            this.shift_error = "";
            this.shiftFormsubmit = false;
            //this.shiftForm.reset();
            this.records = true;
            this.shiftForm.controls['shift'].setValue(this.shiftDays);
          }
          /* push data to array */
        }
        else {
          this.shiftTime.push(item)
          this.dynamicHeight = this.shiftTime.length < 12 ? ((this.shiftTime.length + 1) * 48 + 10) + "px" : '';
          this.shiftFormsubmit = false;
          this.shift_error = "";
          this.records = true;
        }
      }
    })
    this.shiftTime = [...this.shiftTime];
    //this.shiftFormsubmit = false;
    //this.shiftForm.reset();
    // this.shiftForm.controls['start_time'].setValue('')
    // this.shiftForm.controls['end_time'].setValue('')
    if(this.records){
      this.shiftForm.reset();
    }
    this.shiftForm.controls['shift'].setValue(this.shiftDays);
    }
  }

  DeleteStoreTime(index) {
    this.shiftTime.splice(index, 1);
    this.shiftTime = [...this.shiftTime];
    this.dynamicHeight = this.shiftTime.length < 12 ? ((this.shiftTime.length + 1) * 48 + 10) + "px" : '';
  }
  /* Shift Timing */

  /* canDeactivate code */
  async canDeactivate() {
    var result_dt = await this.getConfirmData();
    if (Boolean(result_dt)) {
      return true;
    } else {
      return false;
    }
  }

  async getConfirmData(): Promise<any> {

    let filled_data = 0;
    if(this.form.dirty){
      filled_data = 1;
    }

    if (filled_data && !this.form.valid) {
      return this.utility.confirmDialog({ title: 'Please confirm the action', message: 'Are you sure you\'d like to leave the page? You\'ll lose all your progress?', okButton: 'LEAVE', cancelButton: 'CANCEL' }).toPromise();
    } else {
      return true;
    }
  }
  /* canDeactivate code */
}