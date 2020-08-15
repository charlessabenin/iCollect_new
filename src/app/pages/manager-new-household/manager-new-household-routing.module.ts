import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerNewHouseholdPage } from './manager-new-household.page';

const routes: Routes = [
  {
    path: '',
    component: ManagerNewHouseholdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerNewHouseholdPageRoutingModule {}
