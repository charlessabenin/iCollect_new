import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PlantationMapPageRoutingModule } from './plantation-map-routing.module';

import { PlantationMapPage } from './plantation-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PlantationMapPageRoutingModule
  ],
  declarations: [PlantationMapPage]
})
export class PlantationMapPageModule {}
