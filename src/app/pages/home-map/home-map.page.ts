import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, ToastController, NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { NetworkService, ConnectionStatus } from 'src/app/services/network.service.js';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

import mapboxgl from '../../../assets/mapbox-gl-cordova-offline.js';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home-map',
  templateUrl: './home-map.page.html',
  styleUrls: ['./home-map.page.scss'],
})
export class HomeMapPage implements OnInit {

  map: any;
  saveBtn = false;

  your_location: any;
  home_location: any;

  constructor(
    private platform: Platform,
    private storage: Storage,
    private db: DatabaseService,
    public translate: TranslateService,
    private geolocation: Geolocation,
    public navCtrl: NavController,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private networkService: NetworkService,
    private toastController: ToastController,
    private alertCtrl: AlertController
  ) {
    this.platform.ready().then(() => {
      mapboxgl.accessToken = 'pk.eyJ1IjoiY3JvdGg1MyIsImEiOiJjajRsazkxenowdnZuMnducjRiam90djlnIn0.XMeuMgUwPncR3fMwSgS7WA';
    });

    this.translate.get('YOUR_LOCATION').subscribe(value => { this.your_location = value; });
    this.translate.get('HOME_LOCATION').subscribe(value => { this.home_location = value; });
  }

  ngOnInit() {
    this.storage.get('id_contact').then((val) => {
      this.db.getContact(val).then(usr => {
        if (((usr.coordx == null) || (usr.coordx == 'null'))
          && ((usr.coordy == null) || (usr.coordy == 'null'))
        ) {
          this.saveBtn = true;
          
          this.translate.get('NO_HOME_COORDS').subscribe(value => { 
            this.presentAlert(value, 'Info');
          });

          this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
            this.geolocation.getCurrentPosition().then(resp => {
              if (status == ConnectionStatus.Online) {
                this.map_Online(resp.coords.latitude, resp.coords.longitude, 0);
              }
              if (status == ConnectionStatus.Offline) {
                this.map_Offline(resp.coords.latitude, resp.coords.longitude, 0);
              }

              let precision = Math.round(resp.coords.accuracy * 100) / 100;

              this.translate.get('ACCURACY').subscribe(value => { 
                this.toastAlert(value + ' : ' + precision + 'm');
              });

            });

          });

        } else {
          this.saveBtn = false;

          this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
            if (status == ConnectionStatus.Online) {
              this.map_Online(usr.coordx, usr.coordy, 1);
            }
            if (status == ConnectionStatus.Offline) {
              this.map_Offline(usr.coordx, usr.coordy, 1);
            }
          });
        }

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

  map_Offline(coordx, coordy, conf) {
    new mapboxgl.OfflineMap({
      container: 'map',
      style: 'assets/styles/osm-bright/style-offline.json',
      center: [coordy, coordx],
      zoom: 10,
      bearing: -45,
      hash: true
    }).then((map) => {
      map.addControl(new mapboxgl.NavigationControl());

      map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      }));

      if (conf == 0) {
        new mapboxgl.Marker({ color: 'red' })
          .setLngLat([coordy, coordx])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(this.your_location))
          .addTo(map);

      } else {
        new mapboxgl.Marker()
          .setLngLat([coordy, coordx])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(this.home_location))
          .addTo(map);
      }
    });
  }

  map_Online(coordx, coordy, conf) {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coordy, coordx],
      zoom: 10
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }));

    if (conf == 0) {
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat([coordy, coordx])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(this.your_location))
        .addTo(this.map);

    } else {
      new mapboxgl.Marker()
        .setLngLat([coordy, coordx])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(this.home_location))
        .addTo(this.map);
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

  saveHomeLocation() {
    this.checkGPSPermission();
  }

  checkGPSPermission() {
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

  backToList() {
    this.storage.get('id_project').then((val) => { 
      if(val!=null) {
        this.navCtrl.navigateBack(['/contact-list']);
      } else{
        this.navCtrl.navigateBack(['/menu/contacts']);
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
    this.storage.get('id_contact').then((val) => {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.db.saveContactCoords(resp.coords.latitude, resp.coords.longitude, val, resp.coords.accuracy).then(
          () => {
            this.saveBtn = false;

            this.db.lastLogedUser().then(usr => {
              var m = new Date(); let id_project, id_task, id_contact;
              let date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
              this.storage.get('id_project').then((val1) => { id_project = val1; });
              this.storage.get('id_contact').then((val2) => { id_contact = val2; });
              this.storage.get('id_task').then((val3) => { id_task = val3; });

              this.db.addTicker(usr.id_contact, null, null, val, 'coordx', resp.coords.latitude, 'contact', date, resp.coords.latitude, resp.coords.longitude, id_contact, id_project, id_task, null, null, null, null, null, null, null, null, null, null);
              this.db.addTicker(usr.id_contact, null, null, val, 'coordy', resp.coords.longitude, 'contact', date, resp.coords.latitude, resp.coords.longitude, id_contact, id_project, id_task, null, null, null, null, null, null, null, null, null, null);
            });

            this.translate.get('HOME_LOCATION_SAVED').subscribe(value => { 
              this.presentAlert(value, 'Success');
            });

            setTimeout(() => { this.ngOnInit(); }, 2000);
          });

      }).catch((error) => {
        this.translate.get('LOCATION_ERROR').subscribe(value => { 
          this.presentAlert(value + error, 'Error');
        });
      });
    });

  }

}
