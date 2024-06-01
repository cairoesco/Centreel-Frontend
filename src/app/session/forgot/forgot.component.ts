import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { UtilsServiceService } from 'src/app/shared/services/utils-service.service';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  public form: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder, private router: Router, private apiApi: ApiService, private utils: UtilsServiceService) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required, CustomValidators.email])]
    });
  }

  onSubmit() {
    const forgotData = new FormData();
    forgotData.append("email", this.form.controls['email'].value)
    forgotData.append("type", 'PASSWORD')
    this.apiApi.post('forgotPassword', forgotData).subscribe((response: any) => {
      if (response.success) {
        this.utils.showSnackBar(response.message, { duration: 4000 });
        this.router.navigate(['/session/signin']);
      }
      else {
        this.utils.showSnackBar(response.message);
      }
    });

  }

}
