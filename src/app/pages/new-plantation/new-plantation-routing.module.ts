import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewPlantationPage } from './new-plantation.page';

const routes: Routes = [
  {
    path: '',
    component: NewPlantationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewPlantationPageRoutingModule {}
