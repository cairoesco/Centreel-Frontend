import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-marketing-mail',
  templateUrl: './marketing-mail.component.html',
  styleUrls: ['./marketing-mail.component.scss']
})
export class MarketingMailComponent implements OnInit {
  sendMarketingMail: UntypedFormGroup;
  displayedColumns = ['id', 'name', 'progress', 'color'];
  dataSource: MatTableDataSource<UserData>;
  filteredStoreOptions: Observable<any>;
  filteredOptions: Observable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  rows = [];
  simpleItems = [true, 'Two', 3];
  temp = [];
  chainParamters = [
    {
      "chain_id": 29,
      "name": "Max",
      "desc": "this is max chain.",
      "status": 1,
      "created_on": "10/04/2018 06:45 PM",
      "created_by_name": null
    },
    {
      "chain_id": 48,
      "name": "Red chain",
      "desc": "radhika 's chain",
      "status": 1,
      "created_on": "10/03/2018 03:10 PM",
      "created_by_name": null
    }
  ];
  chainStores = [{
    "store_id": 29,
    "chain_id": 29,
    "name": "Wealth Shop",
    "address": "4545 W 10th Avenue",
    "description": "The Wealth Shop is Vancouver's first legal cannabis shop",
    "chain_manager_name": "Wealth Shop",
    "fname": "",
    "lname": "",
    "latitude": 49.26410030,
    "longitude": "-123.21001230",
    "contact_no": "(604) 620-5900"
  },
  {
    "store_id": 35,
    "chain_id": 12,
    "name": "TOKEiT Demo",
    "address": "4545 W 10th Avenue",
    "description": "The new way to pay !",
    "chain_manager_name": "TOKEiT",
    "fname": "",
    "lname": "",
    "latitude": 49.26410030,
    "longitude": "-123.21001230",
    "contact_no": "(604) 620-5900"
  }];
  stores;
  onChangeClick(val) {

  }
  
  constructor(private formBuilder: UntypedFormBuilder) {
    const users: UserData[] = [];
    for (let i = 1; i <= 100; i++) { users.push(createNewUser(i)); }
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }
  ngOnInit() {
    this.filterFormGroup();
    this.dropdownFilters();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.stores = this.chainStores;
  }
  setFocus($event) {
  }
  sunmittedFilterValues(val) {
    console.log(val.value, "exect here");

  }


  /******************************* To make observable filters and changes value according to it ********************************/
  dropdownFilters() {
    this.filteredStoreOptions = this.sendMarketingMail.controls["store_id"].valueChanges
      .pipe(
        startWith(''),
        map(val => this.storeFilter(val))
      );
    this.filteredOptions = this.sendMarketingMail.controls["chain_id"].valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );
  }
  /******************************* Chain Filter ********************************/
  filter(val) {
    if (val.name) {
      this.isChainAvailable(val.chain_id)
      return this.chainParamters.filter(option =>
        option.name.toLowerCase().includes(val.name.toLowerCase()));

    }
    else {
      return this.chainParamters.filter(option =>
        option.name.toLowerCase().includes(val.toLowerCase()));
    }

  }
  /******************************* Store Filter ********************************/
  storeFilter(val) {
    if (val && val.name) {
      return this.stores.filter(option =>
        option.name.toLowerCase().includes(val.name.toLowerCase()));

    }
    else {
      return this.stores.filter(option =>
        option.name.toLowerCase().includes(val.toLowerCase()));
    }
  }
  /******************************* Check in Chain filter that stores are available or not ********************************/
  isChainAvailable(element) {
    this.stores = [];
    this.stores = this.chainStores.filter(function (d) {
      return d.chain_id == element;

    })
    this.storeDisplay();
    // this.dropdownFilters();
    this.sendMarketingMail.controls["store_id"].setValue("");
  }
    
  /******************************* Filter Form Group ********************************/
  filterFormGroup() {
    this.sendMarketingMail = this.formBuilder.group({
      chain_id: [null, Validators.required],
      store_id: [null, Validators.required],
      age_from: [null, Validators.required],
      age_to: [null, Validators.required],
      gender: [null, Validators.required],
    });
  }
  /******************************* Apply filter in Data-table paginator ********************************/
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /******************************* Display stores name as per store selected in Autocomplete ********************************/  
  storeDisplay(user?: any): string | undefined {
    return user ? user.name : undefined;
  }

  /******************************* Display chain name as per store selected in Autocomplete ********************************/  
  chainDisplay(user?: any): string | undefined {
    return user ? user.name : undefined;
  }

}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';
  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}
/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];
export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}