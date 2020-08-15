import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      { path: 'project-list', loadChildren: '../project-list/project-list.module#ProjectListPageModule' },
      { path: 'contacts', loadChildren: '../contacts/contacts.module#ContactsPageModule' },
      { path: 'settings', loadChildren: '../settings/settings.module#SettingsPageModule' },
      { path: 'field-mapping', loadChildren: '../field-mapping/field-mapping.module#FieldMappingPageModule' },
      { path: 'location', loadChildren: '../location/location.module#LocationPageModule' }
    ]
  },
  { path: 'language', loadChildren: '../language/language.module#LanguagePageModule' },
  { path: 'login', loadChildren: '../login/login.module#LoginPageModule' },
  { path: 'project-details/:project_id', loadChildren: '../project-details/project-details.module#ProjectDetailsPageModule'},
  { path: 'task-list', loadChildren: '../task-list/task-list.module#TaskListPageModule' },
  { path: 'task-details/:task_id', loadChildren: '../task-details/task-details.module#TaskDetailsPageModule' },
  { path: 'contact-list', loadChildren: '../contact-list/contact-list.module#ContactListPageModule' },
  { path: 'tabs', loadChildren: '../tabs/tabs.module#TabsPageModule' },
  { path: 'plantation-details/:plantation_id', loadChildren: '../plantation-details/plantation-details.module#PlantationDetailsPageModule' },
  { path: 'plantation-map', loadChildren: '../plantation-map/plantation-map.module#PlantationMapPageModule' },
  { path: 'new-location', loadChildren: '../new-location/new-location.module#NewLocationPageModule' },
  { path: 'location-map', loadChildren: '../location-map/location-map.module#LocationMapPageModule' },
  { path: 'field-map', loadChildren: '../field-map/field-map.module#FieldMapPageModule' },
  { path: 'media', loadChildren: '../media/media.module#MediaPageModule' },
  { path: 'sync', loadChildren: '../sync/sync.module#SyncPageModule' },
  { path: 'survey', loadChildren: '../survey/survey.module#SurveyPageModule' },
  { path: 'location-media', loadChildren: '../location-media/location-media.module#LocationMediaPageModule' },
  { path: 'edit-location/:id_location', loadChildren: '../edit-location/edit-location.module#EditLocationPageModule' },
  { path: 'waypoint', loadChildren: '../waypoint/waypoint.module#WaypointPageModule' },
  { path: 'edit-plantation/:plantation_id', loadChildren: '../edit-plantation/edit-plantation.module#EditPlantationPageModule' },
  { path: 'edit-contact/:id_contact', loadChildren: '../edit-contact/edit-contact.module#EditContactPageModule' },
  { path: 'new-media', loadChildren: '../new-media/new-media.module#NewMediaPageModule'},
  { path: 'survey-question/:template_id', loadChildren: '../survey-question/survey-question.module#SurveyQuestionPageModule' },
  { path: 'edit-household/:id', loadChildren: '../edit-household/edit-household.module#EditHouseholdPageModule' },
  { path: 'new-household', loadChildren: '../new-household/new-household.module#NewHouseholdPageModule' },
  { path: 'new-plantation', loadChildren: '../new-plantation/new-plantation.module#NewPlantationPageModule' },
  { path: 'household-details/:id', loadChildren: '../household-details/household-details.module#HouseholdDetailsPageModule' },
  { path: 'download-avatar', loadChildren: '../download-avatar/download-avatar.module#DownloadAvatarPageModule' },
  { path: 'new-contact', loadChildren: '../new-contact/new-contact.module#NewContactPageModule' },
  { path: 'storage-map/:back', loadChildren: '../storage-map/storage-map.module#StorageMapPageModule' },
  { path: 'signature/:type', loadChildren: '../signature/signature.module#SignaturePageModule' },
  { path: 'manager-household-list/:id_manager', loadChildren: '../manager-household-list/manager-household-list.module#ManagerHouseholdListPageModule' },
  { path: 'manager-household/:id', loadChildren: '../manager-household/manager-household.module#ManagerHouseholdPageModule' },
  { path: 'manager-new-household/:contact_id', loadChildren: '../manager-new-household/manager-new-household.module#ManagerNewHouseholdPageModule' },
  { path: 'manager-edit-household/:id', loadChildren: '../manager-edit-household/manager-edit-household.module#ManagerEditHouseholdPageModule' },
  { path: 'manager-survey', loadChildren: '../manager-survey/manager-survey.module#ManagerSurveyPageModule' },
  { path: 'manager-survey-question/:template_id', loadChildren: '../manager-survey-question/manager-survey-question.module#ManagerSurveyQuestionPageModule' },
  { path: 'download-list/:type', loadChildren: '../download-list/download-list.module#DownloadListPageModule' },
  { path: '', redirectTo:'language', pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
