import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ManagerHouseholdPageRoutingModule } from './manager-household-routing.module';

import { ManagerHouseholdPage } from './manager-household.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ManagerHouseholdPageRoutingModule
  ],
  declarations: [ManagerHouseholdPage]
})
export class ManagerHouseholdPageModule {}
