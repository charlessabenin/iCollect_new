import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { File } from '@ionic-native/file/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-location-media',
  templateUrl: './location-media.page.html',
  styleUrls: ['./location-media.page.scss'],
})
export class LocationMediaPage implements OnInit {

  locationPic: any[] = [];
  pictures: any;

  public location_type: any;
  public town: any;
  public area: any;
  public description: any;

  coordx: any;
  coordy: any;
  accuracy: any;
  heading: any;
  altitude: any;
  created_date: any;

  constructor(
    private db: DatabaseService,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private toastController: ToastController,
    public translate: TranslateService,
    private alertCtrl: AlertController,
    private webview: WebView,
    private camera: Camera,
    private storage: Storage,
    private file: File
  ) { }

  ngOnInit() {
    this.storage.get('id_location').then((val) => {
      
      this.getPictures(val);

      this.db.getLocation(val).then((location) => {
        this.location_type = location.location_type;
        this.town = location.town;
        this.area = location.area;
        this.description = location.description;
      });

      var m = new Date();
      this.created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
    });

    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.geolocation.getCurrentPosition().then((resp) => {
          this.coordx = resp.coords.latitude;
          this.coordy = resp.coords.longitude;
          this.accuracy = resp.coords.accuracy;
          this.heading = resp.coords.heading;
          this.altitude = resp.coords.altitude;
    
        }).catch((error) => {
          this.translate.get('LOCATION_ERROR').subscribe(value => { 
            this.presentAlert(value + error, 'Error');
          });
        });
      },
      error => this.presentAlert('Requesting location permissions.' + JSON.stringify(error), 'Error')
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

  getPictures(id_location) {
    this.db.loadLocationPictures(id_location).then(_ =>{
      this.db.getLocationPictures().subscribe(data => {
        this.pictures = data;
        this.loadPictures();
      });
    });
  }

  loadPictures() {
    this.pictures.forEach(pic => {
      this.locationPic = [];
      let filepath = this.file.externalRootDirectory + 'icollect/locations/';
      let filename = pic.picture_name;

      this.file.checkFile(filepath, filename)
        .then(() => {
          this.locationPic.push({
            id_pic: pic.id_pic,
            id_location: pic.id_location,
            picture_name: pic.picture_name,
            date: pic.date,
            description: pic.description,
            cloud_path: pic.cloud_path,
            pictureLink: this.webview.convertFileSrc(filepath + filename)
          });
        })
        .catch(() => {
          if(pic.cloud_path!=null) {
            this.locationPic.push({
              id_pic: pic.id_pic,
              id_location: pic.id_location,
              picture_name: pic.picture_name,
              date: pic.date,
              description: pic.description,
              cloud_path: pic.cloud_path,
              pictureLink: this.webview.convertFileSrc(pic.cloud_path)
            });
          } else {
            this.locationPic.push({
              id_pic: pic.id_pic,
              id_location: pic.id_location,
              picture_name: pic.picture_name,
              date: pic.date,
              description: pic.description,
              cloud_path: pic.cloud_path,
              pictureLink: '../../../assets/not_found.jpg'
            });
          }
        });
    });
  }

  addPicture() {
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

      this.storage.get('id_location').then((val) => {
        this.presentPrompt(correctPath, currentName, val);
      });
    });
  }

  async presentPrompt(correctPath, currentName, id_location) {
    var pic_desc;
    this.translate.get('PIC_DESCRIPTION').subscribe(value => { pic_desc = value; });

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
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.moveFile(data.description, correctPath, currentName, id_location);
          }
        }
      ]
    });
    alert.present();
  }

  moveFile(description, correctPath, currentName, id_location) {
    var m = new Date();
    let newPath = this.file.externalRootDirectory + 'icollect/locations';
    let timestamp = m.getUTCFullYear() + "-" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + "-" + ("0" + m.getUTCMinutes()).slice(-2) + "-" + ("0" + m.getUTCSeconds()).slice(-2);
    let newFileName = id_location + '-' + timestamp + ".jpg"

    this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
      this.db.lastLogedUser().then(usr => {
        this.db.addLocationPicture(id_location, newFileName, this.created_date, usr.id_contact, this.coordx, this.coordy, 0, this.accuracy, this.heading, this.altitude, description, null, null, usr.id_cooperative, usr.id_primary_company).then(_ => {
          this.translate.get('MEDIA_SAVE_SUCCESS').subscribe(value => {
            this.presentAlert(value, 'Success');
          });
        });
      });
    });
  }

  async editDescription(item) {
    var pic_desc;
    this.translate.get('PIC_DESCRIPTION').subscribe(value => { pic_desc = value; });

    const alert = await this.alertCtrl.create({
      message: pic_desc,
      inputs: [
        {
          name: 'description',
          value: item.description
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.saveEditLocationDesc(item.id_pic, data.description, item.id_location);
          }
        }
      ]
    });

    alert.present();
  }

  saveEditLocationDesc(id_pic, description, id_location) {
    this.db.saveEditedLocationPicture(id_pic, description, id_location).then(_ => {  
      this.translate.get('UPDATE_LOCATION_SUCCESS').subscribe(value => { 
        this.toastAlert(value);
      }); 
    });
  }

  async toastAlert(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }

}
