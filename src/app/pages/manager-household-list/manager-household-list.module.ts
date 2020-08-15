import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ManagerHouseholdListPageRoutingModule } from './manager-household-list-routing.module';

import { ManagerHouseholdListPage } from './manager-household-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ManagerHouseholdListPageRoutingModule
  ],
  declarations: [ManagerHouseholdListPage]
})
export class ManagerHouseholdListPageModule {}
