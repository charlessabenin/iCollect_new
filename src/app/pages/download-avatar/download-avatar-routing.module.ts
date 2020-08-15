import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadAvatarPage } from './download-avatar.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadAvatarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadAvatarPageRoutingModule {}
