import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-field-mapping',
  templateUrl: './field-mapping.page.html',
  styleUrls: ['./field-mapping.page.scss'],
})
export class FieldMappingPage implements OnInit {

  tasks: any[] = [];
  field_data: any = false;

  constructor(
    private db: DatabaseService,
    private loading: LoadingService,
    public translate: TranslateService,
    public navCtrl: NavController,
    private storage: Storage
  ) { 
    this.storage.remove('town_id');
    this.storage.clear();
  }

  ngOnInit() {
    this.translate.get('LOADING_TASK').subscribe(value => { 
      this.loading.showLoader(value);
    });

    this.db.lastLogedUser().then(usr => { 
      if((usr.agent_type == 2) || (usr.agent_type == 4)) {
        this.field_data = false;

        if(usr.id_supchain_company == 331) {
          this.db.loadCooperativeTasks(usr.id_primary_company).then(_ => {
            this.db.getProjectTasks().subscribe(data => {
              this.tasks = data;
              this.loading.hideLoader();
            });
          });

        } else {
          this.db.loadCompanyTasks(usr.id_primary_company).then(_ => {
            this.db.getProjectTasks().subscribe(data => {
              this.tasks = data;
              this.loading.hideLoader();
            });
          });
        }
        
      } else
      if (usr.agent_type == 3) {
        this.field_data = true;
        this.loading.hideLoader();

      } else {
        this.field_data = false;
        this.db.loadTasks(usr.id_contact).then(_ => {
          this.db.getProjectTasks().subscribe(data => {
            this.tasks = data;
            this.loading.hideLoader();
          });
        });
      }
    });
  }

  itemTask(item) {
    this.storage.set('town_id', item.town_id);
    this.navCtrl.navigateForward(['/field-map']);
  }

  contactList() {
    this.navCtrl.navigateRoot(['/menu/contacts']);
  }

}
