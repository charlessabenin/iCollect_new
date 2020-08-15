import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerHouseholdListPage } from './manager-household-list.page';

const routes: Routes = [
  {
    path: '',
    component: ManagerHouseholdListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerHouseholdListPageRoutingModule {}
