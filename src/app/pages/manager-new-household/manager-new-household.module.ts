import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ManagerNewHouseholdPageRoutingModule } from './manager-new-household-routing.module';

import { ManagerNewHouseholdPage } from './manager-new-household.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ManagerNewHouseholdPageRoutingModule
  ],
  declarations: [ManagerNewHouseholdPage]
})
export class ManagerNewHouseholdPageModule {}
