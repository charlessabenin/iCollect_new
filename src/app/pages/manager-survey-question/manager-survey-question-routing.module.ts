import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerSurveyQuestionPage } from './manager-survey-question.page';

const routes: Routes = [
  {
    path: '',
    component: ManagerSurveyQuestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerSurveyQuestionPageRoutingModule {}
