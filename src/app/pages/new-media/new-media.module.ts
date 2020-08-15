import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NewMediaPageRoutingModule } from './new-media-routing.module';

import { NewMediaPage } from './new-media.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    NewMediaPageRoutingModule
  ],
  declarations: [NewMediaPage]
})
export class NewMediaPageModule {}
