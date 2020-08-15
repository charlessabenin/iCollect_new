import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service.js';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CacheService } from 'ionic-cache';

@Component({
  selector: 'app-new-location',
  templateUrl: './new-location.page.html',
  styleUrls: ['./new-location.page.scss'],
})
export class NewLocationPage implements OnInit {

  locationTypeList: any;
  regionList: any;

  location_type: any;
  description: any;
  town: any;
  area: any;
  coordx: any;
  coordy: any;
  accuracy: any;
  id_region: any;
  region_name: any;
  id_region_name: any;
  id_location: any;

  user: any;
  created_date: any;

  constructor(
    public navCtrl: NavController,
    private db: DatabaseService,
    private alertCtrl: AlertController,
    public translate: TranslateService,
    private toastController: ToastController,
    public cache: CacheService,
    private router: ActivatedRoute
  ) {
    this.db.lastLogedUser().then(usr => {
      this.user = usr;
    });
  }

  ngOnInit() {
    this.coordx = this.router.snapshot.paramMap.get('coordx');
    this.coordy = this.router.snapshot.paramMap.get('coordy');
    this.accuracy = this.router.snapshot.paramMap.get('accuracy');

    var m = new Date();
    this.created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    this.db.getlocationTypeList().then(() => {
      this.db.getRegvalues().subscribe(data => {
        this.locationTypeList = data;
      });
    });

    this.db.loadTowns().then(() => {
      this.db.getTowns().subscribe(data => {
        this.regionList = data;
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

  add() {
    var m = new Date();
    let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    let data = this.id_region_name.split('@@');
    this.id_region = data[0];
    this.region_name = data[1];

    this.db.getNewContactId().then(id => {
      this.id_location = id.new_id;

      this.db.addLocation(this.id_location, this.location_type, this.description, timestamp, this.coordx, this.coordy, this.town, this.area, this.user.id_contact, 0, this.id_region, this.region_name, this.user.id_primary_company, this.accuracy, this.user.id_cooperative, this.user.id_primary_company)
        .then(async () => {
          this.translate.get('LOCATION_SAVED_SUCCESS').subscribe(value => {
            this.presentAlert(value, 'Success');
          });

          this.saveTicker('infrastructure_type', this.location_type);
          this.saveTicker('description1', this.description);
          this.saveTicker('coordx', this.coordx);
          this.saveTicker('coordy', this.coordy);
          this.saveTicker('city_name', this.town);
          this.saveTicker('id_region', this.id_region);
          this.saveTicker('region_name', this.region_name); 
          this.saveTicker('description2', this.area);
          this.saveTicker('agent_id', this.user.id_contact);
          this.saveTicker('id_proj_company', this.user.id_primary_company); 
          this.saveTicker('accuracy', this.accuracy);
          this.saveTicker('id_cooperative', this.user.id_cooperative); 
          this.saveTicker('id_contractor', this.user.id_primary_company); 

          this.cache.clearAll();
          //this.db.syncData();
          this.navCtrl.navigateBack(['/menu/location']);

        }).catch(err => {
          this.translate.get('LOCATION_NOT_SAVED').subscribe(value => {
            this.toastAlert(value);
          });
        });
    });
  }

  saveTicker(field_name, field_value) {
    this.db.addTicker(this.user.id_contact, null, null, null, field_name, field_value, 'infrastructure', this.created_date, this.coordx, this.coordy, null, null, null, null, null, null, null, null, null, this.id_location, null, null, null)
      .then(() => {
        this.cache.clearAll();
        this.translate.get('TICKER_UPDATED').subscribe(value => {
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
