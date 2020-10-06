import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { QuillModule } from 'ngx-quill';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20
};
import { MccColorPickerModule } from 'material-community-components';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatWidthDirective } from './directive/mat-width.directive';
import { ContentLoaderModule } from '@netbasal/ngx-content-loader';

import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { ScrollSpyDirective } from './directive/scroll-spy.directive';
import { NgxCurrencyModule } from "ngx-currency";
import { CategoryFilterPipe } from './pipe/category-filter.pipe';
import { TwoDigitDecimaNumberDirective } from './directive/two-digit-decima-number.directive';
import { RemoveSpaceDirective } from './directive/remove-space.directive';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    // **** design related *******  
    QuillModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatListModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatSliderModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSortModule,
    MatStepperModule,
    MatTooltipModule,
    MatTreeModule,
    MccColorPickerModule.forRoot({
      empty_color: 'transparent'
    }),
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    CdkTableModule,
    ContentLoaderModule,
    MatProgressButtonsModule,
    NgxCurrencyModule
  ],
  declarations: [MatWidthDirective, ScrollSpyDirective, CategoryFilterPipe, TwoDigitDecimaNumberDirective, RemoveSpaceDirective],
  exports: [
    CommonModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatListModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatSliderModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSortModule,
    MatStepperModule,
    MatTooltipModule,
    MatTreeModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    MccColorPickerModule,
    NgxDatatableModule,
    QuillModule,
    FlexLayoutModule,
    MatWidthDirective,
    ContentLoaderModule,
    MatProgressButtonsModule,
    ScrollSpyDirective,
    NgxCurrencyModule,
    CategoryFilterPipe,
    TwoDigitDecimaNumberDirective,
    RemoveSpaceDirective
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    MatDatepickerModule
  ]
})
export class SharedModule { }
