import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';
import { ToastController, AlertController, NavController } from '@ionic/angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { TranslateService } from '@ngx-translate/core';
import { CacheService } from 'ionic-cache';

@Component({
  selector: 'app-new-plantation',
  templateUrl: './new-plantation.page.html',
  styleUrls: ['./new-plantation.page.scss'],
})
export class NewPlantationPage implements OnInit {

  cultureList: any[] = [];

  code_plantation: any;
  culture: any;

  id_contractor: any;
  id_contact: any;
  id_project: any;
  id_task: any;
  coordx: any;
  coordy: any;
  agent_id: any;
  plantation_id: any;
  plantationsite_id: any;
  contact_code: any;
  id_company: any;

  created_date: any;
  town_name: any;
  id_town: any;

  constructor(
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    private db: DatabaseService,
    private geolocation: Geolocation,
    private toastController: ToastController,
    private locationAccuracy: LocationAccuracy,
    public translate: TranslateService,
    public cache: CacheService,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.db.getCultureList().then(() => {
      this.db.getRegvalues().subscribe(data => {
        this.cultureList = data;
      });
    });

    this.storage.get('id_contact').then((val) => {
      this.id_contact = val;
      this.db.getContact(val).then(contact => {
        this.id_contractor = contact.id_contractor;
        this.town_name = contact.town_name;
        this.id_town = contact.id_town;
        this.contact_code = contact.contact_code;
      });
    });

    this.storage.get('id_project').then((val) => {
      this.id_project = val;
      this.db.getProject(this.id_project).then(prj => {
        this.id_company = prj.id_company;
      });
    });

    this.storage.get('id_task').then((val) => { this.id_task = val; });

    var m = new Date();
    this.created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);


    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.geolocation.getCurrentPosition().then((resp) => {
          this.coordx = resp.coords.latitude;
          this.coordy = resp.coords.longitude;

        }).catch((error) => {
          this.translate.get('LOCATION_ERROR').subscribe(value => { 
            this.presentAlert(value + error, 'Error');
          });
        });
      },
      error => console.log(error)
    );
  }

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

  savePlantationDetails() {
    this.db.lastLogedUser().then(usr => {
      this.agent_id = usr.id_contact;

      this.db.getNewContactId().then(contact => { 
        this.plantation_id = contact.new_id;

        this.db.getNewPlantationId(this.id_contact).then(plant => {
          this.plantationsite_id = plant.plantationsite_id;
          this.code_plantation = this.contact_code + ' P' + plant.number_of_plantation;
  
          this.db.createPlantation(contact.new_id, plant.plantationsite_id, this.id_contact, this.code_plantation, this.culture, this.id_contractor, usr.id_contact, usr.agent_type, this.contact_code)
            .then(_ => {
  
              this.saveTicker('id_culture1', this.culture);
              this.saveTicker('code_plantation', this.code_plantation);
              this.saveTicker('plantationsite_id', this.id_contact);
              this.saveTicker('code_farmer', this.contact_code);
              this.saveTicker('name_town', this.town_name);
              this.saveTicker('id_town', this.id_town);
              this.saveTicker('id_contractor', this.id_company); 
              this.saveTicker('id_company', this.id_company); 
              //this.saveTicker('id_task', this.id_task); 
              this.saveTicker('created_date', this.created_date);
              this.saveTicker('created_by', this.agent_id);
  
  
              this.translate.get('PLANTATION_CREATE_SUCCESS').subscribe(value => { 
                this.toastAlert(value);
              });
  
              setTimeout(() => {
                //this.db.syncData();
                this.navCtrl.navigateBack(['/tabs/tabs/plantation-list']);
              }, 1500);
            });
        });
      });
    });
  }

  async toastAlert(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }

  saveTicker(field_name, field_value) {
    this.db.addTicker(this.agent_id, this.plantation_id, this.plantationsite_id, this.id_contact, field_name, field_value, 'plantation', this.created_date, this.coordx, this.coordy, null, this.id_project, this.id_task, null, null, null, null, null, null, null, null, null, null)
      .then(() => {
        this.cache.clearAll();
        this.translate.get('TICKER_UPDATED').subscribe(value => { 
          this.toastAlert(value); 
        });
      });
  }

}
