import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StorageMapPage } from './storage-map.page';

const routes: Routes = [
  {
    path: '',
    component: StorageMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorageMapPageRoutingModule {}
