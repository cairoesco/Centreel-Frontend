import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomerComponent } from "./customer.component";
import { AddCustomerComponent } from "./add-customer/add-customer.component";
import { EditCustomerComponent } from "./edit-customer/edit-customer.component";
import { CustomerQueueListComponent } from "./customer-queue-list/queue-list.component";
import { CanDeactivateGuard } from "../shared/guard/can-deactivate.guard";

const routes: Routes = [
	{ path: "", component: CustomerComponent },
	// { path: '', component: CustomerComponent, data: { title: 'Customer' }},
	{
		path: 'customer',
		component: CustomerComponent,
		data: { title: 'Customer', breadcrumb: { name: 'customer', url: "customer" } }
},
	{
		path: "create",
		component: AddCustomerComponent,
		//  canActivate: [AuthGuardService],
		// canDeactivate: [CanDeactivateGuard],
		data: { title: "Create Customer", breadcrumb: { name: "Create Customer", url: "create" } },
	},
	{
		path: ":id/view",
		component: EditCustomerComponent,
		// canActivate: [AuthGuardService],
		data: { title: "View Customer", breadcrumb: { name: "View Customer", url: ":id/view" } },
	},
	{
		path: "queue-list",
		component: CustomerQueueListComponent,
		// canDeactivate: [CanDeactivateGuard],
		data: { title: "Queue List", breadcrumb: { name: "Queue List", url: "queue-list" } },
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CustomerRoutingModule {}
