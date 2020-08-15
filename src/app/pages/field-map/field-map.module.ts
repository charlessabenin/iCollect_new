import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FieldMapPageRoutingModule } from './field-map-routing.module';

import { FieldMapPage } from './field-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    FieldMapPageRoutingModule
  ],
  declarations: [FieldMapPage]
})
export class FieldMapPageModule {}
