import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { TranslateService } from '@ngx-translate/core';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Storage } from '@ionic/storage';
import { CacheService } from 'ionic-cache';

@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.page.html',
  styleUrls: ['./new-contact.page.scss'],
})
export class NewContactPage implements OnInit {

  id_town: any;
  firstname: any;
  lastname: any;
  code_plantation: any;
  contact_code: any;
  id_culture2: any;

  id_project: any;
  id_task: any;
  coordx: any;
  coordy: any;
  agent_id: any;
  plantation_id: any = null;
  plantationsite_id: any = null;
  id_gender: any;
  town_name: any;
  id_contact: any;
  id_contractor: any;
  created_date: any;

  cultureList: any;
  id_typeList: any;
  genderList: any;
  last_id: any;
  agent_type: any;
  id_company: any;
  id_cooperative: any;

  new_plantation = false;

  constructor(
    private db: DatabaseService,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    public translate: TranslateService,
    private toastController: ToastController,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    public cache: CacheService,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.genderList = [];
    this.db.getGenderList().then(() => {
      this.db.getGenders().subscribe(data => {
        this.genderList = data;
      });
    });

    this.cultureList = [];
    this.db.getCultureList().then(() => {
      this.db.getRegvalues().subscribe(data => {
        this.cultureList = data;
      });
    });

    var yes, no;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });

    this.id_typeList = [
      { value: null, name: no },
      { value: 9, name: yes }
    ];

    this.storage.get('id_task').then((val) => {
      this.id_task = val;
      this.db.getProjectTask(val).then(tsk => { 
        this.id_town = tsk.town_id;
        this.town_name = tsk.task_titleshort;
      });
    });

    this.storage.get('id_project').then((val) => { 
      this.id_project = val;
      this.db.getProject(val).then(prj => { 
        this.id_company = prj.id_company; 
        this.id_cooperative = prj.id_cooperative;
      });
    });

    this.db.lastLogedUser().then(usr => {
      this.agent_id = usr.id_contact;
      this.agent_type = usr.agent_type;
    });

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

  backToList() {
    this.storage.get('id_project').then((val) => {
      if (val != null) {
        this.navCtrl.navigateBack(['/contact-list']);
      } else {
        this.navCtrl.navigateBack(['/menu/contacts']);
      }
    });
  }

  farmerType(value) {
    if (value == 9) { this.new_plantation = true; }
    else { this.new_plantation = false; }
  }

  checkId() {
    this.db.getNewContactId().then(contact => {
      this.saveContactDetails(contact.new_id);
    });
  }

  saveContactDetails(id_contact) {
    this.id_contact = id_contact;
    let name: string = this.lastname + ' ' + this.firstname;
    let lname = this.lastname.replace(/\s/g, '');
    let code = lname.substring(0, 4);
    this.contact_code = code.toUpperCase();

    this.db.saveContact(id_contact, this.contact_code, this.firstname, this.lastname, name, this.id_gender, 115, this.town_name, this.id_town, this.agent_id, 9, null, null, this.agent_type, this.id_cooperative).then(() => {
      this.saveTicker('contact_code', this.contact_code, 'contact');
      this.saveTicker('firstname', this.firstname, 'contact');
      this.saveTicker('lastname', this.lastname, 'contact');
      this.saveTicker('name', name, 'contact');
      this.saveTicker('id_gender', this.id_gender, 'contact');
      this.saveTicker('id_supchain_type', 115, 'contact');
      this.saveTicker('town_name', this.town_name, 'contact');
      this.saveTicker('id_town', this.id_town, 'contact');
      this.saveTicker('id_type', 9, 'contact');
      this.saveTicker('id_cooperative', this.id_cooperative, 'contact'); 
      //this.saveTicker('id_contractor', this.id_company, 'contact'); 
      //this.saveTicker('id_company', this.id_company, 'contact'); 
      this.saveTicker('created_date', this.created_date, 'contact');
      this.saveTicker('created_by', this.agent_id, 'contact');

      setTimeout(() => {
        this.savePlantationDetails(this.contact_code);
      }, 3000);


      this.translate.get('CONTACT_CREATE_SUCCESS').subscribe(value => {
        this.toastAlert(value);
      });

      setTimeout(() => {
        //this.db.syncData();
        this.navCtrl.navigateBack(['/contact-list']);
      }, 2000);
    });

  }

  savePlantationDetails(contact_code) {
    this.db.getNewPlantationId(this.id_contact).then(plant => {
      this.plantation_id = plant.new_id;
      this.plantationsite_id = this.id_contact;
      this.code_plantation = contact_code + ' P' + plant.number_of_plantation;

      this.db.createPlantation(plant.new_id, this.plantationsite_id, this.id_contact, this.code_plantation, this.id_culture2, null, this.agent_id, this.agent_type, contact_code)
        .then(_ => {

          this.saveTicker('id_culture1', this.id_culture2, 'plantation');
          this.saveTicker('plantationsite_id', this.id_contact, 'plantation');
          this.saveTicker('code_farmer', contact_code, 'plantation');
          this.saveTicker('code_plantation', this.code_plantation, 'plantation');
          this.saveTicker('name_town', this.town_name, 'plantation');
          this.saveTicker('id_town', this.id_town, 'plantation');
          this.saveTicker('created_date', this.created_date, 'plantation');
          this.saveTicker('created_by', this.agent_id, 'plantation');

          this.translate.get('PLANTATION_CREATE_SUCCESS').subscribe(value => {
            this.toastAlert(value);
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

  saveTicker(field_name, field_value, table) {
    this.db.addTicker(this.agent_id, this.plantation_id, this.plantationsite_id, this.id_contact, field_name, field_value, table, this.created_date, this.coordx, this.coordy, this.id_contact, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, null, null)
      .then(() => {
        this.cache.clearAll();
        this.translate.get('TICKER_UPDATED').subscribe(value => {
          this.toastAlert(value);
        });
      });
  }

}
