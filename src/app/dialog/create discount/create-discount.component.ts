import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-discount',
  templateUrl: './create-discount.component.html',
  styleUrls: ['./create-discount.component.scss']
})
export class CreateDiscountComponent implements OnInit {

  tag = [
    {id: 1, name: 'Tag1'},
    {id: 1, name: 'Tag2'},
    {id: 1, name: 'Tag3'},
    {id: 1, name: 'Tag4'},
    {id: 1, name: 'Tag5'}
  ]


  constructor(public dialogRef: MatDialogRef<CreateDiscountComponent>) {
    
  }
    
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    
  }

  /* close dialog box */
  close() {
    this.dialogRef.close();
  }
  /* close dialog box */

}

