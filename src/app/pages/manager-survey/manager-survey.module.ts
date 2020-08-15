import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ManagerSurveyPageRoutingModule } from './manager-survey-routing.module';

import { ManagerSurveyPage } from './manager-survey.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ManagerSurveyPageRoutingModule
  ],
  declarations: [ManagerSurveyPage]
})
export class ManagerSurveyPageModule {}
