import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ContactListPageRoutingModule } from './contact-list-routing.module';

import { ContactListPage } from './contact-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ContactListPageRoutingModule
  ],
  declarations: [ContactListPage]
})
export class ContactListPageModule {}
