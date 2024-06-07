import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { TagComponent } from '../../dialog/tag/tag.component'
import * as _ from 'lodash';
import { ProductService } from '../product.service';
import { DeleteConfirmComponent } from '../../dialog/delete-confirm/delete-confirm.component';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { PrintBarcodeComponent } from '../products/print-barcode/print-barcode.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit {
  public productsList: any = [];
  public adavance_filter: any = [];
  public inProgress: boolean = false;
  public selected = [];
  public name: string;
  public rows: any[] = [];
  public total_count;
  public dynamicHeight = "";
  public selection = new SelectionModel<any>(true, []);
  @ViewChild('myTable') table: any;
  public selectedProductdIds: any = [];
  constructor(public dialog: MatDialog,
    private productService: ProductService,
    private utils: UtilsServiceService,
    private el: ElementRef, 
  ) { }

  
  readonly headerHeight = 50;
  readonly rowHeight = 50;
  isLoading: boolean;

  public pageSize: any = 20;
  public pageIndex: any = 0;

  public newrows: any[] = [];
  productobj: any = new Object();
  scrollEnable : boolean = false;
  

  //***************** Text Filter ************************ */
  // ApplyFilter(filterValue: string) {
  //   this.productobj['search'] = filterValue.toLowerCase();
  //   this.productobj['pageIndex'] = 0;
  //   this.getVariantData();
  // }

  //**************** Filter popup start *********************/
  public filter_data: any;
  openFilter(fdata): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '70%',
      maxWidth: "700px",
      data: { fdata }
    });
    //Call after delete confirm model close
    dialogRef.afterClosed().subscribe(result => {
      if (Boolean(result)) {
        this.inProgress = true;
      this.isLoading = true;
        this.productobj['pageSize'] = 20;
        this.productobj['pageIndex'] = 0;
        result.product_type_id ? this.productobj['product_type_id'] = result.product_type_id ? JSON.stringify(result.product_type_id) : '' : delete this.productobj['product_type_id'];
        result.product_category_id ? this.productobj['product_category_id'] = result.product_category_id ? JSON.stringify(result.product_category_id) : '' : delete this.productobj['product_category_id'];
        result.tags ? this.productobj['tags'] = result.tags ? JSON.stringify(result.tags) : '' : delete this.productobj['tags'];
        
        this.filter_data = result;
        this.getVariantData();
      }
    });
  }

  getVariantData(){
    this.productService.GetProductList(this.productobj)
    .subscribe((response: any) => {
      this.inProgress = false;
      if (response.success) {
        this.total_count = response.total_count;
        this.productsList = response.data.variants;
        this.adavance_filter = response.data.filters
        this.rows = this.productsList
        this.newrows = this.rows
        this.newrows = [...this.newrows]
        this.inProgress = false;
        this.isLoading = false;
        this.dynamicHeight = this.newrows.length < 12 ? ((this.newrows.length + 1) * 48 + 140) + "px" : '';
      }
      else {
        this.utils.showSnackBar(response.message, { panelClass: 'error' });
      }
    });
  }
  //******************************** Filter popup end **************************

  //Calculate row height based on content
  getRowHeight({ product_name, product_type_name, product_category_name }) {
    if ((Boolean(product_name) && product_name.length > 55) ||
      (Boolean(product_type_name) && product_type_name.length > 30) ||
      (Boolean(product_category_name) && product_category_name.length > 29)
    ) {
      if (window.innerWidth < 1700)
        return 70;
    }
    return 48;
  }

  //******************************** Delete product popup start **************************
  //Open delete confirm model 
  delete_product(): void {
    if (this.selected.length > 0) {
      let ids = this.selected.map(({ user_id: id, user_id, ...rest }) => ({ id, user_id, ...rest }));
      const dialogRef = this.dialog.open(DeleteConfirmComponent, {
        data: { selectedItems: ids, title: 'Delete Product', message: 'Are you sure want to delete following product?' }
      });
      //Call after delete confirm model close
      dialogRef.afterClosed().subscribe(result => {
        if (Boolean(result) && result.length > 0) {
          let formdata = new FormData();
          formdata.append('variant_ids', JSON.stringify(_.map(result, 'id')));
          this.productService.deleteProductVariant(formdata).subscribe((response: any) => {
            if (response.success) {
              this.utils.showSnackBar(response.message);
              _.remove(this.rows, function (o: any) {
                return Boolean(_.find(result, function (array) { return array.id == o.variant_id }));
              });
              _.remove(this.productsList, function (o: any) {
                return Boolean(_.find(result, function (array) { return array.id == o.variant_id }));
              });
              this.productsList = [...this.productsList];
              this.rows = [...this.rows];
              this.selection.clear();
              this.selected = [];
            }
          })
        }
      });
    }
  }
  /******************************** Delete user popup end **************************/

  //******************************** Add new tag popup start ************************ */
  AddNewTag(productdetail): void {
    if ((productdetail == 'ALL' && this.selected.length > 0) || Boolean(productdetail.variant_id)) {
      let ids = this.selected.map(({ variant_id: id, variant_id, ...rest }) => ({ id, variant_id, ...rest }));
      const dialogRef = this.dialog.open(TagComponent, {
        width: '550px',
        disableClose: true,
        data: { name: this.name, ids: ids, type: 'variant' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (Boolean(result) && result.length > 0) {
          let reference_ids = [];
          if (productdetail == 'ALL') {
            ids.forEach(({ variant_id }) => (reference_ids.push(variant_id)));
          } else {
            reference_ids.push(productdetail.variant_id)
          }
          const tagData = new FormData();
          tagData.append("tags", JSON.stringify(result))
          tagData.append("reference_ids", JSON.stringify(reference_ids))
          tagData.append("type", "variant")

          this.productService.addTages(tagData)
            .subscribe((response: any) => {
              this.utils.showSnackBar(response.message);
              result.forEach(tag_name => {
                reference_ids.forEach(id => {
                  if (!Boolean(_.find(_.find(this.newrows, function (o) { return o.variant_id == id; }).tags, function (o) { return o.tag_name.toLowerCase() == tag_name.toLowerCase(); }))) {
                    _.find(this.newrows, function (o) { return o.variant_id == id; }).tags.push({ id: 0, tag_name: tag_name })
                  }
                });
              });

              this.selected = [];
            });
        }
      });
    }
  }
  //******************************** New tag add end *******************************/

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


  //*********************** Product Status Change *************************************/
  productStatusChange(product_id, evt) {
    var variant_ids = [product_id];
    var status = evt.checked ? 1 : 0;
    const formData = new FormData();
    formData.append("variant_ids", JSON.stringify(variant_ids));
    formData.append("status", JSON.stringify(status));
    this.productService.productStatusChange(formData)
      .subscribe((response: any) => {
        this.utils.showSnackBar(response.message);
      });
  }


  //******* Get List Data *************/
  onScroll(offsetY: number) {
    const viewHeight = this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;
    if ((offsetY + viewHeight) >= (this.newrows.length * this.rowHeight)) {
      if(!this.scrollEnable){
        this.scrollEnable = true;
        this.pageIndex = this.productobj.pageIndex + 1;
        this.GetProductList(this.pageSize, this.pageIndex);
      }
    }

  }
  
  GetProductList(pageSize, pageIndex) {
    this.inProgress = true;
    if (this.newrows.length == 0) {
      this.isLoading = true;
    }
    this.productobj.pageSize = pageSize;
    this.productobj.pageIndex = pageIndex;
    // this.productService.GetProductList({ pageSize: 9999, pageIndex: 0 })
    this.productService.GetProductList(this.productobj)
      .subscribe((response: any) => {
        this.inProgress = false;
        this.scrollEnable = false;
        if (response.success) {
          this.total_count = response.total_count;
          this.productsList = response.data.variants;
          this.adavance_filter = response.data.filters
          this.rows = this.productsList
          if (this.rows.length == 0 && this.productobj.pageIndex == 0)
            this.newrows = this.rows
          else
            this.newrows.push(...this.rows)
          this.newrows = [...this.newrows]

          this.dynamicHeight = this.newrows.length < 12 ? ((this.newrows.length + 1) * 48 + 140) + "px" : '';
          this.isLoading = false;

          //Set filter value
          // this.adavance_filter.product_attributes.forEach(element => {
          //   element.product_attribute_properties.forEach(checkbox => {
          //     checkbox.value = false;
          //   });
          // });
          // this.adavance_filter.product_types.forEach(element => {
          //   element.product_categories.forEach(checkbox => {
          //     checkbox.value = false;
          //   });
          // });
          // this.adavance_filter.variant_properties.forEach(element => {
          //   element.variant_property_values.forEach(checkbox => {
          //     checkbox.value = false;
          //   });
          // });
        }
        else {
          this.utils.showSnackBar(response.message, { panelClass: 'error' });
        }
      });
  }

  ngOnInit() {
    this.GetProductList(this.pageSize, this.pageIndex);
    this.onChanges();
  }
  
  public search =new UntypedFormControl('');

  onChanges(): void {
    this.search.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(val => {
      this.productobj['search'] = this.search.value;
      this.productobj['pageIndex'] = 0;
      this.productService.GetProductList(this.productobj)
        .subscribe((response: any) => {
          if (response.success) {
            this.total_count = response.total_count;
            this.productsList = response.data.variants;
            this.rows = this.productsList
            this.newrows = this.rows
            this.newrows = [...this.newrows]
            this.inProgress = false;
            this.isLoading = false;
            this.dynamicHeight = this.newrows.length < 12 ? ((this.newrows.length + 1) * 48 + 140) + "px" : '';
          }
        });
    })
    
  }

  public variantDetail: any;
  printBarcode(v_id): void {
    this.variantDetail =this.newrows.find(x => x.variant_id === v_id);
    let vData = [this.variantDetail];
    
    let vId = v_id;
    const dialogRef = this.dialog.open(PrintBarcodeComponent, {
      width: '70%',
      maxWidth: "700px",
      disableClose: true,
      data: { vData, vId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (Boolean(result)) {
        // console.log("data send");
      }
    });
  }
}

