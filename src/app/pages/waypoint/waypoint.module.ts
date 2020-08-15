import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { WaypointPageRoutingModule } from './waypoint-routing.module';

import { WaypointPage } from './waypoint.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    WaypointPageRoutingModule
  ],
  declarations: [WaypointPage]
})
export class WaypointPageModule {}
