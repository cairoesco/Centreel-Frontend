import { Component, OnInit, Inject, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiscountService } from '../discount.service';
import * as _moment from 'moment';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import * as _ from 'lodash';


@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrls: ['./add-discount.component.scss'],
})
export class AddDiscountComponent implements OnInit {

  public tags: any = [];
  public stores: any = [];
  public discount_types: any = [];
  public categories: any = [];
  public rawDetail: any;

  public selectedDiscountType: any;

  public discountForm: FormGroup;
  form_obj: any = new Object();
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public refVar: ChangeDetectorRef,
    private api: DiscountService,
    public utility: UtilsServiceService,
    private router: Router,
    public discountDialogRef: MatDialogRef<AddDiscountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.utility.indexofTab = 0;
  }

  ngOnInit() {
    this.addDiscountForm();
    this.getRawDetails();
    if (this.data.fdata)
      this.discountForm.patchValue(this.data.fdata);
    
  }

  handleSelectDiscountType(type){
    this.selectedDiscountType = type
  }

   /***************** Form Group *****************************/
   addDiscountForm() {
    this.discountForm = this.fb.group({
      store_id: ['', [Validators.required]],
      discount_title: ['', [Validators.required]],
      value: ['', [Validators.required]],
      discount_type: ['', [Validators.required]],
      parameters: [[], [Validators.required]],

    });
  }

  getRawDetails() {
    this.api.GetAddDiscountData()
      .subscribe((response: any) => {
        if (response.success) {
          this.rawDetail = response.data;
          this.stores = response.data.stores;
          this.discount_types = response.data.discounts_types;
          this.tags = response.data.tags;
          this.categories = response.data.categories;
        }
      });
  }

  addNewDiscount() {
    this.form_obj = this.discountForm.getRawValue();
    const tag = [];
    const cat = [];
  for (const params of this.form_obj.parameters) {
   if(this.selectedDiscountType == 'tag'){
   const data = {"tag_id": params.toString()}
   tag.push(data)
   } else if (this.selectedDiscountType == 'category'){
  const data = {"cat_id": params.toString()}
  cat.push(data)
 }
  }

const payload = {
    store_id:  this.form_obj.store_id,
    discount_title: this.form_obj.discount_title,
    status: 1,
    value: this.form_obj.value,
    discount_type: this.form_obj.discount_type,
    parameter: this.selectedDiscountType == 'tag' ? tag : this.selectedDiscountType == 'category' ? cat : ""
}
    this.discountDialogRef.close(payload);
  }

    //******************************** Add discount popup start **************************/
    public filter_data: any;
    AddDiscountPopup(fdata): void {
      const dialogRef = this.dialog.open(AddDiscountComponent, {
        width: '70%',
        maxWidth:"700px",
        data: { fdata }
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        
      });
    }

    close(){
      this.discountForm.reset();
    }

}
