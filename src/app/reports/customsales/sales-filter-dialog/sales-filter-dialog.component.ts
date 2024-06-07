import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../api.service';
import { UtilsServiceService } from '../../../shared/services/utils-service.service';

@Component({
  selector: 'app-sales-filter-dialog',
  templateUrl: './sales-filter-dialog.component.html',
  styleUrls: ['./sales-filter-dialog.component.scss']
})
export class SalesFilterDialogComponent implements OnInit {
  public form: UntypedFormGroup;
  tag_name: any;
  public columnsFormArray: any = [];
  warehouse = [];
  store = [];
  columns = [];
  product_types = [];
  employees = [];
  product_categories = [];
  reportDetails: [];
  columnData: [];
  report_id: number;
  form_obj: any = new Object();
  sales_template: any;
  submit: any;
  productSubCategory = [];
  group_by = []; 
  public producttypeFormArray: any = [];
  public productcatFormArray: any = [];

  constructor(private api: ApiService,
    private fb: UntypedFormBuilder,
    private utils: UtilsServiceService,
    public dialogRef: MatDialogRef<SalesFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (Boolean(data.report_id)) {
      this.report_id = data.report_id;
    }
  }

  /* get warehouse, employee, product categories, columns, product types, group by list for create report dialog */
  getAlldetail() {
    this.api.get('reports/sales/create')
      .subscribe((response: any) => {
        this.warehouse = response.data.warehouses;
        this.product_categories = response.data.product_categories;
        this.employees = response.data.employees;
        this.columns = response.data.columns;
        this.product_types = response.data.product_types;
        this.group_by = response.data.group_by; // for group by
        this.getReportDetails(this.report_id, response.data.columns);
      });
  }

  createReportForm() {
    this.form = this.fb.group({
      storage_id: ['', [Validators.required]],
      user_id: [],
      product_type: ['', [Validators.required]],
      product_categories_id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      fields: [''],
      type: ['sales'],
      group_by: ['']
    });
  }

  close() {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.getAlldetail();
    this.createReportForm();
  }

  onChange(name: string, isChecked: boolean) {
    if (isChecked) {
      this.columnsFormArray.push(name);
    } else {
      let index = this.columnsFormArray.indexOf(name);
      this.columnsFormArray.splice(index, 1);
    }
  }

  /* Bind multiple sub category when multiple category is selected */
  change(event) {
    if (event.source.selected) {
      this.producttypeFormArray.push(event.source.value);
    } else {
      let index = this.producttypeFormArray.indexOf(event.source.value);
      this.producttypeFormArray.splice(index, 1);
    }
    this.productSubCategory = _.filter(this.product_categories, (o) => { return this.producttypeFormArray.indexOf(o.product_type_id) > -1; });
  }
  /* Bind multiple sub category when multiple category selected */

  onSubmit() {
    this.submit = true;
    if (this.columnsFormArray.length == 0) {
      this.form.controls['fields'].setErrors({ 'invalid': false });
    }
    if (this.form.valid) {
      this.form_obj = this.form.getRawValue()
      /* if radio button is selected */
      if (Boolean(this.form.controls['group_by'].value)) {
        var group_by = { "column_name": "group_by", "field": this.form.controls['group_by'].value }
        this.columnsFormArray.push(group_by);
      }
      this.form_obj.storage_id = JSON.stringify(this.form_obj.storage_id);
      this.form_obj.user_id = JSON.stringify(this.form_obj.user_id);
      this.form_obj.product_categories_id = JSON.stringify(this.form_obj.product_categories_id);
      this.form_obj.product_type = JSON.stringify(this.form_obj.product_type);

      /* if radio button is selected */
      this.form_obj.fields = JSON.stringify(this.columnsFormArray);
      if (!(this.report_id)) {
        this.api.post('reports/sales', this.form_obj)
          .subscribe((response: any) => {
            if (response.success) {
              this.utils.showSnackBar(response.message);
              this.dialogRef.close(response.data);
            }
          });
      } else {
        this.form_obj._method = 'put';
        this.api.post('reports/sales/' + this.report_id, this.form_obj)
          .subscribe((response: any) => {
            if (response.success) {
              this.utils.showSnackBar(response.message);
              this.dialogRef.close(response.data);
            }
          });
      }

    }
  }

  /* details for single report */
  getReportDetails(report_id, data) {
    if (Boolean(report_id)) {
      this.api.get('reports/sales/' + report_id + '/edit')
        .subscribe((response: any) => {
          if (response.success) {
            this.reportDetails = response.data[0];
            this.form.patchValue(this.reportDetails)
            this.form.patchValue({ product_type: this.reportDetails['product_type_id'] });
            this.columnData = response.data[0]['sales_report_column'];

            /* set valeue for radio button */
            let self = this;
            _.find(this.columnData, function (j: any) {
              if (j.column_name == 'group_by') {
                var group_by_value = j.field;
                self.form.patchValue({ group_by: group_by_value });
              }
            })
            /* set value for radio button */

            let temp = [];
            for (let index = 0; index < data.length; index++) {
              if (Boolean(_.find(this.columnData, function (j: any) { return j.column_name == data[index].column_name }))) {
                data[index].checked = true;
              } else if (Boolean(_.find(this.columnData, function (j: any) { return j.column_name !== data[index].column_name }))) {
                data[index].checked = false;
              }
              temp.push(data[index])
            }

            /* update already selected checkbox fields */
            this.columns.forEach(element => {
              if (Boolean(_.find(this.columnData, function (j: any) {
                return j.column_name == element.column_name
              }))) {
                element.checked = true;
                this.onChange(element, true);
              } else {
                element.checked = false;
              }
            });
            /* update already selected checkbox fields */

            // Bind multiple categories, storage id and user id in select box
            let storage_id = [],
              user_id = [],
              product_type = [],
              product_categories_id = [];
            var multipleData = this.reportDetails['sales_report_params'];
            multipleData.map((x) => {
              if (x.field.indexOf('storage_locations.storage_id') > -1) storage_id.push(x.value);
              else if (x.field.indexOf('user_details.user_id') > -1) user_id.push(x.value);
              else if (x.field.indexOf('product_categories.product_type_id') > -1) product_type.push(x.value);
              else if (x.field.indexOf('products.product_category') > -1) product_categories_id.push(x.value);
            });
            this.form.patchValue({ storage_id: storage_id });
            this.form.patchValue({ user_id: user_id });
            this.form.patchValue({ product_type: product_type });
            this.form.patchValue({ product_categories_id: product_categories_id });
          }
        });
    }
  }

}
