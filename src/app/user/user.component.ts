import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TagComponent } from '../dialog/tag/tag.component'
import { UserService } from './user.service'
import * as _ from 'lodash';
import { DeleteConfirmComponent } from '../dialog/delete-confirm/delete-confirm.component';
import { UtilsServiceService } from '../shared/services/utils-service.service';
import { UserFilterDialogComponent } from './user-filter-dialog/user-filter-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})

export class UserComponent {
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
    private userService: UserService,
    private utils: UtilsServiceService,
    public refVar: ChangeDetectorRef) {

  }
  ngOnInit() {
    this.GetUsers();
  }

  GetUsers() {
    this.inProgress = true;
    this.userService.GetUserList()
      .subscribe((response: any) => {
        this.inProgress = false;
        if (response.success) {
          this.Users = response.data.user_list;
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
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
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

  /** Whether the number of selected elements matches the total number of rows. */
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  //******************************** Add new tag popup ************************ */
  AddNewTag(userdetail): void {
    if ((userdetail == 'ALL' && this.selected.length > 0) || Boolean(userdetail.user_id)) {
      let ids = this.selected.map(({ user_id: id, user_id, ...rest }) => ({ id, user_id, ...rest }));
      const dialogRef = this.dialog.open(TagComponent, {
        width: '550px',
        disableClose: true,
        data: { name: this.name, ids: ids, type: 'user' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (Boolean(result) && result.length > 0) {
          let reference_ids = [];
          if (userdetail == 'ALL') {
            ids.forEach(({ user_id }) => (reference_ids.push(user_id)));
          } else {
            reference_ids.push(userdetail.user_id)
          }
          const tagData = new FormData();
          tagData.append("tags", JSON.stringify(result))
          tagData.append("reference_ids", JSON.stringify(reference_ids))
          tagData.append("type", "user")

          this.userService.addTages(tagData)
            .subscribe((response: any) => {
              this.utils.showSnackBar(response.message);
              result.forEach(tag_name => {
                reference_ids.forEach(id => {
                  if (!Boolean(_.find(_.find(this.rows, function (o) { return o.user_id == id; }).tags, function (o) { return o.tag_name.toLowerCase() == tag_name.toLowerCase(); }))) {
                    _.find(this.rows, function (o) { return o.user_id == id; }).tags.push({ id: 0, tag_name: tag_name })
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

  //******************************** Delete user popup start **************************/
  //Open delete confirm model 
  delete_user(): void {
    /**
       * ToDo: Remain to implement add tag for user
       */
    if (this.selected.length > 0) {
      const dialogRef = this.dialog.open(DeleteConfirmComponent, {
        width: '550px',
        height: '374px',
        data: { selectedItems: this.selected, title: 'Delete Employees', message: 'Are you sure want to delete following employees?' }
      });

      //Call after delete confirm model close
      dialogRef.afterClosed().subscribe((result: any) => {
        // if (Boolean(result) && result.length > 0) {
        //   //** TODO: Call api after select */
        // } else {
        //   //code
        // }
      });
    }
  }
  //******************************** Delete user popup end **************************/

  //******************************** Change user status **************************/

  public changeUserStatus(userId, evt) {
    var data = {
      status: evt.checked ? 1 : 0
    }
    this.userService.changeUserStatus(userId, data)
      .subscribe((response: any) => {
        this.utils.showSnackBar(response.message);
      });
  }


  //******************************** Change user status End**************************/


  //******************************** Filter popup start **************************/
  public filter_data: any;
  ApplyMultipleFilter(fdata): void {
    const dialogRef = this.dialog.open(UserFilterDialogComponent, {
      width: '70%',
      maxWidth:"700px",
      data: { fdata }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (Boolean(result)) {
        let filterObject = new Object();
        filterObject['store_id'] = result.store_id?JSON.stringify(result.store_id):'';
        filterObject['designation_id'] = result.designation_id?JSON.stringify(result.designation_id):'';
        filterObject['tags'] = result.tags?JSON.stringify(result.tags):'';
        this.filter_data = result;

        this.userService.GetUserFilterList(filterObject)
          .subscribe((response: any) => {
            this.inProgress = false;
            if (response.success) {
              this.Users = response.data.user_list;
              this.rows = this.Users;
              this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 1) * 48 + 140) + "px" : '';
              this.temp = this.Users;
            }
            else {
              this.utils.showSnackBar(response.message, { panelClass: 'error' });
            }
        });
      } 
    });
  }


  resendMailToUnverifiedUser(email) {
    const forgotData = new FormData();
    forgotData.append("email", email)
    this.userService.sendVerification(forgotData).subscribe((response: any) => {
      if (response.success) {
        this.utils.showSnackBar(response.message, { duration: 4000 });
      }
      else {
        this.utils.showSnackBar(response.message);
      }
    });

  }
}


