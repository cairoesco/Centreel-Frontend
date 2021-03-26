import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements OnInit {

  public form: FormGroup;
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private api: ApiService) { }
  public email;
  public key;
  public type;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300
  };
  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawComplete(event) {
    // will be notified of szimek/signature_pad's onEnd event
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }
  ngOnInit() {
    this.form = this.fb.group({
      // password: password,
      // confirmPassword: confirmPassword,
      // pin: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
      pin: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^-?[\d.]+(?:e-?\d+)?$/)])],
      name: [null],
      email: [null],
      key: [null],
      type: [null]
    });

    this.activatedRoute.params.subscribe((params) => {
      let id: any = params['id'];
      let parmeters = Boolean(id)?atob(id):id;

    });
  }

  onSubmit() {
    this.form.get("email").setValue(this.email);
    this.form.get("key").setValue(this.key);
    this.form.get("type").setValue(this.type);
    // code for API call to reset password
    // this.api.post("reset", this.form)
    //   .subscribe((response: any) => {
    //     console.log(response);
    //     if (response.success) {
    //       this.router.navigate ( ['/session/signin'] );
    //     }
    //   },
    //     err => {
    //       console.log(err);
    //       // this.snackBar.open(err.error.error, '', { duration: 5000 });
    //     });
  }



}
