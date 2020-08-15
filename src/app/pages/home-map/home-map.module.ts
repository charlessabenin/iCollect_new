import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomeMapPageRoutingModule } from './home-map-routing.module';

import { HomeMapPage } from './home-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    HomeMapPageRoutingModule
  ],
  declarations: [HomeMapPage]
})
export class HomeMapPageModule {}
