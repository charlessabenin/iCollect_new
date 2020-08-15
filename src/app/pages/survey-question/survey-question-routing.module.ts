import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveyQuestionPage } from './survey-question.page';

const routes: Routes = [
  {
    path: '',
    component: SurveyQuestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyQuestionPageRoutingModule {}
