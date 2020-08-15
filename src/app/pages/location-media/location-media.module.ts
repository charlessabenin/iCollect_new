import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LocationMediaPageRoutingModule } from './location-media-routing.module';

import { LocationMediaPage } from './location-media.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LocationMediaPageRoutingModule
  ],
  declarations: [LocationMediaPage]
})
export class LocationMediaPageModule {}
