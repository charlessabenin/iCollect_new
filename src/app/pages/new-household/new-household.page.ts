import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { CacheService } from 'ionic-cache';

@Component({
  selector: 'app-new-household',
  templateUrl: './new-household.page.html',
  styleUrls: ['./new-household.page.scss'],
})
export class NewHouseholdPage implements OnInit {

  public avatarURL: string;

  relationList: any;
  graduate_primaryList: any;
  graduate_secondaryList: any;
  graduate_tertiaryList: any;
  working_on_farmList: any;
  working_off_farmList: any;
  genderList: any;
  read_writeList: any;
  schoolingList: any;

  fname: any;
  lname: any;
  birth_year: any;
  relation: any;
  graduate_primary: any;
  graduate_secondary: any;
  graduate_tertiary: any;
  working_on_farm: any;
  working_off_farm: any;
  created_date: any;
  gender: any;
  read_write: any;
  schooling: any;

  id_project: any;
  id_task: any;
  id_contact: any;

  coordx: any;
  coordy: any;
  id_household: any;

  id_company: any;

  constructor(
    private db: DatabaseService,
    public navCtrl: NavController,
    private storage: Storage,
    public cache: CacheService,
    private alertCtrl: AlertController,
    private geolocation: Geolocation,
    private toastController: ToastController,
    private locationAccuracy: LocationAccuracy,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.graduate_primaryList = [];
    this.graduate_secondaryList = [];
    this.graduate_tertiaryList = [];
    this.working_on_farmList = [];
    this.working_off_farmList = [];
    this.read_writeList = [];
    this.schoolingList = [];

    this.db.getCertificateAnswers().then(() => {
      this.db.getCertificate().subscribe(data => {
        this.graduate_primaryList = data;
        this.graduate_secondaryList = data;
        this.graduate_tertiaryList = data;
      });
    });

    this.db.getYesNoList().then(() => {
      this.db.getYesNo().subscribe(data => {
        this.working_on_farmList = data;
        this.working_off_farmList = data;
        this.read_writeList = data;
        this.schoolingList = data;
      });
    });

    this.relationList = [];
    this.db.getRelationList().then(() => {
      this.db.getRegvalues().subscribe(data => {
        this.relationList = data;
      });
    });

    this.genderList = [];
    this.db.getGenderList().then(() => {
      this.db.getGenders().subscribe(data => {
        this.genderList = data;
      });
    });

    this.storage.get('id_project').then((val) => { 
      this.id_project = val; 
      this.db.getProject(val).then(prj => { 
        this.id_company = prj.id_company; 
      });
    });
    this.storage.get('id_task').then((val) => { this.id_task = val; });
    this.storage.get('id_contact').then((val) => { this.id_contact = val; });

    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.geolocation.getCurrentPosition().then((resp) => {
          this.coordx = resp.coords.latitude;
          this.coordy = resp.coords.longitude;

        }).catch((error) => {
          this.translate.get('LOCATION_ERROR').subscribe(value => { 
            this.presentAlert(value  + error, 'Error');
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

  async saveHouseholdDetails() {
    var yes, no, title, msg;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });
    this.translate.get('SAVE_HOUSEHOLD_PP_TITLE').subscribe(value => { title = value; });
    this.translate.get('SAVE_HOUSEHOLD_PP_MSG').subscribe(value => { msg = value; });

    const promptAlert = await this.alertCtrl.create({
      subHeader: title,
      message: msg,
      buttons: [
        {
          text: no,
          handler: data => {
            console.log(data);
          }
        },
        {
          text: yes,
          handler: data => {
            console.log(data);
            this.confirmSaveHouseholdDetails();
          }
        }
      ]
    });
    promptAlert.present();
  }

  confirmSaveHouseholdDetails() {
    this.db.lastLogedUser().then(usr => {
      var m = new Date();
      this.created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
      let year;
      if(this.birth_year!=null){
        let date = this.birth_year.split('-');
        year = date[0];
      } else { year = null; }

      this.db.getNewContactId().then(contact => { 
        this.id_household = contact.new_id;

        this.db.newHousehold(this.id_household, this.id_contact, this.fname, this.lname, year, this.relation, this.graduate_primary, this.graduate_secondary, this.graduate_tertiary, this.working_on_farm, this.working_off_farm, usr.id_contact, this.created_date, usr.id_contact, null, null, this.gender, this.read_write, this.schooling, null, null).then(_ => {
          if (this.fname != "") { this.saveTicker('firstname', this.fname); }
          if (this.lname != "") { this.saveTicker('lastname', this.lname); }
          if (this.birth_year != "") { this.saveTicker('birth_year', year); }
          if (this.relation != "") { this.saveTicker('relation', this.relation); }
          if (this.graduate_primary != "") { this.saveTicker('graduate_primary', this.graduate_primary); }
          if (this.graduate_secondary != "") { this.saveTicker('graduate_secondary', this.graduate_secondary); }
          if (this.graduate_tertiary != "") { this.saveTicker('graduate_tertiary', this.graduate_tertiary); }
          if (this.working_on_farm != "") { this.saveTicker('working_on_farm', this.working_on_farm); }
          if (this.working_off_farm != "") { this.saveTicker('working_off_farm', this.working_off_farm); }
          if (this.created_date != "") { this.saveTicker('created_date', this.created_date); }
          if (this.gender != "") { this.saveTicker('gender', this.gender); }
          if (this.read_write != "") { this.saveTicker('read_write', this.read_write); }
          if (this.schooling != "") { this.saveTicker('schooling', this.schooling); }
          
          this.saveTicker('contact_id', this.id_contact);
          this.saveTicker('agent_id', usr.id_contact);
          this.saveTicker('created_by', usr.id_contact);
  
          this.translate.get('HOUSEHOLD_SAVED').subscribe(value => { 
            this.toastAlert(value);
          });
  
          setTimeout(() => {
            //this.db.syncData();
            this.navCtrl.navigateBack(['/tabs/tabs/household-list']);
          }, 2000);
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
    this.db.lastLogedUser().then(usr => {
      this.db.addTicker(usr.id_contact, null, null, this.id_contact, field_name, field_value, 'contact_household', this.created_date, this.coordx, this.coordy, null, this.id_project, this.id_task, this.id_household, null, null, null, null, this.id_company, null, null, null, null)
      .then(() => { 
        this.cache.clearAll();
        this.translate.get('TICKER_UPDATED').subscribe(value => { 
          this.toastAlert(value); 
        });
      });
    });
  }

}
