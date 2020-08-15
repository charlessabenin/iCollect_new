import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController, ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { TranslateService } from '@ngx-translate/core';
import { CacheService } from 'ionic-cache';

@Component({
  selector: 'app-edit-media',
  templateUrl: './edit-media.page.html',
  styleUrls: ['./edit-media.page.scss'],
})
export class EditMediaPage implements OnInit {

  id_doc: any;
  docTypeList: any[] = [];

  doc_date: any;
  docImg: any;
  description: any; description_old: any;
  doc_type: any; doc_type_old: any;

  id_plantation: any;
  id_contact: any;
  id_project: any;
  id_task: any;
  coordx: any;
  coordy: any;

  table: any;
  ticker:number = 1;

  constructor(
    private file: File,
    private navParams: NavParams,
    private db: DatabaseService,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private locationAccuracy: LocationAccuracy,
    public translate: TranslateService,
    private geolocation: Geolocation,
    public cache: CacheService,
    private storage: Storage,
    private webview: WebView,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.id_doc = this.navParams.get('id_doc');

    this.storage.get('id_plantation').then((val) => { this.id_plantation = val; });
    this.storage.get('id_contact').then((val) => { this.id_contact = val; });
    this.storage.get('id_project').then((val) => { this.id_project = val; });
    this.storage.get('id_task').then((val) => { this.id_task = val; });

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

    this.storage.get('dataType').then((val2) => {
      if (val2 == 'contact') {
        this.table = 'contact_docs';
        this.db.getDocTypeContactList().then(() => {
          this.db.getRegvalues().subscribe(data => {
            this.docTypeList = [];
            this.docTypeList = data;
          });
        });

        this.db.getDocDataContact(this.id_doc).then(data => {
          var filePath, folder;
          if (data.description == 'household_avatar') {
            filePath = this.file.externalRootDirectory + 'icollect/household/' + data.filename;
            folder = 'household/';
          } else if (data.description == 'user_avatar') {
            filePath = this.file.externalRootDirectory + 'icollect/avatar/' + data.filename;
            folder = 'avatar/';
          } else {
            filePath = this.file.externalRootDirectory + 'icollect/documents/' + data.filename;
            folder = 'documents/';
          }
    
          this.file.checkFile(this.file.externalRootDirectory+ 'icollect/'+ folder, data.filename)
            .then(() => { this.docImg = this.webview.convertFileSrc(filePath); })
            .catch(() => { 
              if(data.cloud_path!=null) {
                this.docImg = this.webview.convertFileSrc(data.cloud_path);
              } else {
                this.docImg = '../../../assets/not_found.jpg';
              }
            }
          );
    
          this.doc_type = data.doc_type;
          this.doc_date =  data.doc_date;
          this.description = data.description;
        });
      }

      if (val2 == 'plantation') {
        this.table = 'plantation_docs';
        this.db.getDocTypePlantationList().then(() => {
          this.db.getRegvalues().subscribe(data => {
            this.docTypeList = [];
            this.docTypeList = data;
          });
        });

        this.db.getDocDataPlantation(this.id_doc).then(data => {
          this.file.checkFile(this.file.externalRootDirectory+ 'icollect/plantations/', data.filename)
            .then(() => { 
              if(data.doc_type == 155) {
                this.docImg = '../../../assets/video.png';
              } else {
                this.docImg = this.webview.convertFileSrc(this.file.externalRootDirectory + 'icollect/plantations/' + data.filename);
              }
            })
            .catch(() => { 
              if(data.cloud_path!=null) {
                this.docImg = this.webview.convertFileSrc(data.cloud_path);
              } else {
                this.docImg = '../../../assets/not_found.jpg';
              }
            }
          );
    
          this.doc_type = data.doc_type;
          this.doc_date =  data.doc_date;
          this.description = data.description;
        });
      }
    });

  }

  closeModal() {
    this.modalController.dismiss();
  }

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

  updateMedia() {
    this.db.updateContactDocData(this.id_doc, this.doc_type, this.description)
      .then(_ => {
        
        if (this.doc_type !== this.doc_type_old) { this.saveTicker('doc_type', this.doc_type); }
        if (this.description !== this.description_old) { this.saveTicker('description', this.description); }

        if(this.ticker == 1) {
          this.translate.get('TICKER_UPDATED').subscribe(value => { 
            this.toastAlert(value); 
          });
        }

        this.translate.get('DATA_SAVE_SUCCESS').subscribe(value => { 
          this.toastAlert(value); 
        });

        setTimeout(() => {
          //this.db.syncData();
          this.closeModal();
        }, 1500);
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
    var m = new Date();
    let created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    this.db.lastLogedUser().then(usr => {
      this.db.addTicker(usr.id_contact, this.id_plantation, null, this.id_contact, field_name, field_value, this.table, created_date, this.coordx, this.coordy, this.id_doc, this.id_project, this.id_task, null, this.id_doc, null, null, null, null, null, null, null, null)
        .then(() => { 
          this.cache.clearAll();
          this.ticker = 1;
      });
    });
  }

}
