import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NewPlantationPageRoutingModule } from './new-plantation-routing.module';

import { NewPlantationPage } from './new-plantation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    NewPlantationPageRoutingModule
  ],
  declarations: [NewPlantationPage]
})
export class NewPlantationPageModule {}
