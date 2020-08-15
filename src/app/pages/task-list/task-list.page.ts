import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit {

  tasks: any[] = [];
  id_project: any;

  constructor(
    public navCtrl: NavController,
    private db: DatabaseService,
    private loading: LoadingService,
    public translate: TranslateService,
    private storage: Storage
  ) {
    this.storage.remove('town_id');
    this.storage.remove('id_task');
  }

  ngOnInit() {
    this.storage.get('id_project').then((val) => {
      this.id_project = val;

      this.translate.get('LOADING_TASK').subscribe(value => { 
        this.loading.showLoader(value); 
      });
      
      this.db.lastLogedUser().then(usr => {
        if((usr.agent_type == 2)||(usr.agent_type == 4)) {
          this.db.loadCompanyProjectTasks(usr.id_primary_company, this.id_project).then(_ => {
            this.db.getProjectTasks().subscribe(data => {
              this.tasks = data;
              this.loading.hideLoader();
            });
          });

        } else {
          this.db.loadProjectTasks(usr.id_contact, this.id_project).then(_ => {
            this.db.getProjectTasks().subscribe(data => {
              this.tasks = data;
              this.loading.hideLoader();
            });
          });
        }
        
      });

    }).catch(() => {
      this.navCtrl.navigateBack(['/project-list']);
    });
  }

  itemTask(item) {
    this.db.lastLogedUser().then(usr => {
      this.storage.set('town_id', item.town_id);
      this.storage.set('id_task', item.id_task);
      this.navCtrl.navigateForward(['/contact-list']);
    });
  }

  taskDetails(id_task) {
    this.navCtrl.navigateForward(['/task-details/'+id_task]);
  }

}
