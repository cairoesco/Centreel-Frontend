import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  rows = [];
  constructor(private api: ApiService, public snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.rows = data;
    });
  }

  fetch(cb) {
    this.api.get('roles')
      .subscribe((response: any) => {
        cb(response.data);
      },
        err => {
          this.snackBar.open(err, '', { duration: 5000 });
        }
      );
  }

  deleteRow(typeId, index) {
    console.log(this.rows);
    this.api.deletes('roles/deletes', typeId)
      .subscribe((response: any) => {
        if (response.success) {
          //  console.log(index);
          this.rows.splice(index, 1);
          this.snackBar.open(response.message, '', { duration: 5000 });
          this.router.navigateByUrl('roles');
        }
      },
      err => {
        this.snackBar.open(err.error.error, '', { duration: 5000 });
      });
  }

}
