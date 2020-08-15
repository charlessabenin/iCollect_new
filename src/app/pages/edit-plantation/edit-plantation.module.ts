import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { EditPlantationPageRoutingModule } from './edit-plantation-routing.module';

import { EditPlantationPage } from './edit-plantation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    EditPlantationPageRoutingModule
  ],
  declarations: [EditPlantationPage]
})
export class EditPlantationPageModule {}
