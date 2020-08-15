import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantationMapPage } from './plantation-map.page';

const routes: Routes = [
  {
    path: '',
    component: PlantationMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlantationMapPageRoutingModule {}
