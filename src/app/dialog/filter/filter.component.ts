import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  public form: UntypedFormGroup;
  filter_name:any;
  
  city = [
    {
      id: 1,
      name: 'Abbotsford'
    },
    {
      id: 2,
      name: 'Burnaby'
    },
    {
      id: 3,
      name: 'Chilliwack'
    },
    {
      id: 4,
      name: 'Coquitlam'
    },
    {
      id: 5,
      name: 'Delta'
    },
    {
      id: 6,
      name: 'Fort St.John'
    },
    {
      id: 7,
      name: 'Vancouver'
    }
  ];

  province = [
    {id: 1, name: 'Ontario'},
    {id: 1, name: 'Quebec'},
    {id: 1, name: 'British Columbia'},
    {id: 1, name: 'Alberta'},
    {id: 1, name: 'Manitoba'},
    {id: 1, name: 'Saskatchewan'},
    {id: 1, name: 'Nova Scotia'},
  ];

  tag = [
    {id: 1, name: 'Tag1'},
    {id: 1, name: 'Tag2'},
    {id: 1, name: 'Tag3'},
    {id: 1, name: 'Tag4'},
    {id: 1, name: 'Tag5'}
  ]

  categoriesSelected = [
    false, true, false
  ];

  //myGroup;

  

  constructor(private fb: UntypedFormBuilder,public dialogRef: MatDialogRef<FilterComponent>, @Inject(MAT_DIALOG_DATA) public data: FilterDialogData) {
    this.form = this.fb.group({
      myCategory: this.fb.array(this.categoriesSelected)
    });
  }
    
  onNoClick(): void {
    this.dialogRef.close(this.form.value);
  }
  ngOnInit() {
    this.form = this.fb.group({
      filter_name: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
    });
  }

  /* close dialog box */
  close() {
    this.dialogRef.close();
  }
  /* close dialog box */

}
export interface FilterDialogData {
  animal: string;
  name: string;
}
