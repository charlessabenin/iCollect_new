import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service.js';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { CacheService } from 'ionic-cache';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.page.html',
  styleUrls: ['./edit-location.page.scss'],
})
export class EditLocationPage implements OnInit {

  location_type: any;
  locationTypeList: any;
  description: any;
  id_location: any;
  town: any;
  area: any;
  user: any;
  coordx: any;
  coordy: any;
  ticker: number = 0;

  constructor(
    private db: DatabaseService,
    private alertCtrl: AlertController,
    private geolocation: Geolocation,
    public navCtrl: NavController,
    public translate: TranslateService,
    private toastController: ToastController,
    private locationAccuracy: LocationAccuracy,
    private activatedRoute: ActivatedRoute,
    public cache: CacheService,
    private storage: Storage
  ) {
    this.db.lastLogedUser().then(usr => {
      this.user = usr;
    });
  }

  ngOnInit() {
    this.id_location = this.activatedRoute.snapshot.paramMap.get('id_location');

    this.db.getlocationTypeList().then(() => {
      this.db.getRegvalues().subscribe(data => {
        this.locationTypeList = data;
      });
    });

    this.db.getLocation(this.id_location).then(location => {
      this.location_type = location.type;
      this.town = location.town;
      this.area = location.area;
      this.description = location.description;
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
  }

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

  save() {
    this.db.lastLogedUser().then(usr => {
      this.db.updateLocation(this.location_type, this.description, this.town, this.area, this.id_location, usr.id_contact)
      .then(async () => {

        this.saveTicker('infrastructure_type', this.location_type);
        this.saveTicker('description1', this.description);
        this.saveTicker('description2', this.area);
        this.saveTicker('city_name', this.town);

        if (this.ticker == 1) {
          this.translate.get('TICKER_UPDATED').subscribe(value => {
            this.toastAlert(value);
          });
        }

        //this.db.syncData();
        this.translate.get('UPDATE_LOCATION_SUCCESS').subscribe(
          value => { this.toastAlert(value); }
        );
      });
    });
  }

  saveTicker(field_name, field_value) {
    let id_infrastructure = this.user.id_contact + this.id_location;
    var m = new Date();
    let created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    this.db.addTicker(this.user.id_contact, null, null, null, field_name, field_value, 'infrastructure', created_date, this.coordx, this.coordy, null, null, null, null, null, null, null, null, null, id_infrastructure, null, null, null)
      .then(() => {
        this.cache.clearAll();
        this.ticker = 1;
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
            this.navCtrl.navigateBack(['/menu/location']);
          }
        },
        {
          text: save,
          handler: data => {
            console.log(data);
            this.save();
          }
        }
      ]
    });
    alert.present();
  }

}
