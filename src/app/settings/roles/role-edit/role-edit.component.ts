import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'; //
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar'; //
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes'; //

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {

  addType: UntypedFormGroup;
  submitted: boolean = false;
  currentId: number;
  typeData = new Object();
  roledata: any = new Object();
  servicePartner = []; //for chain
  roles = []; //for chain
  totallevel: any = [];

  /* for chip */
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  permissionCtrl = new UntypedFormControl();
  filteredPermission: any[] = [];
  //filteredPermission: Observable<string[]>;
  permission: string[] = [];
  allPermission: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  permissionList: any = [];
  permissions: any = [];

  @ViewChild('permissionInput') permissionInput: ElementRef<HTMLInputElement>;
  /* for chip */

  constructor(private router: Router,
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar, private api: ApiService) {
    // this.filteredPermission = this.permissionCtrl.valueChanges.pipe(
    // startWith(null),
    // map((permission: string | null) => permission ? this._filter(permission) : this.allPermission.slice()));
  }

  /* get Permission list */
  getPermission() {
    this.api.get('permissions')
      .subscribe((response: any) => {
        this.permissionList = response.data.permissions;
        this.filteredPermission = response.data.permissions;

      });
  }
  /* get Permisson list */

  /* for chip */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our Permission
    if ((value || '').trim()) {
      this.permission.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.permissionCtrl.setValue(null);
  }

  remove(permission: string): void {
    const index = this.permission.indexOf(permission);

    if (index >= 0) {
      this.permission.splice(index, 1);
      this.permissions.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.permission.push(event.option.viewValue);
    this.permissions.push({ permission_id: event.option.value, permission_name: event.option.viewValue }); //
    this.permissionInput.nativeElement.value = '';
    this.permissionCtrl.setValue(null);
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.allPermission.filter(permission => permission.toLowerCase().indexOf(filterValue) === 0);
  // }
  private _filter(value: string, array, key, selectedArray): string[] {
    if (value) {
      const filterValue = (value && typeof value != "number") ? value.toLowerCase() : null;
      return array.filter(modules => modules[key].toLowerCase().indexOf(filterValue) >= 0);
      //return array.filter(modules => modules[key].toLowerCase().indexOf(filterValue) >= 0 && selectedArray.indexOf(filterValue) == -1);
    } else {
      //const filterValue = (value && typeof value != "number") ? value.toLowerCase() : null;
      return array;
    }
  }

  /* for chip */

  /* for chain */
  // getChains() {
  //   this.api.get('chains')
  //     .subscribe((response: any) => {
  //       this.servicePartner = response.data;
  //     });
  // }
  /* for chain */

  /* for role count */
  getRoles() {
    this.api.get('roles')
      .subscribe((response: any) => {
        this.roles = response.data;
      });
  }
  /* for role count */

  ngOnInit() {
    this.getPermission();
    this.getRoles();
    //this.getChains();
    this.addType = this.formBuilder.group({
      role_id: [null, Validators.required],
      role_name: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
      role_desc: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
      role_status: [null, Validators.required],
      permissionCtrl: [null],
      role_created_by: [null],
      role_level: [null],
      partner_id: [null],
    });
    this.addType.controls.permissionCtrl.valueChanges.subscribe(res => {
      this.filteredPermission = this._filter(res, this.permissionList, 'permission_name', this.permission);
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      let id: number = params['id'];

      if (id) {
        this.currentId = id;
        this.fetch((data) => {
          this.typeData = data;
        });
      }

    });

  }
  fetch(cb) {
    this.api.get('roles/' + this.currentId + '/edit').subscribe((response: any) => {
      if (response.success) {
        response.data.roles[0].permissionCtrl = null;

        this.addType.setValue(response.data.roles[0]);
        this.permission = response.data.permissions.map(x => x.permission_name);
        this.permissions = response.data.permissions;

      } else {
        this.snackBar.open(response.message, '', { duration: 5000 });
        this.router.navigateByUrl('roles');
      }
      cb(response.data);
    });
  }

  onSubmit() {
    if (this.addType.valid) {
      this.roledata = this.addType.getRawValue();
      delete this.roledata.permissionCtrl;
      // delete this.permissiondata.methodsCtrl;
      this.roledata.permissions = this.permissions;

      this.api.post('roles/updates/'+this.currentId, this.roledata)
        .subscribe((response: any) => {
          if (response.success) {
            this.snackBar.open(response.message, '', { duration: 5000 });
            this.router.navigateByUrl('roles');
          }
        },
          err => {
            this.snackBar.open(err.error.message, '', { duration: 5000 });
          });
    }
  }

}
