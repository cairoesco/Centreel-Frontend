import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsServiceService } from 'src/app/shared/services/utils-service.service';

@Component({
  selector: 'app-default-product-search',
  templateUrl: './default-product-search.component.html',
  styleUrls: ['./default-product-search.component.scss']
})
export class DefaultProductSearchComponent implements OnInit {
  public form: UntypedFormGroup;
  public categoryList:any=[];
  public subCategoryList:any=[];
  products:any=[
    {id:1,name:'Durgamata',description:'Description',price:123},
    {id:1,name:'Durgamata',description:'Description',price:123},
    {id:1,name:'Durgamata',description:'Description',price:123},
  ]
  constructor(private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<DefaultProductSearchComponent>,
    public utils: UtilsServiceService,
    @Inject(MAT_DIALOG_DATA) public data: DefaultProductSearchComponent) {
    this.categoryList=data.categoryList; 
  }

  ngOnInit() {
    this.form = this.fb.group({
      category: [''],
      subcategory:[],
      keyword:[]
    });
  }
  selectedType(type_id,e){
    this.subCategoryList=_.find(this.categoryList,(data)=>data.type_id==type_id);
  }
  onSubmit(){
    console.log(this.form.value);
  }
  productSelect(data){
    this.dialogRef.close(data);
  }
}
