import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NewHouseholdPageRoutingModule } from './new-household-routing.module';

import { NewHouseholdPage } from './new-household.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    NewHouseholdPageRoutingModule
  ],
  declarations: [NewHouseholdPage]
})
export class NewHouseholdPageModule {}
