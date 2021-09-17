import { Component, NgZone, OnInit, OnDestroy, ViewChild, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { BreakpointObserver } from '@angular/cdk/layout';
const SMALL_WIDTH_BREAKPOINT = 960;

import { UserIdleService } from 'angular-user-idle';
import { UtilsServiceService } from 'src/app/shared/services/utils-service.service';
import { LockScreenService } from 'src/app/dialog/lock-screen/lock-screen.service';

@Component({
  selector: 'app-layout',
  template: `
  <app-layout-inner
    [isScreenSmall]="isScreenSmall | async"
  ></app-layout-inner>
  `,
encapsulation: ViewEncapsulation.None
})

export class AdminLayoutComponent {
  isScreenSmall: Observable<boolean>;
  constructor(public breakpoints: BreakpointObserver) {
    this.isScreenSmall = breakpoints
      .observe(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`)
      .pipe(map(breakpoint => breakpoint.matches));
  }
}

@Component({
  selector: "app-layout-inner",
  templateUrl: "./admin-layout.component.html"
})
export class LayoutComponent implements OnInit, OnDestroy {
  @Input() isScreenSmall: boolean;
  private _router: Subscription;
  url: string;
  sidePanelOpened;
  options = {
    collapsed: false,
    boxed: false,
    dark: false,
    dir: 'ltr'
  };

  @ViewChild('sidemenu', {static: true}) sidemenu;
  @ViewChild(PerfectScrollbarDirective, {static: true}) directiveScroll: PerfectScrollbarDirective;
  public config: PerfectScrollbarConfigInterface = {};

  //Check user lock status
  @HostListener('mousemove') mousemove() {
    if (Boolean(this.utils.getSessionData('isLock'))) {
      //this.utils.closeLockDialog();
      //this.router.navigate(['/session/signin']);
      this.lockService.openLockDialog();
    }
  }
  constructor(
    private router: Router,
    private userIdle: UserIdleService,
    public utils: UtilsServiceService,
    public lockService: LockScreenService,
    zone: NgZone) {
    // this.mediaMatcher.addListener(mql => zone.run(() => {
    //   this.mediaMatcher = mql;
    // }));
  }

  ngOnInit(): void {
    this.url = this.router.url;
    this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      document.querySelector('.app-inner > .mat-drawer-content > div').scrollTop = 0;
      this.url = event.url;
      this.runOnRouteChange();
    });

    //Start watching for user inactivity.
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => {
      //let redirect_url = encodeURIComponent(this.sharedservice.getPreviousUrl());
      if (this.router.url != '/session/signin' && !Boolean(this.utils.getSessionData('isLock'))) {
        this.utils.setSessionData('isLock', "true");
        this.lockService.openLockDialog();
      } else {
        this.userIdle.stopWatching();
      }
    });

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => console.log('Time is up!'));

  }

  ngOnDestroy(): void {
    this._router.unsubscribe();
  }

  runOnRouteChange(): void {
    if (this.isOver()) {
      this.sidemenu.close();
    }

    this.updatePS();
  }

  receiveOptions($event): void {
    this.options = $event;
  }

  isOver(): boolean {
    /* find dynamic id from po view and draft view url */
    let urlString = (this.url).split('/');
    let id = urlString[3];
    /* find dynamic id from po view and draft view url */
    if (this.url === '/apps/messages' ||
      this.url === '/apps/calendar' ||
      this.url === '/apps/media' ||
      this.url === '/maps/leaflet' ||
      this.url === '/purchaseorder/po-list/create' ||
      this.url === '/purchaseorder/po-list/'+id+'/view' ||
      this.url === '/purchaseorder/po-draft/'+id+'/view' ||
      this.url === '/taskboard') {
      return true;
    } else {
      return this.isScreenSmall;
    }
  }

  menuMouseOverOut(mode): void {
    if (this.isScreenSmall && this.options.collapsed) {
      this.sidemenu.mode = mode;
    }
  }

  updatePS(): void {
    if (!this.isScreenSmall) {
      setTimeout(() => {
        this.directiveScroll.update();
      }, 350);
    }
  }
}
