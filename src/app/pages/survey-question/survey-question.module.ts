import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SurveyQuestionPageRoutingModule } from './survey-question-routing.module';

import { SurveyQuestionPage } from './survey-question.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SurveyQuestionPageRoutingModule
  ],
  declarations: [SurveyQuestionPage]
})
export class SurveyQuestionPageModule {}
