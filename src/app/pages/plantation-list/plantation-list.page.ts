import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { NavController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-plantation-list',
  templateUrl: './plantation-list.page.html',
  styleUrls: ['./plantation-list.page.scss'],
})
export class PlantationListPage implements OnInit {

  plantations: any[] = [];
  plantation_data: any;

  constructor(
    public navCtrl: NavController,
    private db: DatabaseService,
    public loading: LoadingService,
    public translate: TranslateService,
    private alertCtrl: AlertController,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.storage.remove('id_plantation'); 
    this.storage.remove('id_manager');
    this.storage.remove('dataType');

    this.storage.get('id_contact').then((val) => { 
      this.translate.get('LOADING_PLANTATIONS').subscribe(value => { 
        this.loading.showLoader(value);
      });
      
      this.plantation_data = "";
      this.db.lastLogedUser().then(usr => {
        this.db.loadPlantations(usr.id_contact, usr.agent_type, val).then(_ =>{
          this.db.getPlantations().subscribe(data => {  
            this.plantation_data = data;
            this.loadData();
            this.loading.hideLoader();
          });
        });
      });
    });
  }

  loadData() { 
    this.plantations = [];
    this.plantation_data.forEach(plantation => {
      var status_data;
      if(plantation.dc_completed == 1){
        status_data = true;
      } else { status_data = false; }

      this.plantations.push({
        id_plantation: plantation.id_plantation,
        name_town: plantation.name_town,
        code_plantation: plantation.code_plantation,
        area_round: plantation.area_round,
        area_acres_round: plantation.area_acres_round,
        area: plantation.area,
        area_acres: plantation.area_acres,
        status_data: status_data,
        culture: plantation.culture,
        id_manager: plantation.id_manager,
        owner_manager: plantation.owner_manager
      });
    });
  }

  ionRefresh(event) {
    console.log('Pull Event Triggered!');
    setTimeout(() => {
      console.log('Async operation has ended');
      this.loadData();
      //complete()  signify that the refreshing has completed and to close the refresher
      event.target.complete();
    }, 2000);
  }

  ionPull(event) {
    //Emitted while the user is pulling down the content and exposing the refresher.
    console.log('ionPull Event Triggered!' + event);
  }

  ionStart(event) {
    //Emitted when the user begins to start pulling down.
    console.log('ionStart Event Triggered!' + event);
  } 

  itemPlantation(item) {
    this.storage.set('id_plantation', item.id_plantation);
    this.navCtrl.navigateForward(['/plantation-map']);
  }

  plantationDetails(item) {
    this.storage.set('id_plantation', item.id_plantation);
    this.navCtrl.navigateForward(['/plantation-details', item.id_plantation]);
  }

  itemPlantationMedia(item) {
    this.storage.set('id_plantation', item.id_plantation);
    this.storage.set('dataType', 'plantation');
    this.navCtrl.navigateForward(['/media']);
  }

  newPlantation() {
    this.navCtrl.navigateForward(['/new-plantation']);
  }

  managerHousehold(id_manager) { 
    if(id_manager == null) { 
      this.translate.get('FIELD_MANAGER_CHEICK').subscribe(value => { 
        this.presentAlert(value,'Info');
      });
    } else {
      this.storage.set('id_manager', id_manager);
      this.navCtrl.navigateForward(['/manager-household-list', id_manager]);
    }
  }

  backToList() {
    this.storage.get('id_project').then((val) => { 
      if(val!=null) {
        this.navCtrl.navigateBack(['/contact-list']);
      } else{
        this.navCtrl.navigateBack(['/menu/contacts']);
      }
    });
  }

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

}
