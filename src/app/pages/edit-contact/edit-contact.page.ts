import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActivatedRoute } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { CacheService } from 'ionic-cache';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.page.html',
  styleUrls: ['./edit-contact.page.scss'],
})
export class EditContactPage implements OnInit {

  public avatarURL: string;

  genderList: any;
  languageList: any;
  id_coop_memberList: any;
  dc_completedList: any;
  civil_statusList: any;
  nationalityList: any;

  contact_code: any; contact_code_old: any;
  firstname: any; firstname_old: any;
  lastname: any; lastname_old: any;
  name: string; name_old: string;
  p_phone: any; p_phone_old: any;
  p_phone2: any; p_phone2_old: any;
  p_phone3: any; p_phone3_old: any;
  p_phone4: any; p_phone4_old: any;
  p_email: any; p_email_old: any;
  p_email2: any; p_email2_old: any;
  p_email3: any; p_email3_old: any;
  id_coop_member: any; id_coop_member_old: any;
  //state: any; state_old: any;
  //district: any; district_old: any;
  town_name: any; town_name_old: any;
  p_street1: any; p_street1_old: any;
  id_gender: any; id_gender_old: any;
  birth_date: any; birth_date_old: any;
  national_lang: any; national_lang_old: any;
  notes: any; notes_old: any;
  dc_completed: any; dc_completed_old: any;
  civil_status: any; civil_status_old: any;
  nationality: any; nationality_old: any;
  number_children: any; number_children_old: any;
  place_birth: any; place_birth_old: any;
  bankname: any; bankname_old: any;
  mobile_money_operator: any; mobile_money_operator_old: any;
  title: any;
  id_contact: any;
  cooperative_name: any; cooperative_name_old: any;
  other_lang: any; other_lang_old: any;

