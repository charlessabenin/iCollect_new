import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MediaPageRoutingModule } from './media-routing.module';

import { MediaPage } from './media.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    MediaPageRoutingModule
  ],
  declarations: [MediaPage]
})
export class MediaPageModule {}
