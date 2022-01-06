import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { CustomValidators } from 'ng2-validation';
import { TagComponent } from '../../dialog/tag/tag.component'
import { MatDialog } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import {map, startWith} from 'rxjs/operators';
import { Observable } from 'rxjs';
import {  TagManagementService } from '../tag-management.service';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import * as _ from 'lodash';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-edit-tag-management',
  templateUrl: './edit-tag-management.component.html',
  styleUrls: ['./edit-tag-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter }
  ],
})
export class EditTagManagementComponent implements OnInit {

  @ViewChild('tagEntityInput') tagEntityInput: ElementRef<HTMLInputElement>;
 
  console = console;

  currentUserDetail: any;
  public innerHeight: any;
  public inProgress: boolean = false;
  public indexofTab = 0;
  public selectable: boolean = true;
  public removable: boolean = true;
  public removeTagArray = [];
  public tagArray: any = [];
  public ArrayOfTags: any = [];
  public tags: boolean = false;
  public store_id: any;
  public chain_id: any;
  public defaultStatus: any;
  public isEditing: boolean = false;
  public isEditingEntity: boolean = false;
  public addNewEntry: boolean = false;
  public customerInfo: boolean = false;
  public TagStatusArray: any = [];
  public tempEntityArray: any = [];
  public selectedTag: any = [];
  public tagForm: FormGroup;
  public index: any = 'ALL';
  public rawDetail: any;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagEntities: string[] = [];
  allTagEntities: any = [];
  tagEntityCtrl = new FormControl();
  filteredTagEntities: Observable<string[]>;

  state$: Observable<object>;

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE ALL',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }
  barEditButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'EDIT',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }
  barUploadButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'UPLOAD DOCUMENT',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }
  barSaveTagButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE CHANGES',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }
  barAddTagEntitiesButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'ADD ENTITIES',
    barColor: 'primary',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }
 
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public refVar: ChangeDetectorRef,
    private api: TagManagementService,
    public utility: UtilsServiceService,
    private tagManagementService: TagManagementService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  
    this.utility.indexofTab = 0;
    this.currentUserDetail = this.utility.getSessionData('currentUser');


    this.filteredTagEntities = this.tagEntityCtrl.valueChanges.pipe(
      startWith(null),
      map((tagEntity: string | null) => (tagEntity ? this._filter(tagEntity) : this.allTagEntities.slice())),
    );
 
  }
  

  onSubmit() {
    const formData = new FormData();
    if (this.tagForm.valid) {
      this.barButtonOptions.text = "Saving Data...";
      this.barButtonOptions.active = true;
      this.barButtonOptions.disabled = true;     
    }else{
      this.utility.scrollToError();
    }
  }

  //************ Remove tag ********************/
  removeTag(index, tag) {
    if (index !== -1) {
      this.tagArray.filter(tagArray => {
        if (tagArray.id != 0 && tagArray.id == tag) {
          this.removeTagArray.push(tagArray.id);
        }
      })
      this.ArrayOfTags.splice(index, 1);
      this.tagArray.splice(index, 1);
    }
  }

  //******* Add new tag popup **************  */
  AddNewTag(): void {
    // const dialogRef = this.dialog.open(TagComponent, {
    //   width: '550px',
    //   disableClose: true,
    //   data: { name: this.tagName, type: 'user' }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (Boolean(result) && result.length > 0) {
    //     result.forEach(tag_name => {
    //       if (!Boolean(_.find(this.tagArray, function (o) { return o.tag_name.toLowerCase() == tag_name.toLowerCase(); }))) {
    //         this.tagArray.push({ id: 0, tag_name: tag_name })
    //         this.ArrayOfTags.push(tag_name)
    //       }
    //     })
    //   }

    // });
  }
  
  getTagForm() {
    this.tagForm = this.fb.group({
      tag_name: '',
      source: [{value: '', disabled:true}],
      status: '',
      entities: '',   
    });
    // this.tagForm.controls['source'].disable()
  }

  viewOnly(){
    this.isEditing = false;
    this.tagForm.disable();
    this.barSaveTagButtonOptions.disabled = true;
  }
  isEditable(){
    this.isEditing = true;
    this.tagForm.enable();
    this.barSaveTagButtonOptions.disabled = false;
  }

  handleAddNewEntry(status){
      this.addNewEntry = status
  }
  handleIsEditing(){
    this.isEditing = !this.isEditing
  }

  handleOnSubmitGeneralEdit(){
    this.inProgress = true;
   const entities = [];
   this.tempEntityArray.map(entity => entities.push(entity?.variant_id.toString()));
    const payload = {
      // id of the tag
      tag_ids: this.selectedTag.id, 
      // variant ids or user id for employers tag
      reference_ids: this.selectedTag.type === 'variant' ? entities : this.selectedTag.user_id,
      // tagname
      tags:  [this.tagForm.get('tag_name').value], 
      status: this.tagForm.get('status').value,
      type: this.selectedTag.type
    }
    console.log({ payload })
    this.tagManagementService.updateTag(payload).subscribe((response: any) => {
      if (response.success) {
        console.log(response.data, 'response.data response.data response.data response.data')
        this.activatedRoute.params.subscribe((params: Params) => {
          if (params?.id){
             this.GetTag(params?.id);
             this.GetTagEntities(params?.id);
          }
        });
      }
    })
  }
  
  GetTag(id){
    this.inProgress = true;
    this.tagManagementService.getTags().subscribe((response: any) => {
      if (response.success) {
        const tempSelectedTag = response.data.find(tag => tag.id == id);
        this.selectedTag = tempSelectedTag;
        if(tempSelectedTag){
          this.tagForm.get('tag_name').setValue(tempSelectedTag.tag_name);
          this.tagForm.get('source').setValue(tempSelectedTag.type);
          this.tagForm.get('status').setValue(tempSelectedTag.status);

          this.GetAllEntities(tempSelectedTag.type);
        }

        this.inProgress = false;
        this.viewOnly();
      }
    })
  }

  GetTagEntities(id){
    this.inProgress = true;
    this.tagManagementService.getTagEntities(id).subscribe((response: any) => {
      if (response.success) {
        for (const entity of response.data){
          this.tempEntityArray.push(entity);
         
        }
      }
      this.inProgress = false;
    })
  }

  GetAllEntities(type){
    this.inProgress = true;
    this.tagManagementService.getAllEntities(type).subscribe((response: any) => {
      if (response.success) {
        this.allTagEntities =  response.data;
        
      }
      this.inProgress = false;
    })
  }

  ngOnInit() {
    this.TagStatusArray = [
      {
        status: 'Inactive',
        status_id: 0
      },
      {
        status: 'Active',
        status_id: 1
      },
    ];

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params?.id){
         this.GetTag(params?.id);
         this.GetTagEntities(params?.id);
      }
    });
    this.getTagForm();
    
  }
  ngDoCheck() {
    this.innerHeight = window.innerHeight - 192;
  }

  remove(tagEntity: string): void {
    console.log(tagEntity, 'tagEntity tagEntity tagEntity')
    console.log(this.tempEntityArray, 'this.tempEntityArray this.tempEntityArray this.tempEntityArray')
    const index = this.tempEntityArray.indexOf(tagEntity);

    if (index >= 0) {
      this.tempEntityArray.splice(index, 1);
    }
    console.log(this.tempEntityArray, 'this.tempEntityArray this.tempEntityArray this.tempEntityArray')
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedEntity = this.allTagEntities.find(entity => entity.variant_name == event.option.value);
    this.tagEntityCtrl.setValue(null);
    if(selectedEntity){
      const entityExists = this.tempEntityArray.find(entity => entity.variant_id == selectedEntity.variant_id)
      if(entityExists){
        return
      }
      const tempObj = {
        tag_id: this.selectedTag.id,
        tag_name: this.selectedTag.tag_name,
        variant_id: selectedEntity.variant_id,
        variant_name : selectedEntity.variant_name,
        type: this.selectedTag.type,
      }
      this.tempEntityArray.push(tempObj)
    } 

  }

  private _filter(value: string): string[] {
    if(typeof value == 'string'){
    const filterValue = value?.toLowerCase();
    return this.allTagEntities.filter(tagEntity => tagEntity['variant_name'].toLowerCase().includes(filterValue));
    }
  }
}
