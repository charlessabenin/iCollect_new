import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FieldMappingPage } from './field-mapping.page';

const routes: Routes = [
  {
    path: '',
    component: FieldMappingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FieldMappingPageRoutingModule {}
