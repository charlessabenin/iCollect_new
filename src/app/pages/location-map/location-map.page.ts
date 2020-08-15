import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NetworkService, ConnectionStatus } from 'src/app/services/network.service.js';
import { DatabaseService } from 'src/app/services/database.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';

import mapboxgl from "../../../assets/mapbox-gl-cordova-offline.js";
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.page.html',
  styleUrls: ['./location-map.page.scss'],
})
export class LocationMapPage implements OnInit {

  map: any;
  coordx: any;
  coordy: any;
  user: any;

  accuracy: any;
  heading: any;
  altitude: any;

  actionBtn = false;
  created_date: any;

  constructor(
    private platform: Platform,
    private db: DatabaseService,
    public navCtrl: NavController,
    private geolocation: Geolocation,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private alertCtrl: AlertController,
    private networkService: NetworkService,
    public translate: TranslateService,
    private storage: Storage,
    private camera: Camera,
    private file: File
  ) {
    this.platform.ready().then(() => {
      mapboxgl.accessToken = 'pk.eyJ1IjoiY3JvdGg1MyIsImEiOiJjajRsazkxenowdnZuMnducjRiam90djlnIn0.XMeuMgUwPncR3fMwSgS7WA';
    });
  }

  ngOnInit() {
    this.db.lastLogedUser().then(usr => {
      this.user = usr;
      this.checkGPSPermission();
    });

    var m = new Date();
    this.created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    this.storage.get('id_location').then((val) => {
      if (val == null) {
        this.actionBtn = true;
        this.translate.get('MORE_ACCURATE').subscribe(value => {
          this.presentAlert(value, 'Info');
        });

      } else {
        this.actionBtn = false;
      }
    });
  }

  map_Offline(coordx, coordy) {
    new mapboxgl.OfflineMap({
      container: 'location-map',
      style: 'assets/styles/osm-bright/style-offline.json',
      center: [coordy, coordx],
      zoom: 12,
      bearing: -45,
      hash: true
    }).then((map) => {
      map.addControl(new mapboxgl.NavigationControl());

      map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      }));

      this.storage.get('id_location').then((val) => {
        this.db.getLocation(val).then(data => {
          new mapboxgl.Marker()
            .setLngLat([data.coordy, data.coordx])
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(data.location_type))
            .addTo(map);
        });
      });

    });
  }

  map_Online(coordx, coordy) {
    this.map = new mapboxgl.Map({
      container: 'location-map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coordy, coordx],
      zoom: 12
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }));

    this.storage.get('id_location').then((val) => {
      this.db.getLocation(val).then(data => {
        new mapboxgl.Marker()
          .setLngLat([data.coordy, data.coordx])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(data.location_type))
          .addTo(this.map);
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

  newLocation() {
    let data = {
      coordx: this.coordx,
      coordy: this.coordy,
      accuracy: this.accuracy
    }

    this.navCtrl.navigateForward(['/new-location', data]);
  }

  checkGPSPermission() {
    if (this.user.high_accuracy == 1) {
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
          alert(err);
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
      this.coordx = resp.coords.latitude;
      this.coordy = resp.coords.longitude;
      this.accuracy = resp.coords.accuracy;
      this.heading = resp.coords.heading;
      this.altitude = resp.coords.heading;

      this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
        if (status == ConnectionStatus.Online) {
          this.map_Online(resp.coords.latitude, resp.coords.longitude);
        }
        if (status == ConnectionStatus.Offline) {
          this.map_Offline(resp.coords.latitude, resp.coords.longitude);
        }
      });

    }).catch((error) => {
      this.translate.get('LOCATION_ERROR').subscribe(value => {
        this.presentAlert(value, 'Error');
      });
    });
  }

  addLocationMedia() {
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
        this.db.addLocationPicture(id_location, newFileName, this.created_date, usr.id_contact, this.coordx, this.coordy, 0, this.accuracy, this.heading, this.altitude, description, null, null, usr.id_primary_company, usr.id_cooperative).then(_ => {
          this.translate.get('MEDIA_SAVE_SUCCESS').subscribe(value => {
            this.presentAlert(value, 'Success');
          });
        });
      });
    });
  }

}
