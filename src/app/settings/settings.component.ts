import { Component, OnInit } from '@angular/core';
import { UtilsServiceService } from '../shared/services/utils-service.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public userData: any;
  constructor(public utility: UtilsServiceService) {
    this.userData = this.utility.getSessionData("currentUser");
  }

  ngOnInit() {
  }

}
