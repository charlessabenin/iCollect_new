import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { DatabaseService } from 'src/app/services/database.service.js';
import { NavController, ToastController, AlertController, Platform } from '@ionic/angular';
//import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-waypoint',
  templateUrl: './waypoint.page.html',
  styleUrls: ['./waypoint.page.scss'],
})
export class WaypointPage implements OnInit {

  id_plantation: any;
  id_contact: any;
  count: number = 0;

  startBtn: boolean = false;
  addBtn: boolean = true;
  stopBtn: boolean = true;

  public backBtn = true;
  previewBtn = false;
  drawAdd = false;

  docType_values: any[] = [];
  waypoints: any[] = [];
  coordx: any;
  coordy: any;
  precision: any;
  subscription: any;
  user: any;

  constructor(
    private storage: Storage,
    private db: DatabaseService,
    private geolocation: Geolocation,
    private androidPermissions: AndroidPermissions,
    //private screenOrientation: ScreenOrientation,
    private locationAccuracy: LocationAccuracy,
    private toastController: ToastController,
    public translate: TranslateService,
    private alertCtrl: AlertController,
    private mediaCapture: MediaCapture,
    public navCtrl: NavController,
    private platform: Platform,
    private camera: Camera,
    private insomnia: Insomnia,
    private file: File
  ) {
    this.getGPSPrecision();

    this.insomnia.keepAwake()
        .then(
          () => console.log('success'),
          () => console.log('error')
        );
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.storage.get('id_contact').then((id_contact) => { this.id_contact = id_contact; });

      this.db.lastLogedUser().then(usr => {
        this.user = usr;
      });

      this.db.getDocTypePlantationList().then(() => {
        this.db.getRegvalues().subscribe(data => { 
          data.forEach(value => {
            if(value.id_regvalue == 502) {
              this.docType_values.push({
                type: 'radio',
                label: value.cvalue,
                value: value.id_regvalue,
                checked: true
              });
            } else {
              this.docType_values.push({
                type: 'radio',
                label: value.cvalue,
                value: value.id_regvalue
              });
            }
          });
        });
      });

      this.loadPreviousPoints();
    });
  }

  loadPreviousPoints() {
    this.storage.get('id_plantation').then((val) => {
      this.id_plantation = val;
      this.db.loadWayPoints(val, 0).then(_ => {
        this.db.getWayPoints().subscribe(data => {
          this.waypoints = data;
        });

        if (this.waypoints.length != 0) {
          this.previewBtn = true;
        }
      });
    });
  }

  getGPSPrecision() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.subscription = this.geolocation.watchPosition().subscribe((data) => {
          this.precision = "";
          this.precision = Math.round(data.coords.accuracy * 100) / 100 + ' m';
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

  async toastAlert(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }

  start() {
    if (this.waypoints.length != 0) {
      this.alertPrompt();
    } else {
      this.startBtn = true;
      this.addBtn = false;
      this.stopBtn = false;

      this.drawAdd = true;
      this.backBtn = false;

      this.checkGPSPermission();
    }
  }

  async alertPrompt() {
    var yes, no, msg, headerText;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });
    this.translate.get('START_WAYPOINT_PP_MSG').subscribe(value => { msg = value; });
    this.translate.get('START_WAYPOINT_PP_TITLE').subscribe(value => { headerText = value; });

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
            this.startWayPoint();
          }
        }
      ]
    });
    promptAlert.present();
  }

  startWayPoint() {
    this.startBtn = true;
    this.addBtn = false;
    this.stopBtn = false;

    this.drawAdd = true;
    this.backBtn = false;
    this.previewBtn = false;

    this.db.deleteAllWayPoint(this.id_plantation).then(_ => {
      this.translate.get('OLD_POINTS_DELETE_SUCCESS').subscribe(value => { 
        this.toastAlert(value); 
      });

      this.checkGPSPermission();
    });
  }

  addPoint() {
    this.count = this.count + 1;
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.geolocation.getCurrentPosition().then((resp) => {
          var m = new Date();
          let created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

          this.db.lastLogedUser().then(usr => {
            this.db.addWayPoint(usr.id_contact, this.id_plantation, this.id_contact, resp.coords.longitude, resp.coords.latitude, created_date, 0, this.count, resp.coords.accuracy).then(_ => {
           
              this.translate.get('NEW_POINT_ADDED').subscribe(value => { 
                this.toastAlert(value); 
              });
            });
          });

        }).catch((error) => {
          this.translate.get('LOCATION_ERROR').subscribe(value => { 
            this.presentAlert(value + error, 'Error');
          });
        });
      },
      error => console.log('Error requesting location permissions ' + JSON.stringify(error))
    );
  }

  stop() {
    this.startBtn = false;
    this.addBtn = true;
    this.stopBtn = true;

    this.drawAdd = true;
    this.previewBtn = true;

    this.count = this.count + 1;
    var m = new Date();
    let created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
    this.subscription.unsubscribe();

    this.db.lastLogedUser().then(usr => {
      this.db.addWayPoint(usr.id_contact, this.id_plantation, this.id_contact, this.coordx, this.coordy, created_date, 0, this.count, this.precision).then(_ => {
        this.translate.get('WAY_POINT_STOP').subscribe(
          value => { this.toastAlert(value); }
        );
        this.count = 0;
      });
    });
  }

  checkGPSPermission() {
    if(this.user.high_accuracy == 1){
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        result => {
          if (result.hasPermission) {
            //If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS();
          } else {
            //If not having permission ask for permission
            this.requestGPSPermission();
          }
        }, err => {
          console.log(err);
        }
      );
    } else {
      this.getLocationCoordinates();
    }
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(() => { this.askToTurnOnGPS(); },
            error => {
              //Show alert if user click on 'No Thanks'
              this.presentAlert('Error requesting location permissions ' + error, 'Error');
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.getLocationCoordinates()
      },
      error => this.presentAlert('Requesting location permissions.' + JSON.stringify(error), 'Error')
    );
  }

  // Methos to get device accurate coordinates using device GPS
  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.coordx = resp.coords.longitude;
      this.coordy = resp.coords.latitude;
      this.precision = resp.coords.accuracy;

      this.translate.get('WAY_POINT_START').subscribe(
        value => { this.toastAlert(value); }
      );

      var m = new Date();
      let created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

      this.db.lastLogedUser().then(usr => {
        this.db.addWayPoint(usr.id_contact, this.id_plantation, this.id_contact, resp.coords.longitude, resp.coords.latitude, created_date, 0, 1, resp.coords.accuracy).then(_ => {
          this.translate.get('NEW_POINT_ADDED').subscribe(value => { 
            this.toastAlert(value); 
          });

          this.count = 1;
        });
      });

    }).catch((error) => {
      this.translate.get('LOCATION_ERROR').subscribe(value => { 
        this.presentAlert(value + error, 'Error');
      });
    });
  }
 
  preview() {
    this.navCtrl.navigateBack(['/plantation-map', { preview_waypoints: 1 }]);
  }

  selectImage() {
    //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      targetWidth: 1024,
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
      this.prompDoctype(correctPath, currentName, this.id_plantation);
    });

  }

  async prompDoctype(correctPath, currentName, id_plantation) {
    var docType, save, cancel;
    this.translate.get('DOCUMENT_TYPE').subscribe(value => { docType = value; });
    this.translate.get('SAVE').subscribe(value => { save = value; });
    this.translate.get('CANCEL').subscribe(value => { cancel = value; });

    const alert = await this.alertCtrl.create({
      message: docType,
      inputs: this.docType_values,
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          handler: data => {
            console.log(data);
            this.presentPrompt(502, correctPath, currentName, id_plantation);
          }
        },
        {
          text: save,
          handler: data => { 
            this.presentPrompt(data, correctPath, currentName, id_plantation);
          }
        }
      ]
    });
    alert.present();
  }

  async presentPrompt(doc_type, correctPath, currentName, id_plantation) {
    var pic_desc, save, cancel;
    this.translate.get('PIC_DESCRIPTION').subscribe(value => { pic_desc = value; });
    this.translate.get('SAVE').subscribe(value => { save = value; });
    this.translate.get('CANCEL').subscribe(value => { cancel = value; });

    const alert = await this.alertCtrl.create({
      message: pic_desc,
      inputs: [
        {
          name: 'description',
          placeholder: 'Description'
        }
      ],
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          handler: data => {
            console.log(data);
          }
        },
        {
          text: save,
          handler: data => {
            this.moveFile(data.description, correctPath, currentName, id_plantation, doc_type);
          }
        }
      ]
    });
    alert.present();
  }

  captureVideo() {
    //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 30
    }

    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      let capturedFile = res[0];
      let fileName = capturedFile.name;
      let dir = capturedFile['localURL'].split('/');
      dir.pop();
      let fromDirectory = dir.join('/');

      this.presentPrompt(155, fromDirectory, fileName, this.id_plantation);

    }, (err: CaptureError) => console.error(err));
  }

  moveFile(description, correctPath, currentName, id_plantation, doc_type) {
    var m = new Date();
    let created_date = m.getUTCFullYear() + "-" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + "-" + ("0" + m.getUTCMinutes()).slice(-2) + "-" + ("0" + m.getUTCSeconds()).slice(-2);
    let newPath = this.file.externalRootDirectory + 'icollect/plantations/';

    if(doc_type == 155) {
      var newFileName = this.id_plantation + '_' + created_date + ".mp4";

      this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
        this.db.saveDocDataPlantation(this.id_plantation, newFileName, description, doc_type, this.user.id_contact);
      });

    } else {
      var newFileName = id_plantation + '_' + created_date + ".jpg";
      
      this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
        this.db.saveDocDataPlantation(id_plantation, newFileName, description, doc_type, this.user.id_contact);
      });
    } 
  }

  deletePoint(item) {
    this.db.deleteWayPoint(item.id, this.id_plantation).then(_ => {

      this.translate.get('POINT_DELETED').subscribe(value => { 
        this.toastAlert(value);
      });

      if (this.waypoints.length == 0) {
        this.previewBtn = false;
        this.startBtn = true;
        this.addBtn = false;
        this.stopBtn = false;
      }
    });
  }
}
