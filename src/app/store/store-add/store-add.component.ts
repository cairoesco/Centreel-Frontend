import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MatDialog } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { TagComponent } from '../../dialog/tag/tag.component';
import { TillComponent } from '../../dialog/till/till.component';
import * as _ from 'lodash';
import { StoreService } from '../store.service'
import { UtilsServiceService } from 'src/app/shared/services/utils-service.service';
import { WarehouseModalComponent } from '../warehouse-modal/warehouse-modal.component';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
@Component({
  selector: 'app-store-add',
  templateUrl: './store-add.component.html',
  styleUrls: ['./store-add.component.scss']
})
export class StoreAddComponent implements OnInit {

  public rawData: any
  public innerHeight: any;
  public type: string = 'component';
  public selected = false;
  public indexofTab = 0;
  public create_store_form: UntypedFormGroup;
  public addStore: UntypedFormGroup;
  public heightOfY;
  public chains = [];
  public countryList: any;
  public provinceList: any;
  public cityList: any;
  public arrayOfFiles = [];
  public filesOfarray = [];
  public arrayOfImages = [];
  public imagesOfarray = [];
  public noImageSelect: boolean = false;
  public uploadDocForm: UntypedFormGroup;
  public uploadedDocName: any = "";
  public dynamicHeight = "";

  constructor(private route: ActivatedRoute, private fb: UntypedFormBuilder, public dialog: MatDialog, public refVar: ChangeDetectorRef,
    public storeService: StoreService,
    public utility: UtilsServiceService,
    private router: Router) {
    this.fileUploader();
    this.utility.indexofTab = 0;
  }

  addStoreForm() {
    this.create_store_form = this.fb.group({
      /* store info */
      chain_id: ['', Validators.required],
      name: ['', Validators.compose([Validators.required])],
      contact_email: ['', Validators.compose([Validators.required, CustomValidators.email])],
      contact_no: ['', Validators.compose([Validators.required, Validators.minLength(7)])],
      latitude: ['000000'],
      longitude: ['000000'],
      address: ['', Validators.compose([Validators.required])],
      address_unit: ['', Validators.required],
      country: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      zipcode: ['', Validators.compose([Validators.required])],
      store_image: [''],
      tags: this.fb.array([]),
      store_document: [],
      store_location: ['store location'],
      website: [''],
      description: ['', Validators.required],
      license_details: this.LicensesFormArray(),
      store_timings: this.StoreTimings(this.storeDays),
      opens: [''],
      closes: [''],
      warehouse_details: this.fb.array([]),
      till_details: this.fb.array([]),
      tax_no: [''],
      document_details: [[], [Validators.required]],
    });
    this.uploadDocForm = this.fb.group({
      document: ['', [Validators.required]],
      document_title: ['', [Validators.required]],
      document_type: [''],
      document_type_data: ['', [Validators.required]],
      document_expiry_date: ['', [Validators.required]],

    })
  }

