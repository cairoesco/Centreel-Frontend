import { Component, OnInit, NgZone } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {

  warehouseForm: UntypedFormGroup;
  public title = 'Places';
  public addrKeys: string[];
  public addr: object;

  lat: number = 51.678418;
  lng: number = 7.809007;
  zoom: number = 16;

  constructor(private _formBuilder: UntypedFormBuilder, private zone: NgZone) {
    this.warehouseForm = this.addwarehouse();
  }

  ngOnInit() {
  }

  setAddress(addrObj) {
    this.zone.run(() => {
      this.addr = addrObj;
      this.lat = addrObj.lat;
      this.lng = addrObj.lng;
      this.addrKeys = Object.keys(addrObj);
    });
  }

  private addwarehouse() {
    return this._formBuilder.group({
      name: [''],
      type: [''],
      chain: [''],
      store: [''],
      location: [''],
      province: [''],
      country: [''],
      city: [''],
      phone: [''],
      email: [''],
    });
  }

  onSubmit(data) {

  }
}
