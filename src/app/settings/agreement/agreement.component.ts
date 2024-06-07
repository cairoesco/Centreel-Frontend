import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { SettingsService } from '../settings.service'
@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements OnInit {
  addAgreement: UntypedFormGroup;
  agreement: any = new Object();
  chain_id: any = '';
  public barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    //buttonColor: 'primary',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }
  chains = [];
  constructor(
    private formBuilder: UntypedFormBuilder,
    public utility: UtilsServiceService,
    public settingsService: SettingsService) {
    this.getAllChain();
  }
  @ViewChild('editor') editor: QuillEditorComponent;

  ngOnInit() {
    this.addAgreement = this.formBuilder.group({
      chain_id: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      agreement_id: [],
    });
    this.addAgreement.patchValue({ status: "1" });
    this.onChanges();
  }

  getAllChain() {
    this.settingsService.getChain()
      .subscribe((response: any) => {
        this.chains = response.data;
        if (this.chains.length == 1) {
          this.addAgreement.get('chain_id').setValue(this.chains[0].chain_id)
        }
      });
  }
  onSubmit() {
    this.agreement = this.addAgreement.getRawValue();

    if (this.addAgreement.valid) {
      this.barButtonOptions.active = true;
      this.barButtonOptions.text = 'Saving Data...';
    }
    if (this.addAgreement.valid && this.addAgreement.get('agreement_id').value != '') {
      this.agreement._method = 'put';
      this.settingsService.updateAgreement(this.addAgreement.get('agreement_id').value, this.agreement)
        .subscribe((response: any) => {
          this.utility.showSnackBar(response.message);
          this.barButtonOptions.active = false;
          this.barButtonOptions.text = 'SAVE';
        },
          err => {
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'SAVE';
          });
    }
    else {
      this.settingsService.storeAgreement(this.agreement)
        .subscribe((response: any) => {
          this.utility.showSnackBar(response.message);
          this.barButtonOptions.active = false;
          this.barButtonOptions.text = 'SAVE';
        },
          err => {
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'SAVE';
          });
    }

  }
  onChanges(): void {
    this.addAgreement.get('chain_id').valueChanges.subscribe(val => {
      this.settingsService.getAgreement(val)
        .subscribe((response: any) => {
          if (response.data) {
            this.addAgreement.patchValue(response.data);
            this.addAgreement.patchValue({ status: response.data.status.toString() });
          }
          else {
            this.addAgreement.patchValue({ status: '1', description: '', agreement_id: '', title: '' });
          }
        });
    });
  }
}
