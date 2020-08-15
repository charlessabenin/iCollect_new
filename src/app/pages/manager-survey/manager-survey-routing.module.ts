import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerSurveyPage } from './manager-survey.page';

const routes: Routes = [
  {
    path: '',
    component: ManagerSurveyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerSurveyPageRoutingModule {}
