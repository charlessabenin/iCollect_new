import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HouseholdDetailsPage } from './household-details.page';

const routes: Routes = [
  {
    path: '',
    component: HouseholdDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HouseholdDetailsPageRoutingModule {}
