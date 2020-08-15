import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewHouseholdPage } from './new-household.page';

const routes: Routes = [
  {
    path: '',
    component: NewHouseholdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewHouseholdPageRoutingModule {}
