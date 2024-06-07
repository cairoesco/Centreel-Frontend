import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ApiService } from 'src/app/api.service';
import * as _ from 'lodash';
import { UtilsServiceService } from '../../shared/services/utils-service.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  public form: UntypedFormGroup;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  alltags: string[] = [];
  newtags: string[] = [];
  isTag:boolean = false;

  constructor(private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<TagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public utils: UtilsServiceService,
    private webApi: ApiService) {
  }

  ngOnInit() {
    this.addTagForm();

    this.webApi.get('tags?type=' + this.data.type).subscribe((result: any) => {
      if (Boolean(result.success)) {
        this.alltags = result.data;
        this.isTag = true;
      }
    })
    //Close dialog on route change
    this.router.events.subscribe(() => {
      this.dialogRef.close();
    });
  }



  remove(fruit: string): void {
    const index = this.newtags.indexOf(fruit);
    if (index >= 0) {
      this.newtags.splice(index, 1);
    }
  }

  add(tagval) {
    if (tagval != '') {
      let value = tagval;
      if ((value || '').trim()) {
        if (_.find(this.newtags, function (o) {
          return o.toLowerCase() == value.toLowerCase();
        }) == undefined) {
          this.newtags.push(value.trim());
        }
        else {
          this.utils.showSnackBar("Tag already exists", { panelClass: 'error' });
        }
      }
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.alltags.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  onAddClick() {
    this.onSubmit();
    if (this.newtags.length > 0) {
      this.dialogRef.close(this.newtags);
    }
  }

  addTagForm() {
    this.form = this.fb.group({
      tag: ['']
    });
  }

  onSubmit() {
    if (this.form.controls['tag'].value != '') {
      let value = this.form.controls['tag'].value;
      if ((value || '').trim()) {
        if (_.find(this.newtags, function (o) {
          return o.toLowerCase() == value.toLowerCase();
        }) == undefined) {
          this.newtags.push(value.trim());
        }
        else {
          this.utils.showSnackBar("Tag already exists", { panelClass: 'error' });
        }
        this.form.reset();
      }
    }
  }
}