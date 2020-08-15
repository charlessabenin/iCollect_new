import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NavController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  user: any;
  locations: any[] = [];

  constructor(
    private db: DatabaseService,
    public navCtrl: NavController,
    public loading: LoadingService,
    public translate: TranslateService,
    private alertCtrl: AlertController,
    private storage: Storage
  ) {
    this.storage.clear();
  }

  ngOnInit() {
    this.translate.get('LOADING_LOCATION').subscribe(value => { 
      this.loading.showLoader(value);
    });

    this.db.lastLogedUser().then(usr => {
      this.user = usr;

      this.db.loadLocations(this.user.id_contact).then(_ => {
        this.db.getLocations().subscribe(data => {
          this.locations = data;
          this.loading.hideLoader();
        });
      });
    });
  }

  itemShowLocation(item) {
    this.storage.remove('id_location');
    this.storage.set('id_location', item.id_location);
    this.navCtrl.navigateForward(['/location-map']);
  }

  newLocation() {
    this.storage.remove('id_location');
    this.navCtrl.navigateForward(['/location-map']);
  }

  itemPictures(item) {
    this.storage.remove('id_location');
    this.storage.set('id_location', item.id_location);
    this.navCtrl.navigateForward(['/location-media']);
  }

  itemLocation(item) {
    this.storage.remove('id_location');
    this.storage.set('id_location', item.id_location);
    this.navCtrl.navigateForward(['/edit-location', item.id_location]);
  }

  async deleteConfirm(item) {
    var yes, no, title, msg;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });
    this.translate.get('DELETE_LOCATION_PP_TITLE').subscribe(value => { title = value; });
    this.translate.get('DELETE_LOCATION_PP_MSG').subscribe(value => { msg = value; });

    const alert = await this.alertCtrl.create({
      message: msg + item.cvalue + '?',
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
            this.deleteLocation(item.id_location);
          }
        }
      ]
    });
    alert.present();
  }

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

  deleteLocation(id_location) {  
    this.db.deleteLocation(id_location, this.user.id_contact).then(_ => {
      this.translate.get('LOCATION_DELETED_SUCCESS').subscribe(value => { 
        this.presentAlert(value, 'Success');
      });
    });
  }

}
