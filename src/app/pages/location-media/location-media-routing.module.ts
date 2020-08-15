import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationMediaPage } from './location-media.page';

const routes: Routes = [
  {
    path: '',
    component: LocationMediaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationMediaPageRoutingModule {}
