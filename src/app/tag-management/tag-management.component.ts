import { Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TagComponent } from '../dialog/tag/tag.component'
import { TagManagementService } from './tag-management.service'
import * as _ from 'lodash';
import { UtilsServiceService } from '../shared/services/utils-service.service';
import { TagManagementFilterDialogComponent } from './tag-management-filter-dialog/tag-management-filter-dialog.component';
// import { PreferredProductDialogComponent } from './preferred-product-dialog/preferred-product-dialog.component';

@Component({
  selector: 'app-tag-management',
  templateUrl: './tag-management.component.html',
  styleUrls: ['./tag-management.component.scss']
})

export class TagManagementComponent implements OnInit {
  public inProgress: boolean = false;
  public name: string;
  public Tags: any[] = [];
  public rows: any[] = [];
  public expanded: any = {};
  public timeout: any;
  public selected = [];
  public temp: any = [];
  public expandedall: boolean = false;
  public dynamicHeight = "";
  public totalCount = 0;
  public pageSize: any = 20;
  public pageIndex: any = 0;

  readonly headerHeight = 50;
  readonly rowHeight = 50;

  @ViewChild('myTable') table: any;
  constructor(public dialog: MatDialog,
    private tagManagementService: TagManagementService,
    private utils: UtilsServiceService,
    private el: ElementRef,
    public refVar: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.GetAllTags();
  }

  GetAllTags() {
    this.inProgress = true;
    this.tagManagementService.getTags()
      .subscribe((response: any) => {
        this.inProgress = false;
        if (response.success) {
          this.Tags = response.data;
          this.totalCount = response.total_count;
          this.rows = this.Tags;
          this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 1) * 48 + 140) + "px" : '';
          this.temp = this.Tags;
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

  changeTagStatus(tag, evt){
    const payload = {
      status : evt.checked ? 1 : 0
    }
    this.tagManagementService.editTagStatus(tag.id, payload)
      .subscribe((response: any) => {
        if (response.success) {
         this.GetAllTags();
        }
      });
  }

  public filterData: any;
  ApplyMultipleFilter(): void {
    const dialogRef = this.dialog.open(TagManagementFilterDialogComponent, {
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
        // this.GetUsers(result)
      }
    });
  }

}
