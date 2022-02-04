import { NgModule } from '@angular/core';
import {SharedModule} from '../shared/shared.module'
import {ChainRoutingModule} from './chain.routing'
import { ChainComponent } from './chain.component';
import { CreateComponent } from './create/create.component';
import {ChainService} from './chain.service'

@NgModule({
  imports: [ChainRoutingModule,SharedModule],
  declarations: [ ChainComponent, CreateComponent ],
  providers:[ChainService]
})

export class ChainModule {}