  id_company: any;
  id_project: any;
  id_task: any;
  coordx: any;
  coordy: any;
  created_date: any;
  agent_id: any;
  ticker: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    public translate: TranslateService,
    private alertCtrl: AlertController,
    private geolocation: Geolocation,
    public navCtrl: NavController,
    public loading: LoadingService,
    private locationAccuracy: LocationAccuracy,
    private db: DatabaseService,
    public cache: CacheService,
    public camera: Camera,
    private webview: WebView,
    private storage: Storage,
    private file: File
  ) {
    this.storage.get('id_project').then((val) => { this.id_project = val; });
    this.storage.get('id_task').then((val) => { this.id_task = val; });
  }

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

  ngOnInit() {
    var yes, no, complete, not_complete;

    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });
    this.translate.get('COMPLETE').subscribe(value => { complete = value; });
    this.translate.get('NOT_COMPLETE').subscribe(value => { not_complete = value; });

    this.dc_completedList = [
      { value: 0, name: not_complete },
      { value: 1, name: complete }
    ];

    this.id_coop_memberList = [
      { value: 0, name: no },
      { value: 1, name: yes }
    ];

    this.genderList = [];
    this.db.getGenderList().then(data => {
      this.db.getGenders().subscribe(data => {
        this.genderList = data;
      });
    });

    this.languageList = [];
    this.db.getLanguageList().then(_ => {
      this.db.getLanguages().subscribe(data => {
        this.languageList = data;
      });
    });

    this.civil_statusList = [];
    this.db.getCivilStateList().then(_ => {
      this.db.getCivilState().subscribe(data => {
        this.civil_statusList = data;
      });
    });

    this.nationalityList = [];
    this.db.getNationalityList().then(_ => {
      this.db.getNationality().subscribe(data => {
        this.nationalityList = data;
      });
    });

    this.db.getProject(this.id_project).then(prj => { 
      this.id_company = prj.id_company;
    });

    var m = new Date();
    this.created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    this.db.lastLogedUser().then(usr => {
      this.agent_id = usr.id_contact;
    });

    this.loadData();

    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.geolocation.getCurrentPosition().then((resp) => {
          this.db.lastLogedUser().then(usr => {
            this.coordx = resp.coords.latitude;
            this.coordy = resp.coords.longitude;
          });

        }).catch((error) => {
          this.translate.get('LOCATION_ERROR').subscribe(value => {
            this.presentAlert(value + error, 'Error');
          });
        });
      }, error => console.log(error));
  }

  loadData() {
    this.id_contact = this.activatedRoute.snapshot.paramMap.get('id_contact');
    this.db.getContact(this.id_contact).then(contact => {
      this.title = contact.name;

      let filepath = this.file.externalRootDirectory + 'icollect/avatar/';
      let filename = contact.avatar;

      this.file.checkFile(filepath, filename)
        .then(() => { this.avatarURL = this.webview.convertFileSrc(filepath + filename); })
        .catch(() => {
          if (contact.avatar_path != null) {
            this.avatarURL = this.webview.convertFileSrc(contact.avatar_path);
          } else {
            this.avatarURL = 'assets/user.png';
          }
        }
        );

      this.p_phone = contact.p_phone;
      this.p_phone2 = contact.p_phone2;
      this.p_phone3 = contact.p_phone3;
      this.p_phone4 = contact.p_phone4;
      this.p_email = contact.p_email;
      this.p_email2 = contact.p_email2;
      this.p_email3 = contact.p_email3;

      this.cooperative_name = contact.cooperative_name;

      //if (contact.state == 'null') {
      //  this.state = '';
      //} else { this.state = contact.state; }

      //if (contact.district == 'null') {
      //  this.district = '';
      //} else { this.district = contact.district; }

      this.p_street1 = contact.p_street1;
      this.notes = contact.notes;

      this.contact_code = contact.contact_code; this.contact_code_old = contact.contact_code;

      this.firstname = contact.firstname; this.firstname_old = contact.firstname;
      this.lastname = contact.lastname; this.lastname_old = contact.lastname;
      this.name = contact.name; this.name_old = contact.name;

      this.id_coop_member = contact.id_coop_member; this.id_coop_member_old = contact.id_coop_member;
      this.town_name = contact.town_name; this.town_name_old = contact.town_name;
      this.id_gender = contact.id_gender; this.id_gender_old = contact.id_gender;
      this.birth_date = contact.birth_date; this.birth_date_old = contact.birth_date;
      this.national_lang = contact.national_lang; this.national_lang_old = contact.national_lang;
      this.dc_completed = contact.dc_completed; this.dc_completed_old = contact.dc_completed;
      this.civil_status = contact.civil_status; this.civil_status_old = contact.civil_status;
      this.nationality = contact.nationality; this.nationality_old = contact.nationality;

      this.bankname = contact.bankname; this.mobile_money_operator = contact.mobile_money_operator;
      this.bankname_old = contact.bankname; this.mobile_money_operator_old = contact.mobile_money_operator;
      this.other_lang = contact.other_lang; this.other_lang_old = contact.other_lang;

      this.number_children = contact.number_children;
      this.place_birth = contact.place_birth;

      this.number_children_old = contact.number_children;
      this.place_birth_old = contact.place_birth;
      this.p_phone_old = contact.p_phone;
      this.p_phone2_old = contact.p_phone2;
      this.p_phone3_old = contact.p_phone3;
      this.p_phone4_old = contact.p_phone4;
      this.p_email_old = contact.p_email;
      this.p_email2_old = contact.p_email2;
      this.p_email3_old = contact.p_email3;

      this.cooperative_name_old = contact.cooperative_name;
      //this.state_old = contact.state;
      //this.district_old = contact.district;
      this.p_street1_old = contact.p_street1;
      this.notes_old = contact.notes;
    });

  }

  getAvatar() {
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
      let created_date = m.getUTCFullYear() + "-" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + "-" + ("0" + m.getUTCMinutes()).slice(-2) + "-" + ("0" + m.getUTCSeconds()).slice(-2);

      var newFileName = this.id_contact + '_' + created_date + ".jpg";
      let newPath = this.file.externalRootDirectory + 'icollect/avatar/';

      this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
        this.avatarURL = this.webview.convertFileSrc(newPath + newFileName);
        this.db.saveDocDataContact(this.id_contact, newFileName, 'user_avatar', 154, this.agent_id, null);
        this.db.saveContactAvatar(this.id_contact, newFileName);

        this.translate.get('AVATAR_SAVED').subscribe(value => {
          this.presentAlert(value, 'Successs');
        });
      });
    });

  }

  async saveContactDetails() {
    var yes, no, title, message;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });
    this.translate.get('SAVE_CONTACT_PP_TITLE').subscribe(value => { title = value; });
    this.translate.get('SAVE_CONTACT_PP_MSG').subscribe(value => { message = value; });

    const promptAlert = await this.alertCtrl.create({
      subHeader: title,
      message: message,
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
            this.saveContactDetailsConfirm();
          }
        }
      ]
    });
    promptAlert.present();
  }

  saveContactDetailsConfirm() {
    let bdate;
    if(this.birth_date!=null){
      let date = this.birth_date.split('T');
      bdate = date[0];
    } else { bdate = null; }

    this.translate.get('SAVING_CONTACT_DATA').subscribe(value => {
      this.loading.showLoader(value);
    });

    this.name = this.lastname + ' ' + this.firstname;

    this.db.updateContactData(this.contact_code, this.firstname, this.lastname, this.name, this.p_phone, this.p_phone2, this.p_phone3, this.p_phone4, this.p_email, this.p_email2, this.p_email3, this.id_coop_member, this.town_name, this.p_street1, this.id_gender, bdate, this.national_lang, this.notes, this.dc_completed, this.civil_status, this.nationality, this.number_children, this.place_birth, this.bankname, this.mobile_money_operator, this.other_lang, this.id_contact)
      .then(async () => {

        if (this.contact_code !== this.contact_code_old) { this.saveTicker('contact_code', this.contact_code); }
        if (this.firstname !== this.firstname_old) { this.saveTicker('firstname', this.firstname); }
        if (this.lastname !== this.lastname_old) { this.saveTicker('lastname', this.lastname); }
        if (this.name !== this.name_old) { this.saveTicker('name', this.name); }

        if (this.p_phone !== this.p_phone_old) { this.saveTicker('p_phone', this.p_phone); }
        if (this.p_phone2 !== this.p_phone2_old) { this.saveTicker('p_phone2', this.p_phone2); }
        if (this.p_phone3 !== this.p_phone3_old) { this.saveTicker('p_phone3', this.p_phone3); }
        if (this.p_phone4 !== this.p_phone4_old) { this.saveTicker('p_phone4', this.p_phone4); }
        if (this.p_email !== this.p_email_old) { this.saveTicker('p_email', this.p_email); }
        if (this.p_email2 !== this.p_email2_old) { this.saveTicker('p_email2', this.p_email2); }
        if (this.p_email3 !== this.p_email3_old) { this.saveTicker('p_email3', this.p_email3); }
        if (this.id_coop_member !== this.id_coop_member_old) { this.saveTicker('id_coop_member', this.id_coop_member); }
        if (this.town_name !== this.town_name_old) { this.saveTicker('town_name', this.town_name); }
        if (this.p_street1 !== this.p_street1_old) { this.saveTicker('p_street1', this.p_street1); }
        if (this.id_gender !== this.id_gender_old) { this.saveTicker('id_gender', this.id_gender); }
        if (this.birth_date !== this.birth_date_old) { this.saveTicker('birth_date', bdate); }
        if (this.national_lang !== this.national_lang_old) { this.saveTicker('national_lang', this.national_lang); }
        if (this.notes !== this.notes_old) { this.saveTicker('notes', this.notes); }
        if (this.dc_completed !== this.dc_completed_old) { this.saveTicker('dc_completed', this.dc_completed); }
        if (this.civil_status !== this.civil_status_old) { this.saveTicker('civil_status', this.civil_status); }
        if (this.nationality !== this.nationality_old) { this.saveTicker('nationality', this.nationality); }
        if (this.number_children !== this.number_children_old) { this.saveTicker('number_children', this.number_children); }
        if (this.place_birth !== this.place_birth_old) { this.saveTicker('place_birth', this.place_birth); }

        if (this.bankname !== this.bankname_old) { this.saveTicker('bankname', this.bankname); }
        if (this.mobile_money_operator !== this.mobile_money_operator_old) { this.saveTicker('mobile_money_operator', this.mobile_money_operator); }
        if (this.other_lang !== this.other_lang_old) { this.saveTicker('other_lang', this.other_lang); }

        this.saveTicker('modified_date', this.created_date);
        this.saveTicker('modified_by', this.agent_id);

        if (this.ticker == 1) {
          this.translate.get('TICKER_UPDATED').subscribe(value => {
            this.toastAlert(value);
          });
        }

        setTimeout(() => {
          this.loading.hideLoader();
          
          this.translate.get('CONTACT_SAVE_SUCCES').subscribe(value => {
            this.toastAlert(value);
          });

          //this.db.syncData();
          this.navCtrl.navigateBack(['/tabs/tabs/contact-details', this.id_contact]);
        }, 4000);
      });
  }

  async backToDetails() {
    var text, save, cancel;
    this.translate.get('SAVE_MSG').subscribe(value => { text = value; });
    this.translate.get('SAVE').subscribe(value => { save = value; });
    this.translate.get('CANCEL').subscribe(value => { cancel = value; });

    const alert = await this.alertCtrl.create({
      message: text,
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          handler: data => {
            console.log(data);
            this.navCtrl.navigateBack(['/tabs/tabs/contact-details', this.id_contact]);
          }
        },
        {
          text: save,
          handler: data => {
            console.log(data);
            this.saveContactDetailsConfirm();
          }
        }
      ]
    });
    alert.present();
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
    this.db.addTicker(this.agent_id, null, null, this.id_contact, field_name, field_value, 'contact', this.created_date, this.coordx, this.coordy, this.id_contact, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, null, null)
      .then(() => {
        this.cache.clearAll();
        this.ticker = 1;
      });
  }

  signature(type) {
    this.navCtrl.navigateForward(['/signature/' + type]);
  }

}
