import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { EditHouseholdPageRoutingModule } from './edit-household-routing.module';

import { EditHouseholdPage } from './edit-household.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    EditHouseholdPageRoutingModule
  ],
  declarations: [EditHouseholdPage]
})
export class EditHouseholdPageModule {}
