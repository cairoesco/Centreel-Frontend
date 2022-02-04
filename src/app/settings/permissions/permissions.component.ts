import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  rows = [];
  constructor(private api: ApiService, public snackBar: MatSnackBar,private router: Router) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.rows = data;
    });
  }

  fetch(cb) {
    this.api.get('permissions', {'page': true})
      .subscribe((response: any) => {
        cb(response.data);
      },
      err => {
        this.snackBar.open(err, '', { duration: 5000 });
      }
    );
  }

  deleteRow(typeId, index) {
    this.api.deletes('permissions/deletes', typeId)
        .subscribe((response: any) => {
            if (response.success) {
              //  console.log(index);
                this.rows.splice(index, 1);
                this.snackBar.open(response.message, '', { duration: 5000 });
                this.router.navigateByUrl('permissions');
            }
        },
    err => {
        this.snackBar.open(err.error.error, '', { duration: 5000 });
    });
  }

}
