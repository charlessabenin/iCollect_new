import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicImageLoader } from 'ionic-image-loader';
import { DownloadAvatarPageRoutingModule } from './download-avatar-routing.module';

import { DownloadAvatarPage } from './download-avatar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    IonicImageLoader,
    DownloadAvatarPageRoutingModule
  ],
  declarations: [DownloadAvatarPage]
})
export class DownloadAvatarPageModule {}
