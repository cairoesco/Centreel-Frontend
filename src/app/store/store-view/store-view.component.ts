import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { TagComponent } from '../../dialog/tag/tag.component';
import { MatDialog } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { StoreService } from '../store.service'
import { UtilsServiceService } from 'src/app/shared/services/utils-service.service';
import * as _ from 'lodash';
import { WarehouseModalComponent } from '../warehouse-modal/warehouse-modal.component';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { environment } from 'src/environments/environment';
import { TillComponent } from '../../dialog/till/till.component';

const API_URL = environment.baseUrl + "api/";

@Component({
  selector: 'app-store-view',
  templateUrl: './store-view.component.html',
  styleUrls: ['./store-view.component.scss']
})
export class StoreViewComponent implements OnInit {
  public innerHeight: any;
  public type: string = 'component';
  public selected = false;
  public indexofTab = 0;
  public form: UntypedFormGroup;
  public storeForm: UntypedFormGroup;
  public warehouseForm: UntypedFormGroup;
  public tillForm: UntypedFormGroup;
  public tagsForm: UntypedFormGroup;
  public hoursForm: UntypedFormGroup;
  public licenseForm: UntypedFormGroup;
  public addStore: UntypedFormGroup;
  public chains: any[];
  public countryList: any;
  public provinceList: any;
  public cityList: any;
  public storeId: any;
  public storeData: any;
  public removeTagArray = [];
  public addNewTagArray = [];
  public remove_warehouse = [];
  public remove_license = [];
  public remove_till = [];
  public arrayOfFiles = [];
  public filesOfarray = [];
  public arrayOfImages = [];
  public imagesOfarray: any = [];
  public removeImagesArray: any = [];
  public dynamicHeight = "";
  public timedynamicHeight = "";
  public uploadDocForm: UntypedFormGroup;
  public uploadedDocName: any = "";
  public API_URL = environment.baseUrl + "api/";
  public documentExpiryMinDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  imageSrc: any;
  heightOfY;
  constructor(private route: ActivatedRoute, private fb: UntypedFormBuilder, public dialog: MatDialog, public refVar: ChangeDetectorRef, public storeService: StoreService,
    public utility: UtilsServiceService,
  ) {
    this.fileUploader();
    this.utility.indexofTab = 0;
  }

  /* Editable Mode */
  isActive;
  storeInfo: boolean = false;
  warehouseInfo: boolean = false;
  tags: boolean = false;
  hours: boolean = false;
  licenseInfo: boolean = false;
  tillInfo: boolean = false;


  viewOnly() {
    this.isFormSubmitted = false;
    this.tags = false;
    this.hours = false;
    this.licenseInfo = false;
    this.storeInfo = false;
    this.warehouseInfo = false;
    this.tillInfo = false;

    this.storeForm.disable()
    this.tagsForm.disable()
    this.hoursForm.disable()
    this.warehouseForm.disable()
    this.licenseForm.disable()
    this.tillForm.disable()
    this.uploadDocForm.disable()
  }

  isEditable(key) {
    switch (key) {
      case 1:
        this.viewOnly();
        this.storeInfo = true;
        this.storeForm.enable();
        break;
      case 2:
        this.viewOnly();
        this.tagsForm.enable()
        this.tags = true;
        break;
      case 3:
        this.viewOnly();
        this.hoursForm.enable()
        this.hours = true;
        break;
      case 4:
        this.viewOnly();
        this.warehouseForm.enable()
        this.warehouseInfo = true;
        break;
      case 5:
        this.viewOnly();
        this.licenseForm.enable()
        this.uploadDocForm.enable()
        this.licenseInfo = true;
        break;
      case 6:
        this.viewOnly();
        this.tillForm.enable()
        this.tillInfo = true;
        break;

      default:
        break;
    }
  }

