import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantationDetailsPage } from './plantation-details.page';

const routes: Routes = [
  {
    path: '',
    component: PlantationDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlantationDetailsPageRoutingModule {}
