import { Component, OnInit } from '@angular/core';
import { Platform, NavController, AlertController, ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NetworkService, ConnectionStatus } from 'src/app/services/network.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import mapboxgl from "../../../assets/mapbox-gl-cordova-offline.js";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-storage-map',
  templateUrl: './storage-map.page.html',
  styleUrls: ['./storage-map.page.scss'],
})
export class StorageMapPage implements OnInit {

  map: any;
  user: any;
  id_plantation: any;
  storage_coordx: any;
  storage_coordy: any;
  coordx: any;
  coordy: any;
  plantationsite_id: any;
  id_contact: any;
  created_date: any;
  id_project: any;
  id_task: any;
  back: any;

  actionBtn = false;

  constructor(
    private platform: Platform,
    private db: DatabaseService,
    public navCtrl: NavController,
    private geolocation: Geolocation,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private networkService: NetworkService,
    public translate: TranslateService,
    private storage: Storage,
    private router: ActivatedRoute
  ) {
    this.platform.ready().then(() => {
      mapboxgl.accessToken = 'pk.eyJ1IjoiY3JvdGg1MyIsImEiOiJjajRsazkxenowdnZuMnducjRiam90djlnIn0.XMeuMgUwPncR3fMwSgS7WA';
    });
  }

  ngOnInit() {
    this.db.lastLogedUser().then(usr => {
      this.user = usr; 
    });

    this.back = this.router.snapshot.paramMap.get('back');

    this.storage.get('id_project').then((val) => { this.id_project = val; });
    this.storage.get('id_task').then((val) => { this.id_task = val; });
    
    this.storage.get('id_plantation').then(id => {
      this.id_plantation = id;
      this.db.getPlantation(id).then(plantation => {
        this.storage_coordx = plantation.storage_coordx;
        this.storage_coordy = plantation.storage_coordy;
        this.plantationsite_id = plantation.plantationsite_id;
        this.id_contact = plantation.id_contact;

        if((this.storage_coordx==null)&&(this.storage_coordy==null)){
          this.checkGPSPermission();
        } else {
          this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
            if (status == ConnectionStatus.Online) {
              this.map_Online(this.storage_coordx, this.storage_coordy);
            }
            if (status == ConnectionStatus.Offline) {
              this.map_Offline(this.storage_coordx, this.storage_coordy);
            }
          });
        }
      });
    });

    var m = new Date();
    this.created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    if (this.back == 2) {
      this.actionBtn = true;
      this.translate.get('MORE_ACCURATE').subscribe(value => {
        this.presentAlert(value, 'Info');
      });

    } else {
      this.actionBtn = false;
    }
  }

  map_Offline(coordx, coordy) {
    new mapboxgl.OfflineMap({
      container: 'storage-map',
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

      if((this.storage_coordx==null)&&(this.storage_coordy==null)){
        new mapboxgl.Marker({ color: 'red' })
          .setLngLat([coordy, coordx])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML('Your location'))
          .addTo(map);

      } else {
        this.translate.get('STORAGE_LOCATION').subscribe(value => {
          new mapboxgl.Marker()
            .setLngLat([this.storage_coordy, this.storage_coordx])
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(value))
            .addTo(map);
        });
      }

    });
  }

  map_Online(coordx, coordy) {
    this.map = new mapboxgl.Map({
      container: 'storage-map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coordy, coordx],
      zoom: 12
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }));

    if((this.storage_coordx==null)&&(this.storage_coordy==null)){
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat([coordy, coordx])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML('Your location'))
        .addTo(this.map);

    } else {
      this.translate.get('STORAGE_LOCATION').subscribe(value => {
        new mapboxgl.Marker()
          .setLngLat([this.storage_coordy, this.storage_coordx])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(value))
          .addTo(this.map);
      });
    }
  }

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
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

  async newStorage() {
    var msg;
    this.translate.get('STORAGE_PROMPT_MSG').subscribe(value => {
      msg = value;
    });

    const alert = await this.alertCtrl.create({
      message: msg,
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
            this.saveNewStorage();
          }
        }
      ]
    });
    alert.present();
  }

  saveNewStorage() {
    this.db.savePlantationStorageCoords(this.coordx, this.coordy, this.id_plantation).then(
      () => {
        this.saveTicker('storage_coordx', this.coordx);
        this.saveTicker('storage_coordy', this.coordy);

        this.translate.get('STORAGE_SAVE_SUCCESS').subscribe(value => {
          this.presentAlert(value, 'Success');
        });

        setTimeout(() => {
          this.navCtrl.navigateBack(['/edit-plantation', this.id_plantation]);
        }, 2000);
      }
    );
  }

  saveTicker(field_name, field_value) {
    this.db.addTicker(this.user.id_contact, this.id_plantation, this.plantationsite_id, this.id_contact, field_name, field_value, 'plantation', this.created_date, this.coordx, this.coordy, this.id_plantation, this.id_project, this.id_task, null, null, null, null, null, null, null, null, null, null)
      .then(() => {
        this.translate.get('TICKER_UPDATED').subscribe(value => {
          this.toastAlert(value);
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

  backToEdit() {
    if (this.back == 1) {
      this.navCtrl.navigateBack(['/plantation-details/' + this.id_plantation]);
    } else {
      this.navCtrl.navigateBack(['/edit-plantation', this.id_plantation]);
    }
  }

}
