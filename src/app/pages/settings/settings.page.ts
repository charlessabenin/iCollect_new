import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from 'src/app/services/database.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertController, ToastController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Storage } from '@ionic/storage';
import { CacheService } from "ionic-cache";
import { NavController } from '@ionic/angular';
import { NetworkService, ConnectionStatus } from 'src/app/services/network.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public avatar: string;
  lang: string;

  contact_data_date: string; contact_data = false;
  plantation_data_date: string; plantation_data = false;
  backup_data_date: string; backup_data = false;
  image_data_date: string; image_data = false;
  document_data_date: string; document_data = false;
  downAvatar_data_date: string; downAvatar_data = false;

  public high_accuracy_value: boolean;
  user: any;

  constructor(
    public loading: LoadingService,
    public translate: TranslateService,
    private alertCtrl: AlertController,
    private transfer: FileTransfer,
    public navCtrl: NavController,
    private db: DatabaseService,
    private storage: Storage,
    public cache: CacheService,
    private networkService: NetworkService,
    private toastController: ToastController,
    private file: File
  ) {
    this.storage.clear();
    this.cache.clearAll();
  }

  ngOnInit() {
    this.db.lastLogedUser().then(usr => {
      this.user = usr;
      this.lang = usr.lang;

      if (this.user.high_accuracy == 1) { this.high_accuracy_value = true; } else { this.high_accuracy_value = false; }
    });

    this.loadDataInfos();
  }

  loadDataInfos() {
    this.db.lastAVATARdownloadData().then(data => {
      this.downAvatar_data_date = data.data_date;
      this.downAvatar_data = true;
    });

    this.db.lastBackupData().then(data => {
      this.backup_data_date = data.data_date;
      this.backup_data = true;
    });

    this.db.lastPlantationData().then(data => {
      this.plantation_data_date = data.data_date;
      this.plantation_data = true;
    });

    this.db.lastContactData().then(data => { 
      this.contact_data_date = data.data_date;
      this.contact_data = true;
    });
  }

  createAvatarDir() {
    this.file.checkDir(this.file.externalRootDirectory, 'icollect/avatar').then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
      this.file.createDir(this.file.externalRootDirectory, 'icollect/avatar', false).then(response => {
        console.log('Directory create' + response);

      }).catch(err => { console.log('Directory no create' + JSON.stringify(err)); });
    });
  }

  createDocumentsDir() {
    this.file.checkDir(this.file.externalRootDirectory, 'icollect/documents').then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
      this.file.createDir(this.file.externalRootDirectory, 'icollect/documents', false).then(response => {
        console.log('Directory create' + response);

      }).catch(err => { console.log('Directory no create' + JSON.stringify(err)); });
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

  async toastAlert(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }

  localUpdate() {
    this.navCtrl.navigateBack(['/download-list', 'settings']);
  }

  downloadAvatars() {
    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        this.createAvatarDir();
        this.navCtrl.navigateBack(['/download-avatar']);
      }

      if (status == ConnectionStatus.Offline) {
        this.toastAlert('Check Your internet connection before.');
      }

      /*
          this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
            if (status == ConnectionStatus.Online) {
              this.translate.get('AVATAR_DOWNLOAD_BACKGROUND').subscribe(value => {
                this.loading.showLoader(value);
              });
      
              this.db.loadContactsAvatar(this.user.id_contact, this.user.agent_type).then(_ => {
                this.db.getContacts().subscribe(data => {
                  data.forEach(row => {
                    let path = this.file.externalRootDirectory + 'icollect/avatar/';
                    let url = encodeURI("https://icoop.live/ic/uploads/avatar/" + row.id_contact + ".jpg");
                    const fileTransfer: FileTransferObject = this.transfer.create();
                    fileTransfer.download(url, path + row.id_contact + ".jpg").then((data) => {
                      console.log(data);
                    }, (err) => { console.log(err); });
                  });
      
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
      
                  this.db.addData('avatar', timestamp, 1, null);
                  this.loadDataInfos();
      
                  this.loading.hideLoader();
                });
              });
            }
      
            if (status == ConnectionStatus.Offline) {
              this.toastAlert('Check Your internet connection before.');
            } */
    });

  }

  backup() {
    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        this.translate.get('UPLOADING_DB').subscribe(value => {
          this.loading.showLoader(value);
        });

        this.file.checkFile(this.file.applicationStorageDirectory + 'databases/', 'icollect_1.4.7.db').then((files) => {
          let dbURL = encodeURI(this.file.applicationStorageDirectory + 'databases/icollect_1.4.7.db');

          let m = new Date();
          let timestamp = m.getUTCFullYear() + "-" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + m.getUTCDate()).slice(-2) + "_" + ("0" + m.getUTCHours()).slice(-2) + "." + ("0" + m.getUTCMinutes()).slice(-2) + "." + ("0" + m.getUTCSeconds()).slice(-2);
          let filename = this.user.id_contact + "_" + timestamp + ".db";

          let url = encodeURI("https://icoop.live/ic/mobile_upload.php?func=database");

          let options: FileUploadOptions = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'fileName': filename, 'func': 'database' }
          }

          const fileTransfer: FileTransferObject = this.transfer.create();

          fileTransfer.upload(dbURL, url, options, true)
            .then((data) => {
              console.log(data);

              this.translate.get('BACKUP_DB_SUCCESS').subscribe(
                value => { this.presentAlert(value, 'Success'); }
              );

              var m = new Date();
              let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
              this.db.addData('backup', timestamp, null, 1, null);

              this.loadDataInfos();
              this.loading.hideLoader();

            }, (err) => {
              console.log(err);
              this.loading.hideLoader();

              this.translate.get('BACKUP_DB_ERROR').subscribe(
                value => { this.presentAlert(value, 'Error'); }
              );
            });

        }).catch((err) => {
          console.log(err);
          this.loading.hideLoader();
        });
      }

      if (status == ConnectionStatus.Offline) {
        this.translate.get('CHECK_INTERNET').subscribe(value => {
          this.toastAlert(value);
        });
      }
    });
  }

  uploadContactDocs() {
    let data = { dataType: 'contact' }
    this.navCtrl.navigateForward(['/sync', data]);
  }

  uploadPlantationDocs() {
    let data = { dataType: 'plantation' }
    this.navCtrl.navigateForward(['/sync', data]);
  }

  uploadLocationDocs() {
    let data = { dataType: 'location' }
    this.navCtrl.navigateForward(['/sync', data]);
  }

  notSyncList() {
    let data = { dataType: 'local_data' }
    this.navCtrl.navigateForward(['/sync', data]);
  }


  async deleteDatabase() {
    var yes, no, title, msg;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });
    this.translate.get('DELETE_LOCAL_DB_PP_TITLE').subscribe(value => { title = value; });
    this.translate.get('DELETE_LOCAL_DB_PP_MSG').subscribe(value => { msg = value; });

    let promptAlert = await this.alertCtrl.create({
      message: msg,
      subHeader: title,
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
            this.deleteDatabaseConfirm();
          }
        }
      ]
    });
    promptAlert.present();
  }

  deleteDatabaseConfirm() {
    this.backup();
    
    setTimeout(() => {
      this.db.deleteAllData().then(_ => {
        this.db.deleteUserTable();
      });
    }, 3500);
  }

  changeLanguage(lang) { 
    this.db.updateLang(this.user.id_contact, lang).then(_ => {
      this.translate.use(lang);
    });
  }

  changeAccuracy() {
    var high_accuracy;
    if (this.high_accuracy_value == true) {
      high_accuracy = 1;
    } else { high_accuracy = 0; }

    this.db.updateAccuracy(high_accuracy, this.user.id_contact).then(_ => {
      this.translate.get('ACCURACY_UPDATE').subscribe(value => {
        this.presentAlert(value, 'Success');
      });
    });
  }

}
