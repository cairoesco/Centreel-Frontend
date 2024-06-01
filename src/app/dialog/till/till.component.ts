
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-till',
  templateUrl: './till.component.html',
  styleUrls: ['./till.component.scss']
})
 
export class TillComponent implements OnInit {
  public form: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder,public dialogRef: MatDialogRef<TillComponent>, @Inject(MAT_DIALOG_DATA) public data:any) { 
  }
 
  ngOnInit() {
    this.form = this.fb.group({
      storage_id: [0],
      name: ['',Validators.required],
      subtype: ['', Validators.required],
      status: [0],
    });
    if(Boolean(this.data.data)){
      this.form.patchValue({storage_id:this.data.data.storage_id,name:this.data.data.name,subtype:this.data.data.subtype,status:this.data.data.status})
    }
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form);
    }
  }
}

 
