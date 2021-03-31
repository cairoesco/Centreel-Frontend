import { Component, ViewChild, ChangeDetectorRef,  OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-discount-setting',
  templateUrl: './discount-setting.component.html',
  styleUrls: ['./discount-setting.component.scss']
})
export class DiscountSettingComponent implements OnInit {

  public inProgress: boolean = false;
  public name: string;
  public Users: any[] = [];
  public rows: any[] = [];
  public columns: any[] = [];
  public expanded: any = {};
  public timeout: any;
  public selected = [];
  public temp: any = [];
  public expandedall: boolean = false;
  public dynamicHeight = "";
  @ViewChild('discountTable') table: any;
  constructor(public dialog: MatDialog,
    // private customerService: CustomerService,
    // private utils: UtilsServiceService,
    public refVar: ChangeDetectorRef) {
  }

  ngOnInit() {

    this.rows = [
      {
        name: "10% off on flowers",
        startDate: "29-Jun-2018",
        value: "10%",
        status: 'active',
        action: [
          {edit: true}, {delete: true}
        ]
      },
      {
        name: "10% off on flowers",
        startDate: "29-Jun-2018",
        value: "10%",
        status: 'active',
        action: [
          {edit: true}, {delete: true}
        ]
      },
      {
        name: "10% off on flowers",
        startDate: "29-Jun-2018",
        value: "10%",
        status: 'active',
        action: [
          {edit: true}, {delete: true}
        ]
      },
    ]

  }


}
