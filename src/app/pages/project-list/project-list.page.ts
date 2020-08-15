import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { NavController, Platform } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss'],
})
export class ProjectListPage implements OnInit {

  projects: any[] = [];
  project_data: any = false;

  constructor(
    public navCtrl: NavController,
    private db: DatabaseService,
    private loading: LoadingService,
    private platform: Platform,
    public translate: TranslateService,
    private storage: Storage
  ) {

  }

  ngOnInit() { 
    this.translate.get('LOADING_PROJECT').subscribe(value => { 
      this.loading.showLoader(value);  
    });
    
    this.platform.ready().then(() => {

      this.db.lastLogedUser().then(usr => { 
        if(usr.agent_type == 4){
          this.project_data = false;
          
          if(usr.id_supchain_company == 331) {
            this.db.loadCooperativeProjects(usr.id_primary_company).then(_ => {  
              this.db.getProjects().subscribe(data => {  
                this.projects = data; 
                this.loading.hideLoader();
              })
            });
          } else {
            this.db.loadCompanyProjects(usr.id_primary_company).then(_ => {  
              this.db.getProjects().subscribe(data => {  
                this.projects = data; 
                this.loading.hideLoader();
              })
            });
          }
          
        } else
        if (usr.agent_type == 3) {
          this.project_data = true;
          this.loading.hideLoader();

        } else {
          this.project_data = false;
          this.db.loadProjects(usr.id_contact).then(_ => {  
            this.db.getProjects().subscribe(data => {  
              this.projects = data; 
              this.loading.hideLoader();
            })
          });
        }
      });

    });
  }

  contactList() {
    this.navCtrl.navigateRoot(['/menu/contacts']);
  }

  projectTask(item){ 
    this.storage.set('id_project', item.id_project);
    this.navCtrl.navigateForward(['/task-list']);
  }

  projectDetails(id_project) {
    this.navCtrl.navigateForward(['/project-details/'+id_project]);
  }

}
