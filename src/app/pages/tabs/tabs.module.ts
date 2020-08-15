import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: 
    [ 
      { 
        path: 'home-map', 
        loadChildren: '../home-map/home-map.module#HomeMapPageModule' 
      },
      { 
        path: 'contact-details/:id', 
        loadChildren: '../contact-details/contact-details.module#ContactDetailsPageModule' 
      },
      { 
        path: 'plantation-list', 
        loadChildren: '../plantation-list/plantation-list.module#PlantationListPageModule' 
      },
      {
        path: 'household-list',
        loadChildren:'../household-list/household-list.module#HouseholdListPageModule'
      }
    ]
  },
  {
    path:'',
    redirectTo: 'tabs/contact-details/:id',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
