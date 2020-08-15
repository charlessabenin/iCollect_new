import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { LoadingService } from 'src/app/services/loading.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { File } from '@ionic-native/file/ngx';
import { CacheService } from 'ionic-cache';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manager-household-list',
  templateUrl: './manager-household-list.page.html',
  styleUrls: ['./manager-household-list.page.scss'],
})
export class ManagerHouseholdListPage implements OnInit {

  households: any[] = [];
  household_data: any;
  public searchTerm: string = "";

  id_contact: any;
  lastHousholdID = null;
  contact: any;
  user: any;

  coordx: any;
  coordy: any;
  ticker: number = 0;

  complete = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    private db: DatabaseService,
    public loading: LoadingService,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private locationAccuracy: LocationAccuracy,
    public translate: TranslateService,
    private geolocation: Geolocation,
    public cache: CacheService,
    private webview: WebView,
    private file: File
  ) { }

  ngOnInit() {
    this.id_contact = this.activatedRoute.snapshot.paramMap.get('id_manager');

    this.db.getContact(this.id_contact).then(contact => {
      this.contact = contact;
    });

    this.db.lastLogedUser().then(usr => {
      this.user = usr;
    });

    this.db.checkHousehold(this.id_contact).then(data => {
      if (data.total == 0) { this.creatHeadHousehold(); }
    });

    this.db.getQuestionNumber(2).then(cQnb => {
      this.db.getCurrentSurQuestion(this.id_contact).then(q => {
        if (cQnb.total == 0) {
          this.complete = true;
        } else {
          let question = q.total + 1;
          if (question > cQnb.total) {
            this.complete = false;
          } else {
            this.complete = true;
          }
        }
      });
    });

    //this.loading.showLoader('Loading household data..');
    this.db.loadHouseholds(this.id_contact).then(() => {
      this.db.getHouseholds().subscribe(data => {
        //this.loading.hideLoader();
        this.household_data = data;

        this.loadData();
      });
    }).catch(() => {
      this.loading.hideLoader();
    });

    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.geolocation.getCurrentPosition().then((resp) => {
          this.coordx = resp.coords.latitude;
          this.coordy = resp.coords.longitude;

        }).catch((error) => {
          this.presentAlert('Error getting location' + error, 'Error');
        });
      },
      error => console.log(error)
    );
  }

  loadData() {
    this.household_data.forEach(household => {
      let filepath = this.file.externalRootDirectory + 'icollect/household/';
      let filename = household.avatar;

      this.households = [];
      this.file.checkFile(filepath, filename)
        .then(() => {
          this.households.push({
            id: household.id,
            id_household: household.id_household,
            fname: household.fname,
            lname: household.lname,
            cvalue: household.cvalue,
            age: household.age,
            photo: this.webview.convertFileSrc(filepath + filename)
          });
        })
        .catch(() => {
          if (household.avatar_path != null) {
            this.households.push({
              id: household.id,
              id_household: household.id_household,
              fname: household.fname,
              lname: household.lname,
              cvalue: household.cvalue,
              age: household.age,
              photo: this.webview.convertFileSrc(household.avatar_path)
            });
          } else {
            this.households.push({
              id: household.id,
              id_household: household.id_household,
              fname: household.fname,
              lname: household.lname,
              cvalue: household.cvalue,
              age: household.age,
              photo: '../../../assets/household.png'
            });
          }
        });
    });

    this.setFilteredItems();
  }

  creatHeadHousehold() {
    var m = new Date();
    let created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    this.translate.get('SAVING_HOUSEHOLD_DATA').subscribe(value => {
      this.loading.showLoader(value);
    });

    this.db.getNewContactId().then(contact => {
      this.lastHousholdID = contact.new_id;
      this.db.newHousehold(contact.new_id, this.id_contact, this.contact.firstname, this.contact.lastname, null, 551, null, null, null, null, null, this.user.id_contact, created_date, this.user.id_contact, null, null, null, null, null, this.contact.avatar, this.contact.avatar_path).then(() => {

        this.saveTicker('firstname', this.contact.firstname);
        this.saveTicker('lastname', this.contact.lastname);
        this.saveTicker('relation', 551);
        this.saveTicker('created_date', created_date);
        this.saveTicker('contact_id', this.id_contact);
        this.saveTicker('agent_id', this.user.id_contact);
        this.saveTicker('avatar_path', this.contact.avatar_path);
        this.saveTicker('created_by', this.user.id_contact);

        if (this.ticker == 1) {
          this.translate.get('TICKER_UPDATED').subscribe(value => {
            this.toastAlert(value);
          });
        }

        setTimeout(() => {
          this.loading.hideLoader();
          this.translate.get('HEAD_HOUSEHOLD_SUCCESS').subscribe(value => {
            this.presentAlert(value, 'Success');
          });
        }, 2000);

      });
    });
  }

  saveTicker(field_name, field_value) {
    var m = new Date();
    let created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    this.db.addTicker(this.user.id_contact, null, null, this.id_contact, field_name, field_value, 'contact_household', created_date, this.coordx, this.coordx, this.lastHousholdID, null, null, this.lastHousholdID, null, null, null, null, null, null, null, null, null)
      .then(() => {
        this.cache.clearAll();
        this.ticker = 1;
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
      duration: 1500,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }

  setFilteredItems() {
    this.households = this.filterItems(this.searchTerm);
  }

  filterItems(searchTerm) {
    return this.households.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  ionRefresh(event) {
    console.log('Pull Event Triggered!');
    setTimeout(() => {
      console.log('Async operation has ended');
      this.loadData();
      //complete()  signify that the refreshing has completed and to close the refresher
      event.target.complete();
    }, 2000);
  }

  ionPull(event) {
    //Emitted while the user is pulling down the content and exposing the refresher.
    console.log('ionPull Event Triggered!' + event);
  }

  ionStart(event) {
    //Emitted when the user begins to start pulling down.
    console.log('ionStart Event Triggered!' + event);
  }

  itemHousehold(item) {
    this.navCtrl.navigateForward(['/manager-household', item.id_household]);
  }

  newHousehold() {
    this.navCtrl.navigateForward(['/manager-new-household', this.id_contact]);
  }

  servey() {
    this.navCtrl.navigateForward(['/manager-survey']);
  }

}
