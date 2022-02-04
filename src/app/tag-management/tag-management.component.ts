import { Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TagComponent } from '../dialog/tag/tag.component'
import { TagManagementService } from './tag-management.service'
import * as _ from 'lodash';
import { UtilsServiceService } from '../shared/services/utils-service.service';
import { TagManagementFilterDialogComponent } from './tag-management-filter-dialog/tag-management-filter-dialog.component';
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
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
  public sources: any[] = ["All Sources"];
  public default_sources = "All Sources";
  public expanded: any = {};
  public timeout: any;
  public selected = [];
  public temp: any = [];
  public expandedall: boolean = false;
  public dynamicHeight = "";
  public totalCount = 0;
  public pageSize: any = 20;
  public pageIndex: any = 0;
  public form: FormGroup;
  public fb: FormBuilder;
  public selectedSource: any = ""
  public filterParam: any = ""
  readonly headerHeight = 50;
  readonly rowHeight = 50;

  @ViewChild('myTable') table: any;
  constructor(public dialog: MatDialog,
    private tagManagementService: TagManagementService,
    private utils: UtilsServiceService,
    private el: ElementRef,
    public refVar: ChangeDetectorRef) {
  }

  // public sourceForm = new FormControl();

  ngOnInit() {
    this.GetAllTags();
  }


  
  GetAllTags() {
    this.inProgress = true;
    this.tagManagementService.getTags()
      .subscribe((response: any) => {
        this.inProgress = false;
        if (response.success) {
          for(const tag of response.data){
            if(!this.sources.includes(tag.type)){
              this.sources.push(tag.type)
            }
          }
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
    this.filterParam = val
    this.fetchFilteredTags()
    // // filter our data
    // const temp = this.temp.filter(function (d) {
    //   return d.customer_name.toLowerCase().indexOf(val) !== -1 || !val;
    // });
    // // update the rows
    // this.rows = temp;
    // this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 1) * 48 + 140) + "px" : '';
    // // Whenever the filter changes, always go back to the first page
    // if (this.rows.length > 0 && this.table)
    //   this.table.offset = 0;
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
  ApplyMultipleFilter(e): void {
   
      this.selectedSource = e;
    
    this.fetchFilteredTags();
  }

  fetchFilteredTags() {
    this.inProgress = true;

     
    const params = {
      type: this.selectedSource == "All Sources" ? '' : this.selectedSource ,
      search: this.filterParam
    }

    this.tagManagementService.filterTag(params)
      .subscribe((response: any) => {
        this.inProgress = false;
        if (response.success) {
          for(const tag of response.data){
            if(!this.sources.includes(tag.type)){
              this.sources.push(tag.type)
            }
          }
          this.Tags = response.data;
          this.totalCount = response.total_count;
          this.rows = this.Tags;
          this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 1) * 48 + 140) + "px" : '';
          this.temp = this.Tags;
        }
      });
      this.inProgress = false;
  }

}


