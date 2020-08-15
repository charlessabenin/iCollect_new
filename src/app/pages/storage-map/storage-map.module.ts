import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { StorageMapPageRoutingModule } from './storage-map-routing.module';

import { StorageMapPage } from './storage-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    StorageMapPageRoutingModule
  ],
  declarations: [StorageMapPage]
})
export class StorageMapPageModule {}
