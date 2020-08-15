import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PlantationDetailsPageRoutingModule } from './plantation-details-routing.module';

import { PlantationDetailsPage } from './plantation-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PlantationDetailsPageRoutingModule
  ],
  declarations: [PlantationDetailsPage]
})
export class PlantationDetailsPageModule {}
