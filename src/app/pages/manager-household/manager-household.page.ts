import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-manager-household',
  templateUrl: './manager-household.page.html',
  styleUrls: ['./manager-household.page.scss'],
})
export class ManagerHouseholdPage implements OnInit {

  id:any;
  public avatarURL: string;
  
  fname: any;
  lname: any;
  birth_year: any;
  relation: any;
  graduate_primary: any;
  graduate_secondary: any;
  graduate_tertiary: any;
  working_on_farm: any;
  working_off_farm: any;
  created_date: any;
  gender: any;
  contact_id: any;
  read_write: any;
  schooling: any;

  constructor(
    private db: DatabaseService,
    private webview: WebView,
    private file: File,
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.activatedRoute.paramMap.subscribe(param => {
      this.id = param.get('id'); 

      this.db.getHousehold(this.id).then(household => { 
        this.contact_id = household.contact_id;
        this.fname = household.fname;
        this.lname = household.lname;
        this.birth_year = household.birth_year;
  
        if (household.relation == null) {
          this.relation = '';
        } else {
          this.db.getRegvalue(household.relation).then(regvalue => {
            this.relation = regvalue.cvalue;
          });
        }
  
        if (household.graduate_primary == null) {
          this.graduate_primary = '';
        } else {
          this.db.getRegvalue(household.graduate_primary).then(regvalue => {
            this.graduate_primary = regvalue.cvalue;
          });
        }
  
        if (household.graduate_secondary == null) {
          this.graduate_secondary = '';
        } else {
          this.db.getRegvalue(household.graduate_secondary).then(regvalue => {
            this.graduate_secondary = regvalue.cvalue;
          });
        }
  
        if (household.graduate_tertiary == null) {
          this.graduate_tertiary = '';
        } else {
          this.db.getRegvalue(household.graduate_tertiary).then(regvalue => {
            this.graduate_tertiary = regvalue.cvalue;
          });
        }
  
        if (household.working_on_farm == null) {
          this.working_on_farm = '';
        } else {
          this.db.getRegvalue(household.working_on_farm).then(regvalue => {
            this.working_on_farm = regvalue.cvalue;
          });
        }
  
        if (household.working_off_farm == null) {
          this.working_off_farm = '';
        } else {
          this.db.getRegvalue(household.working_off_farm).then(regvalue => {
            this.working_off_farm = regvalue.cvalue;
          });
        }
  
        if (household.gender == null) {
          this.gender = '';
        } else {
          this.db.getRegvalue(household.gender).then(regvalue => {
            this.gender = regvalue.cvalue;
          });
        }

        if (household.read_write == null) {
          this.read_write = '';
        } else {
          this.db.getRegvalue(household.read_write).then(regvalue => {
            this.read_write = regvalue.cvalue;
          });
        }

        if (household.schooling == null) {
          this.schooling = '';
        } else {
          this.db.getRegvalue(household.schooling).then(regvalue => {
            this.schooling = regvalue.cvalue;
          });
        }
  
        let filepath = this.file.externalRootDirectory + 'icollect/household/';
        let filename = household.avatar;
  
        this.file.checkFile(filepath, filename)
          .then(() => { this.avatarURL = this.webview.convertFileSrc(filepath + filename); })
          .catch(() => { 
            if(household.avatar_path != null) {
              this.avatarURL = this.webview.convertFileSrc(household.avatar_path);
            } else {
              this.avatarURL = 'assets/household.png';
            }
          }
        );
      });
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

  editHousehold() {
    this.navCtrl.navigateBack(['/manager-edit-household', this.id]);
  }

  navBack() {
    this.navCtrl.navigateBack(['/manager-household-list', this.contact_id]);
  }

}
