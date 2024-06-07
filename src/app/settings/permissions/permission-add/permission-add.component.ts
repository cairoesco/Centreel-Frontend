import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar'; //
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-permission-add',
  templateUrl: './permission-add.component.html',
  styleUrls: ['./permission-add.component.scss']
})
export class PermissionAddComponent implements OnInit {

  addType: UntypedFormGroup;
  submitted: boolean = false;
  permissiondata: any = new Object();
  permissionMethods = [];
  currentId: 2;
  module_id: any = [];
  methodList: any = [];

  // for module chip
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  moduleCtrl = new UntypedFormControl();
  filteredModules: any[] = [];
  modules: string[] = [];
  module: any = [];
  moduleList: any = [];
  // End module chip

  // for method chip
  methodsCtrl = new UntypedFormControl();
  filteredMethods: any[] = [];
  methods: string[] = [];
  method: any = [];
  methodsList: any = [];
  // End module chip


  @ViewChild('moduleInput') moduleInput: ElementRef<HTMLInputElement>;
  @ViewChild('methodInput') methodInput: ElementRef<HTMLInputElement>;

  /* for chip */
  constructor(private router: Router,
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar, private api: ApiService) {

    this.addType = this.formBuilder.group({
      permission_name: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
      permission_desc: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
      permission_status: [null, Validators.required],
      moduleCtrl: [null, Validators.required],
      methodsCtrl: [null]
    });
    this.addType.controls.moduleCtrl.valueChanges.subscribe(res => {
      this.filteredModules = this._filter(res, this.moduleList, 'module_name', this.modules);
    });

    this.addType.controls.methodsCtrl.valueChanges.subscribe(res => {
      this.filteredMethods = this._filter(res, this.methodsList, 'method_name', this.methods);
    });
  }

  ngOnInit() {
    this.getModule();
  }

  // get module list
  getModule() {
    this.api.get('modules')
      .subscribe((response: any) => {
        this.moduleList = response.data.modules;
        this.filteredModules = response.data.modules;
      });
  }
  // get module list

  // get module wise methods
  getMethods(module) {
    this.api.get('modules/'+ module.module_id+'/edit').subscribe((response: any) => {
      if (response.success) {
        this.methodList = response.data.module_methods;
        module.selectedMethods = (response.data.module_methods.map(x => x.method_name));

        module.methods = response.data.module_methods;
      }
    });
  }
  // get module wise methods

  /* for chip */
  addModuleMethod(event: MatChipInputEvent, selectedArray, inputValue): void {
    const input = event.input;
    const value = event.value;

    // Add our modules
    if ((value || '').trim()) {
      selectedArray.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    //console.log(selectedArray);
    inputValue.setValue(null);
  }

  removeModule(module: string): void {
    const index = this.modules.indexOf(module);

    if (index >= 0) {
      this.modules.splice(index, 1);
      this.module.splice(index, 1);
    }
  }

  removeMethod(method: string): void {
    const index = this.methods.indexOf(method);

    if (index >= 0) {
      this.methods.splice(index, 1);
      this.method.splice(index, 1);
    }
  }

  selectedModule(event: MatAutocompleteSelectedEvent): void {
    this.modules.push(event.option.viewValue);
    //this.module.push(event.option.value);
    this.module.push({ module_id: event.option.value, module_name: event.option.viewValue });

    this.moduleInput.nativeElement.value = '';
    this.moduleCtrl.setValue(null);
    this.getMethods(this.module[this.module.length - 1]); //
  }

  selectedMethod(event: MatAutocompleteSelectedEvent): void {
    this.methods.push(event.option.viewValue);
    this.methodInput.nativeElement.value = '';
    this.methodsCtrl.setValue(null);
  }

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

  // End Module Code

  onSubmit() {
    if (this.addType.valid) {

      this.permissiondata = this.addType.getRawValue();
      delete this.permissiondata.moduleCtrl;
      delete this.permissiondata.methodsCtrl;

      this.permissiondata.modules = this.module;
      this.api.post('permissions', this.permissiondata)
        .subscribe((response: any) => {
          if (response.success) {
            this.snackBar.open(response.message, '', { duration: 5000 });
            this.router.navigateByUrl('permissions');
          }
        },
          err => {
            this.snackBar.open(err.error.error, '', { duration: 5000 });
          });
    }
  }

}
