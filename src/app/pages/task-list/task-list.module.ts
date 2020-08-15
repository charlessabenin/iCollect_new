import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TaskListPageRoutingModule } from './task-list-routing.module';

import { TaskListPage } from './task-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TaskListPageRoutingModule
  ],
  declarations: [TaskListPage]
})
export class TaskListPageModule {}
