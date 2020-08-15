import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ManagerEditHouseholdPageRoutingModule } from './manager-edit-household-routing.module';

import { ManagerEditHouseholdPage } from './manager-edit-household.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ManagerEditHouseholdPageRoutingModule
  ],
  declarations: [ManagerEditHouseholdPage]
})
export class ManagerEditHouseholdPageModule {}
