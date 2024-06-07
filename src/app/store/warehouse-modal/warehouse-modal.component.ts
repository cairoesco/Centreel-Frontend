import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-warehouse-modal',
  templateUrl: './warehouse-modal.component.html',
  styleUrls: ['./warehouse-modal.component.scss']
})

export class WarehouseModalComponent implements OnInit {
  public form: UntypedFormGroup;
  public countryList: any;
  public provinceList: any;
  public cityList: any;
  public warehouse: any = {};
  constructor(private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<WarehouseModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public storeService: StoreService) {
    this.warehouse = data.data;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      subtype: ['', Validators.required],
      address: [null],
      city_id: [''],
      state_id: [''],
      country_id: [''],
      latitude: ['000000'],
      longitude: ['000000'],
      phone: [''],
      email: [''],
      storage_id: [0],
      zipcode: ['']
    });

    this.getLocationList('country', 0)
    this.getLocationList("state", (Boolean(this.warehouse) && Boolean(this.warehouse.country_id)) ? this.warehouse.country_id : 0);
    this.getLocationList("city", (Boolean(this.warehouse) && Boolean(this.warehouse.state_id)) ? this.warehouse.state_id : 0);
    //this.storeInfoForm(this.warehouse)
    if (Boolean(this.warehouse)) {
      this.form.patchValue({
        storage_id: this.warehouse.storage_id,
        name: this.warehouse.name,
        subtype: this.warehouse.subtype,
        address: this.warehouse.address,
        city_id: this.warehouse.city_id,
        state_id: this.warehouse.state_id,
        country_id: this.warehouse.country_id,
        latitude: this.warehouse.latitude,
        longitude: this.warehouse.longitude,
        phone: this.warehouse.phone,
        email: this.warehouse.email
      })
    }
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form);
    }
  }

  storeInfoForm(data?: any) {
    this.form = this.fb.group({
      storage_id: [data.storage_id ? data.storage_id : 0],
      name: [data.name, Validators.required],
      subtype: [data.subtype, Validators.required],
      address: [data.address],
      city_id: [data.city_id],
      state_id: [data.state_id],
      country_id: [data.country_id],
      latitude: [data.latitude],
      longitude: [data.longitude],
      phone: [data.phone],
      email: [data.email]
    });
  }

}

