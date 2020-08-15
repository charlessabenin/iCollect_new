import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectListPageRoutingModule } from './project-list-routing.module';

import { ProjectListPage } from './project-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ProjectListPageRoutingModule
  ],
  declarations: [ProjectListPage]
})
export class ProjectListPageModule {}