  storeGeneralform() {
    this.storeForm = this.fb.group({
      //chain_id: [data.chain_id, Validators.required],
      name: ['', Validators.required],
      //store_image: [''],
      address: ['', Validators.required],
      address_unit: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      zipcode: ['', Validators.required],
      description: [''],
      contact_email: ['', Validators.compose([Validators.required, CustomValidators.email])],
      contact_no: ['', Validators.compose([Validators.required, Validators.minLength(7)])],
      website: [''],
      latitude: ['000000'],
      longitude: ['000000'],
      store_location: ['store location'],
      tax_no: [''],
    });

    this.hoursForm = this.fb.group({
      store_timings: this.StoreTimings(this.storeDays),
      opens: [''],
      closes: [''],
    });

    this.licenseForm = this.fb.group({
      licenses: this.licenseInfoFormObjDefine(),
    });

    this.warehouseForm = this.fb.group({
      warehouses: new UntypedFormArray([])
    });

    this.tagsForm = this.fb.group({
      tags: new UntypedFormArray([])
    });

    this.tillForm = this.fb.group({
      tills: new UntypedFormArray([])
    });
    this.uploadDocForm = this.fb.group({
      document: ['', [Validators.required]],
      document_title: ['', [Validators.required]],
      document_type: [''],
      document_type_data: ['', [Validators.required]],
      document_expiry_date: ['', [Validators.required]],

    })
  }

  StoreTimings(data) {
    let arr = new UntypedFormArray([])
    data.forEach(data => {
      arr.push(this.fb.group({
        id: [0],
        day_of_week: [data.day_of_week],
        name: [this.storeDayNames[data.day_of_week - 1]],
        isSelected: [false]
      }));
    })
    return arr;
  }
  //#region ************************** Image & Document related***************************

  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
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
  }

  public ImageFileDragged(e: any) {
    this.hasBaseDropZoneOver = e;
    this.uploader.queue.forEach(element => {
      let imageElement: any = element.file.rawFile;
      if (["image/jpeg", "image/jpg", "image/png", 'image/gif'].indexOf(imageElement.type) > -1) {
        let imageElement: any = element.file.rawFile;
        let imageFile: any;
        const reader = new FileReader();
        reader.onload = (res) => {
          imageFile = reader.result;
          this.arrayOfImages.push({ image_id: 0, file_name: element.file.name, image_url: imageFile });
        }
        reader.readAsDataURL(imageElement);
        this.refVar.detectChanges();
        this.imagesOfarray.push(imageElement);
      } else {
        this.utility.showSnackBar("Unsupported file format", { panelClass: 'error' });
      }
    });
    this.uploader.clearQueue()
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

  DeleteImage(index, id) {
    var removeInd = index - (this.arrayOfImages.length - this.imagesOfarray.length)
    if (index !== -1) {
      this.arrayOfImages.splice(index, 1);
      if (id == 0) {
        this.imagesOfarray.splice(removeInd, 1);
      }
      if (id > 0) {
        this.removeImagesArray.push(id)
      }
    }
  }

  /*************** Document  ********************* */
  public documentFileDragged(e: any) {
    this.hasBaseDropZoneOver = e;
    this.uploader.queue.forEach(element => {
      let imageElement: any = element.file.rawFile;
      this.arrayOfFiles.push({ id: 0, file_name: element.file.name, file_path: element.file });
      this.filesOfarray.push(imageElement);
    });
    this.uploader.clearQueue();
  }

  deleted_documents = [];
  public storeDocumentArray: any = [];
  deleteDocumentFile(id, index) {
    if (id > 0) {
      this.deleted_documents.push(id);
    }
    this.arrayOfFiles.splice(index, 1);
    this.filesOfarray.splice(index, 1);
  }

  deleteFile(file?, index?) {
    this.utility.confirmDialog({ title: 'Delete Document', message: 'Are you sure want to delete document?' }).subscribe((result: any) => {
      if (Boolean(result)) {
        if (index !== -1 && file == 0) {
          let file_index = index - (this.arrayOfFiles.length - this.filesOfarray.length);
          this.filesOfarray.splice(file_index, 1);
          this.arrayOfFiles.splice(index, 1);

        }
        else if (index !== -1 && file != 0) {
          var param = { _method: 'delete' }
          this.storeService.deleteDocument(file, param)
            .subscribe((response: any) => {
              if (response.success) {
                this.utility.showSnackBar(response.message);
                this.storeDocumentArray.splice(index, 1);

              }
            });
        }
      }
    })
  }

  downloadFile(file_id, i) {
    window.open(API_URL + "documents/" + file_id + "/download", '_blank');
  }
  //#endregion ************************** End Image and Document ***************************

  //#region ************************** General Store Info section ***************************

  storeInfoForm(data?: any) {
    this.storeForm.patchValue({
      name: data.name,
      address: data.address,
      address_unit: data.address_unit,
      country: data.country,
      state: data.state,
      city: data.city,
      zipcode: data.zipcode,
      description: data.description,
      contact_email: data.contact_email,
      contact_no: data.contact_no,
      website: data.website,
      latitude: '000000',
      longitude: '000000',
      tax_no: data.tax_no,
      store_location: 'store location',
    });
  }

  generalStoreInfoPost() {
    const formData = new FormData();
    Object.keys(this.imagesOfarray).forEach(key => {
      formData.append('store_images[]', this.imagesOfarray[key])
    })

    formData.append("deleted_images", JSON.stringify(this.removeImagesArray))
    formData.append('general_info', JSON.stringify(this.storeForm.value))
    formData.append("_method", "put")
    if (this.storeForm.status == "VALID") {
      this.UpdateStore(formData);
    }else{
      this.utility.scrollToError();
    }
  }
  //#endregion ************************** End General Store Info section ***************************

  //#region ************************** Tag section ***************************

  tagInfoForm(data?: any) {
    this.tagsForm = this.fb.group({
      tags: this.tagForm(data),
    });
  }

  tagForm(tagObjArr) {
    let arr = new UntypedFormArray([])
    tagObjArr.forEach(data => {
      arr.push(this.fb.group({
        tag_name: [data.tag_name],
        id: [data.id]
      }));
    })
    return arr;
  }

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
    const control = <UntypedFormArray>this.tagsForm.controls['tags'];
    dialogRef.afterClosed().subscribe(result => {
      if (Boolean(result) && result.length > 0) {
        result.forEach(tag_name => {
          if (!Boolean(_.find(control.value, function (o) { return o.tag_name.toLowerCase() == tag_name.toLowerCase() }))) {
            control.push(this.tagObj(tag_name));
            this.addNewTagArray.push(tag_name)
          }
        }
        )
      }
    });
  }

  removeTag(index, tag) {
    const control = <UntypedFormArray>this.tagsForm.controls['tags'];
    control.removeAt(index)
    if (tag.value.id > 0) {
      this.removeTagArray.push(tag.value.id);
    }
    else {
      this.addNewTagArray.splice(_.findIndex(this.addNewTagArray, function (o) { return o == tag.value.tag_name; }), 1)
    }
  }

  tagsInfoPost() {
    const formData = new FormData();
    let tags = {
      tags: JSON.stringify({
        add_tag: this.addNewTagArray,
        remove_tag: this.removeTagArray
      })
    }
    Object.keys(tags).forEach(key => {
      formData.append(key, tags[key])
    });
    formData.append("_method", "put")
    if (this.addNewTagArray.length > 0 || this.removeTagArray.length > 0) {
      this.UpdateStore(formData);
    }
  }
  //#endregion ************************** End Tag section ***************************

  //#region ************************** Store Timing section ***************************

  storeTimes: any = []
  public shiftFormsubmit: boolean = false;
  public greater: boolean = false;
  public is_selected:boolean = false;
  public time_required:boolean = false;
  public records: boolean = false;
  AddStoreTime() {
    this.shiftFormsubmit = true;
    this.time_required = false;
    this.records = false;

    this.hoursForm.controls['store_timings'].value.map(item => item).filter(item => {

      if(this.hoursForm.controls['opens'].value && this.hoursForm.controls['closes'].value){
        if (item.isSelected) {
          item.opens = this.hoursForm.controls['opens'].value
          item.closes = this.hoursForm.controls['closes'].value
          if(item.opens < item.closes){
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
              this.timedynamicHeight = this.storeTimes.length < 12 ? ((this.storeTimes.length + 1) * 48 + 10) + "px" : '';
              this.shiftFormsubmit = false;
              this.records = true;
            }
          }else{
            this.greater = true;
          }
        }else{
          this.is_selected = true;
        }
      }else{
        this.time_required = true;
      }
    })
    this.storeTimes = [...this.storeTimes];
    if(this.records){
      this.hoursForm.controls['store_timings'].reset();
      this.hoursForm.controls['opens'].reset();
      this.hoursForm.controls['closes'].reset();
    }
    this.hoursForm.controls['store_timings'].setValue(this.storeDays);
  }


  storeDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  hoursInfoForm(data?: any) {
    this.storeTimes = [];
    data.forEach(item => {
      item.name = this.storeDayNames[item.day_of_week - 1]
      this.storeTimes.push(item);
      this.timedynamicHeight = this.storeTimes.length < 12 ? ((this.storeTimes.length + 1) * 48 + 10) + "px" : '';
    })
  }

  storeTimingInfoPost() {
    const formData = new FormData();
    var data;
    data = {
      store_timings: JSON.stringify(this.storeTimes)
    }
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    });
    formData.append("_method", "put")

    if (this.hoursForm) {
      this.UpdateStore(formData);
    }
  }


  MarkAsClosed(index, id, status) {
    status = status == 1 ? 0 : 1;
    const formData = new FormData();
    formData.append("store_closed", status)
    this.storeService.markAsClose(id, formData)
      .subscribe((response: any) => {
        if (response.success) {
          this.utility.showSnackBar(response.message);
          this.storeTimes.find(item => item.id == id).store_closed = status;
          this.storeTimes = [...this.storeTimes];
        }
      });
  }

  DeleteStoreTime(index, id) {
    this.utility.confirmDialog({ title: 'Delete Timing', message: 'Are you sure want to delete store time?' }).subscribe((result: any) => {
      if (Boolean(result)) {
        if (id > 0) {
          this.storeService.deleteStoreTiming(id)
            .subscribe((response: any) => {
              if (response.success) {
                this.utility.showSnackBar(response.message);
                this.storeTimes.splice(index, 1);
                this.storeTimes = [...this.storeTimes];
                this.timedynamicHeight = this.storeTimes.length < 12 ? ((this.storeTimes.length + 1) * 48 + 10) + "px" : '';
              }
            });
        }
        else {
          this.storeTimes.splice(index, 1);
          this.storeTimes = [...this.storeTimes];
          this.timedynamicHeight = this.storeTimes.length < 12 ? ((this.storeTimes.length + 1) * 48 + 10) + "px" : '';
        }
      }
    })
  }

  //#endregion ----------------------------------- End Store Timing section -----------------------------------

  //#region ----------------------------------- License section -----------------------------------
  licenseInfoFormObjDefine() {
    let data = {
      license_name: [""],
      license_number: [""]
    }
    return data;
  }

  private AddNewLicenseObj() {
    return this.fb.group({
      license_name: ['', Validators.required],
      license_number: ['', Validators.required]
    });
  }

  licenseInfoForm(data?: any) {
    this.licenseForm = this.fb.group({
      licenses: this.licenseInfoFormObj(data),
    });
  }

  licenseInfoFormObj(licenseObjArr) {
    let arr = new UntypedFormArray([])
    licenseObjArr.forEach(data => {
      arr.push(this.fb.group({
        id: [data.id],
        license_name: [data.license_name, Validators.required],
        license_number: [data.license_number, Validators.required],
      }));
    })
    return arr;
  }

  AddNewLicense() {
    const control = <UntypedFormArray>this.licenseForm.controls['licenses'];
    control.push(this.AddNewLicenseObj())
  }

  DeleteLicense(index, id) {
    const licenseControl = <UntypedFormArray>this.licenseForm.controls['licenses'];
    licenseControl.removeAt(index)
    if (id > 0) {
      this.remove_license.push(id);
    }
  }

  licenceInfoPost() {
    const formData = new FormData();

    Object.keys(this.filesOfarray).forEach(key => {
      formData.append('documents[]', this.filesOfarray[key])
    })
    // formData.append("document_details", JSON.stringify(this.arrayOfFiles))
    // formData.append("deleted_documents", JSON.stringify(this.deleted_documents))

    let licenses = {
      licenses: JSON.stringify({
        details: this.licenseForm.controls['licenses'].value,
        remove_license: this.remove_license,
      })
    }
    formData.append('document_details', JSON.stringify(this.arrayOfFiles))
    Object.keys(licenses).forEach(key => {
      formData.append(key, licenses[key])
    });

    formData.append("_method", "put")
    if (this.licenseForm.valid) {
      this.UpdateStore(formData);
    }
  }
  //#endregion ------------------------------ End License section ------------------------------

  //#region ------------------------------ Warehouse section ------------------------------
  warehouseInfoForm(data?: any) {
    this.warehouseForm = this.fb.group({
      warehouses: this.warehouseInfoFormObj(data),
    });
  }

  warehouseInfoFormObj(warehouseObjArr) {
    let arr = new UntypedFormArray([])
    warehouseObjArr.forEach(data => {
      arr.push(this.fb.group({
        storage_id: [data.storage_id],
        name: [data.name, Validators.compose([Validators.required])],
        subtype: [data.subtype, Validators.compose([Validators.required])],
        address: [data.address],
        city_id: [data.city_id],
        state_id: [data.state_id],
        country_id: [data.country_id],
        latitude: [data.latitude],
        longitude: [data.longitude],
        phone: [data.phone],
        email: [data.email]
      }));
    })
    return arr;
  }


  AddEditWarehouse(index?: any, data?: any) {
    const dialogRef = this.dialog.open(WarehouseModalComponent, {
      width: '550px',
      disableClose: true,
      data: { data: data ? data.value : '', type: this.rawData.subtype }

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (index != undefined) {
          // update warehouse
          (<UntypedFormArray>this.warehouseForm.controls['warehouses']).at(index).patchValue(result.value);
        }
        else {
          // add new warehouse
          const warehouseControl = <UntypedFormArray>this.warehouseForm.controls['warehouses'];
          warehouseControl.push(result);
        }
      }
    });
  }

  DeleteWarehouse(index, id) {
    this.utility.confirmDialog({ title: 'Delete Warehouse', message: 'Are you sure want to delete Warehouse?' }).subscribe((result: any) => {
      if (Boolean(result)) {
        const warehouseControl: any = this.warehouseForm.get('warehouses');
        warehouseControl.removeAt(index)
        if (id > 0) {
          this.remove_warehouse.push(id);
        }
      }
    })
  }

  storeWarehouseInfoPost() {
    const formData = new FormData();
    let warehouses = {
      warehouses: JSON.stringify({
        details: this.warehouseForm.controls['warehouses'].value,
        remove_warehouse: this.remove_warehouse
      })
    }
    Object.keys(warehouses).forEach(key => {
      formData.append(key, warehouses[key])
    });
    formData.append("_method", "put")
    if (this.warehouseForm) {
      this.UpdateStore(formData);
    }
  }
  //#endregion ------------------------------ End warehouse Section ------------------------------

  //#region ------------------------------ Till Section ------------------------------

  tillInfoForm(data?: any) {
    this.tillForm = this.fb.group({
      tills: this.tillInfoFormObj(data),
    });
    this.dynamicHeight = this.tillForm.controls['tills'].value.length < 12 ? ((this.tillForm.controls['tills'].value.length + 1) * 48 + 10) + "px" : '';
  }

  tillInfoFormObj(tillObjArr) {
    let arr = new UntypedFormArray([])
    tillObjArr.forEach(data => {
      arr.push(this.fb.group({
        storage_id: [data.storage_id],
        name: [data.name],
        subtype: [data.subtype],
        status: [data.status],
      }));
    })
    return arr;
  }

  AddEditTill(index?: any, data?: any) {
    const dialogRef = this.dialog.open(TillComponent, {
      width: '550px',
      disableClose: true,
      data: { data: data ? data : '', type: this.rawData.till_types }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (index != undefined) {
          // update Till
          (<UntypedFormArray>this.tillForm.controls['tills']).at(index).patchValue(result.value);
        }
        else {
          // add new Till
          const control = <UntypedFormArray>this.tillForm.controls['tills'];
          control.push(result);
        }
        this.dynamicHeight = this.tillForm.controls['tills'].value.length < 12 ? ((this.tillForm.controls['tills'].value.length + 1) * 48 + 10) + "px" : '';
      }
    });
  }

  DeleteTill(index, id) {
    const tillControl = <UntypedFormArray>this.tillForm.controls['tills'];
    tillControl.removeAt(index)
    if (id > 0) {
      this.remove_till.push(id);
    }
  }

  changeTillStatus(obj, status, index) {
    obj.status = status == 0 ? 1 : 0;

    (<UntypedFormArray>this.tillForm.controls['tills']).at(index).patchValue(obj);
    // this.TillInfoPost();
  }

  TillInfoPost() {
    const formData = new FormData();
    let tills = {
      tills: JSON.stringify({
        details: this.tillForm.controls['tills'].value,
        remove_till: this.remove_till
      })
    }
    Object.keys(tills).forEach(key => {
      formData.append(key, tills[key])
    });
    formData.append("_method", "put")
    if (this.tillForm) {
      this.UpdateStore(formData);
    }
  }

  //#endregion ************************** End Till section ***************************

  //************************** Get store details ***************************

  getStoreDetail() {
    this.storeService.getStoreDetailById(this.storeId)
      .subscribe((response: any) => {
        if (response.success) {
          this.storeData = response.data;
          this.storeDocumentArray = response.data.storeDocuments;
          this.arrayOfImages = this.storeData.imageData;
          this.getLocationList("country", this.storeData.generalData.country);
          this.getLocationList("state", this.storeData.generalData.country);
          this.getLocationList("city", this.storeData.generalData.state);

          this.storeInfoForm(this.storeData.generalData)
          this.hoursInfoForm(this.storeData.storeTimings)
          this.licenseInfoForm(this.storeData.storeLicenceData);
          this.tagInfoForm(this.storeData.tags);
          this.warehouseInfoForm(this.storeData.storeWarehouse);
          this.tillInfoForm(this.storeData.storeTillData);
          this.viewOnly();


        }
      });
  }

  //****************** Chain List ******************/
  getChainList() {
    this.storeService.getChainList()
      .subscribe((response: any) => {
        if (response.success) {
          this.chains = response.data;
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


  //********************************** Submit ************************* */
  onSubmit(event) {

    switch (event) {
      case "storeInfo":
        this.generalStoreInfoPost();
        break;
      case "tagsInfo":
        this.tagsInfoPost();
        break;
      case "storeTimingInfo":
        this.storeTimingInfoPost();
        break;
      case "storeWarehouseInfo":
        this.storeWarehouseInfoPost();
        break;
      case "licenceInfo":
        this.licenceInfoPost();
        break;
      case "tillInfo":
        this.TillInfoPost();
        break;
      default:
        break;
    }
  }

  //**************** API call for save changes Store *******************/

  UpdateStore(data) {
    this.barButtonOptions.active = true;
    this.barButtonOptions.text = 'Saving Data...';

    this.storeService.updateStore(this.storeId, data)
      .subscribe((response: any) => {
        this.viewOnly();
        if (response.success) {
          this.utility.showSnackBar(response.message);
          this.barButtonOptions.active = false;
          this.barButtonOptions.text = 'SAVE CHANGES';
          this.initialisation()
          this.getStoreDetail();
          // this.getUserbyId();
        }
        else {
          this.barButtonOptions.active = false;
          this.barButtonOptions.text = 'SAVE CHANGES';
        }
      }, err => {
        this.barButtonOptions.active = false;
        this.barButtonOptions.text = 'SAVE CHANGES';
      });
  }

  initialisation() {
    this.removeTagArray = [];
    this.addNewTagArray = [];
    this.remove_license = [];
    this.remove_till = [];
    this.arrayOfFiles = [];
    this.filesOfarray = [];
    this.arrayOfImages = [];
    this.imagesOfarray = [];
    this.removeImagesArray = [];
  }

  public rawData: any
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
    this.storeGeneralform();
    this.route.params.subscribe(params => {
      this.storeId = +params['id'];
      this.getStoreDetail()
    });
    this.getStoreRawData();
    this.getChainList()
    this.viewOnly();
  }

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

  storeDays = [
    { "id": 0, "day_of_week": 1, "name": "Sunday", isSelected: false },
    { "id": 0, "day_of_week": 2, "name": "Monday", isSelected: false },
    { "id": 0, "day_of_week": 3, "name": "Tuesday", isSelected: false },
    { "id": 0, "day_of_week": 4, "name": "Wednesday", isSelected: false },
    { "id": 0, "day_of_week": 5, "name": "Thursday", isSelected: false },
    { "id": 0, "day_of_week": 6, "name": "Friday", isSelected: false },
    { "id": 0, "day_of_week": 7, "name": "Saturday", isSelected: false },
  ]

  from_time = ['00:00', '00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45', '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45', '24:00'];
  to_time = ['00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45', '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45', '24:00'];
}


