import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPlantationPage } from './edit-plantation.page';

const routes: Routes = [
  {
    path: '',
    component: EditPlantationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPlantationPageRoutingModule {}
