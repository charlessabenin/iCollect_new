import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { CacheService } from 'ionic-cache';

@Component({
  selector: 'app-manager-edit-household',
  templateUrl: './manager-edit-household.page.html',
  styleUrls: ['./manager-edit-household.page.scss'],
})
export class ManagerEditHouseholdPage implements OnInit {

  id: any;
  id_household: any;
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

  fname: any;                   fname_old: any;
  lname: any;                   lname_old: any;
  birth_year: any;              birth_year_old: any;
  relation: any;                relation_old: any;
  graduate_primary: any;        graduate_primary_old: any;
  graduate_secondary: any;      graduate_secondary_old: any;
  graduate_tertiary: any;       graduate_tertiary_old: any;
  working_on_farm: any;         working_on_farm_old: any;
  working_off_farm: any;        working_off_farm_old: any;       
  gender: any;                  gender_old: any;
  read_write: any;              read_write_old: any;
  schooling: any;               schooling_old: any;
  modified_date: any;

  id_project: any;
  id_task: any;
  id_contact: any;

  coordx: any;
  coordy: any;
  agent_id: any;
  ticker: number = 0;

  constructor(
    private db: DatabaseService,
    private camera: Camera,
    private webview: WebView,
    private storage: Storage,
    private file: File,
    public navCtrl: NavController,
    public cache: CacheService,
    private toastController: ToastController,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private alertCtrl: AlertController,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

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

    this.storage.get('id_project').then((val) => { this.id_project = val; });
    this.storage.get('id_task').then((val) => { this.id_task = val; });
    this.storage.get('id_manager').then((val) => { this.id_contact = val; });

    this.db.lastLogedUser().then(usr => {
      this.agent_id = usr.id_contact;
    });

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
      }, error => console.log(error));

    this.loadData();
  }

  loadData() {
    this.db.getHousehold(this.id).then(household => {
      this.id_household = household.id_household;
      this.fname = household.fname;
      this.lname = household.lname;
      this.birth_year = household.birth_year;
      this.relation = household.relation;
      this.graduate_primary = household.graduate_primary;
      this.graduate_secondary = household.graduate_secondary;
      this.graduate_tertiary = household.graduate_tertiary;
      this.working_on_farm = household.working_on_farm;
      this.working_off_farm = household.working_off_farm;
      this.gender = household.gender;
      this.read_write = household.read_write;
      this.schooling  = household.schooling;

      this.fname_old = household.fname;
      this.lname_old = household.lname;
      this.birth_year_old = household.birth_year;
      this.relation_old = household.relation;
      this.graduate_primary_old = household.graduate_primary;
      this.graduate_secondary_old = household.graduate_secondary;
      this.graduate_tertiary_old = household.graduate_tertiary;
      this.working_on_farm_old = household.working_on_farm;
      this.working_off_farm_old = household.working_off_farm;
      this.gender_old = household.gender;
      this.read_write_old = household.read_write;
      this.schooling_old = household.schooling;

      let filepath = this.file.externalRootDirectory + 'icollect/household/';
      let filename = household.avatar;

      this.file.checkFile(filepath, filename)
        .then(() => { this.avatarURL = this.webview.convertFileSrc(filepath + filename); })
        .catch(() => { 
          if(household.avatar_path != null) {
            this.avatarURL = this.webview.convertFileSrc(household.avatar_path);
          } else {
            this.avatarURL = 'assets/household.png';
          } 
        }
      );
    });
  }

  async saveHouseholdDetails() {
    var yes, no, title, message;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });
    this.translate.get('SAVE_HOUSEHOLD_PP_TITLE').subscribe(value => { title = value; });
    this.translate.get('SAVE_HOUSEHOLD_PP_MSG').subscribe(value => { message = value; });

    const promptAlert = await this.alertCtrl.create({
      subHeader: title,
      message: message,
      buttons: [
        {
          text: no,
          handler: data => {
            console.log(data);
            this.backToDetails();
          }
        },
        {
          text: yes,
          handler: data => {
            console.log(data);
            this.saveHouseholdConfirm();
          }
        }
      ]
    });
    promptAlert.present();
  }

  saveHouseholdConfirm() {
    this.db.lastLogedUser().then(usr => {
      var m = new Date();
      this.modified_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
      
      let year;
      if(this.birth_year!=null){
        let date = this.birth_year.split('-');
        year = date[0];
      } else { year = null; }

      this.db.updateHousehold(this.id, this.id_contact, this.fname, this.lname, year, this.relation, this.graduate_primary, this.graduate_secondary, this.graduate_tertiary, this.working_on_farm, this.working_off_farm, usr.id_contact, this.modified_date, usr.id_contact, this.gender, this.read_write, this.schooling)
      .then(async () => {
        
        if (this.fname !== this.fname_old) { this.saveTicker('firstname', this.fname); }
        if (this.lname !== this.lname_old) { this.saveTicker('lastname', this.lname); }
        if (this.birth_year !== this.birth_year_old) { this.saveTicker('birth_year', year); }
        if (this.relation !== this.relation_old) { this.saveTicker('relation', this.relation); }
        if (this.graduate_primary !== this.graduate_primary_old) { this.saveTicker('graduate_primary', this.graduate_primary); }
        if (this.graduate_secondary !== this.graduate_secondary_old) { this.saveTicker('graduate_secondary', this.graduate_secondary); }
        if (this.graduate_tertiary !== this.graduate_tertiary_old) { this.saveTicker('graduate_tertiary', this.graduate_tertiary); }
        if (this.working_on_farm !== this.working_on_farm_old) { this.saveTicker('working_on_farm', this.working_on_farm); }
        if (this.working_off_farm !== this.working_off_farm_old) { this.saveTicker('working_off_farm', this.working_off_farm); }
        if (this.gender !== this.gender_old) { this.saveTicker('gender', this.gender); }
        if (this.read_write !== this.read_write_old) { this.saveTicker('read_write', this.read_write); }
        if (this.schooling !== this.schooling_old) { this.saveTicker('schooling', this.schooling); }
        
        this.saveTicker('modified_date', this.modified_date); 
        this.saveTicker('modified_by', usr.id_contact); 

        if(this.ticker == 1) {
          this.translate.get('TICKER_UPDATED').subscribe(value => { 
            this.toastAlert(value); 
          });
        }
        
        setTimeout(() => {
          this.translate.get('HOUSEHOLD_SAVED').subscribe(value => { 
            this.presentAlert(value, 'Data saved'); 
          });

          this.navCtrl.navigateBack(['/manager-household', this.id]);
        }, 2000);
      });
    });
  }

  backToDetails() {
    this.navCtrl.navigateBack(['/manager-household', this.id]);
  }

  async toastAlert(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }

  saveTicker(field_name, field_value) {
    this.db.lastLogedUser().then(usr => {
      this.db.addTicker(usr.id_contact, null, null, this.id_contact, field_name, field_value, 'contact_household', this.modified_date, this.coordx, this.coordy, this.id, this.id_project, this.id_task, this.id_household, null, null, null, null, null, null, null, null, null)
      .then(() => { 
        this.cache.clearAll();
        this.ticker = 1;
      });
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

  getHouseholdAvatar() {
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      targetWidth: 900,
      targetHeight: 900,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(imagePath => {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

      var m = new Date();
      let created_date = m.getUTCFullYear() + "-" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + m.getUTCDate()).slice(-2) + "_" + ("0" + m.getUTCHours()).slice(-2) + "-" + ("0" + m.getUTCMinutes()).slice(-2) + "-" + ("0" + m.getUTCSeconds()).slice(-2);

      var newFileName = this.id_household + '_' + created_date + ".jpg";
      let newPath = this.file.externalRootDirectory + 'icollect/household/';
      this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
        this.avatarURL = this.webview.convertFileSrc(newPath + newFileName);
        this.db.saveDocDataContact(this.id_contact, newFileName, 'household_avatar', 154, this.agent_id, this.id);
        this.db.saveHouseholdAvatar(this.id, newFileName);

        this.translate.get('AVATAR_SAVED').subscribe(value => { 
          this.presentAlert(value, 'Successs');  
        });
      });
    });

  }

  deleteHousehold() {
    this.db.deleteHousehold(this.id).then(_ => {
      this.db.deleteHouseholdTicker(this.id).then(_ =>{
        this.translate.get('HOUSEHOLD_DELETE_SUCCES').subscribe(value => { 
          this.presentAlert(value, 'Successs');  
        });

        this.storage.get('id_manager').then(val => {
          this.navCtrl.navigateBack(['/manager-household-list', val]);
        });
      });
    });
  }

}
