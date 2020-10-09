import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss']
})
export class DeleteConfirmComponent implements OnInit {

  selectedItems: any = [];
  title: string;
  message: string;
  okButton:string;
  cancelButton:string;
  confirmSelectedItems: any = [];
  constructor(public dialogRef: MatDialogRef<DeleteConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    const {selectedItems,title, message, cancelButton, okButton} = data;
    this.selectedItems = selectedItems;
    this.title = title;
    this.message = message;
    this.cancelButton=Boolean(cancelButton)?cancelButton:'CANCEL';
    this.okButton=Boolean(okButton)?okButton:'DELETE'
    this.confirmSelectedItems = Boolean(this.selectedItems) ? this.selectedItems : [];
  }

  ngOnInit() {
  }

  /* close dialog box */
  close() {
    this.dialogRef.close();
  }
  /* close dialog box */

  changeCheckbox(user, event) {
    if (event.checked) {
      this.confirmSelectedItems.push(user);
    } else {
      this.confirmSelectedItems = _.filter(this.confirmSelectedItems, function (o) { return o.id != user.id; });
    }
  }

  //Delete confirm close dialog
  deleteData() {
    this.dialogRef.close(this.confirmSelectedItems);
  }
}