import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ManagerSurveyQuestionPageRoutingModule } from './manager-survey-question-routing.module';

import { ManagerSurveyQuestionPage } from './manager-survey-question.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ManagerSurveyQuestionPageRoutingModule
  ],
  declarations: [ManagerSurveyQuestionPage]
})
export class ManagerSurveyQuestionPageModule {}
