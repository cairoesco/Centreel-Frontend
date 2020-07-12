import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-smtp-setting',
  templateUrl: './smtp-setting.component.html',
  styleUrls: ['./smtp-setting.component.scss']
})
export class SmtpSettingComponent implements OnInit {
  portList:any=['25','465','587'];
  settingForm:FormGroup;

  constructor(public fb:FormBuilder) {    
   }

  ngOnInit() {
    this.InitializeForm();
  }

  //Initialize setting form
  InitializeForm(){
    this.settingForm=this.fb.group({
      host:['',Validators.compose([Validators.required])],
      port:['',Validators.compose([Validators.required])],
      username:['',Validators.compose([Validators.required])],
      password:['',Validators.compose([Validators.required])],
      connection_type:['']
    })
  }

  //Save settings data
  SaveSettings(data){
    if(Boolean(this.settingForm.valid)){
      console.log(data);
    }
    
  }
}
