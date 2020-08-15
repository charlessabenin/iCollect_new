import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerHouseholdPage } from './manager-household.page';

const routes: Routes = [
  {
    path: '',
    component: ManagerHouseholdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerHouseholdPageRoutingModule {}
