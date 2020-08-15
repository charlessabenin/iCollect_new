import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HouseholdListPage } from './household-list.page';

const routes: Routes = [
  {
    path: '',
    component: HouseholdListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HouseholdListPageRoutingModule {}
