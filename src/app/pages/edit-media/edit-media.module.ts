import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { EditMediaPageRoutingModule } from './edit-media-routing.module';

import { EditMediaPage } from './edit-media.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    EditMediaPageRoutingModule
  ],
  declarations: [EditMediaPage]
})
export class EditMediaPageModule {}
