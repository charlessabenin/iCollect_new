import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';
import { TranslateService } from '@ngx-translate/core';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages: any;

  public avatar: string;
  public FullName: string;
  public Company: string;

  user: any;
  selectedPath = "";

  constructor(
    public navCtrl: NavController,
    private router: Router,
    private file: File,
    private webview: WebView,
    private db: DatabaseService,
    public translate: TranslateService,
    private backgroundMode: BackgroundMode
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
      }
    });
  }

  ngOnInit() {
    this.db.lastLogedUser().then(usr => {
      this.user = usr;

      this.file.checkDir(this.file.externalRootDirectory, 'icollect/avatar').then(_ => {
        let link = this.file.externalRootDirectory + 'icollect/avatar/' + this.user.id_contact + '.jpg';
        this.file.checkFile(this.file.externalRootDirectory + 'icollect/avatar/', this.user.id_contact + '.jpg').then(_ => {
          this.avatar = this.webview.convertFileSrc(link);
        }).catch(_ => {
          this.avatar = '../assets/user.png';
        });
      }); 

      this.FullName = this.user.name;
      this.Company = this.user.company_name;

      var project_list, contact_list, field_mapping, location, settings;

      this.translate.get('MENU_PROJECT_LIST').subscribe(value => { project_list = value; });
      this.translate.get('MENU_CONTACT_LIST').subscribe(value => { contact_list = value; });
      this.translate.get('MENU_FIELD_MAPPING').subscribe(value => { field_mapping = value; });
      this.translate.get('MENU_LOCATION').subscribe(value => { location = value; });
      this.translate.get('MENU_SETTNGS').subscribe(value => { settings = value; });

      this.pages = [
        {
          title: project_list,
          url: '/menu/project-list',
          icon: 'home'
        },  
        { 
          title: contact_list,
          url: '/menu/contacts',
          icon: 'people'
        },
        {
          title: field_mapping,
          url: '/menu/field-mapping',
          icon: 'map'
        },
        {
          title: location,
          url: '/menu/location',
          icon: 'list'
        },
        {
          title: settings,
          url: '/menu/settings',
          icon: 'settings'
        }
      ];
    }); 
  }

  logout() {
    this.db.logOut(this.user.id_contact).then(_ => {
      this.backgroundMode.enable();
      this.db.backup(this.user.id_contact);
      this.db.syncData();
      
      let data = {
        lang: this.user.lang,
        username: this.user.username,
        password: atob(this.user.pass_value)
      };

      this.navCtrl.navigateRoot(['login', data]);
    });
  }
}
