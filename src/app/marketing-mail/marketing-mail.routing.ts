import { MarketingMailComponent } from './marketing-mail.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
{
  path: '',
  component: MarketingMailComponent,
  data:
  {
      state:'mail',
      mode:'main'
  },
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class marketingMailRoutingModule { }

