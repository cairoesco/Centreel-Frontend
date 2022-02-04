import { Component } from '@angular/core';
import { ApiService } from "../api.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-chain',
  templateUrl: './chain.component.html',
  styleUrls: ['./chain.component.scss'],
  providers: [ApiService]
})
export class ChainComponent {
  rows = [];
  constructor(private api: ApiService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.rows = data;
    });
  }

  fetch(cb) {
    this.api.get('chains')
      .subscribe((response: any) => {
        cb(response.data);
      },
        err => {
          this.snackBar.open(err, '', { duration: 5000 });
        }
      );
  }

}
