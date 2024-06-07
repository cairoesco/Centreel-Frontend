import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  addChain: UntypedFormGroup;
  submitted: boolean = false;
  States:any=[{ name: 'India', sound: 'Woof!' },
  { name: 'Canada', sound: 'Meow!' },
  { name: 'USA', sound: 'Moo!' },
  { name: 'Australia', sound: 'Wa-pa-pa-pa-pa-pa-pow!' },]

  @ViewChild('1') element1: ElementRef;
  @ViewChild('2') element2: ElementRef;
  @ViewChild('3') element3: ElementRef;

  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = window.innerHeight * 81 / 100;
    this.innerHeight = this.innerHeight + ""
  }

  /* Scroll Events */
  public innerHeight: any;
  public type: string = 'component';
  public selected = false;
  public indexofTab = 0;
  public form: UntypedFormGroup;
  public addStore: UntypedFormGroup;
  imageSrc: any;
  heightOfY;

  constructor(private router: Router,
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    public refVar: ChangeDetectorRef,
    private api: ApiService) { }


  ngOnInit() {
    this.addChain = this.formBuilder.group({
      chain_name: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
      chain_desc: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
      chain_manager_id: [null, Validators.required],
    });
    this.innerHeight = window.innerHeight * 81 / 100;
    this.innerHeight = this.innerHeight + ""
  }

  /* Scroll Events */

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
    // if (check.y >= (this.element1.nativeElement.offsetHeight + this.element2.nativeElement.offsetHeight + this.element3.nativeElement.offsetHeight)) {
    //   this.indexofTab = 3;
    // }
    this.refVar.detectChanges();
  }

  public scrollToBottom(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToBottom();
    } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToBottom();
      this.indexofTab = 3;
    }
  }

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
      // case 3:
      //   this.heightOfY = this.element1.nativeElement.offsetHeight + this.element2.nativeElement.offsetHeight + this.element3.nativeElement.offsetHeight;
      //   break;
      default:
        break;
    }
    this.heightOfY = this.heightOfY + (event * 40);
    this.componentRef.directiveRef.scrollToY(this.heightOfY, 500);
  }

  /* Scroll Events */

}
