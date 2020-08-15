import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaypointPage } from './waypoint.page';

const routes: Routes = [
  {
    path: '',
    component: WaypointPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaypointPageRoutingModule {}
