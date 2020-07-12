import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TagComponent } from '../dialog/tag/tag.component'
import { CustomerService } from './customer.service'
import * as _ from 'lodash';
import { UtilsServiceService } from '../shared/services/utils-service.service';
import { CustomerFilterDialogComponent } from './customer-filter-dialog/customer-filter-dialog.component';
import { PreferredProductDialogComponent } from './preferred-product-dialog/preferred-product-dialog.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})

export class CustomerComponent implements OnInit {
  public inProgress: boolean = false;
  public name: string;
  public Users: any[] = [];
  public rows: any[] = [];
  public expanded: any = {};
  public timeout: any;
  public selected = [];
  public temp: any = [];
  public expandedall: boolean = false;
  public dynamicHeight = "";
  @ViewChild('myTable') table: any;
  constructor(public dialog: MatDialog,
    private customerService: CustomerService,
    private utils: UtilsServiceService,
    public refVar: ChangeDetectorRef) {
  }
  ngOnInit() {
    this.GetUsers();
  }

  GetUsers(params?) {
    this.inProgress = true;
    if (!params)
      params = { platform: 'web' };
    else {
      Object.keys(params).forEach(key => {
        if (params[key] instanceof Object) {
          params[key] = JSON.stringify(params[key]);
        }
        if (!params[key] || params[key] == "" || params[key] == "null") {
          delete params[params[key]];
        }
      })
    }
    this.customerService.GetCustomerList(params)
      .subscribe((response: any) => {
        this.inProgress = false;
        if (response.success) {
          this.Users = response.data.data;
          this.rows = this.Users;
          this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 1) * 48 + 140) + "px" : '';
          this.temp = this.Users;
        }
      });
  }

  applyFilter(filterValue: string) {
    const val = filterValue.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.customer_name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rows = temp;
    this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 1) * 48 + 140) + "px" : '';
    // Whenever the filter changes, always go back to the first page
    if (this.rows.length > 0 && this.table)
      this.table.offset = 0;
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onActivate(event) {
    if (event.type == 'click') {
      this.table.rowDetail.toggleExpandRow(event.row);
    }
  }

  //Calculate row height based on content
  getRowHeight({ store_name, designation }) {
    if ((Boolean(store_name) && store_name.length > 70) ||
      (Boolean(designation) && designation.length > 40)
    ) {
      if (window.innerWidth < 1700)
        return 70;
    }
    return 48;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  //******************************** Add new tag popup ************************ */
  AddNewTag(customerDetail): void {
    if ((customerDetail == 'ALL' && this.selected.length > 0) || Boolean(customerDetail.patient_id)) {
      let ids = this.selected.map(({ patient_id: id, patient_id, ...rest }) => ({ id, patient_id, ...rest }));
      const dialogRef = this.dialog.open(TagComponent, {
        width: '550px',
        disableClose: true,
        data: { name: this.name, ids: ids, type: 'customer' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (Boolean(result) && result.length > 0) {
          let reference_ids = [];
          if (customerDetail == 'ALL') {
            ids.forEach(({ patient_id }) => (reference_ids.push(patient_id)));
          } else {
            reference_ids.push(customerDetail.patient_id)
          }
          const tagData = new FormData();
          tagData.append("tags", JSON.stringify(result))
          tagData.append("reference_ids", JSON.stringify(reference_ids))
          tagData.append("type", "customer")

          this.customerService.addTages(tagData)
            .subscribe((response: any) => {
              this.utils.showSnackBar(response.message);
              result.forEach(tag_name => {
                reference_ids.forEach(id => {
                  if (!Boolean(_.find(_.find(this.rows, function (o) { return o.patient_id == id; }).tags, function (o) { return o.tag_name.toLowerCase() == tag_name.toLowerCase(); }))) {
                    _.find(this.rows, function (o) { return o.patient_id == id; }).tags.push({ id: 0, tag_name: tag_name })
                  }
                });
              })
              this.selected = [];
            });
        }
      });
    }
  }
  //******************************** End new tag add  *******************************/



  //******************************** Filter popup start **************************/
  public filterData: any;
  ApplyMultipleFilter(): void {
    const dialogRef = this.dialog.open(CustomerFilterDialogComponent, {
      width: '40%',
      data: { data: this.filterData }
    });
    //Call after delete confirm model close
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.filterData = result;
        Object.keys(result).forEach(key => {
          if (!Boolean(result[key])) {
            delete result[key];
          }
        })
        this.GetUsers(result)
      }
    });
  }


     //******************************** Filter popup start **************************/
     customerPreferredProducts(patient_id) {
      const dialogRef = this.dialog.open(PreferredProductDialogComponent, {
        width: '40%',
        data: { data: patient_id }
      });
      dialogRef.afterClosed().subscribe((result: any) => {
      });
    }
 
}


