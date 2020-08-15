import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { File } from '@ionic-native/file/ngx';
import { ActivatedRoute } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingService } from 'src/app/services/loading.service';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { NetworkService, ConnectionStatus } from 'src/app/services/network.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss'],
})
export class SyncPage implements OnInit {

  contact_data = false;
  plantation_data = false;
  location_data = false;
  local_data = false;

  data: any[] = [];
  loaded_data: any[] = [];
  lines: any[] = [];

  dataType: any;
  progress: any;
  l_sync_id: any;

  local_data_spinner = false;
  local_data_progress: number;
  local_data_progress_value: any;

  user: any;
  network = false;

  constructor(
    private db: DatabaseService,
    public loading: LoadingService,
    public navCtrl: NavController,
    public translate: TranslateService,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private backgroundMode: BackgroundMode,
    private networkService: NetworkService,
    private router: ActivatedRoute,
    private transfer: FileTransfer,
    private http: HTTP,
    private file: File
  ) { }

  ngOnInit() {
    this.dataType = this.router.snapshot.paramMap.get('dataType');
    this.db.lastLogedUser().then(usr => { this.user = usr; });

    if (this.dataType == 'contact') {
      this.contact_data = true;

      this.db.loadDocDataContactSync().then(_ => {
        this.db.getContactDoc().subscribe(data => {
          this.loaded_data = [];
          this.loaded_data = data;
          this.loadData();
        });
      });
    }

    if (this.dataType == 'plantation') {
      this.plantation_data = true;

      this.db.loadDocDataPlantationSync().then(_ => {
        this.db.getPlantationDoc().subscribe(data => {
          this.data = [];
          this.data = data;
        });
      });
    }

    if (this.dataType == 'location') {
      this.location_data = true;

      this.db.loadPicturesLocationSync().then(_ => {
        this.db.getLocationPictures().subscribe(data => {
          this.data = [];
          this.data = data;
        });
      });
    }

    if (this.dataType == 'local_data') {
      this.local_data = true;

      this.db.loadTickerData().then(_ => {
        this.db.getTickerNotSync().subscribe(data => {
          this.data = [];
          this.data = data;
          this.data.sort((a, b) => {
            if (a.id_mobconticker > b.id_mobconticker) {
              return 1;
            } else if (a.id_mobconticker < b.id_mobconticker) {
              return -1;
            } else {
              return 0;
            }
          });
        });
      });
    }

    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        this.network = true;
      } else { this.network = false; }
    });
  }

  loadData() {
    this.data = [];
    this.loaded_data.forEach(rows => {
      this.data.push({
        id_doc: rows.id_doc,
        name: rows.name,
        filename: rows.filename,
        doc_date: rows.doc_date,
        doc_type: rows.doc_type,
        description: rows.description,
        sync: rows.sync,
        id_contact: rows.id_contact,
        coordx: rows.coordx,
        coordy: rows.coordy,
        accuracy: rows.accuracy,
        heading: rows.heading,
        agent_id: rows.agent_id,
        cloud_path: rows.cloud_path,
        id_household: rows.id_household,
        photo: rows.photo
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

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

  syncContacts() {
    if (this.network == true) {
      this.backgroundMode.enable();
      this.translate.get('UPLOAD_BACKGROUND').subscribe(value => {
        this.presentAlert(value, 'Info');
      });

      this.data.forEach(value => {
        var filepath, upload_preset;
        if (value.description == 'household_avatar') {
          filepath = this.file.externalRootDirectory + 'icollect/household/';
          upload_preset = 'c8cj4hcg';
        } else if (value.description == 'user_avatar') {
          filepath = this.file.externalRootDirectory + 'icollect/avatar/';
          upload_preset = 'pnudck3e';
        } else {
          filepath = this.file.externalRootDirectory + 'icollect/documents/';
          upload_preset = 'svzzhdf3';
        }

        let filename = value.filename;
        let id_doc = value.id_doc;
        let id_contact = value.id_contact;
        let doc_type = value.doc_type;
        let description = value.description;
        let coordx = value.coordx;
        let coordy = value.coordy;
        let accuracy = value.accuracy;
        let heading = value.heading;
        let id_household = value.id_household;
        let agent_id = value.agent_id;
        let doc_date = value.doc_date;
        let sync = value.sync;
        let cloud_path = value.cloud_path;

        if (cloud_path != null) {
          this.saveContactTicker('doc_date', doc_date, id_contact, id_doc, coordx, coordy, id_household, 1);
          this.saveContactTicker('doc_link', cloud_path, id_contact, id_doc, coordx, coordy, id_household, 1);
          this.saveContactTicker('doc_type', doc_type, id_contact, id_doc, coordx, coordy, id_household, 1);
          this.saveContactTicker('description', description, id_contact, id_doc, coordx, coordy, id_household, 1);
          this.saveContactTicker('coordx', coordx, id_contact, id_doc, coordx, coordy, id_household, 1);
          this.saveContactTicker('coordy', coordy, id_contact, id_doc, coordx, coordy, id_household, 1);
          this.saveContactTicker('accuracy', accuracy, id_contact, id_doc, coordx, coordy, id_household, 1);
          this.saveContactTicker('heading', heading, id_contact, id_doc, coordx, coordy, id_household, 1);
          this.saveContactTicker('agent_id', agent_id, id_contact, id_doc, coordx, coordy, id_household, 1);
          this.saveContactTicker('id_household', id_household, id_contact, id_doc, coordx, coordy, id_household, 1);
          this.saveContactTicker('sync', 1, id_contact, id_doc, coordx, coordy, id_household, 1);

        } else {
          let contactURL = encodeURI(filepath + filename);
          let url = encodeURI("https://api.cloudinary.com/v1_1/www-idiscover-live/image/upload");

          let options: FileUploadOptions = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'upload_preset': upload_preset }
          }

          const fileTransfer: FileTransferObject = this.transfer.create();

          fileTransfer.onProgress((ProgressEvent: any) => {
            if (ProgressEvent.lengthComputable) {
              this.progress = Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) / 100;
              //this.updateProgress(id_doc, this.progress, 'contact');
            }
          });

          fileTransfer.upload(contactURL, url, options, true)
            .then((data) => {
              console.log(data);

              let r = data.response.trim();
              let cUrl = JSON.parse(r);
              let file_url = JSON.stringify(cUrl.secure_url).split('"').join('');

              var m = new Date();
              let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
              this.db.addData('contact_picture', timestamp, null, 1, null);

              this.db.updateCloudLinkContactDoc(file_url, id_doc).then(() => {

                if (upload_preset == 'pnudck3e') {
                  this.db.saveContactAvatarPath(id_contact, file_url).then(() => {
                    this.db.addTicker(this.user.id_contact, null, null, id_contact, 'avatar_path', file_url, 'contact', timestamp, coordx, coordy, id_contact, null, null, null, null, null, null, null, null, null, null, null, null).then(() => {
                      this.translate.get('TICKER_UPDATED').subscribe(value => {
                        this.toastAlert(value);
                      });
                    });
                  });
                }

                if (upload_preset == 'c8cj4hcg') {
                  this.db.saveHouseholdAvatarPath(id_household, file_url).then(() => {
                    this.db.addTicker(this.user.id_contact, null, null, id_contact, 'avatar_path', file_url, 'contact_household', timestamp, coordx, coordy, id_contact, null, null, id_household, null, null, null, null, null, null, null, null, null).then(() => {
                      this.translate.get('TICKER_UPDATED').subscribe(value => {
                        this.toastAlert(value);
                      });
                    });
                  });
                }

                this.saveContactTicker('doc_date', doc_date, id_contact, id_doc, coordx, coordy, id_household, 0);
                this.saveContactTicker('doc_link', file_url, id_contact, id_doc, coordx, coordy, id_household, 0);
                this.saveContactTicker('doc_type', doc_type, id_contact, id_doc, coordx, coordy, id_household, 0);
                this.saveContactTicker('description', description, id_contact, id_doc, coordx, coordy, id_household, 0);
                this.saveContactTicker('coordx', coordx, id_contact, id_doc, coordx, coordy, id_household, 0);
                this.saveContactTicker('coordy', coordy, id_contact, id_doc, coordx, coordy, id_household, 0);
                this.saveContactTicker('accuracy', accuracy, id_contact, id_doc, coordx, coordy, id_household, 0);
                this.saveContactTicker('heading', heading, id_contact, id_doc, coordx, coordy, id_household, 0);
                this.saveContactTicker('agent_id', agent_id, id_contact, id_doc, coordx, coordy, id_household, 0);
                this.saveContactTicker('id_household', id_household, id_contact, id_doc, coordx, coordy, id_household, 0);
                this.saveContactTicker('sync', sync, id_contact, id_doc, coordx, coordy, id_household, 0);
              });

              this.translate.get('CONTACT_DOC_UPLOAD_SUCCESS').subscribe(
                value => { this.toastAlert(value); }
              );

            }, (err) => {
              console.log(err);
              this.translate.get('CONTACT_DOC_UPLOAD_ERROR').subscribe(
                value => { this.toastAlert(value); }
              );
            });
        }
      });

    } else {
      this.translate.get('CHECK_INTERNET').subscribe(value => {
        this.toastAlert(value);
      });
    }

  }

  /*updateProgress(id_doc, sync, type) {
    if (type == 'contact') {
      this.db.updateSyncContactDoc(sync, id_doc).then(_ => {
        this.loadData();
      });
    } else
    if (type == 'location_picture') {
      this.db.updateSyncLocationPics(sync, id_doc);
    } else {
      this.db.updateSyncPlantationDoc(sync, id_doc);
    }
  }*/

  saveContactTicker(field_name, field_value, id_contact, id_table, coordx, coordy, id_household, conf) {
    var m = new Date();
    let date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
    this.db.addTicker(this.user.id_contact, null, null, id_contact, field_name, field_value, 'contact_docs', date, coordx, coordy, id_table, null, null, id_household, id_table, null, null, null, null, null, null, null, null)
      .then(() => {
        if (conf == 1) { this.db.updateSyncContactDoc(1, id_table); }
        this.translate.get('TICKER_UPDATED').subscribe(value => {
          this.toastAlert(value);
        });
      });
  }

  clearContact() {
    var title, msg;
    this.translate.get('DELETE_DATA_PP_TITLE').subscribe(value => { title = value; });
    this.translate.get('DELETE_DATA_PP_MSG').subscribe(value => { msg = value; });
    this.clearPrompt(msg, title, 'contact');
  }

  clearContactAction() {
    this.db.clearContactDoc().then(_ => {
      this.translate.get('DELETE_DATA_SUCCESS').subscribe(
        value => { this.presentAlert(value, 'Success'); }
      );
    });
  }

  syncPlantations() {
    if (this.network == true) {
      this.backgroundMode.enable();
      this.translate.get('UPLOAD_BACKGROUND').subscribe(value => {
        this.presentAlert(value, 'Info');
      });

      this.data.forEach(value => {
        let filepath = this.file.externalRootDirectory + 'icollect/plantations/';
        let filename = value.filename;
        let id_doc = value.id_doc;
        let id_plantation = value.id_plantation;
        let doc_type = value.doc_type;
        let description = value.description;
        let coordx = value.coordx;
        let coordy = value.coordy;
        let accuracy = value.accuracy;
        let heading = value.heading;
        let agent_id = value.agent_id;
        let doc_date = value.doc_date;
        let cloud_path = value.cloud_path;

        if (cloud_path != null) {
          this.savePlantationTicker('doc_type', doc_type, id_plantation, id_doc, coordx, coordy, 1);
          this.savePlantationTicker('doc_date', doc_date, id_plantation, id_doc, coordx, coordy, 1);
          this.savePlantationTicker('description', description, id_plantation, id_doc, coordx, coordy, 1);
          this.savePlantationTicker('coordx', coordx, id_plantation, id_doc, coordx, coordy, 1);
          this.savePlantationTicker('coordy', coordy, id_plantation, id_doc, coordx, coordy, 1);
          this.savePlantationTicker('accuracy', accuracy, id_plantation, id_doc, coordx, coordy, 1);
          this.savePlantationTicker('heading', heading, id_plantation, id_doc, coordx, coordy, 1);
          this.savePlantationTicker('agent_id', agent_id, id_plantation, id_doc, coordx, coordy, 1);
          this.savePlantationTicker('doc_link', cloud_path, id_plantation, id_doc, coordx, coordy, 1);
          this.savePlantationTicker('sync', 1, id_plantation, id_doc, coordx, coordy, 1);

        } else {
          let plantationURL = encodeURI(filepath + filename);

          var url;
          if (doc_type == 155) {
            url = encodeURI("https://api.cloudinary.com/v1_1/www-idiscover-live/video/upload");
          } else {
            url = encodeURI("https://api.cloudinary.com/v1_1/www-idiscover-live/image/upload");
          }

          let options: FileUploadOptions = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'upload_preset': 'tijqdgzo' }
          }

          const fileTransfer: FileTransferObject = this.transfer.create();

          fileTransfer.onProgress((ProgressEvent: any) => {
            if (ProgressEvent.lengthComputable) {
              this.progress = Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) / 100;
              //this.updateProgress(id_doc, this.progress, 'plantation');
            }
          });

          fileTransfer.upload(plantationURL, url, options, true)
            .then((data) => {
              console.log(data);

              let r = data.response.trim();
              let cUrl = JSON.parse(r);
              let file_url = JSON.stringify(cUrl.secure_url).split('"').join('');

              var m = new Date();
              let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
              this.db.addData('plantation_picture', timestamp, null, 1, null);

              this.db.updateCloudLinkPlantationtDoc(file_url, id_doc).then(() => {
                this.savePlantationTicker('doc_date', doc_date, id_plantation, id_doc, coordx, coordy, 0);
                this.savePlantationTicker('doc_link', file_url, id_plantation, id_doc, coordx, coordy, 0);
                this.savePlantationTicker('doc_type', doc_type, id_plantation, id_doc, coordx, coordy, 0);
                this.savePlantationTicker('description', description, id_plantation, id_doc, coordx, coordy, 0);
                this.savePlantationTicker('coordx', coordx, id_plantation, id_doc, coordx, coordy, 0);
                this.savePlantationTicker('coordy', coordy, id_plantation, id_doc, coordx, coordy, 0);
                this.savePlantationTicker('accuracy', accuracy, id_plantation, id_doc, coordx, coordy, 0);
                this.savePlantationTicker('heading', heading, id_plantation, id_doc, coordx, coordy, 0);
                this.savePlantationTicker('agent_id', agent_id, id_plantation, id_doc, coordx, coordy, 0);
              });

              this.translate.get('CONTACT_DOC_UPLOAD_SUCCESS').subscribe(
                value => { this.toastAlert(value); }
              );

            }, (err) => {
              console.log(err);
              this.translate.get('CONTACT_DOC_UPLOAD_ERROR').subscribe(
                value => { this.toastAlert(value); }
              );
            });
        }
      });

    } else {
      this.translate.get('CHECK_INTERNET').subscribe(value => {
        this.toastAlert(value);
      });
    }
  }

  savePlantationTicker(field_name, field_value, id_plantation, id_table, coordx, coordy, conf) {
    var m = new Date();
    let date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
    this.db.addTicker(this.user.id_contact, id_plantation, null, null, field_name, field_value, 'plantation_docs', date, coordx, coordy, id_table, null, null, null, null, id_table, null, null, null, null, null, null, null)
      .then(() => {
        if (conf == 1) { this.db.updateSyncPlantationDoc(1, id_table); }
        this.translate.get('TICKER_UPDATED').subscribe(value => {
          this.toastAlert(value);
        });
      });
  }

  clearPlantation() {
    var title, msg;
    this.translate.get('DELETE_DATA_PP_TITLE').subscribe(value => { title = value; });
    this.translate.get('DELETE_DATA_PP_MSG').subscribe(value => { msg = value; });
    this.clearPrompt(msg, title, 'plantation');
  }

  clearPlantationAction() {
    this.db.clearPlantationDoc().then(_ => {
      this.translate.get('DELETE_DATA_SUCCESS').subscribe(
        value => { this.presentAlert(value, 'Success'); }
      );
    });
  }

  syncLocationPics() {
    if (this.network == true) {
      this.backgroundMode.enable();
      this.translate.get('UPLOAD_BACKGROUND').subscribe(value => {
        this.presentAlert(value, 'Info');
      });

      this.data.forEach(value => {
        let filepath = this.file.externalRootDirectory + 'icollect/locations/';
        let picture_name = value.picture_name;
        let id_pic = value.id_pic;
        let id_location = value.id_location;
        let description = value.description;
        let coordx = value.coordx;
        let coordy = value.coordy;
        let accuracy = value.accuracy;
        let heading = value.heading;
        let doc_type = value.doc_type;
        let agent_id = value.agent_id;
        let date = value.date;
        let sync_id = value.sync_id;
        let cloud_path = value.cloud_path;
        let id_cooperative = value.id_cooperative;
        let id_contractor = value.id_cooperative;

        if (cloud_path != null) {
          this.saveLocationPicTicker('id_phototype', doc_type, sync_id, id_location, id_pic, coordx, coordy, 1);
          this.saveLocationPicTicker('photo_date', date, sync_id, id_location, id_pic, coordx, coordy, 1);
          this.saveLocationPicTicker('photo_description', description, sync_id, id_location, id_pic, coordx, coordy, 1);
          this.saveLocationPicTicker('coordx', coordx, sync_id, id_location, id_pic, coordx, coordy, 1);
          this.saveLocationPicTicker('coordy', coordy, sync_id, id_location, id_pic, coordx, coordy, 1);
          this.saveLocationPicTicker('accuracy', accuracy, sync_id, id_location, id_pic, coordx, coordy, 1);
          this.saveLocationPicTicker('heading', heading, sync_id, id_location, id_pic, coordx, coordy, 1);
          this.saveLocationPicTicker('agent_id', agent_id, sync_id, id_location, id_pic, coordx, coordy, 1);
          this.saveLocationPicTicker('photo_link', cloud_path, sync_id, id_location, id_pic, coordx, coordy, 1);
          this.saveLocationPicTicker('id_infrastructure', id_location, sync_id, id_location, id_pic, coordx, coordy, 1);
          this.saveLocationPicTicker('id_cooperative', id_cooperative, sync_id, id_location, id_pic, coordx, coordy, 1);
          this.saveLocationPicTicker('id_contractor', id_contractor, sync_id, id_location, id_pic, coordx, coordy, 1);
          this.saveLocationPicTicker('sync', 1, sync_id, id_location, id_pic, coordx, coordy, 1);

        } else {
          let locationPicURL = encodeURI(filepath + picture_name);

          var url = encodeURI("https://api.cloudinary.com/v1_1/www-idiscover-live/image/upload");

          let options: FileUploadOptions = {
            fileKey: "file",
            fileName: picture_name,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'upload_preset': 'ydjkaefw' }
          }

          const fileTransfer: FileTransferObject = this.transfer.create();

          fileTransfer.onProgress((ProgressEvent: any) => {
            if (ProgressEvent.lengthComputable) {
              this.progress = Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) / 100;
              //this.updateProgress(id_pic, this.progress, 'location_picture');
            }
          });

          fileTransfer.upload(locationPicURL, url, options, true)
            .then((data) => {
              console.log(data);

              let r = data.response.trim();
              let cUrl = JSON.parse(r);
              let file_url = JSON.stringify(cUrl.secure_url).split('"').join('');

              var m = new Date();
              let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
              this.db.addData('location_picture', timestamp, null, 1, null);

              this.db.getNewContactId().then(contact => {
                this.l_sync_id = contact.new_id;
              });

              this.db.updateCloudLinkLocationPicture(file_url, this.l_sync_id, id_pic).then(() => {
                this.saveLocationPicTicker('photo_date', date, this.l_sync_id, id_location, id_pic, coordx, coordy, 0);
                this.saveLocationPicTicker('photo_link', file_url, this.l_sync_id, id_location, id_pic, coordx, coordy, 0);
                this.saveLocationPicTicker('id_phototype', doc_type, this.l_sync_id, id_location, id_pic, coordx, coordy, 0);
                this.saveLocationPicTicker('photo_description', description, this.l_sync_id, id_location, id_pic, coordx, coordy, 0);
                this.saveLocationPicTicker('coordx', coordx, this.l_sync_id, id_location, id_pic, coordx, coordy, 0);
                this.saveLocationPicTicker('coordy', coordy, this.l_sync_id, id_location, id_pic, coordx, coordy, 0);
                this.saveLocationPicTicker('accuracy', accuracy, this.l_sync_id, id_location, id_pic, coordx, coordy, 0);
                this.saveLocationPicTicker('heading', heading, this.l_sync_id, id_location, id_pic, coordx, coordy, 0);
                this.saveLocationPicTicker('agent_id', agent_id, this.l_sync_id, id_location, id_pic, coordx, coordy, 0);
                this.saveLocationPicTicker('id_infrastructure', id_location, this.l_sync_id, id_location, id_pic, coordx, coordy, 0);
                this.saveLocationPicTicker('id_cooperative', id_cooperative, this.l_sync_id, id_location, id_pic, coordx, coordy, 0);
                this.saveLocationPicTicker('id_contractor', id_contractor, this.l_sync_id, id_location, id_pic, coordx, coordy, 0);
                this.saveLocationPicTicker('sync', 1, this.l_sync_id, id_location, id_pic, coordx, coordy, 0);
              });

              this.translate.get('LOCATION_PIC_UPLOAD_SUCCESS').subscribe(
                value => { this.toastAlert(value); }
              );

            }, (err) => {
              console.log(err);
              this.translate.get('CONTACT_DOC_UPLOAD_ERROR').subscribe(
                value => { this.toastAlert(value); }
              );
            });
        }
      });

    } else {
      this.translate.get('CHECK_INTERNET').subscribe(value => {
        this.toastAlert(value);
      });
    }
  }

  saveLocationPicTicker(field_name, field_value, id_infrastructure_photo, id_location, id_table, coordx, coordy, conf) {
    var m = new Date();
    let date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
    this.db.addTicker(this.user.id_contact, null, null, null, field_name, field_value, 'infrastructure_photos', date, coordx, coordy, id_table, null, null, null, null, null, null, null, null, id_location, null, null, id_infrastructure_photo)
      .then(() => {
        if (conf == 1) { this.db.updateSyncLocationPic(1, id_table); }
        this.translate.get('TICKER_UPDATED').subscribe(value => {
          this.toastAlert(value);
        });
      });
  }

  clearLocation() {
    var title, msg;
    this.translate.get('DELETE_DATA_PP_TITLE').subscribe(value => { title = value; });
    this.translate.get('DELETE_DATA_PP_MSG').subscribe(value => { msg = value; });
    this.clearPrompt(msg, title, 'location');
  }

  clearLocationAction() {
    this.db.clearLocationPic().then(_ => {
      this.translate.get('DELETE_DATA_SUCCESS').subscribe(
        value => { this.presentAlert(value, 'Success'); }
      );
    });
  }

  syncData() {

    let filepath = this.file.externalRootDirectory + 'icollect/data/';

    var m = new Date();
    let date = m.getUTCFullYear() + "-" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + m.getUTCDate()).slice(-2) + "_" + ("0" + m.getUTCHours()).slice(-2) + "." + ("0" + m.getUTCMinutes()).slice(-2) + "." + ("0" + m.getUTCSeconds()).slice(-2);

    let filename = this.user.id_contact+'_'+ date + '_mtk.sql';
    let fileURL = encodeURI(filepath + filename);

    this.file.createFile(filepath, filename, true).then(() => {

      let query: string = "";
    
        var i = 0;
        this.data.forEach(value => {
          query = query + "\nINSERT INTO mobcrmticker (id_contact, field_name, field_value, field_table, ticker_time, coordx, coordy, id_agent, id_plantation, id_plantationsite, local_synctable_id, id_project, id_task, sync, id_household, id_contact_docs, id_plantation_docs, id_equipment, id_sur_survey_answers, id_contractor, id_infrastructure, id_suranswer, plant_line_id, id_infrastructure_photo) VALUES (" + value.contact_id + ", '" + value.field_name + "', '" + value.field_value + "', '" + value.field_table + "', '" + value.ticker_time + "', '" + value.coordx + "', '" + value.coordy + "', " + value.agent_id + ", " + value.plantation_id + ", " + value.plantationsite_id + ", " + value.local_synctable_id + ", " + value.project_id + ", " + value.task_id + ", 1, " + value.id_household + ", " + value.id_contact_docs + ", " + value.id_plantation_docs + ", " + value.id_equipement + ", " + value.id_sur_survey_answers + ", " + value.id_contractor + ", " + value.id_infrastructure + ", " + value.id_suranswer + ", " + value.plant_line_id + ", " + value.id_infrastructure_photo + ");";
          this.file.writeExistingFile(filepath, filename, query).then(() => {
            i = i + 1;
            if (i === this.data.length) {
              if (this.network == true) {
                this.translate.get('UPLOADING_DATA').subscribe(value => {
                  this.loading.showLoader(value);
                });
      
                let url = encodeURI("https://icoop.live/ic/mobile_upload.php?func=data");
      
                let options: FileUploadOptions = {
                  fileKey: "file",
                  fileName: filename,
                  chunkedMode: false,
                  mimeType: "multipart/form-data",
                  params: { 'fileName': filename, 'func': 'data' }
                }
      
                const fileTransfer: FileTransferObject = this.transfer.create();
      
                fileTransfer.upload(fileURL, url, options, true)
                  .then(() => {
                    this.loading.hideLoader();
                    this.toastAlert('Data uploaded successfully.');
                    this.db.tickerAsSunc();
                    this.db.backup(this.user.id_contact);
      
                  }).catch(err => { 
                    console.log(JSON.stringify(err));
                    this.loading.hideLoader();
                  });
      
              } else {
                this.translate.get('CHECK_INTERNET').subscribe(value => {
                  this.toastAlert(value);
                });
              }
            }
          });
        });

    });

    /*if (this.network == true) {
      this.translate.get('UPLOADING_DATA').subscribe(value => {
        this.loading.showLoader(value);
      });

      let x = 1;
      let length: number = this.data.length;

      this.local_data_spinner = true;
      this.local_data_progress = 0;
      this.local_data_progress_value = 0 + '%';

      this.data.forEach(value => {
        var link = 'https://idiscover.ch/api/restifydb/postgres_dev/mobcrmticker/';
        var myData = JSON.stringify({
          id_contact: value.contact_id,
          field_name: value.field_name,
          field_value: value.field_value,
          field_table: value.field_table,
          ticker_time: value.ticker_time,
          coordx: value.coordx,
          coordy: value.coordy,
          id_agent: value.agent_id,
          id_plantation: value.plantation_id,
          id_plantationsite: value.plantationsite_id,
          local_synctable_id: value.local_synctable_id,
          id_project: value.project_id,
          id_task: value.task_id,
          sync: 1,
          id_household: value.id_household,
          id_contact_docs: value.id_contact_docs,
          id_plantation_docs: value.id_plantation_docs,
          id_equipment: value.id_equipement,
          id_sur_survey_answers: value.id_sur_survey_answers,
          id_contractor: value.id_contractor,
          id_infrastructure: value.id_infrastructure,
          id_suranswer: value.id_suranswer,
          plant_line_id: value.plant_line_id,
          id_infrastructure_photo: value.id_infrastructure_photo
        });
        var donnee = encodeURI('_data=' + myData);

        this.http.setDataSerializer('utf8');
        this.http.post(link, donnee, { "Content-Type": "application/x-www-form-urlencoded" })
          .then(() => {
            this.db.updateTicker(value.id_mobconticker).then(_ => {
              this.translate.get('ROW_UPDATED').subscribe(
                value => {
                  let toast = this.toastController.create({
                    message: x + ' ' + value,
                    duration: 1000,
                    position: 'bottom'
                  });
                  toast.then(toast => toast.present());
                }
              );

              this.local_data_progress = (x / length);
              this.local_data_progress_value = Math.round((x / length) * 100) + '%';

              if (x == length) {
                this.loading.hideLoader();
                this.db.backup(this.user.id_contact);
              }

              x = x + 1;
            });

          }).catch((error) => {
            this.loading.hideLoader();
            console.error('API Error : ', error.status);
            console.error('API Error : ', JSON.stringify(error));
          });
      });

    } else {
      this.translate.get('CHECK_INTERNET').subscribe(value => {
        this.toastAlert(value);
      });
    } */
  }

  async clearPrompt(msg, headerText, datatype) {
    var yes, no;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });

    const promptAlert = await this.alertCtrl.create({
      subHeader: headerText,
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
            if (datatype == 'local_data') { this.clearDataAction(); }
            if (datatype == 'plantation') { this.clearPlantationAction(); }
            if (datatype == 'location') { this.clearLocationAction(); }
            if (datatype == 'contact') { this.clearContactAction(); }
          }
        }
      ]
    });
    promptAlert.present();
  }

  clearData() {
    var title, msg;
    this.translate.get('DELETE_DATA_PP_TITLE').subscribe(value => { title = value; });
    this.translate.get('DELETE_DATA_PP_MSG').subscribe(value => { msg = value; });
    this.clearPrompt(msg, title, 'local_data');
  }

  clearDataAction() {
    this.db.clearTicker().then(_ => {
      this.translate.get('DELETE_DATA_SUCCESS').subscribe(
        value => { this.presentAlert(value, 'Success'); }
      );
    });
  }

}
