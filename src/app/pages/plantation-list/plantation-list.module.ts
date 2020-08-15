import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PlantationListPageRoutingModule } from './plantation-list-routing.module';

import { PlantationListPage } from './plantation-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PlantationListPageRoutingModule
  ],
  declarations: [PlantationListPage]
})
export class PlantationListPageModule {}
