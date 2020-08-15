import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HouseholdListPageRoutingModule } from './household-list-routing.module';

import { HouseholdListPage } from './household-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    HouseholdListPageRoutingModule
  ],
  declarations: [HouseholdListPage]
})
export class HouseholdListPageModule {}
