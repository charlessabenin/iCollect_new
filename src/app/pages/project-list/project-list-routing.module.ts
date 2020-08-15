import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectListPage } from './project-list.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectListPageRoutingModule {}
