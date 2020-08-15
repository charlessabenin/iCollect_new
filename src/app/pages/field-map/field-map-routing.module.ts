import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FieldMapPage } from './field-map.page';

const routes: Routes = [
  {
    path: '',
    component: FieldMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FieldMapPageRoutingModule {}
