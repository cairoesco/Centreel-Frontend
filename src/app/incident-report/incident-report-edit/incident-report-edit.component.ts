import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../api.service';
import * as _moment from 'moment';


@Component({
  selector: 'app-incident-report-edit',
  templateUrl: './incident-report-edit.component.html',
  styleUrls: ['./incident-report-edit.component.scss']
})
export class IncidentReportEditComponent implements OnInit {

  public form: UntypedFormGroup;
  innerHeight: any;

  public type: string = 'component';
  public indexofTab = 0;
  heightOfY;

  constructor(private route: ActivatedRoute,
    private api: ApiService,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public refVar: ChangeDetectorRef
  ) { }

  /* Scroll Events */

  @ViewChild('1') element1: ElementRef;
  @ViewChild('2') element2: ElementRef;
  @ViewChild('3') element3: ElementRef;
  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = window.innerHeight - 192;
    this.innerHeight = this.innerHeight + ""
  }
  /* Scroll Events */

  /* scroll */
  onScrollEvent(evt) {
    let check = this.componentRef.directiveRef.geometry();
    if (check.y < this.element1.nativeElement.offsetHeight) {
      this.indexofTab = 0;
    }
    if (check.y >= this.element1.nativeElement.offsetHeight) {
      this.indexofTab = 1;
    }
    if (check.y >= (this.element1.nativeElement.offsetHeight + this.element2.nativeElement.offsetHeight)) {
      this.indexofTab = 2;
    }
    this.refVar.detectChanges();
  }

  public scrollToBottom(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToBottom();
    } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToBottom();
      this.indexofTab = 3;
    }
  }
  /* scroll */

  /* Scroll on tab clicking */
  onClick(event) {

    switch (event) {
      case 0:
        this.heightOfY = 0;
        break;
      case 1:
        this.heightOfY = this.element1.nativeElement.offsetHeight;
        break;
      case 2:
        this.heightOfY = this.element1.nativeElement.offsetHeight + this.element2.nativeElement.offsetHeight;
        break;


      default:
        break;
    }
    this.heightOfY = this.heightOfY + (event * 40);
    this.componentRef.directiveRef.scrollToY(this.heightOfY, 500);
  }

  /* Scroll on tab clicking */

  reportData: [];
  empData: [];
  witnessData: [];

  report_id: any;

  /* form */
  addIncidentReportForm() {
    this.form = this.fb.group({
      parties_involved: [''],
      event_date: ['', Validators.compose([Validators.required, CustomValidators.date])],
      actions_taken: [''],
      sales_record: [''],
      user_fname: [''],
      name: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
      last_name: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
      middle_name: [''],
      nick_name: [''],
      dob: ['', Validators.compose([Validators.required, CustomValidators.date])],
      gender: [''],
      address: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      zipcode: ['', Validators.compose([Validators.required])],
      province: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      contact_no: ['', Validators.compose([Validators.required, CustomValidators.phone('en-US')])],
      units: this.fb.array([
        this.getUnit()
      ]) //

    });
  }
  /* form */

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.report_id = +params['id'];
    });
    this.getReportId();
    this.innerHeight = window.innerHeight - 192;
    this.innerHeight = this.innerHeight + ""
    this.addIncidentReportForm();
    this.form.disable()

  }
  ngDoCheck() {
    this.innerHeight = window.innerHeight - 192;
  }

  private getUnit() {
    const numberPatern = '^[0-9.,]+$';
    return this.fb.group({
      unitName: ['', Validators.required],
      qty: [1, [Validators.required, Validators.pattern(numberPatern)]],
      unitPrice: ['', [Validators.required,
      Validators.pattern(numberPatern)]],
      unitTotalPrice: [{ value: '', disabled: true }]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.form = this.form.getRawValue();
    }
  }

  /* get detail of incident report by id */
  getReportId() {
    this.api.get('incidentReport/' + this.report_id)
      .subscribe((response: any) => {
        if (response.success) {
          this.reportData = response.data;
          this.empData = response.data.employee;
          this.witnessData = response.data.witness;
          this.form.patchValue(response.data)
          response.data.event_date = _moment(response.data.event_date, 'YYYY-MM-DD').format('YYYY-MM-DD');
          this.form.controls['event_date'].patchValue(response.data.event_date);

        }
      });
  }

}
