import { Component, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { TagComponent } from '../dialog/tag/tag.component'
import { StoreService } from './store.service'
import * as _ from 'lodash';
import { DeleteConfirmComponent } from '../dialog/delete-confirm/delete-confirm.component';
import { UtilsServiceService } from '../shared/services/utils-service.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})

export class StoreComponent {
  public inProgress: boolean = false;
  public Stores: any[] = [];
  public selection = new SelectionModel<any>(true, []);
  public rows: any[] = [];
  @ViewChild('myTable') table: any;
  public expanded: any = {};
  public timeout: any;
  public selected = [];
  public temp: any = [];
  public expandedall: boolean = false;
  public dynamicHeight = "";
  public tableMode:string = 'flex';
  constructor(public dialog: MatDialog,
    private storeService: StoreService,
    private utils: UtilsServiceService) { }
  ngOnInit() {
    this.GetStores();
  }
  
  ngDoCheck(){
    if(window.innerWidth<=1024){
      this.tableMode='flex';
    }else{
      this.tableMode='force';
    }
  }

  GetStores() {
    this.inProgress = true;
    this.storeService.GetStoreList()
      .subscribe((response: any) => {
        this.inProgress = false;
        if (response.success) {
          this.Stores = response.data;
          this.rows = this.Stores;
          this.temp = this.Stores;
        }
      });
  }

  applyFilter(filterValue: string) {
    const val = filterValue.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
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
  AddNewTag(storedetail): void {
    if ((storedetail == 'ALL' && this.selected.length > 0) || Boolean(storedetail.store_id)) {
      let ids = this.selected.map(({ store_id: id, store_id, ...rest }) => ({ id, store_id, ...rest }));
      const dialogRef = this.dialog.open(TagComponent, {
        width: '550px',
        disableClose: true,
        data: { name: "", ids: ids, type: 'store' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (Boolean(result) && result.length > 0) {
          let reference_ids = [];
          if (storedetail == 'ALL') {
            ids.forEach(({ store_id }) => (reference_ids.push(store_id)));
          } else {
            reference_ids.push(storedetail.store_id)
          }
          const tagData = new FormData();
          tagData.append("tags", JSON.stringify(result))
          tagData.append("reference_ids", JSON.stringify(reference_ids))
          tagData.append("type", "store")

          this.storeService.addTages(tagData)
            .subscribe((response: any) => {
              this.utils.showSnackBar(response.message);
              result.forEach(tag_name => {
                reference_ids.forEach(id => {
                  if (!Boolean(_.find(_.find(this.rows, function (o) { return o.store_id == id; }).tags, function (o) { return o.tag_name.toLowerCase() == tag_name.toLowerCase(); }))) {
                    _.find(this.rows, function (o) { return o.store_id == id; }).tags.push({ id: 0, tag_name: tag_name })
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

  //******************************** Delete Store popup start **************************/
  //Open delete confirm model 
  deleteStore(): void {
    if (this.selected.length > 0) {
      let ids = this.selected.map(({ store_id: id, store_id, ...rest }) => ({ id, store_id, ...rest }));
      const dialogRef = this.dialog.open(DeleteConfirmComponent, {
        width: '550px',
        height: '374px',
        data: { selectedItems: ids, title: 'Delete Stores', message: 'Are you sure want to delete following stores?' }
      });

      //Call after delete confirm model close
      dialogRef.afterClosed().subscribe(result => {

      });
    }
  }
  //******************************** Change store status **************************/

  // public changeStoreStatus(StoreId, evt) {
  //   var data = {
  //     status: evt.checked ? 1 : 0
  //   }
  //   this.storeService.changeStoreStatus(StoreId, data)
  //     .subscribe((response: any) => {
  //       this.utils.showSnackBar(response.message);
  //     });
  // }
}


