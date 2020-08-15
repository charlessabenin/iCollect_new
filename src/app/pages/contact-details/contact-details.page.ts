import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { CacheService } from 'ionic-cache';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.page.html',
  styleUrls: ['./contact-details.page.scss'],
})
export class ContactDetailsPage implements OnInit {

  name: any;

  id_contact: any;
  contact_code: any;
  p_phone: any;
  p_phone2: any;
  p_phone3: any;
  p_phone4: any;
  p_email: any;
  p_email2: any;
  p_email3: any;
  id_coop_member: any;
  //state: any;
  //district: any;
  town_name: any;
  p_street1: any;
  gender: any;
  birth_date: any;
  national_lang: any;
  notes: any;
  dc_completed: any;
  civil_status: any;
  nationality: any;
  number_children: any;
  place_birth: any;
  bankname: any;
  mobile_money_operator: any;
  cooperative_name: any;

  farmer_signature: any;
  agent_signature: any;
  farmer_signature_preview: any;
  agent_signature_preview: any;
  other_lang: any;
  id: any;

  public avatarURL: any;
  public has_avatar = false;

  constructor(
    public translate: TranslateService,
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private db: DatabaseService,
    private storage: Storage,
    private webview: WebView,
    public cache: CacheService,
    private file: File
  ) {

  }

  ngOnInit() {
    this.cache.clearAll();
    this.storage.remove('dataType');

    this.loadData();
  }

  loadData() {
    this.activatedRoute.paramMap.subscribe(param => {
      this.id = param.get('id');

      this.db.getContact(this.id).then(contact => {
        var yes, no, complete, not_complete;
        this.translate.get('YES').subscribe(value => { yes = value; });
        this.translate.get('NO').subscribe(value => { no = value; });
        this.translate.get('COMPLETE').subscribe(value => { complete = value; });
        this.translate.get('NOT_COMPLETE').subscribe(value => { not_complete = value; });

        this.id_contact = contact.id_contact;
        this.name = contact.name;

        let filepath = this.file.externalRootDirectory + 'icollect/avatar/';
        let filename = contact.avatar;

        this.file.checkFile(filepath, filename)
          .then(() => {
            this.has_avatar = true;
            this.avatarURL = this.webview.convertFileSrc(filepath + filename);
          }).catch(() => {
            if (contact.avatar_path != null) {
              this.has_avatar = true;
              this.avatarURL = this.webview.convertFileSrc(contact.avatar_path);
            } else {
              this.has_avatar = false;
            }
          });

        this.contact_code = contact.contact_code;
        this.p_phone = contact.p_phone;
        this.p_phone2 = contact.p_phone2;
        this.p_phone3 = contact.p_phone3;
        this.p_phone4 = contact.p_phone4;
        this.p_email = contact.p_email;
        this.p_email2 = contact.p_email2;
        this.p_email3 = contact.p_email3;

        this.cooperative_name = contact.cooperative_name;
        this.bankname = contact.bankname;
        this.mobile_money_operator = contact.mobile_money_operator;

        this.town_name = contact.town_name;
        this.p_street1 = contact.p_street1;

        if (contact.id_gender == 'null') {
          this.gender = '';
        } else {
          this.db.getRegvalue(contact.id_gender).then(regvalue => {
            this.gender = regvalue.cvalue;
          });
        }

        if (contact.birth_date == null) {
          this.birth_date = '';
        } else {
          let b_date = contact.birth_date.split(" ");
          this.birth_date = b_date[0];
        }

        if (contact.national_lang == null) {
          this.national_lang = '';
        } else {
          this.db.getRegvalue(contact.national_lang).then(regvalue => {
            this.national_lang = regvalue.cvalue;
          });
        }


        if (contact.other_lang == null) {
          this.other_lang = '';
        } else {
          this.db.getRegvalue(contact.other_lang).then(regvalue => {
            this.other_lang = regvalue.cvalue;
          });
        }

        this.notes = contact.notes;

        let id_coop_member;
        if (contact.id_coop_member == 1) {
          id_coop_member = yes;
        } else { id_coop_member = no; }
        this.id_coop_member = id_coop_member;

        if (contact.dc_completed == 1) {
          this.dc_completed = complete;
        } else { this.dc_completed = not_complete; }

        if (contact.civil_status == null) {
          this.civil_status = '';
        } else {
          this.db.getRegvalue(contact.civil_status).then(regvalue => {
            this.civil_status = regvalue.cvalue;
          });
        }

        if (contact.nationality == null) {
          this.nationality = '';
        } else {
          this.db.getRegvalue(contact.nationality).then(regvalue => {
            this.nationality = regvalue.cvalue;
          });
        }

        if (contact.number_children == null) {
          this.number_children = '';
        } else { this.number_children = contact.number_children; }

        if (contact.place_birth == null) {
          this.place_birth = '';
        } else { this.place_birth = contact.place_birth; }

        var dir = this.file.externalRootDirectory + 'icollect/documents/';

        // Signature

        this.db.getContactSignature(this.id, 603).then(sign => {
          if (sign.filename != null) {
            this.file.checkFile(dir, sign.filename)
              .then(() => {
                this.farmer_signature_preview = true;
                this.farmer_signature = this.webview.convertFileSrc(dir + sign.filename);
              })
              .catch(() => { this.farmer_signature_preview = false; }
              );
          } else { this.farmer_signature_preview = false; }
        });

        this.db.getContactSignature(this.id, 604).then(sign => {
          if (sign.filename != null) {
            this.file.checkFile(dir, sign.filename)
              .then(() => {
                this.agent_signature_preview = true;
                this.agent_signature = this.webview.convertFileSrc(dir + sign.filename);
              })
              .catch(() => { this.agent_signature_preview = false; }
              );
          } else { this.agent_signature_preview = false; }
        });

      });
    });
  }

  backToList() {
    this.storage.get('id_project').then((val) => {
      if (val != null) {
        this.navCtrl.navigateBack(['/contact-list']);
      } else {
        this.navCtrl.navigateBack(['/menu/contacts']);
      }
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

  servey() {
    this.navCtrl.navigateForward(['/survey']);
  }

  documents() {
    this.storage.set('dataType', 'contact');
    this.navCtrl.navigateForward(['/media']);
  }

  editContact() {
    this.navCtrl.navigateForward(['/edit-contact', this.id]);
  }

}
