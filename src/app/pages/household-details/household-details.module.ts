import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HouseholdDetailsPageRoutingModule } from './household-details-routing.module';

import { HouseholdDetailsPage } from './household-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    HouseholdDetailsPageRoutingModule
  ],
  declarations: [HouseholdDetailsPage]
})
export class HouseholdDetailsPageModule {}
