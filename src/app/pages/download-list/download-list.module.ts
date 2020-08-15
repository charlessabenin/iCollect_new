import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DownloadListPageRoutingModule } from './download-list-routing.module';

import { DownloadListPage } from './download-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    DownloadListPageRoutingModule
  ],
  declarations: [DownloadListPage]
})
export class DownloadListPageModule {}
