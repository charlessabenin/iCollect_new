import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditHouseholdPage } from './edit-household.page';

const routes: Routes = [
  {
    path: '',
    component: EditHouseholdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditHouseholdPageRoutingModule {}
