import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FieldMappingPageRoutingModule } from './field-mapping-routing.module';

import { FieldMappingPage } from './field-mapping.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    FieldMappingPageRoutingModule
  ],
  declarations: [FieldMappingPage]
})
export class FieldMappingPageModule {}
