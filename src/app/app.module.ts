import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { BidiModule } from '@angular/cdk/bidi';
import { UserIdleModule } from 'angular-user-idle';
import { MenuComponent,HeaderComponent,SidebarComponent,OptionsComponent,AdminLayoutComponent,BreadcrumbComponent,AuthLayoutComponent,
  AccordionAnchorDirective,
  AccordionLinkDirective,
  AccordionDirective,
  LayoutComponent
} from './core';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { AuthGuardService } from './session/authguard.service';
import { AuthService } from './session/auth.service';
import { AuthInterceptor } from './shared/interceptor/auth-interceptor';
import { MenuService } from './core/menu/menu.service';
import { ApiService } from './api.service';
import { SharedService } from './shared/shared.service'
import { SharedModule } from './shared/shared.module';
import { TagComponent } from "./dialog/tag/tag.component";
import { DeleteConfirmComponent } from './dialog/delete-confirm/delete-confirm.component';
import { LockScreenComponent } from './dialog/lock-screen/lock-screen.component';
import { PrintBarcodeComponent } from '../app/products/products/print-barcode/print-barcode.component';

import { SignaturePadModule } from 'angular2-signaturepad';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SidebarComponent,
        OptionsComponent,
        MenuComponent,
        AdminLayoutComponent,
        AuthLayoutComponent,
        AccordionAnchorDirective,
        AccordionLinkDirective,
        AccordionDirective,
        BreadcrumbComponent,
        TagComponent,
        DeleteConfirmComponent,
        LockScreenComponent,
        PrintBarcodeComponent,
        LayoutComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(AppRoutes),
        UserIdleModule.forRoot({ idle: 4000, timeout: 4000, ping: 120 }),
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        LoadingBarRouterModule,
        BidiModule,
        SharedModule,
        SignaturePadModule
    ],
    providers: [
        AuthGuardService,
        AuthService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        MenuService,
        ApiService,
        SharedService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