  //#region -------------------------- Image & Document ---------------------------------------
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
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
  }

  //***** Image */
  public ImageFileDragged(e: any) {
    this.hasBaseDropZoneOver = e;
    this.uploader.queue.forEach(element => {
      let imageElement: any = element.file.rawFile;
      if (["image/jpeg", "image/jpg", "image/png", 'image/gif'].indexOf(imageElement.type) > -1) {
        let imageFile: any;
        const reader = new FileReader();
        reader.onload = (res) => {
          imageFile = reader.result;
          this.arrayOfImages.push({ file_id: 0, file_name: element.file.name, file_path: imageFile });
        }
        reader.readAsDataURL(imageElement);
        this.refVar.detectChanges();
        this.imagesOfarray.push(imageElement);
      } else {
        this.utility.showSnackBar("Unsupported file format", { panelClass: 'error' });
      }
    });
    this.uploader.clearQueue();
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
  DeleteImage(index) {
    if (index !== -1) {
      this.arrayOfImages.splice(index, 1);
      this.imagesOfarray.splice(index, 1);
    }
  }

  //****** Document */
  public documentFileDragged(e: any) {
    this.hasBaseDropZoneOver = e;
    this.uploader.queue.forEach(element => {
      let imageElement: any = element.file.rawFile;
      this.arrayOfFiles.push({ file_id: 0, file_name: element.file.name, file_path: element.file });
      this.filesOfarray.push(imageElement);
    });
    this.uploader.clearQueue();
  }
  deleteFile(index) {
    if (index !== -1) {
      this.arrayOfFiles.splice(index, 1);
      this.filesOfarray.splice(index, 1);
    }
  }
  //#endregion --------------------------End Image & Document ---------------------------------------


  //#region ----------------------- Tag section ------------------------------
  private tagObj(tag_name) {
    return this.fb.group({
      tag_name: [tag_name],
      id: [0]
    });
  }

  AddNewTag(): void {
    const dialogRef = this.dialog.open(TagComponent, {
      width: '550px',
      disableClose: true,
      data: { name: "", type: 'store' }
    });
    const control = <UntypedFormArray>this.create_store_form.controls['tags'];
    dialogRef.afterClosed().subscribe(result => {
      if (Boolean(result) && result.length > 0) {
        result.forEach(tag_name => {
          if (!Boolean(_.find(control.value, function (o) { return o.tag_name.toLowerCase() == tag_name.toLowerCase() }))) {
            control.push(this.tagObj(tag_name));
          }
        }
        )
      }
    });
  }

  removeTag(index) {
    const control = <UntypedFormArray>this.create_store_form.controls['tags'];
    control.removeAt(index);
  }
  //#endregion ----------------------- End Tag section ------------------------------

  //#region ------------------- Store Timing -------------------------
  StoreTimings(storeDays) {
    let arr = new UntypedFormArray([])
    storeDays.forEach(data => {
      arr.push(this.fb.group({
        day_of_week: [data.day_of_week],
        name: [data.name],
        opens: ['00:00'],
        closes: ['00:00'],
        isSelected: [false]
      }));
    })
    return arr;
  }
  //#endregion ----------------- End Store Timing -------------------

  //#region ------------------ License Section --------------------
  LicensesFormArray() {
    let arr = new UntypedFormArray([])
    arr.push(this.fb.group({
      license_name: ['', Validators.required],
      license_number: ['', Validators.required],
    }));
    return arr;
  }

  private AddNewLicenseObj() {
    return this.fb.group({
      license_name: ['', Validators.required],
      license_number: ['', Validators.required]
    });
  }

  AddNewLicense() {
    const licenseControl = <UntypedFormArray>this.create_store_form.controls['license_details'];
    licenseControl.push(this.AddNewLicenseObj())
  }


  DeleteLicense(index) {
    const licenseControl = <UntypedFormArray>this.create_store_form.controls['license_details'];
    licenseControl.removeAt(index)
  }
  //#endregion ------------------ End License Section --------------------

  //#region ------------------ Warehouse section ----------------
  AddWarehouse() {
    const dialogRef = this.dialog.open(WarehouseModalComponent, {
      width: '550px',
      disableClose: true,
      // data: this.rawData.subtype
      data: { data: "", type: this.rawData.subtype }

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const warehouseControl = <UntypedFormArray>this.create_store_form.controls['warehouse_details'];
        warehouseControl.push(result);
      }
    });
  }

  DeleteWarehouse(index) {
    const warehouseControl = <UntypedFormArray>this.create_store_form.controls['warehouse_details'];
    warehouseControl.removeAt(index)
  }
  //#endregion ------------------End Warehouse section ----------------

  //#region ------------------ Till section ----------------

  AddNewTill() {
    const dialogRef = this.dialog.open(TillComponent, {
      width: '550px',
      disableClose: true,
      //data: this.rawData.till_types
      data: { data: "", type: this.rawData.till_types }

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const Control = <UntypedFormArray>this.create_store_form.controls['till_details'];
        Control.push(result);
      }
    });
  }

  changeTillStatus(obj, status, index) {
    obj.value.status = status == 0 ? 1 : 0;
    (<UntypedFormArray>this.create_store_form.controls['till_details']).at(index).patchValue(obj.value);
  }

  DeleteTill(index) {
    const control = <UntypedFormArray>this.create_store_form.controls['till_details'];
    control.removeAt(index)
  }
  //#endregion ------------------End Till section ----------------

  //****************** Chain List ******************/
  getChainList() {
    this.storeService.getChainList()
      .subscribe((response: any) => {
        if (response.success) {
          this.chains = response.data;
          if (this.chains.length == 1) {
            this.create_store_form.get('chain_id').setValue(this.chains[0].chain_id);
          }
        }
      });
  }

  //****************** Location List ******************/

  getLocationList(type, parent_id) {
    this.storeService.getLocationList(type, parent_id)
      .subscribe((response: any) => {
        if (response.success) {
          if (type == "country") {
            this.countryList = response.data;
          }
          else if (type == "state") {
            this.provinceList = response.data;
          }
          else if (type == "city") {
            this.cityList = response.data;
          }
        }
      });
  }

  //************************************************* FINAL SUBMIT *************************************** */

  onSubmit() {
    if(this.storeTimes.length == 0){
      this.AddStoreTime();
    }
    if (this.arrayOfFiles.length == 0){
      this.uploadFile();
    }
    if (this.arrayOfImages.length == 0) {
      this.noImageSelect = true;
      // return false;
    }
    if (this.arrayOfFiles.length > 0){
      this.create_store_form.get('document_details').setValue(JSON.stringify(this.arrayOfFiles));
    }
    
    // this.create_store_form.removeControl('opens')
    // this.create_store_form.removeControl('closes')

    const formData = new FormData();
    Object.keys(this.create_store_form.value).forEach(key => {
      if (key == "store_image") {
        Object.keys(this.arrayOfImages).forEach(key1 => {
          formData.append("store_images[]", this.imagesOfarray[key1])
        });
      }
      else if (key == "store_document") {
        Object.keys(key).forEach(key => {
          if (this.filesOfarray[key])
            formData.append("documents[]", this.filesOfarray[key])
        });
      }
      else {
        if (this.create_store_form.value[key] instanceof Object) {
          if (key != "store_timings") {
            formData.append(key, JSON.stringify(this.create_store_form.value[key]));
          }
          else {
            formData.append(key, JSON.stringify(this.storeTimes));
          }
        }
        else {
          formData.append(key, this.create_store_form.value[key])
        }
      }
    });

    if (this.create_store_form.valid) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';

      this.storeService.createStore(formData)
        .subscribe((response: any) => {
          if (response.success) {
            this.utility.showSnackBar(response.message);
            this.router.navigateByUrl('stores');
          }
          this.barButtonOptions.active = false;
          this.barButtonOptions.text = 'SAVE ALL';
        },
          err => {
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'SAVE ALL';
          });
    }else{
      this.utility.scrollToError();
    }
  }

  getStoreRawData() {
    this.storeService.getStoreRawData()
      .subscribe((response: any) => {
        if (response.success) {
          response.data.id_card_types = _.sortBy(response.data.id_card_types, 'id_card_type');
          this.rawData = response.data;
        }
      });
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight * 81 / 100;
    this.innerHeight = this.innerHeight + ""
    this.addStoreForm();
    this.getChainList();
    this.getLocationList('country', 0)
    this.getStoreRawData();
  }
  ngDoCheck() {
    this.checkHeight();
  }
  checkHeight() {
    this.innerHeight = window.innerHeight - 192;
  }

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE ALL',
    //buttonColor: 'primary',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }

  storeDays = [
    { "day_of_week": 1, "name": "Sunday", "opens": "", "closes": "", isSelected: false },
    { "day_of_week": 2, "name": "Monday", "opens": "", "closes": "", isSelected: false },
    { "day_of_week": 3, "name": "Tuesday", "opens": "", "closes": "", isSelected: false },
    { "day_of_week": 4, "name": "Wednesday", "opens": "", "closes": "", isSelected: false },
    { "day_of_week": 5, "name": "Thursday", "opens": "", "closes": "", isSelected: false },
    { "day_of_week": 6, "name": "Friday", "opens": "", "closes": "", isSelected: false },
    { "day_of_week": 7, "name": "Saturday", "opens": "", "closes": "", isSelected: false },
  ]


  storeTimes: any = []
  public shiftFormsubmit: boolean = false;
  public greater: boolean = false;
  public is_selected: boolean = false;
  public time_required: boolean = false;
  public records: boolean = false;
  AddStoreTime() {
    this.time_required = false;
    this.shiftFormsubmit = true;
    this.records = false;
    this.create_store_form.controls['store_timings'].value.map(item => item).filter(item => {

      if (this.create_store_form.controls['opens'].value && this.create_store_form.controls['closes'].value) {
        if (item.isSelected) {
          item.opens = this.create_store_form.controls['opens'].value
          item.closes = this.create_store_form.controls['closes'].value
          if (item.opens < item.closes) {
            if (this.storeTimes.find(data => data.day_of_week == item.day_of_week)) {
              this.storeTimes.map(data => {
                if (data.day_of_week == item.day_of_week) {
                  data.opens = item.opens;
                  data.closes = item.closes;
                  this.shiftFormsubmit = false;
                }
              })
            }
            else {
              this.storeTimes.push(item)
              this.dynamicHeight = this.storeTimes.length < 12 ? ((this.storeTimes.length + 1) * 48 + 10) + "px" : '';
              this.shiftFormsubmit = false;
              this.records = true;
            }
          } else {
            this.greater = true;
          }

        } else {
          this.is_selected = true;
        }
      } else {
        this.time_required = true;
      }
    })
    this.storeTimes = [...this.storeTimes];
    // this.create_store_form.controls['opens'].setValue('')
    // this.create_store_form.controls['closes'].setValue('')
    if (this.records) {
      this.create_store_form.controls['store_timings'].reset();
      this.create_store_form.controls['opens'].reset();
      this.create_store_form.controls['closes'].reset();
    }
    this.create_store_form.controls['store_timings'].setValue(this.storeDays);
  }

  DeleteStoreTime(index) {
    this.storeTimes.splice(index, 1);
    this.storeTimes = [...this.storeTimes];
    this.dynamicHeight = this.storeTimes.length < 12 ? ((this.storeTimes.length + 1) * 48 + 10) + "px" : '';
  }

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
    if(this.create_store_form.dirty){
      filled_data = 1;
    }

    if (filled_data && !this.create_store_form.valid) {
      return this.utility.confirmDialog({ title: 'Please confirm the action', message: 'Are you sure you\'d like to leave the page? You\'ll lose all your progress?', okButton: 'LEAVE', cancelButton: 'CANCEL' }).toPromise();
    } else {
      return true;
    }
  }
  /* canDeactivate code */

  from_time = ['00:00', '00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45', '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45', '24:00'];
  to_time = ['00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45', '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45', '24:00'];
}

