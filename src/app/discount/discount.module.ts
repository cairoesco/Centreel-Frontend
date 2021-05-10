import { NgModule } from '@angular/core';
import { DiscountComponent } from './discount.component';
import { AddDiscountComponent } from "./add-discount/add-discount.component";
// import { EditDiscountComponent } from "./edit-discount/edit-discount.component";
import { SharedModule } from '../shared/shared.module'
import { DiscountRoutingModule } from './discount.routing'
import { DiscountService } from './discount.service'
import { DiscountFilterDialogComponent } from './discount-filter-dialog/discount-filter-dialog.component';


@NgModule({
    imports: [SharedModule, DiscountRoutingModule],
    declarations: [DiscountComponent, AddDiscountComponent, DiscountFilterDialogComponent],
    providers: [DiscountService],
    entryComponents:[AddDiscountComponent, DiscountFilterDialogComponent]
})
export class DiscountModule { }
