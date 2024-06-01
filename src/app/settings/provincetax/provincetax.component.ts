import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormBuilder, UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-provincetax',
  templateUrl: './provincetax.component.html',
  styleUrls: ['./provincetax.component.scss']
})
export class ProvincetaxComponent implements OnInit {

  provinceTaxForm: UntypedFormGroup;
  taxesArray: any = [];
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

  constructor(private _formBuilder: UntypedFormBuilder) {

    this.provinceTaxForm = this.createContactForm();

    this.taxesArray = [
      {
        "regionID": 1,
        "regionValue": "Alberta",
        "taxesArray": {
          "taxID": 1,
          "taxValue": 5,
          "typeID": 1,
          "typeValue": 'PST',
          "options": "3",
        }
      },
      {
        "regionID": 1,
        "regionValue": "British Columbia",
        "taxesArray": {
          "taxID": 1,
          "taxValue": 5,
          "typeID": 1,
          "typeValue": 'PST',
          "options": "2",
        }
      },
      {
        "regionID": 1,
        "regionValue": "Manitoba",
        "taxesArray": {
          "taxID": 1,
          "taxValue": 5,
          "typeID": 1,
          "typeValue": 'PST',
          "options": "3",
        }
      }
    ]

    //const control = <FormArray>this.provinceTaxForm.get('regionsTaxes')['controls'];

    const control = <UntypedFormArray>this.provinceTaxForm.controls['regionsTaxes'];

    this.taxesArray.forEach(element => {
      control.push(this.addRegionTaxes(element));
    });
  }

  private addRegionTaxes(tempData) {
    return this._formBuilder.group({
      regionID: [tempData.regionID],
      regionValue: [tempData.regionValue],
      taxID: [tempData.taxesArray.taxID],
      taxValue: [tempData.taxesArray.taxValue, [Validators.required, Validators.min(1), Validators.max(99999)]],
      typeID: [tempData.taxesArray.typeID],
      typeValue: [tempData.taxesArray.typeValue, [Validators.required]],
      options: [tempData.taxesArray.options, [Validators.required]]
    });
  }


  ngOnInit() {
  }

  /**
    * Create contact form
    *
    * @returns {FormGroup}
    */
  createContactForm(): UntypedFormGroup {
    return this._formBuilder.group({
      countryTaxID: [''],
      countryTax: [''],
      regionsTaxes: this._formBuilder.array([
      ])
    });
  }


  onSubmit(evt) {
    console.log(evt.value);
  }

}
