import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantationListPage } from './plantation-list.page';

const routes: Routes = [
  {
    path: '',
    component: PlantationListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlantationListPageRoutingModule {}
