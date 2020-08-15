import { Injectable } from '@angular/core';
import { Platform, NavController, AlertController, ToastController } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from './loading.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NetworkService, ConnectionStatus } from './network.service';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { CacheService } from 'ionic-cache';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  projects = new BehaviorSubject([]);
  project_tasks = new BehaviorSubject([]);
  paths = new BehaviorSubject([]);
  plantations = new BehaviorSubject([]);
  contacts = new BehaviorSubject([]);
  reg_values = new BehaviorSubject([]);
  reg_languages = new BehaviorSubject([]);
  reg_genders = new BehaviorSubject([]);
  locations = new BehaviorSubject([]);
  plantation_doc = new BehaviorSubject([]);
  contact_doc = new BehaviorSubject([]);
  ticker_data = new BehaviorSubject([]);
  location_pic = new BehaviorSubject([]);
  way_point = new BehaviorSubject([]);
  survey = new BehaviorSubject([]);
  survey_answers = new BehaviorSubject([]);
  sur_answers = new BehaviorSubject([]);
  house_holds = new BehaviorSubject([]);
  reg_yesno = new BehaviorSubject([]);
  reg_certificate = new BehaviorSubject([]);
  towns = new BehaviorSubject([]);
  reg_fertilizer = new BehaviorSubject([]);
  reg_herbicide = new BehaviorSubject([]);
  reg_pesticide = new BehaviorSubject([]);
  reg_adjoining_cultures = new BehaviorSubject([]);
  reg_fire = new BehaviorSubject([]);
  reg_waste = new BehaviorSubject([]);
  reg_civilState = new BehaviorSubject([]);
  reg_nationality = new BehaviorSubject([]);
  reg_plantManager = new BehaviorSubject([]);
  reg_plantCertification = new BehaviorSubject([]);

  private agent_type: any;
  private agent_id: any;
  private id_primary_company: any;
  private id_supchain_company: any;

  loaderToShow: any;

  constructor(
    private plt: Platform,
    public http: HTTP,
    private file: File,
    public cache: CacheService,
    private webview: WebView,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private HttpClient: HttpClient,
    public translate: TranslateService,
    public loading: LoadingService,
    private geolocation: Geolocation,
    private transfer: FileTransfer,
    private locationAccuracy: LocationAccuracy,
    private toastController: ToastController,
    private networkService: NetworkService,
    private backgroundMode: BackgroundMode
  ) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'icollect_1.4.7.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.createTables();
        });
    })
  }

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

  createTables() {
    this.translate.get('DB_CREATION').subscribe(value => {
      this.loading.showLoader(value);
    });

    this.HttpClient.get('../../assets/database.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.dbReady.next(true);
            this.loadRegvaluesDB();
            this.loadTownsDB();

            this.createIcollectDir();
            this.createHouseholdDir();
            this.createDocumentsDir();
            this.createPlantationsDir();
            this.createAvatarDir();
            this.createLocationsDir();
            this.createDataDir();

            this.loading.hideLoader();

            /*if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online) {
              this.syncData();
            }*/
          })
          .catch(e => { console.error(e); });
      });
  }

  loadRegvaluesDB() {
    this.HttpClient.get('../../assets/regvalues.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.dbReady.next(true);
           
          })
          .catch(e => { console.error(e); });
      });
  }

  loadTownsDB() {
    this.HttpClient.get('../../assets/towns.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.dbReady.next(true);
           
          })
          .catch(e => { console.error(e); });
      });
  }

  backup(id_contact) {
    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        this.backgroundMode.enable();

        this.translate.get('UPLOADING_DB').subscribe(value => {
          this.loading.showLoader(value);
        });

        this.file.checkFile(this.file.applicationStorageDirectory + 'databases/', 'icollect.db').then((files) => {
          console.log(files);
          let dbURL = encodeURI(this.file.applicationStorageDirectory + 'databases/icollect.db');

          let m = new Date();
          let timestamp = m.getUTCFullYear() + "-" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + m.getUTCDate()).slice(-2) + "_" + ("0" + m.getUTCHours()).slice(-2) + "." + ("0" + m.getUTCMinutes()).slice(-2) + "." + ("0" + m.getUTCSeconds()).slice(-2);
          let filename = id_contact + "_" + timestamp + ".db";

          let url = encodeURI("https://icoop.live/ic/mobile_upload.php?func=database");

          let options: FileUploadOptions = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'fileName': filename, 'func': 'database' }
          }

          const fileTransfer: FileTransferObject = this.transfer.create();

          fileTransfer.upload(dbURL, url, options, true)
            .then((data) => {
              console.log(data);

              this.translate.get('BACKUP_DB_SUCCESS').subscribe(
                value => { this.presentAlert(value, 'Success'); }
              );

              var m = new Date();
              let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
              this.addData('backup', timestamp, null, 1, null);

              this.loading.hideLoader();

            }, (err) => {
              console.log(err);
              this.loading.hideLoader();

              this.translate.get('BACKUP_DB_ERROR').subscribe(
                value => { this.presentAlert(value, 'Error'); }
              );
            });

        }).catch((err) => {
          console.log(err);
          this.loading.hideLoader();
        });
      }
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  createIcollectDir() {
    this.file.checkDir(this.file.externalRootDirectory, 'icollect').then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
      this.file.createDir(this.file.externalRootDirectory, 'icollect', false).then(response => {
        console.log('Directory create' + response);
      }).catch(err => { console.log('Directory no create' + JSON.stringify(err)); });
    });
  }

  createLocationsDir() {
    this.file.checkDir(this.file.externalRootDirectory, 'icollect/locations').then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
      this.file.createDir(this.file.externalRootDirectory, 'icollect/locations', true).then(response => {
        console.log('Directory create' + response);
      }).catch(err => { console.log('Directory no create' + JSON.stringify(err)); });
    });
  }

  createAvatarDir() {
    this.file.checkDir(this.file.externalRootDirectory, 'icollect/avatar').then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
      this.file.createDir(this.file.externalRootDirectory, 'icollect/avatar', true).then(response => {
        console.log('Directory create' + response);
      }).catch(err => { console.log('Directory no create' + JSON.stringify(err)); });
    });
  }

  createHouseholdDir() {
    this.file.checkDir(this.file.externalRootDirectory, 'icollect/household').then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
      this.file.createDir(this.file.externalRootDirectory, 'icollect/household', true).then(response => {
        console.log('Directory create' + response);
      }).catch(err => { console.log('Directory no create' + JSON.stringify(err)); });
    });
  }

  createDocumentsDir() {
    this.file.checkDir(this.file.externalRootDirectory, 'icollect/documents').then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
      this.file.createDir(this.file.externalRootDirectory, 'icollect/documents', true).then(response => {
        console.log('Directory create' + response);
      }).catch(err => { console.log('Directory no create' + JSON.stringify(err)); });
    });
  }

  createPlantationsDir() {
    this.file.checkDir(this.file.externalRootDirectory, 'icollect/plantations').then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
      this.file.createDir(this.file.externalRootDirectory, 'icollect/plantations', true).then(response => {
        console.log('Directory create' + response);
      }).catch(err => { console.log('Directory no create' + JSON.stringify(err)); });
    });
  }

  createDataDir() {
    this.file.checkDir(this.file.externalRootDirectory, 'icollect/data').then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
      this.file.createDir(this.file.externalRootDirectory, 'icollect/data', true).then(response => {
        console.log('Directory create' + response);
      }).catch(err => { console.log('Directory no create' + JSON.stringify(err)); });
    });
  }

  // Update regvalues

  /*updateRegvalues() {
    this.loading.showLoader('Updating registervalues data..');
    this.database.executeSql('DELETE FROM registervalues', []).then(() => {
      this.restFetchRegvalues().then(
        (val) => {
          console.log(val);
          this.loading.hideLoader();

        }, (err) => {
          console.log(err);
          this.loading.hideLoader();
        }
      );
    }).catch(() => {
      this.loading.hideLoader();
    });
  }*/

  // User

  loadUser(username): Promise<any> {
    return this.database.executeSql('SELECT * FROM users WHERE username=?', [username]).then(data => {
      if (data.rows.length == 0) {
        return { length: 0 }
      } else {
        return {
          length: data.rows.length,
          id_contact: data.rows.item(0).id_contact,
          id_primary_company: data.rows.item(0).id_primary_company,
          id_user_supchain_type: data.rows.item(0).id_user_supchain_type,
          company_name: data.rows.item(0).company_name,
          username: data.rows.item(0).username,
          name: data.rows.item(0).name,
          agent_type: data.rows.item(0).agent_type,
          id_survey_tp: data.rows.item(0).id_survey_tp,
          lang: data.rows.item(0).lang,
          save_login: data.rows.item(0).save_login,
          pass_value: data.rows.item(0).pass_value,
          password_2: data.rows.item(0).password_2,
          password: data.rows.item(0).password,
          id_supchain_type: data.rows.item(0).id_supchain_type,
          id_supchain_company: data.rows.item(0).id_supchain_company,
          log: data.rows.item(0).log
        }
      }
    });
  }

  addUser(id_contact, id_primary_company, id_user_supchain_type, company_name, username, password, name, agent_type, password_2, lang, save_login, pass_value, id_cooperative, id_supchain_type, id_supchain_company) {
    let data = [id_contact, id_primary_company, id_user_supchain_type, company_name, username, password, name, agent_type, password_2, lang, save_login, pass_value, 1, id_cooperative, id_supchain_type, id_supchain_company];
    return this.database.executeSql('INSERT INTO users (id_contact, id_primary_company, id_user_supchain_type, company_name, username, password, name, agent_type, password_2, lang, save_login, pass_value, log, id_cooperative, id_supchain_type, id_supchain_company) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(val => {
      this.loadUser(username);
    });
  }

  logIn(username, save_login) {
    return this.database.executeSql('UPDATE users SET log=?, save_login=? WHERE username=?', [1, save_login, username]).then(_ => {
      this.loadUser(username);
    });
  }

  deleteUser(username) {
    return this.database.executeSql('DELETE FROM users WHERE username = ?', [username]);
  }

  logOut(id_contact) {
    return this.database.executeSql('UPDATE users SET log=? WHERE id_contact=?', [0, id_contact]);
  }

  logAllOut() {
    return this.database.executeSql('UPDATE users SET log=0', []);
  }

  updateAccuracy(high_accuracy, id_contact) {
    return this.database.executeSql('UPDATE users SET high_accuracy=? WHERE id_contact=?', [high_accuracy, id_contact]);
  }

  updateLang(id_contact, lang) {
    return this.database.executeSql('UPDATE users SET lang=? WHERE id_contact=?', [lang, id_contact]);
  }

  updateUserSurv(id_contact, id_survey_tp) {
    return this.database.executeSql('UPDATE users SET id_survey_tp=? WHERE id_contact=?', [id_survey_tp, id_contact]);
  }

  lastLogedUser(): Promise<any> {
    return this.database.executeSql('SELECT * FROM users WHERE log=?', [1]).then(data => {
      return {
        id_contact: data.rows.item(0).id_contact,
        id_primary_company: data.rows.item(0).id_primary_company,
        id_user_supchain_type: data.rows.item(0).id_user_supchain_type,
        company_name: data.rows.item(0).company_name,
        username: data.rows.item(0).username,
        name: data.rows.item(0).name,
        agent_type: data.rows.item(0).agent_type,
        id_survey_tp: data.rows.item(0).id_survey_tp,
        lang: data.rows.item(0).lang,
        save_login: data.rows.item(0).save_login,
        pass_value: data.rows.item(0).pass_value,
        password_2: data.rows.item(0).password_2,
        password: data.rows.item(0).password,
        id_cooperative: data.rows.item(0).id_cooperative,
        id_supchain_type: data.rows.item(0).id_supchain_type,
        id_supchain_company: data.rows.item(0).id_supchain_company,
        log: data.rows.item(0).log
      }
    });
  }

  // Household

  getHouseholds(): Observable<any[]> {
    return this.house_holds.asObservable();
  }

  deleteHouseholds() {
    return this.database.executeSql('DELETE FROM contact_household', []);
  }

  loadHouseholds(contact_id) {
    return this.database.executeSql('SELECT h.id_household, h.avatar, h.contact_id, h.fname, h.lname, h.birth_year, r.cvalue, r.cvaluefr, h.avatar_path FROM contact_household h LEFT JOIN registervalues r ON r.id_regvalue = h.relation WHERE contact_id=?', [contact_id]).then(data => {
      let house_holdList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          let birthyear = new Date().getFullYear();
          let age = birthyear - data.rows.item(i).birth_year;

          house_holdList.push({
            id_household: data.rows.item(i).id_household,
            avatar: data.rows.item(i).avatar,
            contact_id: data.rows.item(i).contact_id,
            fname: data.rows.item(i).fname,
            lname: data.rows.item(i).lname,
            avatar_path: data.rows.item(i).avatar_path,
            age: age,
            cvalue: cvalue
          });
        }
      }

      this.house_holds.next(house_holdList);
    });
  }

  countContactHousehold(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM contact_household', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  addHousehold(id_household, contact_id, fname, lname, birth_year, relation, graduate_primary, graduate_secondary, graduate_tertiary, working_on_farm, working_off_farm, agent_id, created_date, created_by, modified_date, modified_by, gender, avatar_path, read_write, schooling) {
    let data = [id_household, contact_id, fname, lname, birth_year, relation, graduate_primary, graduate_secondary, graduate_tertiary, working_on_farm, working_off_farm, agent_id, created_date, created_by, modified_date, modified_by, gender, avatar_path, read_write, schooling];
    return this.database.executeSql('INSERT INTO contact_household (id_household, contact_id, fname, lname, birth_year, relation, graduate_primary, graduate_secondary, graduate_tertiary, working_on_farm, working_off_farm, agent_id, created_date, created_by, modified_date, modified_by, gender, avatar_path, read_write, schooling) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(() => {
      this.loadHouseholds(contact_id);
    });
  }

  newHousehold(id_household, contact_id, fname, lname, birth_year, relation, graduate_primary, graduate_secondary, graduate_tertiary, working_on_farm, working_off_farm, agent_id, created_date, created_by, modified_date, modified_by, gender, read_write, schooling, avatar, avatar_path) {
    let data = [id_household, contact_id, fname, lname, birth_year, relation, graduate_primary, graduate_secondary, graduate_tertiary, working_on_farm, working_off_farm, agent_id, created_date, created_by, modified_date, modified_by, gender, read_write, schooling, avatar, avatar_path];
    return this.database.executeSql('INSERT INTO contact_household (id_household, contact_id, fname, lname, birth_year, relation, graduate_primary, graduate_secondary, graduate_tertiary, working_on_farm, working_off_farm, agent_id, created_date, created_by, modified_date, modified_by, gender, read_write, schooling, avatar, avatar_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(() => {
      this.loadHouseholds(contact_id);
    });
  }

  getHousehold(id_household): Promise<any> {
    return this.database.executeSql('SELECT * FROM contact_household WHERE id_household = ?', [id_household]).then(data => {
      return {
        id_household: data.rows.item(0).id_household,
        contact_id: data.rows.item(0).contact_id,
        fname: data.rows.item(0).fname,
        lname: data.rows.item(0).lname,
        birth_year: data.rows.item(0).birth_year,
        relation: data.rows.item(0).relation,
        graduate_primary: data.rows.item(0).graduate_primary,
        graduate_secondary: data.rows.item(0).graduate_secondary,
        graduate_tertiary: data.rows.item(0).graduate_tertiary,
        working_on_farm: data.rows.item(0).working_on_farm,
        working_off_farm: data.rows.item(0).working_off_farm,
        agent_id: data.rows.item(0).agent_id,
        created_date: data.rows.item(0).created_date,
        created_by: data.rows.item(0).created_by,
        modified_date: data.rows.item(0).modified_date,
        modified_by: data.rows.item(0).modified_by,
        avatar: data.rows.item(0).avatar,
        gender: data.rows.item(0).gender,
        order: data.rows.item(0).order,
        avatar_path: data.rows.item(0).avatar_path,
        read_write: data.rows.item(0).read_write,
        schooling: data.rows.item(0).schooling
      }
    });
  }

  checkHousehold(contact_id) {
    return this.database.executeSql('SELECT COUNT(id_household) AS total FROM contact_household WHERE contact_id=?', [contact_id]).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  updateHousehold(id_household, contact_id, fname, lname, birth_year, relation, graduate_primary, graduate_secondary, graduate_tertiary, working_on_farm, working_off_farm, agent_id, modified_date, modified_by, gender, read_write, schooling) {
    let data = [contact_id, fname, lname, birth_year, relation, graduate_primary, graduate_secondary, graduate_tertiary, working_on_farm, working_off_farm, agent_id, modified_date, modified_by, gender, read_write, schooling, id_household];
    return this.database.executeSql('UPDATE contact_household SET contact_id=?, fname=?, lname=?, birth_year=?, relation=?, graduate_primary=?, graduate_secondary=?, graduate_tertiary=?, working_on_farm=?, working_off_farm=?, agent_id=?, modified_date=?, modified_by=?, gender=?, read_write=?, schooling=?, sync=0 WHERE id_household=?', data).then(_ => {
      this.getHousehold(id_household);
    });
  }

  saveHouseholdAvatar(id_household, avatar) {
    return this.database.executeSql('UPDATE contact_household SET avatar=? WHERE id_household=?', [avatar, id_household]).then(_ => {
      this.getHousehold(id_household);
    });
  }

  saveHouseholdAvatarPath(id_household, avatar_path) {
    return this.database.executeSql('UPDATE contact_household SET avatar_path=? WHERE id_household=?', [avatar_path, id_household]);
  }

  deleteHousehold(id_household) {
    return this.database.executeSql('DELETE FROM contact_household WHERE id_household=?', [id_household]);
  }

  // Projects

  getProjects(): Observable<any[]> {
    return this.projects.asObservable();
  }

  deleteProjects() {
    return this.database.executeSql('DELETE FROM projects', []);
  }

  loadProjects(agent_id) {
    return this.database.executeSql('SELECT * FROM projects WHERE agent_id=?', [agent_id]).then(data => {
      let projectList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          projectList.push({
            id_project: data.rows.item(i).id_project,
            project_name: data.rows.item(i).project_name,
            project_type: data.rows.item(i).project_type,
            project_type_name: data.rows.item(i).project_type_name,
            start_date: data.rows.item(i).start_date,
            due_date: data.rows.item(i).due_date,
            project_status: data.rows.item(i).project_status,
            id_company: data.rows.item(i).id_company,
            company_name: data.rows.item(i).company_name,
            id_culture: data.rows.item(i).id_culture,
            name_culture: data.rows.item(i).name_culture,
            country_id: data.rows.item(i).country_id,
            name_country: data.rows.item(i).name_country,
            region_id: data.rows.item(i).region_id,
            agent_id: data.rows.item(i).agent_id
          });
        }
      }

      this.projects.next(projectList);
    });
  }

  countProject(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM projects', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadCompanyProjects(id_company) {
    return this.database.executeSql('SELECT * FROM projects WHERE id_company=?', [id_company]).then(data => {
      let projectList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          projectList.push({
            id_project: data.rows.item(i).id_project,
            project_name: data.rows.item(i).project_name,
            project_type: data.rows.item(i).project_type,
            project_type_name: data.rows.item(i).project_type_name,
            start_date: data.rows.item(i).start_date,
            due_date: data.rows.item(i).due_date,
            project_status: data.rows.item(i).project_status,
            id_company: data.rows.item(i).id_company,
            company_name: data.rows.item(i).company_name,
            id_culture: data.rows.item(i).id_culture,
            name_culture: data.rows.item(i).name_culture,
            country_id: data.rows.item(i).country_id,
            name_country: data.rows.item(i).name_country,
            region_id: data.rows.item(i).region_id,
            agent_id: data.rows.item(i).agent_id
          });
        }
      }

      this.projects.next(projectList);
    });
  }

  loadCooperativeProjects(id_cooperative) {
    return this.database.executeSql('SELECT * FROM projects WHERE id_cooperative=?', [id_cooperative]).then(data => {
      let projectList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          projectList.push({
            id_project: data.rows.item(i).id_project,
            project_name: data.rows.item(i).project_name,
            project_type: data.rows.item(i).project_type,
            project_type_name: data.rows.item(i).project_type_name,
            start_date: data.rows.item(i).start_date,
            due_date: data.rows.item(i).due_date,
            project_status: data.rows.item(i).project_status,
            id_company: data.rows.item(i).id_company,
            company_name: data.rows.item(i).company_name,
            id_culture: data.rows.item(i).id_culture,
            name_culture: data.rows.item(i).name_culture,
            country_id: data.rows.item(i).country_id,
            name_country: data.rows.item(i).name_country,
            region_id: data.rows.item(i).region_id,
            agent_id: data.rows.item(i).agent_id
          });
        }
      }

      this.projects.next(projectList);
    });
  }

  addProject(id_project, project_name, project_type, project_type_name, start_date, due_date, project_status, id_company, company_name, id_culture, name_culture, country_id, name_country, region_id, agent_id, agent_type, id_cooperative) {
    let data = [id_project, project_name, project_type, project_type_name, start_date, due_date, project_status, id_company, company_name, id_culture, name_culture, country_id, name_country, region_id, agent_id, id_cooperative];
    return this.database.executeSql('INSERT INTO projects (id_project, project_name, project_type, project_type_name, start_date, due_date, project_status, id_company, company_name, id_culture, name_culture, country_id, name_country, region_id, agent_id, id_cooperative) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(() => {
      if ((agent_type == 2) || (agent_type == 4)) {
        if (this.id_supchain_company == 331) {
          this.loadCooperativeProjects(id_cooperative);
        } else {
          this.loadCompanyProjects(id_company);
        }

      } else {
        this.loadProjects(agent_id);
      }
    });
  }

  getProject(id_project): Promise<any> {
    return this.database.executeSql('SELECT * FROM projects WHERE id_project = ?', [id_project]).then(data => {
      return {
        id_project: data.rows.item(0).id_project,
        project_name: data.rows.item(0).project_name,
        project_type: data.rows.item(0).project_type,
        project_type_name: data.rows.item(0).project_type_name,
        start_date: data.rows.item(0).start_date,
        due_date: data.rows.item(0).due_date,
        project_status: data.rows.item(0).project_status,
        id_company: data.rows.item(0).id_company,
        company_name: data.rows.item(0).company_name,
        id_culture: data.rows.item(0).id_culture,
        name_culture: data.rows.item(0).name_culture,
        country_id: data.rows.item(0).country_id,
        name_country: data.rows.item(0).name_country,
        region_id: data.rows.item(0).region_id,
        agent_id: data.rows.item(0).agent_id,
        id_cooperative: data.rows.item(0).id_cooperative
      }
    });
  }

  // Project Tasks

  countProjectTask(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM project_tasks', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  deleteProjectTask() {
    return this.database.executeSql('DELETE FROM project_tasks', []);
  }

  getProjectTasks(): Observable<any[]> {
    return this.project_tasks.asObservable();
  }

  loadProjectTasks(agent_id, id_project) {
    return this.database.executeSql('SELECT t.town_id, t.town_name, p.id_task, t.task_delegated_id, t.agent_id, p.project_name, p.id_project FROM towns_tasks t LEFT JOIN project_tasks p ON p.town_id = t.town_id WHERE t.agent_id=? AND t.id_project=?', [agent_id, id_project]).then(data => {
      let projectTasksList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          projectTasksList.push({
            town_id: data.rows.item(i).town_id,
            town_name: data.rows.item(i).town_name,
            id_task: data.rows.item(i).id_task,
            agent_id: data.rows.item(i).agent_id,
            project_name: data.rows.item(i).project_name,
            id_project: data.rows.item(i).id_project,
            task_delegated_id: data.rows.item(i).task_delegated_id
          });
        }
      }

      this.project_tasks.next(projectTasksList);
    });
  }

  loadCompanyProjectTasks(task_delegated_id, id_project) {
    return this.database.executeSql('SELECT t.town_id, t.town_name, p.id_task, t.task_delegated_id, t.agent_id, p.project_name, p.id_project FROM towns_tasks t LEFT JOIN project_tasks p ON p.town_id = t.town_id WHERE t.task_delegated_id=? AND t.id_project=?', [task_delegated_id, id_project]).then(data => {
      let projectTasksList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          projectTasksList.push({
            town_id: data.rows.item(i).town_id,
            town_name: data.rows.item(i).town_name,
            id_task: data.rows.item(i).id_task,
            agent_id: data.rows.item(i).agent_id,
            project_name: data.rows.item(i).project_name,
            id_project: data.rows.item(i).id_project,
            task_delegated_id: data.rows.item(i).task_delegated_id
          });
        }
      }

      this.project_tasks.next(projectTasksList);
    });
  }

  loadCompanyTasks(task_delegated_id) {
    return this.database.executeSql('SELECT t.town_id, t.town_name, p.id_task, t.task_delegated_id, t.agent_id, p.project_name, p.id_project FROM towns_tasks t LEFT JOIN project_tasks p ON p.town_id = t.town_id WHERE t.task_delegated_id=?', [task_delegated_id]).then(data => {
      let projectTasksList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          projectTasksList.push({
            town_id: data.rows.item(i).town_id,
            town_name: data.rows.item(i).town_name,
            id_task: data.rows.item(i).id_task,
            agent_id: data.rows.item(i).agent_id,
            project_name: data.rows.item(i).project_name,
            id_project: data.rows.item(i).id_project,
            task_delegated_id: data.rows.item(i).task_delegated_id
          });
        }
      }

      this.project_tasks.next(projectTasksList);
    });
  }

  loadCooperativeTasks(id_cooperative) {
    return this.database.executeSql('SELECT t.town_id, t.town_name, p.id_task, t.task_delegated_id, t.agent_id, p.project_name, p.id_project FROM towns_tasks t LEFT JOIN project_tasks p ON p.town_id = t.town_id WHERE t.task_delegated_id=?', [id_cooperative]).then(data => {
      let projectTasksList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          projectTasksList.push({
            town_id: data.rows.item(i).town_id,
            town_name: data.rows.item(i).town_name,
            id_task: data.rows.item(i).id_task,
            agent_id: data.rows.item(i).agent_id,
            project_name: data.rows.item(i).project_name,
            id_project: data.rows.item(i).id_project,
            task_delegated_id: data.rows.item(i).task_delegated_id
          });
        }
      }

      this.project_tasks.next(projectTasksList);
    });
  }

  loadTasks(agent_id) {
    return this.database.executeSql('SELECT t.town_id, t.town_name, p.id_task, t.agent_id, p.project_name, p.id_project FROM towns_tasks t LEFT JOIN project_tasks p ON p.town_id = t.town_id WHERE t.agent_id=?', [agent_id]).then(data => {
      let projectTasksList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          projectTasksList.push({
            town_id: data.rows.item(i).town_id,
            town_name: data.rows.item(i).town_name,
            id_task: data.rows.item(i).id_task,
            agent_id: data.rows.item(i).agent_id,
            project_name: data.rows.item(i).project_name,
            id_project: data.rows.item(i).id_project
          });
        }
      }

      this.project_tasks.next(projectTasksList);
    });
  }

  addProjectTask(id_task, task_done, task_type, task_type_name, id_project, project_name, task_titleshort, task_description, start_date, due_date, task_status, task_status_name, task_public, task_public_name, status_name, task_delegated_id, task_delegated_name, agent_id, agent_assist_id, agent_name, tt_farmers, tt_plantation, planned_start_date, planned_end_date, town_id, agent_type, id_cooperative) {
    let data = [id_task, task_done, task_type, task_type_name, id_project, project_name, task_titleshort, task_description, start_date, due_date, task_status, task_status_name, task_public, task_public_name, status_name, task_delegated_id, task_delegated_name, agent_id, agent_assist_id, agent_name, tt_farmers, tt_plantation, planned_start_date, planned_end_date, town_id, id_cooperative];
    return this.database.executeSql('INSERT INTO project_tasks (id_task, task_done, task_type, task_type_name, id_project, project_name, task_titleshort, task_description, start_date, due_date, task_status, task_status_name, task_public, task_public_name, status_name, task_delegated_id, task_delegated_name, agent_id, agent_assist_id, agent_name, tt_farmers, tt_plantation, planned_start_date, planned_end_date, town_id, id_cooperative) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(data => {
      if ((agent_type == 2) || (agent_type == 4)) {
        this.loadCompanyProjectTasks(task_delegated_id, id_project);
      } else {
        this.loadProjectTasks(agent_id, id_project);
      }
    });
  }

  getProjectTask(id_task): Promise<any> {
    return this.database.executeSql('SELECT * FROM project_tasks WHERE id_task = ?', [id_task]).then(data => {
      return {
        id_task: data.rows.item(0).id_task,
        task_done: data.rows.item(0).task_done,
        task_type: data.rows.item(0).task_type,
        task_type_name: data.rows.item(0).task_type_name,
        id_project: data.rows.item(0).id_project,
        project_name: data.rows.item(0).project_name,
        task_titleshort: data.rows.item(0).task_titleshort,
        task_description: data.rows.item(0).task_description,
        start_date: data.rows.item(0).start_date,
        due_date: data.rows.item(0).due_date,
        task_status: data.rows.item(0).task_status,
        task_status_name: data.rows.item(0).task_status_name,
        task_public: data.rows.item(0).task_public,
        task_public_name: data.rows.item(0).task_public_name,
        status_name: data.rows.item(0).status_name,
        task_delegated_id: data.rows.item(0).task_delegated_id,
        task_delegated_name: data.rows.item(0).task_delegated_name,
        agent_id: data.rows.item(0).agent_id,
        agent_assist_id: data.rows.item(0).agent_assist_id,
        agent_name: data.rows.item(0).agent_name,
        tt_farmers: data.rows.item(0).tt_farmers,
        tt_plantation: data.rows.item(0).tt_plantation,
        planned_start_date: data.rows.item(0).planned_start_date,
        planned_end_date: data.rows.item(0).planned_end_date,
        town_id: data.rows.item(0).town_id
      }
    });
  }

  task_nbFarmers(id_task, agent_id) {
    return this.database.executeSql('select count(*) AS tt_farmers from contacts where id_town=( select town_id from project_tasks where id_task=? ) and agent_id=?', [id_task, agent_id]).then(data => {
      return {
        tt_farmers: data.rows.item(0).tt_farmers
      }
    });
  }

  // Towns Tasks

  deleteTownsTask() {
    return this.database.executeSql('DELETE FROM towns_tasks', []);
  }

  addTownsTask(town_id, agent_id, town_name, id_project, task_owner_id, task_delegated_id, agent_type) {
    let data = [town_id, agent_id, town_name, id_project, task_owner_id, task_delegated_id];
    return this.database.executeSql('INSERT INTO towns_tasks (town_id, agent_id, town_name, id_project, task_owner_id, task_delegated_id) VALUES (?, ?, ?, ?, ?, ?)', data).then(data => {
      if ((agent_type == 2) || (agent_type == 4)) {
        this.loadCompanyProjectTasks(task_delegated_id, id_project);
      } else {
        this.loadProjectTasks(agent_id, id_project);
      }
    });
  }

  countTownTask(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM towns_tasks', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  // Plantation Doc

  getPlantationDoc(): Observable<any[]> {
    return this.plantation_doc.asObservable();
  }

  deletePlantationsDoc() {
    return this.database.executeSql('DELETE FROM plantation_docs', []);
  }

  deletePlantationDoc(id_doc, id_plantation) {
    return this.database.executeSql('DELETE FROM plantation_docs WHERE id_doc=?', [id_doc]).then(() => {
      this.loadDocDataPlantation(id_plantation);
    });
  }

  countPlantationDoc(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM plantation_docs', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadDocDataPlantation(id_plantation) {
    return this.database.executeSql('SELECT p.id_doc, p.description, p.cloud_path, p.coordx, p.coordy, p.sync, p.id_plantation, p.doc_date, p.filename, p.doc_type, r.cvalue, r.cvaluefr FROM plantation_docs p LEFT JOIN registervalues r ON p.doc_type = r.id_regvalue WHERE p.id_plantation=? AND p.doc_type NOT IN (654, 655)', [id_plantation]).then(data => {
      let plantation_docList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          let media_path;
          if (data.rows.item(i).doc_type == 155) {
            media_path = '../../assets/video.png';
          } else {
            let filePath = this.file.externalRootDirectory + 'icollect/plantations/' + data.rows.item(i).filename;
            media_path = this.pathForImage(filePath);
          }

          plantation_docList.push({
            id_doc: data.rows.item(i).id_doc,
            id_plantation: data.rows.item(i).id_plantation,
            doc_type: data.rows.item(i).doc_type,
            doc_date: data.rows.item(i).doc_date,
            filename: data.rows.item(i).filename,
            description: data.rows.item(i).description,
            coordx: data.rows.item(i).coordx,
            coordy: data.rows.item(i).coordy,
            cloud_path: data.rows.item(i).cloud_path,
            sync: data.rows.item(i).sync,
            cvalue: cvalue,
            path: media_path
          });
        }
      }

      this.plantation_doc.next(plantation_docList);
    });
  }

  getPlantationPic(id_plnatation, doc_type) {
    return this.database.executeSql('SELECT filename, cloud_path FROM plantation_docs WHERE id_plantation=? AND doc_type=? ORDER BY id_doc DESC LIMIT 1', [id_plnatation, doc_type]).then(data => {
      return {
        filename: data.rows.item(0).filename,
        cloud_path: data.rows.item(0).cloud_path
      }
    });
  }

  addPlantationDoc(id_doc, id_plantation, doc_date, doc_type, cloud_path, coordx, coordy, accuracy, heading, description, sync, agent_id) {
    let data = [id_doc, id_plantation, doc_date, doc_type, cloud_path, coordx, coordy, accuracy, heading, description, sync, agent_id];
    return this.database.executeSql('INSERT INTO plantation_docs (id_doc, id_plantation, doc_date, doc_type, cloud_path, coordx, coordy, accuracy, heading, description, sync, agent_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
  }

  updateCloudLinkPlantationtDoc(cloud_path, id_doc) {
    return this.database.executeSql('UPDATE plantation_docs SET cloud_path=?, sync_id=?, sync=1 WHERE id_doc=?', [cloud_path, id_doc, id_doc]).then(() => {
      this.loadDocDataPlantationSync();
    });
  }

  loadDocDataPlantationSync() {
    return this.database.executeSql('SELECT d.id_doc, d.doc_type, d.cloud_path, d.agent_id, p.code_plantation, d.filename, d.description, d.doc_date, d.sync, d.id_plantation, d.coordx, d.coordy, d.accuracy, d.heading FROM plantation_docs d LEFT JOIN plantation p ON d.id_plantation = p.id_plantation WHERE d.sync != 1 AND d.cloud_path IS NULL', []).then(data => {
      let plantation_docList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          let media_path;
          if (data.rows.item(i).cloud_path != null) {
            media_path = this.pathForImage(data.rows.item(i).cloud_path);
          } else {
            if (data.rows.item(i).doc_type == 155) {
              media_path = '../../assets/video.png';
            } else {
              let filePath = this.file.externalRootDirectory + 'icollect/plantations/' + data.rows.item(i).filename;
              media_path = this.pathForImage(filePath);
            }
          }

          plantation_docList.push({
            id_doc: data.rows.item(i).id_doc,
            code_plantation: data.rows.item(i).code_plantation,
            filename: data.rows.item(i).filename,
            description: data.rows.item(i).description,
            doc_date: data.rows.item(i).doc_date,
            doc_type: data.rows.item(i).doc_type,
            sync: data.rows.item(i).sync,
            id_plantation: data.rows.item(i).id_plantation,
            coordx: data.rows.item(i).coordx,
            coordy: data.rows.item(i).coordy,
            accuracy: data.rows.item(i).accuracy,
            heading: data.rows.item(i).heading,
            agent_id: data.rows.item(i).agent_id,
            cloud_path: data.rows.item(i).cloud_path,
            photo: media_path
          });
        }
      }

      this.plantation_doc.next(plantation_docList);
    });
  }

  getDocDataPlantation(id_doc) {
    return this.database.executeSql('SELECT id_doc, filename, description, doc_date, doc_type, cloud_path FROM plantation_docs WHERE id_doc = ?', [id_doc]).then(data => {
      let filePath;

      if (data.rows.item(0).cloud_path != null) {
        filePath = data.rows.item(0).cloud_path;
      } else {
        filePath = this.file.externalRootDirectory + 'icollect/plantations/' + data.rows.item(0).filename;
      }

      return {
        id_doc: data.rows.item(0).id_doc,
        filename: data.rows.item(0).filename,
        description: data.rows.item(0).description,
        doc_date: data.rows.item(0).doc_date,
        doc_type: data.rows.item(0).doc_type,
        cloud_path: data.rows.item(0).cloud_path,
        path: this.pathForImage(filePath)
      }
    });
  }

  updatePlantationDocData(id_doc, doc_type, description) {
    return this.database.executeSql('UPDATE plantation_docs SET doc_type=?, description=? WHERE id_doc=?', [doc_type, description, id_doc]).then(() => {
      this.getDocDataPlantation(id_doc);
    });
  }

  saveDocDataPlantation(id_plantation, filename, description, doc_type, agent_id) {
    var m = new Date();
    let date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.geolocation.getCurrentPosition().then((resp) => {
          let data = [id_plantation, date, doc_type, filename, resp.coords.latitude, resp.coords.longitude, resp.coords.accuracy, resp.coords.heading, resp.coords.altitude, description, 0, agent_id];

          return this.database.executeSql('INSERT INTO plantation_docs (id_plantation, doc_date, doc_type, filename, coordx, coordy, accuracy, heading, altitude, description, sync, agent_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(_ => {
            this.loadDocDataPlantation(id_plantation);

            this.translate.get('MEDIA_SAVE_SUCCESS').subscribe(value => {
              this.presentAlert(value, 'Success');
            });
          });

        }).catch((error) => {
          this.translate.get('LOCATION_ERROR').subscribe(value => {
            this.presentAlert(value + JSON.stringify(error), 'Error');
          });
        });
      },
      error => console.log(error)
    );
  }

  updateSyncPlantationDoc(sync, id_doc) {
    return this.database.executeSql('UPDATE plantation_docs SET sync=? WHERE id_doc=?', [sync, id_doc]);
  }

  clearPlantationDoc() {
    return this.database.executeSql('DELETE FROM plantation_docs', []).then(() => {
      this.loadDocDataPlantationSync();
    });
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  // Contact Doc

  getContactDoc(): Observable<any[]> {
    return this.contact_doc.asObservable();
  }

  deleteContactDocs() {
    return this.database.executeSql('DELETE FROM contact_docs', []);
  }

  loadDocDataContact(id_contact) {
    return this.database.executeSql('SELECT d.id_doc, c.name, d.doc_type, d.filename, d.cloud_path, d.description, d.doc_date, d.sync, r.cvalue, r.cvaluefr FROM contact_docs d LEFT JOIN contacts c ON d.id_contact = c.id_contact LEFT JOIN registervalues r ON d.doc_type = r.id_regvalue WHERE d.id_contact = ? AND d.doc_type != 654', [id_contact]).then(data => {
      let contact_docList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          contact_docList.push({
            id_doc: data.rows.item(i).id_doc,
            name: data.rows.item(i).name,
            filename: data.rows.item(i).filename,
            description: data.rows.item(i).description,
            doc_date: data.rows.item(i).doc_date,
            cloud_path: data.rows.item(i).cloud_path,
            doc_type: data.rows.item(i).doc_type,
            cvalue: cvalue,
            sync: data.rows.item(i).sync
          });
        }
      }

      this.contact_doc.next(contact_docList);
    });
  }

  loadAllContactDocs() {
    return this.database.executeSql('SELECT d.id_doc, c.name, d.doc_type, d.filename, d.cloud_path, d.description, d.doc_date, d.sync, r.cvalue, r.cvaluefr FROM contact_docs d LEFT JOIN contacts c ON d.id_contact = c.id_contact LEFT JOIN registervalues r ON d.doc_type = r.id_regvalue WHERE d.doc_type != 654', []).then(data => {
      let contact_docList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          contact_docList.push({
            id_doc: data.rows.item(i).id_doc,
            name: data.rows.item(i).name,
            filename: data.rows.item(i).filename,
            description: data.rows.item(i).description,
            doc_date: data.rows.item(i).doc_date,
            cloud_path: data.rows.item(i).cloud_path,
            doc_type: data.rows.item(i).doc_type,
            cvalue: cvalue,
            sync: data.rows.item(i).sync
          });
        }
      }

      this.contact_doc.next(contact_docList);
    });
  }

  countContactDoc(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM contact_docs', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  addContactDoc(id_doc, id_contact, doc_date, doc_type, cloud_path, coordx, coordy, accuracy, heading, description, sync, id_household, agent_id) {
    let data = [id_doc, id_contact, doc_date, doc_type, cloud_path, coordx, coordy, accuracy, heading, description, sync, id_household, agent_id];
    return this.database.executeSql('INSERT INTO contact_docs (id_doc, id_contact, doc_date, doc_type, cloud_path, coordx, coordy, accuracy, heading, description, sync, id_household, agent_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
  }

  loadDocDataContactSync() {
    return this.database.executeSql('SELECT d.id_doc, d.cloud_path, c.name, d.agent_id, d.filename, d.description, d.doc_date, d.doc_type, d.sync, d.id_contact, d.coordx, d.coordy, d.accuracy, d.heading, d.id_household FROM contact_docs d LEFT JOIN contacts c ON d.id_contact = c.id_contact WHERE sync != 1 AND d.cloud_path IS NULL', []).then(data => {
      let contact_docList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var filePath;
          if (data.rows.item(i).cloud_path != null) {
            filePath = data.rows.item(i).cloud_path;
          } else {
            if (data.rows.item(i).description == 'household_avatar') {
              filePath = this.file.externalRootDirectory + 'icollect/household/' + data.rows.item(i).filename;
            } else if (data.rows.item(i).description == 'user_avatar') {
              filePath = this.file.externalRootDirectory + 'icollect/avatar/' + data.rows.item(i).filename;
            } else {
              filePath = this.file.externalRootDirectory + 'icollect/documents/' + data.rows.item(i).filename;
            }
          }

          contact_docList.push({
            id_doc: data.rows.item(i).id_doc,
            name: data.rows.item(i).name,
            filename: data.rows.item(i).filename,
            description: data.rows.item(i).description,
            doc_date: data.rows.item(i).doc_date,
            doc_type: data.rows.item(i).doc_type,
            sync: data.rows.item(i).sync,
            id_contact: data.rows.item(i).id_contact,
            coordx: data.rows.item(i).coordx,
            coordy: data.rows.item(i).coordy,
            accuracy: data.rows.item(i).accuracy,
            heading: data.rows.item(i).heading,
            id_household: data.rows.item(i).id_household,
            agent_id: data.rows.item(i).agent_id,
            cloud_path: data.rows.item(i).cloud_path,
            photo: this.pathForImage(filePath)
          });
        }
      }

      this.contact_doc.next(contact_docList);
    });
  }

  clearContactDoc() {
    return this.database.executeSql('DELETE FROM contact_docs', []).then(() => {
      this.loadDocDataContactSync();
    });
  }

  updateSyncContactDoc(sync, id_doc) {
    return this.database.executeSql('UPDATE contact_docs SET sync=? WHERE id_doc=?', [sync, id_doc]).then(() => {
      this.loadDocDataContactSync();
    });
  }

  updateCloudLinkContactDoc(cloud_path, id_doc) {
    return this.database.executeSql('UPDATE contact_docs SET cloud_path=?, sync_id=?, sync=1 WHERE id_doc=?', [cloud_path, id_doc, id_doc]).then(() => {
      this.loadDocDataContactSync();
    });
  }

  deleteContactDoc(id_doc, id_contact) {
    return this.database.executeSql('DELETE FROM contact_docs WHERE id_doc=?', [id_doc]).then(() => {
      this.loadDocDataContact(id_contact);
    });
  }

  saveDocDataContact(id_contact, filename, description, doc_type, agent_id, id_household) {
    var m = new Date();
    let date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.geolocation.getCurrentPosition().then((resp) => {
          let data = [id_contact, date, doc_type, filename, resp.coords.latitude, resp.coords.longitude, resp.coords.accuracy, resp.coords.heading, resp.coords.altitudeAccuracy, description, 0, id_household, agent_id];

          return this.database.executeSql('INSERT INTO contact_docs (id_contact, doc_date, doc_type, filename, coordx, coordy, accuracy, heading, altitude, description, sync, id_household, agent_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(_ => {
            this.loadDocDataContact(id_contact);

            this.translate.get('DOCUMENT_SAVE_SUCCESS').subscribe(value => {
              this.presentAlert(value, 'Success');
            });
          });

        }).catch((error) => {
          this.translate.get('LOCATION_ERROR').subscribe(value => {
            this.presentAlert(value + JSON.stringify(error), 'Error');
          });
        });
      },
      error => console.log(error)
    );
  }

  updateContactDocData(id_doc, doc_type, description) {
    return this.database.executeSql('UPDATE contact_docs SET doc_type=?, description=? WHERE id_doc=?', [doc_type, description, id_doc]).then(() => {
      this.getDocDataContact(id_doc);
    });
  }

  getDocDataContact(id_doc) {
    return this.database.executeSql('SELECT id_doc, filename, description, doc_date, doc_type, cloud_path FROM contact_docs WHERE id_doc = ?', [id_doc]).then(data => {
      let filePath;

      if (data.rows.item(0).cloud_path != null) {
        filePath = data.rows.item(0).cloud_path;
      } else {
        filePath = this.file.externalRootDirectory + 'icollect/documents/' + data.rows.item(0).filename;
      }

      return {
        id_doc: data.rows.item(0).id_doc,
        filename: data.rows.item(0).filename,
        description: data.rows.item(0).description,
        doc_date: data.rows.item(0).doc_date,
        doc_type: data.rows.item(0).doc_type,
        cloud_path: data.rows.item(0).cloud_path,
        path: this.pathForImage(filePath)
      }
    });
  }

  getContactSignature(id_contact, doc_type) {
    return this.database.executeSql('SELECT id_doc, filename, description, doc_date, doc_type FROM contact_docs WHERE id_contact = ? AND doc_type = ? ORDER BY id_doc DESC LIMIt 1', [id_contact, doc_type]).then(data => {
      return {
        id_doc: data.rows.item(0).id_doc,
        filename: data.rows.item(0).filename,
        description: data.rows.item(0).description,
        doc_date: data.rows.item(0).doc_date,
        doc_type: data.rows.item(0).doc_type
      }
    });
  }

  // Ticker

  getTickerNotSync(): Observable<any[]> {
    return this.ticker_data.asObservable();
  }

  loadTickerData() {
    return this.database.executeSql('SELECT * FROM mobcrmticker WHERE sync = 0 AND field_value IS NOT NULL order by ticker_time DESC', []).then(data => {
      let ticker_dataList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          ticker_dataList.push({
            id_mobconticker: data.rows.item(i).id_mobconticker,
            agent_id: data.rows.item(i).agent_id,
            plantation_id: data.rows.item(i).plantation_id,
            plantationsite_id: data.rows.item(i).plantationsite_id,
            contact_id: data.rows.item(i).contact_id,
            field_name: data.rows.item(i).field_name,
            field_value: data.rows.item(i).field_value,
            field_table: data.rows.item(i).field_table,
            ticker_time: data.rows.item(i).ticker_time,
            coordx: data.rows.item(i).coordx,
            coordy: data.rows.item(i).coordy,
            local_synctable_id: data.rows.item(i).local_synctable_id,
            project_id: data.rows.item(i).project_id,
            task_id: data.rows.item(i).task_id,
            id_household: data.rows.item(i).id_household,
            id_contact_docs: data.rows.item(i).id_contact_docs,
            id_plantation_docs: data.rows.item(i).id_plantation_docs,
            id_equipement: data.rows.item(i).id_equipement,
            id_sur_survey_answers: data.rows.item(i).id_sur_survey_answers,
            id_contractor: data.rows.item(i).id_contractor,
            id_infrastructure: data.rows.item(i).id_infrastructure,
            id_suranswer: data.rows.item(i).id_suranswer,
            plant_line_id: data.rows.item(i).plant_line_id,
            id_infrastructure_photo: data.rows.item(i).id_infrastructure_photo
          });
        }
      }

      this.ticker_data.next(ticker_dataList);
    });
  }

  async syncData() {
    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        this.backgroundMode.enable();

        this.loadTickerData().then(_ => {
          this.getTickerNotSync().subscribe(data => {
            data.forEach(value => {
              var link = 'https://idiscover.ch/api/restifydb/postgres_dev/mobcrmticker/';
              var myData = JSON.stringify({
                id_contact: value.contact_id,
                field_name: value.field_name,
                field_value: value.field_value,
                field_table: value.field_table,
                ticker_time: value.ticker_time,
                coordx: value.coordx,
                coordy: value.coordy,
                id_agent: value.agent_id,
                id_plantation: value.plantation_id,
                id_plantationsite: value.plantationsite_id,
                local_synctable_id: value.local_synctable_id,
                id_project: value.project_id,
                id_task: value.task_id,
                sync: 1,
                id_household: value.id_household,
                id_contact_docs: value.id_contact_docs,
                id_plantation_docs: value.id_plantation_docs,
                id_equipment: value.id_equipement,
                id_sur_survey_answers: value.id_sur_survey_answers,
                id_contractor: value.id_contractor,
                id_infrastructure: value.id_infrastructure,
                id_suranswer: value.id_suranswer,
                plant_line_id: value.plant_line_id,
                id_infrastructure_photo: value.id_infrastructure_photo
              });
              var donnee = encodeURI('_data=' + myData);

              this.http.setDataSerializer('utf8');
              this.http.post(link, donnee, { "Content-Type": "application/x-www-form-urlencoded" })
                .then(() => {
                  this.cache.clearAll();
                  this.updateTicker(value.id_mobconticker);

                }).catch((error) => {
                  console.error('API Error : ', error.status);
                  console.error('API Error : ', JSON.stringify(error));
                });
            });
          });
        });
      }
    });
  }

  addTicker(agent_id, plantation_id, plantationsite_id, contact_id, field_name, field_value, field_table, ticker_time, coordx, coordy, local_synctable_id, project_id, task_id, id_household, id_contact_docs, id_plantation_docs, id_equipement, id_sur_survey_answers, id_contractor, id_infrastructure, id_suranswer, plant_line_id, id_infrastructure_photo) {
    let data = [agent_id, plantation_id, plantationsite_id, contact_id, field_name, field_value, field_table, ticker_time, coordx, coordy, local_synctable_id, project_id, task_id, 0, id_household, id_contact_docs, id_plantation_docs, id_equipement, id_sur_survey_answers, id_contractor, id_infrastructure, id_suranswer, plant_line_id, id_infrastructure_photo];
    return this.database.executeSql('INSERT INTO mobcrmticker (agent_id, plantation_id, plantationsite_id, contact_id, field_name, field_value, field_table, ticker_time, coordx, coordy, local_synctable_id, project_id, task_id, sync, id_household, id_contact_docs, id_plantation_docs, id_equipement, id_sur_survey_answers, id_contractor, id_infrastructure, id_suranswer, plant_line_id, id_infrastructure_photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
      .then(() => {
        /*setTimeout(() => {
          this.syncData();
        }, 3000);*/
      });
  }

  deleteHouseholdTicker(id_household) {
    return this.database.executeSql('DELETE FROM mobcrmticker WHERE id_household=?', [id_household]).then(() => {
      this.loadTickerData();
    });
  }

  clearTicker() {
    return this.database.executeSql('DELETE FROM mobcrmticker', []).then(() => {
      this.loadTickerData();
    });
  }

  async updateTicker(id_mobconticker) {
    return this.database.executeSql('UPDATE mobcrmticker SET sync = 1 WHERE id_mobconticker=?', [id_mobconticker]).then(() => {
      this.loadTickerData();
    });
  }

  tickerAsSunc() {
    return this.database.executeSql('UPDATE mobcrmticker SET sync = 1', []).then(()  => {
      this.loadTickerData();
    });
  }

  // Data

  addData(data_type, data_date, data_download, data_upload, total_rows) {
    let data = [data_type, data_date, data_download, data_upload, total_rows];
    return this.database.executeSql('INSERT INTO data (data_type, data_date, data_download, data_upload, total_rows) VALUES (?, ?, ?, ?, ?)', data);
  }

  loadRegisterData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type='registervalue' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  loadSurvey_answersData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type='sur_answers' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  loadSurvey_UserAnswersData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type='sur_survey_answers' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  loadSurvey_templateData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type='sur_template' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  loadTownData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type='towns' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  loadSurvey_questionData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type='sur_questions' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  loadContactDocData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type='contact_docs' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  loadContactHouseholdData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type='contact_household' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  lastContactData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='contacts' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  loadLocationPictureData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='location_pictures' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  loadLocationData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='locations' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  loadPathsData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='paths' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  lastPlantationData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='plantations' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  loadPlantationDocData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='plantation_docs' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  loadProjectData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='projects' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  loadTownTasktData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='town_tasks' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  loadProjecTasktData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='project_tasks' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  lastBackupData(): Promise<any> {
    return this.database.executeSql("SELECT id_data, data_type, data_date, data_download, data_upload FROM data WHERE data_type ='backup' AND data_upload=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        id_data: data.rows.item(0).id_data,
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        data_download: data.rows.item(0).data_download,
        data_upload: data.rows.item(0).data_upload
      }
    });
  }

  lastAVATARdownloadData(): Promise<any> {
    return this.database.executeSql("SELECT id_data, data_type, data_date, data_download, data_upload FROM data WHERE data_type ='avatar' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        id_data: data.rows.item(0).id_data,
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        data_download: data.rows.item(0).data_download,
        data_upload: data.rows.item(0).data_upload
      }
    });
  }

  // Paths

  getPaths(): Observable<any[]> {
    return this.paths.asObservable();
  }

  deletePaths() {
    return this.database.executeSql('DELETE FROM paths', []);
  }

  loadPaths(agent_id) {
    return this.database.executeSql('SELECT * FROM paths WHERE id_agent=?', [agent_id]).then(data => {
      let pathList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          pathList.push({
            id_path: data.rows.item(i).id_path,
            path_name: data.rows.item(i).path_name,
            plantation_id: data.rows.item(i).plantation_id,
            id_region: data.rows.item(i).id_region,
            path_json: data.rows.item(i).path_json,
            id_agent: data.rows.item(i).id_agent,
            created_date: data.rows.item(i).created_date,
            sync: data.rows.item(i).sync
          });
        }
      }

      this.paths.next(pathList);
    });
  }

  countLocationPaths(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM paths', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadPlantationPaths(plantation_id) {
    return this.database.executeSql('SELECT * FROM paths WHERE plantation_id=?', [plantation_id]).then(data => {
      return {
        id_path: data.rows.item(0).id_path,
        path_name: data.rows.item(0).path_name,
        plantation_id: data.rows.item(0).plantation_id,
        id_region: data.rows.item(0).id_region,
        path_json: data.rows.item(0).path_json,
        id_agent: data.rows.item(0).id_agent,
        created_date: data.rows.item(0).created_date,
        sync: data.rows.item(0).sync
      }
    });
  }

  addPath(id_path, path_name, plantation_id, id_region, path_json, id_agent, created_date, sync, id_company, id_contact) {
    let data = [id_path, path_name, plantation_id, id_region, JSON.stringify(path_json), id_agent, created_date, sync, id_company, id_contact];
    return this.database.executeSql('INSERT INTO paths (id_path, path_name, plantation_id, id_region, path_json, id_agent, created_date, sync, id_company, id_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(_ => {
      this.loadPaths(id_agent);
    });
  }

  updatePath(id_path, path_name, plantation_id, id_region, path_json, id_agent, created_date, sync) {
    let data = [id_path, path_name, plantation_id, id_region, JSON.stringify(path_json), id_agent, created_date, sync];
    return this.database.executeSql('UPDATE paths SET path_name=?, plantation_id=?, id_region=?, path_json=?, id_agent=?, created_date=?, sync=? WHERE id_path=?', data).then(_ => {
      this.loadPaths(id_agent);
    });
  }

  getLastPathId() {
    return this.database.executeSql('SELECT id_path FROM paths ORDER BY id_path DESC LIMIT 1', []).then(data => {
      return { id_path: data.rows.item(0).id_path }
    });
  }

  getPath(id_path): Promise<any> {
    return this.database.executeSql('SELECT * FROM paths WHERE id_path = ?', [id_path]).then(data => {
      return {
        id_path: data.rows.item(0).id_path,
        path_name: data.rows.item(0).path_name,
        plantation_id: data.rows.item(0).plantation_id,
        id_region: data.rows.item(0).id_region,
        path_json: data.rows.item(0).path_json,
        id_agent: data.rows.item(0).id_agent,
        created_date: data.rows.item(0).created_date,
        sync: data.rows.item(0).sync
      }
    });
  }

  // Plantations

  getPlantations(): Observable<any[]> {
    return this.plantations.asObservable();
  }

  deletePlantations() {
    return this.database.executeSql('DELETE FROM plantation', []);
  }

  loadPlantations(agent_id, agent_type, id_contact) {

    let query;
    if (agent_type == 1) {
      query = 'SELECT p.id_plantation, p.dc_completed, p.id_contact, p.surface_ha, p.area, p.area_acres, c.town_name, p.code_plantation, p.id_culture, r.id_regvalue, r.cvaluefr, r.cvalue, p.id_manager, p.owner_manager FROM plantation p LEFT JOIN contacts c ON p.id_contact = c.id_contact LEFT JOIN registervalues r ON p.id_culture1 = r.id_regvalue WHERE c.id_town in ( SELECT DISTINCT town_id FROM towns_tasks WHERE agent_id=' + agent_id + ') AND p.id_contact =' + id_contact;
    } else {
      query = 'SELECT p.id_plantation, p.dc_completed, p.id_contact, p.surface_ha, p.area, p.area_acres, c.town_name, p.code_plantation, p.id_culture, r.id_regvalue, r.cvaluefr, r.cvalue, p.id_manager, p.owner_manager FROM plantation p LEFT JOIN contacts c ON p.id_contact = c.id_contact LEFT JOIN registervalues r ON p.id_culture1 = r.id_regvalue WHERE p.id_contact =' + id_contact;
    }

    return this.database.executeSql(query, []).then(data => {
      let plantationsList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          plantationsList.push({
            id_plantation: data.rows.item(i).id_plantation,
            dc_completed: data.rows.item(i).dc_completed,
            id_contact: data.rows.item(i).id_contact,
            surface_ha: data.rows.item(i).surface_ha,
            area: data.rows.item(i).area,
            area_acres: data.rows.item(i).area_acres,
            surface_ha_round: Math.round(data.rows.item(i).surface_ha * 100) / 100,
            area_round: Math.round(data.rows.item(i).area * 100) / 100,
            area_acres_round: Math.round(data.rows.item(i).area_acres * 100) / 100,
            town_name: data.rows.item(i).town_name,
            code_plantation: data.rows.item(i).code_plantation,
            id_manager: data.rows.item(i).id_manager,
            owner_manager: data.rows.item(i).owner_manager,
            culture: cvalue
          });
        }
      }

      this.plantations.next(plantationsList);
    });
  }

  countPlantation(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM plantation', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadFieldPlantations(id_contact) {
    return this.database.executeSql('SELECT geom_json, coordx, coordy, code_plantation, area_acres, area, id_plantation, mobile_data, id_contact FROM plantation WHERE id_contact = ?', [id_contact]).then(data => {
      let plantationsList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          plantationsList.push({
            id_plantation: data.rows.item(i).id_plantation,
            geom_json: data.rows.item(i).geom_json,
            coordx: data.rows.item(i).coordx,
            coordy: data.rows.item(i).coordy,
            code_plantation: data.rows.item(i).code_plantation,
            area_acres: data.rows.item(i).area_acres,
            area_acres_round: Math.round(data.rows.item(i).area_acres * 100) / 100,
            area_round: Math.round(data.rows.item(i).area * 100) / 100,
            mobile_data: data.rows.item(i).mobile_data,
            id_contact: data.rows.item(i).id_contact
          });
        }
      }

      this.plantations.next(plantationsList);
    });
  }

  getNewPlantationId(id_contact) {
    return this.database.executeSql('SELECT count(*) as number_of_plantation, plantationsite_id from plantation where id_contact=?', [id_contact]).then(data => {

      let number_of_plantation: number = data.rows.item(0).number_of_plantation;
      var new_id = id_contact + 100000 + number_of_plantation;

      return {
        new_id: new_id,
        plantationsite_id: data.rows.item(0).plantationsite_id,
        number_of_plantation: data.rows.item(0).number_of_plantation
      }
    });
  }

  savePlantationManagerID(id_manager, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET id_manager=? WHERE id_plantation=?', [id_manager, id_plantation]);
  }

  saveCollectionPoint(coordx, coordy, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET coordx=?, coordy=? WHERE id_plantation=?', [coordx, coordy, id_plantation]);
  }

  savePlantationPolygon(geom_json, area_acres, area, surface_ha, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET geom_json=?, area_acres=?, area=?, surface_ha=?, mobile_data=1 WHERE id_plantation=?', [JSON.stringify(geom_json), area_acres, area, surface_ha, id_plantation]);
  }

  savePlantationStorageCoords(storage_coordx, storage_coordy, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET storage_coordx=?, storage_coordy=? WHERE id_plantation=?', [storage_coordx, storage_coordy, id_plantation]);
  }

  createPlantation(id_plantation, plantationsite_id, id_contact, code_plantation, id_culture, id_contractor, agent_id, agent_type, code_farmer) {
    let data = [id_plantation, plantationsite_id, id_contact, code_plantation, id_culture, id_contractor, agent_id, code_farmer];
    return this.database.executeSql('INSERT INTO plantation (id_plantation, plantationsite_id, id_contact, code_plantation, id_culture1, id_contractor, agent_id, code_farmer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', data).then(_ => {
      this.loadPlantations(agent_id, agent_type, id_contact);
    })
  }

  addPlantation(id_plantation, plantationsite_id, id_contact, id_town, name_town, property, coordx, coordy, geom_json, year_creation, title_deed, notes, area_acres, surface_ha, area, code_plantation, checked_out, checked_out_by, checked_out_date, id_culture, id_culture1, id_culture2, id_culture3, id_culture4, bio, bio_suisse, perimeter, variety, eco_river, eco_shallows, eco_wells, name_manager, manager_phone, seed_type, dc_completed, inactive, inactive_date, id_contractor, agent_id, numb_feet, mobile_data, globalgap, rspo, synthetic_fertilizer, synthetic_fertilizer_photo, synthetic_herbicides, synthetic_herbicides_photo, synthetic_pesticide, synthetic_pesticide_photo, adjoining_cultures, intercropping, harvest, forest, sewage, waste, rating, manager_civil, number_staff_permanent, number_staff_temporary, yield_estimate, storage_coordx, storage_coordy, storage_photo, area_estimate_ha, fire, owner_manager, id_manager, code_farmer, fair_trade, pest, irrigation, drainage, slope, slope_text, extension, year_extension, replanting, year_to_replant, lands_rights_conflict, lands_rights_conflict_note, road_access, farmer_experience, farmer_experience_level, day_worker_pay, gender_workers, migrant_workers, children_work) {
    let data = [id_plantation, plantationsite_id, id_contact, id_town, name_town, property, coordx, coordy, geom_json, year_creation, title_deed, notes, area_acres, surface_ha, area, code_plantation, checked_out, checked_out_by, checked_out_date, id_culture, id_culture1, id_culture2, id_culture3, id_culture4, bio, bio_suisse, perimeter, variety, eco_river, eco_shallows, eco_wells, name_manager, manager_phone, seed_type, dc_completed, inactive, inactive_date, id_contractor, agent_id, numb_feet, mobile_data, globalgap, rspo, synthetic_fertilizer, synthetic_fertilizer_photo, synthetic_herbicides, synthetic_herbicides_photo, synthetic_pesticide, synthetic_pesticide_photo, adjoining_cultures, intercropping, harvest, forest, sewage, waste, rating, manager_civil, number_staff_permanent, number_staff_temporary, yield_estimate, storage_coordx, storage_coordy, storage_photo, area_estimate_ha, fire, owner_manager, id_manager, code_farmer, fair_trade, pest, irrigation, drainage, slope, slope_text, extension, year_extension, replanting, year_to_replant, lands_rights_conflict, lands_rights_conflict_note, road_access, farmer_experience, farmer_experience_level, day_worker_pay, gender_workers, migrant_workers, children_work];
    return this.database.executeSql('INSERT INTO plantation (id_plantation, plantationsite_id, id_contact, id_town, name_town, property, coordx, coordy, geom_json, year_creation, title_deed, notes, area_acres, surface_ha, area, code_plantation, checked_out, checked_out_by, checked_out_date, id_culture, id_culture1, id_culture2, id_culture3, id_culture4, bio, bio_suisse, perimeter, variety, eco_river, eco_shallows, eco_wells, name_manager, manager_phone, seed_type, dc_completed, inactive, inactive_date, id_contractor, agent_id, numb_feet, mobile_data, globalgap, rspo, synthetic_fertilizer, synthetic_fertilizer_photo, synthetic_herbicides, synthetic_herbicides_photo, synthetic_pesticide, synthetic_pesticide_photo, adjoining_cultures, intercropping, harvest, forest, sewage, waste, rating, manager_civil, number_staff_permanent, number_staff_temporary, yield_estimate, storage_coordx, storage_coordy, storage_photo, area_estimate_ha, fire, owner_manager, id_manager, code_farmer, fair_trade, pest, irrigation, drainage, slope, slope_text, extension, year_extension, replanting, year_to_replant, lands_rights_conflict, lands_rights_conflict_note, road_access, farmer_experience, farmer_experience_level, day_worker_pay, gender_workers, migrant_workers, children_work) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
  }

  getPlantation(id_plantation): Promise<any> {
    return this.database.executeSql('SELECT * FROM plantation WHERE id_plantation = ?', [id_plantation]).then(data => {
      return {
        id_plantation: data.rows.item(0).id_plantation,
        plantationsite_id: data.rows.item(0).plantationsite_id,
        id_contact: data.rows.item(0).id_contact,
        id_town: data.rows.item(0).id_town,
        name_town: data.rows.item(0).name_town,
        property: data.rows.item(0).property,
        coordx: data.rows.item(0).coordx,
        coordy: data.rows.item(0).coordy,
        geom_json: data.rows.item(0).geom_json,
        year_creation: data.rows.item(0).year_creation,
        title_deed: data.rows.item(0).title_deed,
        notes: data.rows.item(0).notes,
        area_acres: data.rows.item(0).area_acres,
        surface_ha: data.rows.item(0).surface_ha,
        area: data.rows.item(0).area,
        code_plantation: data.rows.item(0).code_plantation,
        checked_out: data.rows.item(0).checked_out,
        checked_out_by: data.rows.item(0).checked_out_by,
        checked_out_date: data.rows.item(0).checked_out_date,
        id_culture: data.rows.item(0).id_culture,
        id_culture1: data.rows.item(0).id_culture1,
        id_culture2: data.rows.item(0).id_culture2,
        id_culture3: data.rows.item(0).id_culture3,
        id_culture4: data.rows.item(0).id_culture4,
        bio: data.rows.item(0).bio,
        bio_suisse: data.rows.item(0).bio_suisse,
        perimeter: data.rows.item(0).perimeter,
        variety: data.rows.item(0).variety,
        eco_river: data.rows.item(0).eco_river,
        eco_shallows: data.rows.item(0).eco_shallows,
        eco_wells: data.rows.item(0).eco_wells,
        manager_firstname: data.rows.item(0).manager_firstname,
        manager_lastname: data.rows.item(0).manager_lastname,
        name_manager: data.rows.item(0).name_manager,
        manager_phone: data.rows.item(0).manager_phone,
        seed_type: data.rows.item(0).seed_type,
        dc_completed: data.rows.item(0).dc_completed,
        inactive: data.rows.item(0).inactive,
        inactive_date: data.rows.item(0).inactive_date,
        id_contractor: data.rows.item(0).id_contractor,
        agent_id: data.rows.item(0).agent_id,
        numb_feet: data.rows.item(0).numb_feet,
        mobile_data: data.rows.item(0).mobile_data,
        globalgap: data.rows.item(0).globalgap,
        rspo: data.rows.item(0).rspo,
        synthetic_fertilizer: data.rows.item(0).synthetic_fertilizer,
        synthetic_herbicides: data.rows.item(0).synthetic_herbicides,
        synthetic_pesticide: data.rows.item(0).synthetic_pesticide,
        adjoining_cultures: data.rows.item(0).adjoining_cultures,
        intercropping: data.rows.item(0).intercropping,
        harvest: data.rows.item(0).harvest,
        forest: data.rows.item(0).forest,
        fire: data.rows.item(0).fire,
        waste: data.rows.item(0).waste,
        rating: data.rows.item(0).rating,
        manager_civil: data.rows.item(0).manager_civil,
        number_staff_permanent: data.rows.item(0).number_staff_permanent,
        number_staff_temporary: data.rows.item(0).number_staff_temporary,
        yield_estimate: data.rows.item(0).yield_estimate,
        storage_coordx: data.rows.item(0).storage_coordx,
        storage_coordy: data.rows.item(0).storage_coordy,
        synthetic_pesticide_photo: data.rows.item(0).synthetic_pesticide_photo,
        synthetic_herbicides_photo: data.rows.item(0).synthetic_herbicides_photo,
        synthetic_fertilizer_photo: data.rows.item(0).synthetic_fertilizer_photo,
        adj_cultures_photo: data.rows.item(0).adj_cultures_photo,
        storage_photo: data.rows.item(0).storage_photo,
        fire_photo: data.rows.item(0).fire_photo,
        forest_photo: data.rows.item(0).forest_photo,
        waste_photo: data.rows.item(0).waste_photo,
        river_photo: data.rows.item(0).river_photo,
        shallows_photo: data.rows.item(0).shallows_photo,
        wells_photo: data.rows.item(0).wells_photo,
        bufferzone_photo: data.rows.item(0).bufferzone_photo,
        title_deed_photo: data.rows.item(0).title_deed_photo,
        owner_manager: data.rows.item(0).owner_manager,
        id_manager: data.rows.item(0).id_manager,
        code_farmer: data.rows.item(0).code_farmer,
        fair_trade: data.rows.item(0).fair_trade,

        pest: data.rows.item(0).pest,
        irrigation: data.rows.item(0).irrigation,
        drainage: data.rows.item(0).drainage,
        slope: data.rows.item(0).slope,
        slope_text: data.rows.item(0).slope_text,
        extension: data.rows.item(0).extension,
        year_extension: data.rows.item(0).year_extension,
        replanting: data.rows.item(0).replanting,
        year_to_replant: data.rows.item(0).year_to_replant,
        lands_rights_conflict: data.rows.item(0).lands_rights_conflict,
        lands_rights_conflict_note: data.rows.item(0).lands_rights_conflict_note,
        road_access: data.rows.item(0).road_access,
        farmer_experience: data.rows.item(0).farmer_experience,
        farmer_experience_level: data.rows.item(0).farmer_experience_level,
        day_worker_pay: data.rows.item(0).day_worker_pay,
        gender_workers: data.rows.item(0).gender_workers,
        migrant_workers: data.rows.item(0).migrant_workers,
        children_work: data.rows.item(0).children_work
      }
    });
  }

  updatePlantationtData(code_plantation, year_creation, title_deed, property, notes, area_acres, area, id_culture, bio, bio_suisse, perimeter, variety, eco_river, eco_shallows, eco_wells, manager_firstname, manager_lastname, name_manager, manager_phone, seed_type, dc_completed, inactive, numb_feet, id_plantation, globalgap, rspo, synthetic_fertilizer, synthetic_herbicides, synthetic_pesticide, adjoining_cultures, intercropping, harvest, forest, fire, waste, rating, manager_civil, number_staff_permanent, number_staff_temporary, yield_estimate, name_town, owner_manager, code_farmer, fair_trade, pest, irrigation, drainage, slope, slope_text, extension, year_extension, replanting, year_to_replant, lands_rights_conflict, lands_rights_conflict_note, road_access, farmer_experience, farmer_experience_level, day_worker_pay, gender_workers, migrant_workers, children_work) {
    let data = [code_plantation, year_creation, title_deed, property, notes, area_acres, area, id_culture, bio, bio_suisse, perimeter, variety, eco_river, eco_shallows, eco_wells, manager_firstname, manager_lastname, name_manager, manager_phone, seed_type, dc_completed, inactive, numb_feet, globalgap, rspo, synthetic_fertilizer, synthetic_herbicides, synthetic_pesticide, adjoining_cultures, intercropping, harvest, forest, fire, waste, rating, manager_civil, number_staff_permanent, number_staff_temporary, yield_estimate, name_town, owner_manager, code_farmer, fair_trade, pest, irrigation, drainage, slope, slope_text, extension, year_extension, replanting, year_to_replant, lands_rights_conflict, lands_rights_conflict_note, road_access, farmer_experience, farmer_experience_level, day_worker_pay, gender_workers, migrant_workers, children_work, id_plantation];
    return this.database.executeSql('UPDATE plantation SET code_plantation=?, year_creation=?, title_deed=?, property=?, notes=?, area_acres=?, area=?, id_culture1=?, bio=?, bio_suisse=?, perimeter=?, variety=?, eco_river=?, eco_shallows=?, eco_wells=?, manager_firstname=?, manager_lastname=?, name_manager=?,  manager_phone=?, seed_type=?, dc_completed=?, inactive=?, numb_feet=?, globalgap=?, rspo=?, synthetic_fertilizer=?, synthetic_herbicides=?, synthetic_pesticide=?, adjoining_cultures=?, intercropping=?, harvest=?, forest=?, fire=?, waste=?, rating=?, manager_civil=?, number_staff_permanent=?, number_staff_temporary=?, yield_estimate=?, name_town=?, owner_manager=?, code_farmer=?, fair_trade=?, pest=?, irrigation=?, drainage=?, slope=?, slope_text=?, extension=?, year_extension=?, replanting=?, year_to_replant=?, lands_rights_conflict=?, lands_rights_conflict_note=?, road_access=?, farmer_experience=?, farmer_experience_level=?, day_worker_pay=?, gender_workers=?, migrant_workers=?, children_work=? WHERE id_plantation=?', data).then(() => {
      this.getPlantation(id_plantation);
    });
  }

  savePlantation_storage_photo(storage_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET storage_photo=? WHERE id_plantation=?', [storage_photo, id_plantation]);
  }

  savePlantation_waste_photo(waste_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET waste_photo=? WHERE id_plantation=?', [waste_photo, id_plantation]);
  }

  savePlantation_fire_photo(fire_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET fire_photo=? WHERE id_plantation=?', [fire_photo, id_plantation]);
  }

  savePlantation_forest_photo(forest_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET forest_photo=? WHERE id_plantation=?', [forest_photo, id_plantation]);
  }

  savePlantation_adj_cultures_photo(adj_cultures_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET adj_cultures_photo=? WHERE id_plantation=?', [adj_cultures_photo, id_plantation]);
  }

  savePlantation_synt_pesticide_photo(synthetic_pesticide_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET synthetic_pesticide_photo=? WHERE id_plantation=?', [synthetic_pesticide_photo, id_plantation]);
  }

  savePlantation_synt_herbicides_photo(synthetic_herbicides_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET synthetic_herbicides_photo=? WHERE id_plantation=?', [synthetic_herbicides_photo, id_plantation]);
  }

  savePlantation_synt_fertilizer_photo(synthetic_fertilizer_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET synthetic_fertilizer_photo=? WHERE id_plantation=?', [synthetic_fertilizer_photo, id_plantation]);
  }

  savePlantation_river_photo(river_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET river_photo=? WHERE id_plantation=?', [river_photo, id_plantation]);
  }

  savePlantation_shallows_photo(shallows_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET shallows_photo=? WHERE id_plantation=?', [shallows_photo, id_plantation]);
  }

  savePlantation_wells_photo(wells_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET wells_photo=? WHERE id_plantation=?', [wells_photo, id_plantation]);
  }

  savePlantation_bufferzone_photo(bufferzone_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET bufferzone_photo=? WHERE id_plantation=?', [bufferzone_photo, id_plantation]);
  }

  savePlantation_title_deed_photo(title_deed_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET title_deed_photo=? WHERE id_plantation=?', [title_deed_photo, id_plantation]);
  }

  savePlantation_extension_photo(extension_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET extension_photo=? WHERE id_plantation=?', [extension_photo, id_plantation]);
  }

  savePlantation_road_access_photo(road_access_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET road_access_photo=? WHERE id_plantation=?', [road_access_photo, id_plantation]);
  }

  savePlantation_irrigation_photo(irrigation_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET irrigation_photo=? WHERE id_plantation=?', [irrigation_photo, id_plantation]);
  }

  savePlantation_drainage_photo(drainage_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET drainage_photo=? WHERE id_plantation=?', [drainage_photo, id_plantation]);
  }

  savePlantation_slope_photo(slope_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET slope_photo=? WHERE id_plantation=?', [slope_photo, id_plantation]);
  }

  savePlantation_replanting_photo(replanting_photo, id_plantation) {
    return this.database.executeSql('UPDATE plantation SET replanting_photo=? WHERE id_plantation=?', [replanting_photo, id_plantation]);
  }

  // Location picture

  getLocationPictures(): Observable<any[]> {
    return this.location_pic.asObservable();
  }

  deleteLocationPictures() {
    return this.database.executeSql('DELETE FROM location_pictures', []);
  }

  addLocationPicture(id_location, picture_name, date, agent_id, coordx, coordy, sync, accuracy, heading, altitude, description, cloud_path, sync_id, id_cooperative, id_contractor) {
    let data = [id_location, picture_name, date, agent_id, coordx, coordy, sync, accuracy, heading, altitude, description, cloud_path, sync_id, id_cooperative, id_contractor];
    return this.database.executeSql('INSERT INTO location_pictures (id_location, picture_name, date, agent_id, coordx, coordy, sync, accuracy, heading, altitude, description, cloud_path, sync_id, id_cooperative, id_contractor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(_ => {
      this.loadLocationPictures(id_location);
    });
  }

  countLocationPicture(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM location_pictures', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadLocationPictures(id_location) {
    return this.database.executeSql('SELECT id_pic, id_location, picture_name, date, description, cloud_path FROM location_pictures WHERE id_location =?', [id_location]).then(data => {
      let location_picList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          location_picList.push({
            id_pic: data.rows.item(i).id_pic,
            id_location: data.rows.item(i).id_location,
            picture_name: data.rows.item(i).picture_name,
            date: data.rows.item(i).date,
            description: data.rows.item(i).description,
            cloud_path: data.rows.item(i).cloud_path
          });
        }
      }

      this.location_pic.next(location_picList);
    });
  }

  saveEditedLocationPicture(id_pic, description, id_location) {
    return this.database.executeSql('UPDATE location_pictures SET description=? WHERE id_pic=?', [description, id_pic]).then(() => {
      this.loadLocationPictures(id_location);
    });
  }

  loadPicturesLocationSync() {
    return this.database.executeSql('SELECT p.id_pic, l.location_type, p.cloud_path, p.sync_id, p.agent_id, p.picture_name, p.description, p.date, p.sync, p.id_location, p.coordx, p.coordy, p.accuracy, p.heading, p.id_cooperative, p.id_contractor FROM location_pictures p LEFT JOIN locations l ON p.id_location = l.id_location WHERE p.sync < 1', []).then(data => {
      let location_picList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          var media_path;
          if (data.rows.item(i).cloud_path != null) {
            media_path = this.pathForImage(data.rows.item(i).cloud_path);
          } else {
            if (data.rows.item(i).picture_name != null) {
              media_path = this.pathForImage(this.file.externalRootDirectory + 'icollect/locations/' + data.rows.item(i).picture_name);
            } else {
              media_path = '../../assets/not_found.jpg';
            }
          }

          location_picList.push({
            id_pic: data.rows.item(i).id_pic,
            picture_name: data.rows.item(i).picture_name,
            description: data.rows.item(i).description,
            date: data.rows.item(i).date,
            doc_type: data.rows.item(i).location_type,
            sync: data.rows.item(i).sync,
            id_location: data.rows.item(i).id_location,
            coordx: data.rows.item(i).coordx,
            coordy: data.rows.item(i).coordy,
            accuracy: data.rows.item(i).accuracy,
            heading: data.rows.item(i).heading,
            agent_id: data.rows.item(i).agent_id,
            cloud_path: data.rows.item(i).cloud_path,
            sync_id: data.rows.item(i).sync_id,
            id_cooperative: data.rows.item(i).id_cooperative,
            id_contractor: data.rows.item(i).id_contractor,
            photo: media_path
          });
        }
      }

      this.location_pic.next(location_picList);
    });
  }

  updateSyncLocationPics(sync, id_pic) {
    return this.database.executeSql('UPDATE location_pictures SET sync=? WHERE id_pic=?', [sync, id_pic]).then(() => {
      this.loadPicturesLocationSync();
    });
  }

  updateCloudLinkLocationPicture(cloud_path, sync_id, id_pic) {
    return this.database.executeSql('UPDATE location_pictures SET cloud_path=?, sync_id=?, sync=1 WHERE id_pic=?', [cloud_path, sync_id, id_pic]).then(() => {
      this.loadPicturesLocationSync();
    });
  }

  clearLocationPic() {
    return this.database.executeSql('DELETE FROM location_pictures', []).then(() => {
      this.loadPicturesLocationSync();
    });
  }

  updateSyncLocationPic(sync, id_pic) {
    return this.database.executeSql('UPDATE location_pictures SET sync=? WHERE id_pic=?', [sync, id_pic]);
  }

  // Way Points

  getWayPoints(): Observable<any[]> {
    return this.way_point.asObservable();
  }

  addWayPoint(id_agent, plantation_id, id_contact, coordx, coordy, created_date, sync, seq, accuracy) {
    let data = [id_agent, plantation_id, id_contact, coordx, coordy, created_date, sync, seq, accuracy, 0];
    return this.database.executeSql('INSERT INTO waypoints (id_agent, plantation_id, id_contact, coordx, coordy, created_date, sync, seq, accuracy, saved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(_ => {
      this.loadWayPoints(plantation_id, 0);
    });
  }

  loadWayPoints(plantation_id, value) {
    return this.database.executeSql('SELECT * FROM waypoints WHERE plantation_id=? AND saved=?', [plantation_id, value]).then(data => {
      let way_pointList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          way_pointList.push({
            id: data.rows.item(i).id,
            id_agent: data.rows.item(i).id_agent,
            plantation_id: data.rows.item(i).plantation_id,
            id_contact: data.rows.item(i).id_contact,
            coordx: data.rows.item(i).coordx,
            coordy: data.rows.item(i).coordy,
            created_date: data.rows.item(i).created_date,
            sync: data.rows.item(i).sync,
            seq: data.rows.item(i).seq,
            accuracy: data.rows.item(i).accuracy
          });
        }
      }

      this.way_point.next(way_pointList);
    });
  }

  saveWayPoint(plantation_id) {
    return this.database.executeSql('UPDATE waypoints SET saved=1 WHERE plantation_id=?', [plantation_id]);
  }

  deleteWayPoint(id, plantation_id) {
    return this.database.executeSql('DELETE FROM waypoints WHERE id=?', [id]).then(() => {
      this.loadWayPoints(plantation_id, 0);
    });
  }

  deleteAllWayPoint(plantation_id) {
    return this.database.executeSql('DELETE FROM waypoints WHERE plantation_id=?', [plantation_id]).then(() => {
      this.loadWayPoints(plantation_id, 0);
    });
  }

  // Contacts

  getContacts(): Observable<any[]> {
    return this.contacts.asObservable();
  }

  deleteContacts() {
    return this.database.executeSql('DELETE FROM contacts', []);
  }

  loadContacts(agent_id, agent_type, town_id) {
    var query: any;

    if (agent_type == 1) {
      query = 'SELECT id_contact, name, town_name, dc_completed, avatar, avatar_path, contact_code FROM contacts WHERE id_town in ( SELECT DISTINCT town_id from towns_tasks WHERE agent_id=' + agent_id + ') AND id_type = 9 AND id_town=' + town_id + ' ORDER BY name ASC';
    } else
      if (agent_type == 3) {
        query = 'SELECT id_contact, name, town_name, dc_completed, avatar, avatar_path, contact_code FROM contacts WHERE id_type = 9 AND id_contact=' + agent_id + ' ORDER BY name ASC';
      } else {
        query = 'SELECT id_contact, name, town_name, dc_completed, avatar, avatar_path, contact_code FROM contacts WHERE id_type = 9 AND id_town=' + town_id + ' ORDER BY name ASC';
      }

    return this.database.executeSql(query, []).then(data => {
      let contactsList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let data_collection;
          if (data.rows.item(i).dc_completed == 1) {
            data_collection = true;
          } else { data_collection = false; }

          contactsList.push({
            id_contact: data.rows.item(i).id_contact,
            contact_code: data.rows.item(i).contact_code,
            name: data.rows.item(i).name,
            town_name: data.rows.item(i).town_name,
            avatar: data.rows.item(i).avatar,
            avatar_path: data.rows.item(i).avatar_path,
            status_data: data_collection
          });
        }
      }

      this.contacts.next(contactsList);
    });
  }

  countContact(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM contacts', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadFarmer(id_contact) {
    return this.database.executeSql("SELECT id_contact, name, town_name, dc_completed, avatar, avatar_path, contact_code FROM contacts WHERE id_type = 9 AND id_contact=?", [id_contact]).then(data => {
      let contactsList: any[] = [];

      if (data.rows.length > 0) {

        for (var i = 0; i < data.rows.length; i++) {
          let data_collection;
          if (data.rows.item(i).dc_completed == 1) {
            data_collection = true;
          } else { data_collection = false; }

          contactsList.push({
            id_contact: data.rows.item(i).id_contact,
            contact_code: data.rows.item(i).contact_code,
            name: data.rows.item(i).name,
            town_name: data.rows.item(i).town_name,
            avatar: data.rows.item(i).avatar,
            avatar_path: data.rows.item(i).avatar_path,
            status_data: data_collection
          });
        }
      }

      this.contacts.next(contactsList);
    });
  }

  loadAllContact(town_id) {
    var query: any;
    if (town_id == 0) {
      query = "SELECT id_contact, name, town_name, dc_completed, avatar, avatar_path, contact_code FROM contacts WHERE id_type = 9 ORDER BY name ASC";
    } else {
      query = 'SELECT id_contact, name, town_name, dc_completed, avatar, avatar_path, contact_code FROM contacts WHERE id_type = 9 AND id_town=' + town_id + ' ORDER BY name ASC';
    }

    return this.database.executeSql(query, []).then(data => {
      let contactsList: any[] = [];

      if (data.rows.length > 0) {

        for (var i = 0; i < data.rows.length; i++) {
          let data_collection;
          if (data.rows.item(i).dc_completed == 1) {
            data_collection = true;
          } else { data_collection = false; }

          contactsList.push({
            id_contact: data.rows.item(i).id_contact,
            contact_code: data.rows.item(i).contact_code,
            name: data.rows.item(i).name,
            town_name: data.rows.item(i).town_name,
            avatar: data.rows.item(i).avatar,
            avatar_path: data.rows.item(i).avatar_path,
            status_data: data_collection
          });
        }
      }

      this.contacts.next(contactsList);
    });
  }

  loadContactsAvatar(agent_id, agent_type) {
    var query: any;

    if (agent_type == 1) {
      query = "SELECT id_contact, avatar_path, name, birth_date, avatar_download, avatar FROM contacts WHERE avatar_path!='null' AND id_town in ( SELECT DISTINCT town_id from towns_tasks WHERE agent_id=" + agent_id + ")";
    } else {
      query = "SELECT id_contact, avatar_path, name, birth_date, avatar_download, avatar FROM contacts WHERE avatar_path!='null' ORDER BY name ASC";
    }

    return this.database.executeSql(query, []).then(data => {
      let contactsList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          contactsList.push({
            id_contact: data.rows.item(i).id_contact,
            name: data.rows.item(i).name,
            birth_date: data.rows.item(i).birth_date,
            avatar_path: this.pathForImage(data.rows.item(i).avatar_path),
            avatar_download: data.rows.item(i).avatar_download,
            avatar: data.rows.item(i).avatar
          });

        }
      }

      this.contacts.next(contactsList);
    });
  }

  avatarDownload(id_contact, avatar_download) {
    return this.database.executeSql('UPDATE contacts SET avatar_download=? WHERE id_contact=?', [avatar_download, id_contact]);
  }

  saveContactAvatarPath(id_contact, avatar_path) {
    return this.database.executeSql('UPDATE contacts SET avatar_path=? WHERE id_contact=?', [avatar_path, id_contact]);
  }

  saveContactAvatar(id_contact, avatar) {
    return this.database.executeSql('UPDATE contacts SET avatar=? WHERE id_contact=?', [avatar, id_contact]);
  }

  saveContactCoords(coordx, coordy, id_contact, accuracy) {
    return this.database.executeSql('UPDATE contacts SET coordx=?, coordy=?, accuracy=? WHERE id_contact=?', [coordx, coordy, accuracy, id_contact]);
  }

  addContact(id_contact, contact_code, firstname, lastname, middlename, name, state, district, coordx, coordy, id_gender, birth_date, national_lang, p_phone, p_phone2, p_phone3, p_phone4, p_email, p_email2, p_email3, notes, id_type, id_supchain_type, id_title, id_coop_member, id_coop_member_no, id_cooperative, town_name, id_town, p_street1, dc_completed, agent_id, id_contractor, task_owner_id, avatar_path, civil_status, nationality, number_children, place_birth, agent, dc_collector, bankname, mobile_money_operator, cooperative_name, other_lang) {
    let data = [id_contact, contact_code, firstname, lastname, middlename, name, state, district, coordx, coordy, id_gender, birth_date, national_lang, p_phone, p_phone2, p_phone3, p_phone4, p_email, p_email2, p_email3, notes, id_type, id_supchain_type, id_title, id_coop_member, id_coop_member_no, id_cooperative, town_name, id_town, p_street1, dc_completed, agent_id, id_contractor, task_owner_id, avatar_path, 0, null, civil_status, nationality, number_children, place_birth, agent, dc_collector, bankname, mobile_money_operator, cooperative_name, other_lang];
    return this.database.executeSql('INSERT INTO contacts (id_contact, contact_code, firstname, lastname, middlename, name, state, district, coordx, coordy, id_gender, birth_date, national_lang, p_phone, p_phone2, p_phone3, p_phone4, p_email, p_email2, p_email3, notes, id_type, id_supchain_type, id_title, id_coop_member, id_coop_member_no, id_cooperative, town_name, id_town, p_street1, dc_completed, agent_id, id_contractor, task_owner_id, avatar_path, avatar_download, avatar, civil_status, nationality, number_children, place_birth, agent, dc_collector, bankname, mobile_money_operator, cooperative_name, other_lang) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
  }

  saveContact(id_contact, contact_code, firstname, lastname, name, id_gender, id_supchain_type, town_name, id_town, agent_id, id_type, civil_status, p_phone, agent_type, id_cooperative) {
    let data = [id_contact, contact_code, firstname, lastname, name, id_gender, id_supchain_type, town_name, id_town, agent_id, id_type, civil_status, p_phone, id_cooperative];
    return this.database.executeSql('INSERT INTO contacts (id_contact, contact_code, firstname, lastname, name, id_gender, id_supchain_type, town_name, id_town, agent_id, id_type, civil_status, p_phone, id_cooperative) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(_ => {
      this.loadContacts(agent_id, agent_type, id_town);
    });
  }

  getContact(id_contact): Promise<any> {
    return this.database.executeSql('SELECT * FROM contacts WHERE id_contact = ?', [id_contact]).then(data => {
      return {
        id_contact: data.rows.item(0).id_contact,
        contact_code: data.rows.item(0).contact_code,
        firstname: data.rows.item(0).firstname,
        lastname: data.rows.item(0).lastname,
        middlename: data.rows.item(0).middlename,
        name: data.rows.item(0).name,
        state: data.rows.item(0).state,
        district: data.rows.item(0).district,
        coordx: data.rows.item(0).coordx,
        coordy: data.rows.item(0).coordy,
        id_gender: data.rows.item(0).id_gender,
        birth_date: data.rows.item(0).birth_date,
        national_lang: data.rows.item(0).national_lang,
        p_phone: data.rows.item(0).p_phone,
        p_phone2: data.rows.item(0).p_phone2,
        p_phone3: data.rows.item(0).p_phone3,
        p_phone4: data.rows.item(0).p_phone4,
        p_email: data.rows.item(0).p_email,
        p_email2: data.rows.item(0).p_email2,
        p_email3: data.rows.item(0).p_email3,
        notes: data.rows.item(0).notes,
        id_supchain_type: data.rows.item(0).id_supchain_type,
        id_title: data.rows.item(0).id_title,
        id_coop_member: data.rows.item(0).id_coop_member,
        id_coop_member_no: data.rows.item(0).id_coop_member_no,
        id_cooperative: data.rows.item(0).id_cooperative,
        town_name: data.rows.item(0).town_name,
        id_town: data.rows.item(0).id_town,
        p_street1: data.rows.item(0).p_street1,
        dc_completed: data.rows.item(0).dc_completed,
        agent_id: data.rows.item(0).agent_id,
        id_contractor: data.rows.item(0).id_contractor,
        task_owner_id: data.rows.item(0).task_owner_id,
        avatar: data.rows.item(0).avatar,
        civil_status: data.rows.item(0).civil_status,
        nationality: data.rows.item(0).nationality,
        number_children: data.rows.item(0).number_children,
        place_birth: data.rows.item(0).place_birth,
        bankname: data.rows.item(0).bankname,
        mobile_money_operator: data.rows.item(0).mobile_money_operator,
        cooperative_name: data.rows.item(0).cooperative_name,
        other_lang: data.rows.item(0).other_lang,
        avatar_path: data.rows.item(0).avatar_path
      }
    });
  }

  updateContactData(contact_code, firstname, lastname, name, p_phone, p_phone2, p_phone3, p_phone4, p_email, p_email2, p_email3, id_coop_member, town_name, p_street1, id_gender, birth_date, national_lang, notes, dc_completed, civil_status, nationality, number_children, place_birth, bankname, mobile_money_operator, other_lang, id_contact) {
    let data = [contact_code, firstname, lastname, name, p_phone, p_phone2, p_phone3, p_phone4, p_email, p_email2, p_email3, id_coop_member, town_name, p_street1, id_gender, birth_date, national_lang, notes, dc_completed, civil_status, nationality, number_children, place_birth, bankname, mobile_money_operator, other_lang, id_contact];
    return this.database.executeSql('UPDATE contacts SET contact_code=?, firstname=?, lastname=?, name=?, p_phone=?, p_phone2=?, p_phone3=?, p_phone4=?, p_email=?, p_email2=?, p_email3=?, id_coop_member=?, town_name=?, p_street1=?, id_gender=?, birth_date=?, national_lang=?, notes=?, dc_completed=?, civil_status=?, nationality=?, number_children=?, place_birth=?, bankname=?, mobile_money_operator=?, other_lang=? WHERE id_contact=?', data).then(() => {
      this.getContact(id_contact);
    });
  }

  getNewContactId() {
    return this.database.executeSql("SELECT (id_contact*10000)+(strftime('%s','now')) As new_id FROM users", []).then(data => {
      return {
        new_id: data.rows.item(0).new_id
      }
    });
  }

  // Regvalues

  getRegvalues(): Observable<any[]> {
    return this.reg_values.asObservable();
  }

  deleteRegvalues() {
    return this.database.executeSql('DELETE FROM registervalues', []);
  }

  loadRegvalues() {
    return this.database.executeSql('SELECT * FROM registervalues', []).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_valuesList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            id_register: data.rows.item(i).id_register,
            regname: data.rows.item(i).regname,
            regcode: data.rows.item(i).regcode,
            nvalue: data.rows.item(i).nvalue,
            cvalue: cvalue,
            cvaluede: data.rows.item(i).cvaluede,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvaluept: data.rows.item(i).cvaluept,
            cvaluees: data.rows.item(i).cvaluees,
            dvalue: data.rows.item(i).dvalue
          });
        }
      }

      this.reg_values.next(reg_valuesList);
    });
  }

  countRegvalues(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM registervalues', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  getRelationList() {
    return this.database.executeSql('SELECT id_regvalue,  cvaluefr, cvalue FROM registervalues WHERE id_register = 271', []).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_valuesList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_values.next(reg_valuesList);
    });
  }

  getlocationTypeList() {
    return this.database.executeSql('SELECT id_regvalue,  cvaluefr, cvalue FROM registervalues WHERE id_register = 39', []).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_valuesList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_values.next(reg_valuesList);
    });
  }

  getDocTypeContactList() {
    return this.database.executeSql('SELECT id_regvalue,  cvaluefr, cvalue FROM registervalues WHERE id_register = 265', []).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_valuesList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_values.next(reg_valuesList);
    });
  }

  getDocTypePlantationList() {
    return this.database.executeSql('SELECT id_regvalue,  cvaluefr, cvalue FROM registervalues WHERE id_register = 254', []).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_valuesList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_values.next(reg_valuesList);
    });
  }

  getCultureList() {
    return this.database.executeSql('SELECT id_regvalue, cvaluefr, cvalue FROM registervalues WHERE id_register = 33 ORDER BY cvalue ASC', []).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_valuesList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_values.next(reg_valuesList);
    });
  }

  getYesNo(): Observable<any[]> {
    return this.reg_yesno.asObservable();
  }

  getYesNoList() {
    return this.database.executeSql('SELECT id_regvalue, cvaluefr, cvalue FROM registervalues WHERE id_register = 262', []).then(data => {
      let reg_yesnoList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_yesnoList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_yesno.next(reg_yesnoList);
    });
  }

  getPlantationCertification(): Observable<any[]> {
    return this.reg_plantCertification.asObservable();
  }

  getPlantationCertificationList() {
    return this.database.executeSql('SELECT id_regvalue, cvaluefr, cvalue FROM registervalues WHERE id_register = 263', []).then(data => {
      let reg_plantCertificationList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_plantCertificationList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_plantCertification.next(reg_plantCertificationList);
    });
  }

  getCertificate(): Observable<any[]> {
    return this.reg_certificate.asObservable();
  }

  getCertificateAnswers() {
    return this.database.executeSql('SELECT id_regvalue, cvaluefr, cvalue FROM registervalues WHERE id_register = 273', []).then(data => {
      let reg_certificateList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_certificateList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_certificate.next(reg_certificateList);
    });
  }

  // Fertilizer 

  getFertilizer(): Observable<any[]> {
    return this.reg_fertilizer.asObservable();
  }

  getFertilizerList() {
    return this.database.executeSql('SELECT id_regvalue, cvaluefr, cvalue FROM registervalues WHERE id_register = 36', []).then(data => {
      let reg_fertilizerList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_fertilizerList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_fertilizer.next(reg_fertilizerList);
    });
  }

  // Plantation manager 

  getPlantationManager(): Observable<any[]> {
    return this.reg_plantManager.asObservable();
  }

  getPlantationManagerList() {
    return this.database.executeSql('SELECT id_regvalue, cvaluefr, cvalue FROM registervalues WHERE id_register = 282', []).then(data => {
      let reg_plantManagerList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_plantManagerList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_plantManager.next(reg_plantManagerList);
    });
  }

  // Civil 

  getCivilState(): Observable<any[]> {
    return this.reg_civilState.asObservable();
  }

  getCivilStateList() {
    return this.database.executeSql('SELECT id_regvalue, cvaluefr, cvalue FROM registervalues WHERE id_register = 6', []).then(data => {
      let reg_civilStateList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_civilStateList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_civilState.next(reg_civilStateList);
    });
  }

  // Nationality 

  getNationality(): Observable<any[]> {
    return this.reg_nationality.asObservable();
  }

  getNationalityList() {
    return this.database.executeSql('SELECT id_regvalue, cvaluefr, cvalue FROM registervalues WHERE id_register = 275', []).then(data => {
      let reg_nationalityList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_nationalityList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_nationality.next(reg_nationalityList);
    });
  }

  // Herbicide 

  getHerbicide(): Observable<any[]> {
    return this.reg_herbicide.asObservable();
  }

  getHerbicideList() {
    return this.database.executeSql('SELECT id_regvalue, cvaluefr, cvalue FROM registervalues WHERE id_register = 276', []).then(data => {
      let reg_herbicideList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_herbicideList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_herbicide.next(reg_herbicideList);
    });
  }

  // Pesticide 

  getPesticide(): Observable<any[]> {
    return this.reg_pesticide.asObservable();
  }

  getPesticideList() {
    return this.database.executeSql('SELECT id_regvalue, cvaluefr, cvalue FROM registervalues WHERE id_register = 37', []).then(data => {
      let reg_pesticideList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_pesticideList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_pesticide.next(reg_pesticideList);
    });
  }

  // Adjoining_cultures  

  getAdjoining_cultures(): Observable<any[]> {
    return this.reg_adjoining_cultures.asObservable();
  }

  getAdjoining_culturesList() {
    return this.database.executeSql('SELECT id_regvalue, cvaluefr, cvalue FROM registervalues WHERE id_register = 33 ORDER BY cvalue ASC', []).then(data => {
      let reg_adjoining_culturesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_adjoining_culturesList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_adjoining_cultures.next(reg_adjoining_culturesList);
    });
  }

  // Fire  

  getfire(): Observable<any[]> {
    return this.reg_fire.asObservable();
  }

  getfireList() {
    return this.database.executeSql('SELECT id_regvalue, cvaluefr, cvalue FROM registervalues WHERE id_register = 601', []).then(data => {
      let reg_fireList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_fireList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_fire.next(reg_fireList);
    });
  }

  // Waste 

  getwaste(): Observable<any[]> {
    return this.reg_waste.asObservable();
  }

  getwasteList() {
    return this.database.executeSql('SELECT id_regvalue, cvaluefr, cvalue FROM registervalues WHERE id_register = 602', []).then(data => {
      let reg_wasteList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_wasteList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_waste.next(reg_wasteList);
    });
  }

  // Gender 

  getGenders(): Observable<any[]> {
    return this.reg_genders.asObservable();
  }

  getGenderList() {
    return this.database.executeSql('SELECT id_regvalue, cvaluefr, cvalue FROM registervalues WHERE id_register = 41', []).then(data => {
      let reg_gendersList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_gendersList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_genders.next(reg_gendersList);
    });
  }

  getLanguages(): Observable<any[]> {
    return this.reg_languages.asObservable();
  }

  getLanguageList() {
    return this.database.executeSql('SELECT id_regvalue, cvaluefr, cvalue FROM registervalues WHERE id_register = 7', []).then(data => {
      let reg_languagesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else {
              cvalue = data.rows.item(i).cvaluefr;
            }
          });

          reg_languagesList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvalue: cvalue
          });
        }
      }

      this.reg_languages.next(reg_languagesList);
    });
  }

  addRegvalue(id_regvalue, id_register, regname, regcode, nvalue, cvalue, cvaluede, cvaluefr, cvaluept, cvaluees, dvalue) {
    let data = [id_regvalue, id_register, regname, regcode, nvalue, cvalue, cvaluede, cvaluefr, cvaluept, cvaluees, dvalue];
    return this.database.executeSql('INSERT INTO registervalues (id_regvalue, id_register, regname, regcode, nvalue, cvalue, cvaluede, cvaluefr, cvaluept, cvaluees, dvalue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(data => {
      this.loadRegvalues();
    });
  }

  getRegvalue(id_regvalue): Promise<any> {
    return this.database.executeSql('SELECT * FROM registervalues WHERE id_regvalue = ?', [id_regvalue]).then(data => {

      var cvalue;
      this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
        if (value == 'en') {
          cvalue = data.rows.item(0).cvalue;
        } else {
          cvalue = data.rows.item(0).cvaluefr;
        }
      });

      return {
        id_regvalue: data.rows.item(0).id_regvalue,
        id_register: data.rows.item(0).id_register,
        regname: data.rows.item(0).regname,
        regcode: data.rows.item(0).regcode,
        nvalue: data.rows.item(0).nvalue,
        cvalue: cvalue,
        cvaluede: data.rows.item(0).cvaluede,
        cvaluefr: data.rows.item(0).cvaluefr,
        cvaluept: data.rows.item(0).cvaluept,
        cvaluees: data.rows.item(0).cvaluees,
        dvalue: data.rows.item(0).dvalue
      }
    });
  }

  // Locations

  getLocations(): Observable<any[]> {
    return this.locations.asObservable();
  }

  deleteLocations() {
    return this.database.executeSql('DELETE FROM locations', []);
  }

  loadLocations(agent_id) {
    return this.database.executeSql('SELECT l.id_location, l.location_type, r.cvalue, l.date, l.town FROM locations l LEFT JOIN (SELECT id_regvalue, cvalue FROM registervalues WHERE id_register = 39) r ON r.id_regvalue = l.location_type WHERE agent_id=?', [agent_id]).then(data => {
      let locationsList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          locationsList.push({
            id_location: data.rows.item(i).id_location,
            location_type: data.rows.item(i).location_type,
            cvalue: data.rows.item(i).cvalue,
            date: data.rows.item(i).date,
            town: data.rows.item(i).town,
            locationType: '../../assets/location_types/' + data.rows.item(i).location_type + '.png'
          });
        }
      }

      this.locations.next(locationsList);
    });
  }

  countLocation(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM locations', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  deleteLocation(id_location, agent_id) {
    return this.database.executeSql('DELETE FROM locations WHERE id_location=?', [id_location]).then(() => {
      this.loadLocations(agent_id);
    });
  }

  addLocation(id_location, location_type, description, date, coordx, coordy, town, area, agent_id, sync, id_region, region_name, id_proj_company, accuracy, id_cooperative, id_contractor) {
    let data = [id_location, location_type, description, date, coordx, coordy, town, area, agent_id, sync, id_region, region_name, id_proj_company, accuracy, id_cooperative, id_contractor];
    return this.database.executeSql('INSERT INTO locations (id_location, location_type, description, date, coordx, coordy, town, area, agent_id, sync, id_region, region_name, id_proj_company, accuracy, id_cooperative, id_contractor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(data => {
      this.loadLocations(agent_id);
    });
  }

  getLocation(id_location): Promise<any> {
    return this.database.executeSql('SELECT * FROM locations l LEFT JOIN (SELECT id_regvalue, cvalue FROM registervalues WHERE id_register = 39) r ON r.id_regvalue = l.location_type WHERE id_location = ?', [id_location]).then(data => {
      return {
        id_location: data.rows.item(0).id_location,
        location_type: data.rows.item(0).cvalue,
        type: data.rows.item(0).location_type,
        description: data.rows.item(0).description,
        date: data.rows.item(0).date,
        id_contact: data.rows.item(0).id_contact,
        coordx: data.rows.item(0).coordx,
        coordy: data.rows.item(0).coordy,
        town: data.rows.item(0).town,
        area: data.rows.item(0).area,
        agent_id: data.rows.item(0).agent_id,
        sync: data.rows.item(0).sync
      }
    });
  }

  updateLocation(location_type, description, town, area, id_location, agent_id) {
    let data = [location_type, description, town, area, id_location];
    return this.database.executeSql('UPDATE locations SET location_type=?, description=?, town=?, area=? WHERE id_location=?', data).then(() => {
      this.loadLocations(agent_id);
    })
  }

  // Questions

  deleteSur_question() {
    return this.database.executeSql('DELETE FROM sur_questions', []);
  }

  getSur_question(q_seq, surtemplate_id) {
    return this.database.executeSql('SELECT * FROM sur_questions WHERE q_seq = ? AND surtemplate_id=?', [q_seq, surtemplate_id]).then(data => {
      return {
        id_surq: data.rows.item(0).id_surq,
        q_seq: data.rows.item(0).q_seq,
        q_text: data.rows.item(0).q_text,
        q_type: data.rows.item(0).q_type,
        surtemplate_id: data.rows.item(0).surtemplate_id
      }
    });
  }

  addSur_question(id_surq, q_seq, q_text, q_type, surtemplate_id) {
    let data = [id_surq, q_seq, q_text, q_type, surtemplate_id];
    return this.database.executeSql('INSERT INTO sur_questions (id_surq, q_seq, q_text, q_type, surtemplate_id) VALUES (?, ?, ?, ?, ?)', data);
  }

  countSurvey_question(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM sur_questions', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  getQuestionNumber(surtemplate_id) {
    return this.database.executeSql('SELECT COUNT(id_surq) AS total FROM sur_questions WHERE surtemplate_id=?', [surtemplate_id]).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  // Answers

  getSurAnswer(): Observable<any[]> {
    return this.sur_answers.asObservable();
  }

  getSur_answers(surq_id) {
    return this.database.executeSql('SELECT * FROM sur_answers WHERE surq_id = ? ORDER BY ans_code ASC', [surq_id]).then(data => {
      let sur_answersList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var ans_text;
          this.translate.get('CURRENT_LANGUAGE').subscribe(
            value => {
              if (value == 'en') {
                ans_text = data.rows.item(i).ans_text_en;
              } else {
                ans_text = data.rows.item(i).ans_text_fr;
              }
            }
          );

          sur_answersList.push({
            id_suranswer: data.rows.item(i).id_suranswer,
            surq_id: data.rows.item(i).surq_id,
            ans_code: data.rows.item(i).ans_code,
            ans_text_fr: data.rows.item(i).ans_text_fr,
            ans_text_en: data.rows.item(i).ans_text_en,
            ans_text: ans_text,
            score: data.rows.item(i).score
          });
        }
      }

      this.sur_answers.next(sur_answersList);
    });
  }

  getSur_answer(id_suranswer) {
    return this.database.executeSql('SELECT * FROM sur_answers WHERE id_suranswer = ?', [id_suranswer]).then(data => {
      return {
        id_suranswer: data.rows.item(0).id_suranswer,
        surq_id: data.rows.item(0).surq_id,
        ans_code: data.rows.item(0).ans_code,
        ans_text_fr: data.rows.item(0).ans_text_fr,
        ans_text_en: data.rows.item(0).ans_text_en,
        score: data.rows.item(0).score
      }
    });
  }

  addSur_answers(id_suranswer, surq_id, ans_code, ans_text_fr, ans_text_en, score) {
    let data = [id_suranswer, surq_id, ans_code, ans_text_fr, ans_text_en, score];
    return this.database.executeSql('INSERT INTO sur_answers (id_suranswer, surq_id, ans_code, ans_text_fr, ans_text_en, score) VALUES (?, ?, ?, ?, ?, ?)', data);
  }

  // Survey answers

  countSurvey_answers(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM sur_answers', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  deleteSurvey_answers() {
    return this.database.executeSql('DELETE FROM sur_answers', []);
  }

  countSurvey_UserAnswers(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM sur_survey_answers', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }
  getSurvey_answers(): Observable<any[]> {
    return this.survey_answers.asObservable();
  }

  loadSurvey_answers() {
    return this.database.executeSql('SELECT * FROM sur_survey_answers WHERE id_survey = 2', []).then(data => {
      let survey_answersList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          survey_answersList.push({
            id_suranswer: data.rows.item(i).id_suranswer,
            sur_survey_id: data.rows.item(i).sur_survey_id,
            surtemplate_id: data.rows.item(i).surtemplate_id,
            surquest_id: data.rows.item(i).surquest_id,
            suranswer_id: data.rows.item(i).suranswer_id,
            suranswer: data.rows.item(i).suranswer,
            surscore: data.rows.item(i).surscore,
            id_contact: data.rows.item(i).id_contact,
            sur_datetime: data.rows.item(i).sur_datetime,
            id_agent: data.rows.item(i).id_agent,
            sync: data.rows.item(i).sync,
            coordx: data.rows.item(i).coordx,
            coordy: data.rows.item(i).coordy
          });
        }
      }

      this.survey_answers.next(survey_answersList);
    });
  }

  addSurvey_answers(id_suranswer, sur_survey_id, surtemplate_id, surquest_id, suranswer_id, suranswer, surscore, id_contact, sur_datetime, id_agent, sync, coordx, coordy) {
    let data = [id_suranswer, sur_survey_id, surtemplate_id, surquest_id, suranswer_id, suranswer, surscore, id_contact, sur_datetime, id_agent, sync, coordx, coordy];
    return this.database.executeSql('INSERT INTO sur_survey_answers (id_suranswer, sur_survey_id, surtemplate_id, surquest_id, suranswer_id, suranswer, surscore, id_contact, sur_datetime, id_agent, sync, coordx, coordy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(_ => {
      this.loadSurvey_answers();
    });
  }

  addContactSurveyAnswers(id_suranswer, surtemplate_id, surquest_id, suranswer_id, suranswer, surscore, id_contact, sur_datetime, id_agent, coordx, coordy, accuracy, heading) {
    let data = [id_suranswer, surtemplate_id, surquest_id, suranswer_id, suranswer, surscore, id_contact, sur_datetime, id_agent, 0, coordx, coordy, accuracy, heading];
    return this.database.executeSql('INSERT INTO sur_survey_answers (id_suranswer, surtemplate_id, surquest_id, suranswer_id, suranswer, surscore, id_contact, sur_datetime, id_agent, sync, coordx, coordy, accuracy, heading) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
  }

  getCurrentSurQuestion(id_contact) {
    return this.database.executeSql('SELECT COUNT(id_suranswer) AS total FROM sur_survey_answers a, sur_questions q WHERE a.surquest_id = q.id_surq AND a.id_contact = ?', [id_contact]).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  deleteContactSurveyAnswers() {
    return this.database.executeSql('DELETE FROM sur_survey_answers', []);
  }

  // Survey Template

  deleteSurveyTemplate() {
    return this.database.executeSql('DELETE FROM sur_template', []);
  }

  addSurveyTemplate(id_survey, survey_date, description, survey_type) {
    let data = [id_survey, survey_date, description, survey_type];
    return this.database.executeSql('INSERT INTO sur_template (id_survey, survey_date, description, survey_type) VALUES (?, ?, ?, ?)', data);
  }

  countSurvey_template(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM sur_template', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  getSurveyTemplate(id_survey): Promise<any> {
    return this.database.executeSql('SELECT * FROM sur_template WHERE id_survey = ?', [id_survey]).then(data => {
      return {
        id_survey: data.rows.item(0).id_survey,
        survey_date: data.rows.item(0).survey_date,
        description: data.rows.item(0).description,
        survey_type: data.rows.item(0).survey_type
      }
    });
  }

  // Towns

  getTowns(): Observable<any[]> {
    return this.towns.asObservable();
  }

  deleteTowns() {
    return this.database.executeSql('DELETE FROM towns', []);
  }

  loadTowns() {
    return this.database.executeSql('SELECT gid_town, name_town FROM towns', []).then(data => {
      let townsList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          townsList.push({
            gid_town: data.rows.item(i).gid_town,
            name_town: data.rows.item(i).name_town
          });
        }
      }

      this.towns.next(townsList);
    });
  }

  countTowns(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM towns', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  getTown(gid_town) {
    return this.database.executeSql('SELECT gid_town, name_town FROM towns WHERE gid_town=?', [gid_town]).then(data => {
      return {
        gid_town: data.rows.item(0).gid_town,
        name_town: data.rows.item(0).name_town
      }
    });
  }

  addTown(gid_town, name_town) {
    let data = [gid_town, name_town];
    return this.database.executeSql('INSERT INTO towns (gid_town, name_town) VALUES (?, ?)', data).then(_ => {
      this.loadTowns();
    });
  }

  // Fetch survey data

  async fetchSurveyData(value, type, agent_id, agent_type) {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      this.translate.get('NO_DATA_STORED').subscribe(
        value => { this.presentAlert(value, 'Error'); }
      );

    } else {
      this.translate.get('FETCHING_SURVEY').subscribe(val => {
        this.loading.showLoader(val);
      });

      this.restFetchServeyTemplate(value).then(
        () => {
          this.restFetchServeyQuestions(value).then(
            () => {
              this.restFetchServeyAswers().then(
                () => {
                  this.restFetchServeyUsersAnswers(value, agent_id, agent_type).then(
                    () => {
                      this.loading.hideLoader();
                      this.lastLogedUser().then(usr => {
                        this.updateUserSurv(usr.id_contact, value);
                        if (type == 'manager') {
                          this.navCtrl.navigateForward(['/manager-survey-question', value]);
                        } else {
                          this.navCtrl.navigateForward(['/survey-question', value]);
                        }
                      });

                    },
                    () => { this.loading.hideLoader(); }
                  )
                }, (err) => { this.loading.hideLoader(); }
              )
            }, (err) => { this.loading.hideLoader(); }
          )
        }, (err) => { this.loading.hideLoader(); }
      );
    }
  }

  async restFetchServeyUsersAnswers(value, agent_id, agent_type): Promise<any> {
    return new Promise((resolve, reject) => {
      var sur_servey_answers;

      if (agent_type == 3) {
        sur_servey_answers = 'https://idiscover.ch/postgrest/icollect/dev/sur_survey_answers?surtemplate_id=eq.' + value + '&id_contact=eq.' + agent_id;
      } else
        if (agent_type == 1) {
          sur_servey_answers = 'https://idiscover.ch/postgrest/icollect/dev/sur_survey_answers?surtemplate_id=eq.' + value;
        } else {
          sur_servey_answers = 'https://idiscover.ch/postgrest/icollect/dev/sur_survey_answers?surtemplate_id=eq.' + value + '&id_agent=eq.' + agent_id;
        }

      this.database.executeSql('DELETE FROM sur_survey_answers', []).then(() => {
        this.http.get(sur_servey_answers, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let lenth: number = r.length;

          if (lenth == 0) {
            resolve();
          } else {
            let i = 1;
            r.forEach(value => {
              let id_suranswer = value.id_suranswer;
              let sur_survey_id = value.sur_survey_id;
              let surtemplate_id = value.surtemplate_id;
              let surquest_id = value.surquest_id;
              let suranswer_id = value.suranswer_id;
              let suranswer = value.suranswer;
              let surscore = value.surscore;
              let id_contact = value.id_contact;
              let sur_datetime = value.sur_datetime;
              let id_agent = value.id_agent;
              let sync = value.sync;
              let coordx = value.coordx;
              let coordy = value.coordy;

              this.addSurvey_answers(id_suranswer, sur_survey_id, surtemplate_id, surquest_id, suranswer_id, suranswer, surscore, id_contact, sur_datetime, id_agent, sync, coordx, coordy);

              if (i == lenth) {
                var m = new Date();
                let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                this.addData('sur_survey_answers', timestamp, 1, null, lenth);

                resolve();
              }

              i = i + 1;
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);

          reject();
        });
      });
    });
  }

  async restFetchServeyAswers(): Promise<any> {
    return new Promise((resolve, reject) => {

      let sur_answers = 'https://idiscover.ch/postgrest/icollect/dev/sur_answers';

      this.database.executeSql('DELETE FROM sur_answers', []).then(() => {
        this.http.get(sur_answers, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let lenth: number = r.length;

          if (lenth == 0) {
            resolve();
          } else {
            let i = 1;
            r.forEach(value => {
              let id_suranswer = value.id_suranswer;
              let surq_id = value.surq_id;
              let ans_code = value.ans_code;
              let ans_text_fr = value.ans_text_fr;
              let ans_text_en = value.ans_text_en;
              let score = value.score;

              this.addSur_answers(id_suranswer, surq_id, ans_code, ans_text_fr, ans_text_en, score);

              if (i == lenth) {
                var m = new Date();
                let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                this.addData('sur_answers', timestamp, 1, null, lenth);

                resolve();
              }

              i = i + 1;
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);

          reject();
        });

      });
    });
  }

  async restFetchServeyQuestions(value): Promise<any> {
    return new Promise((resolve, reject) => {

      let sur_questions = 'https://idiscover.ch/postgrest/icollect/dev/sur_questions?surtemplate_id=eq.' + value;

      this.database.executeSql('DELETE FROM sur_questions', []).then(() => {
        this.http.get(sur_questions, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let n: number = r.length;

          if (n == 0) {
            resolve();
          } else {
            let i = 1;
            r.forEach(value => {
              let id_surq = value.id_surq;
              let q_seq = value.q_seq;
              let q_text = value.q_text;
              let q_type = value.q_type;
              let surtemplate_id = value.surtemplate_id;

              this.addSur_question(id_surq, q_seq, q_text, q_type, surtemplate_id);

              if (i == n) {
                var m = new Date();
                let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                this.addData('sur_questions', timestamp, 1, null, n);

                resolve();
              }

              i = i + 1;
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);

          reject();
        });
      });
    });
  }

  async restFetchServeyTemplate(value): Promise<any> {
    return new Promise((resolve, reject) => {

      let sur_template = 'https://idiscover.ch/postgrest/icollect/dev/sur_template?id_survey=eq.' + value;

      this.database.executeSql('DELETE FROM sur_template', []).then(() => {
        this.http.get(sur_template, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let n: number = r.length;

          if (n == 0) {
            resolve();
          } else {
            let i = 1;
            r.forEach(value => {
              let id_survey = value.id_survey;
              let survey_date = value.survey_date;
              let description = value.description;
              let survey_type = value.survey_type;

              this.addSurveyTemplate(id_survey, survey_date, description, survey_type);

              if (i == n) {
                var m = new Date();
                let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                this.addData('sur_template', timestamp, 1, null, n);

                resolve();
              }

              i = i + 1;
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);

          reject();
        });
      });
    });
  }

  // Delete User Table

  deleteUserTable() {
    this.database.executeSql('DELETE FROM users', []).then(() => {
      this.navCtrl.navigateRoot(['/language']);
      let toast = this.toastController.create({
        message: 'User table successfully deleted',
        duration: 3000,
        position: 'bottom'
      });
      toast.then(toast => toast.present());
    });
  }

  clearData() {
    this.database.executeSql('DELETE FROM data WHERE id_data != 1', []);
  }

  // Delete all Data

  async deleteAllData(): Promise<any> {
    this.loading.showLoader('Deleting data from registervalues table..');
    this.database.executeSql('DELETE FROM registervalues', []).then(() => {
      this.loading.hideLoader();

      this.loading.showLoader('Deleting data from contacts table..');
      this.database.executeSql('DELETE FROM contacts', []).then(() => {
        this.loading.hideLoader();

        this.loading.showLoader('Deleting data from plantation table..');
        this.database.executeSql('DELETE FROM plantation', []).then(() => {
          this.loading.hideLoader();

          this.loading.showLoader('Deleting data from projects table..');
          this.database.executeSql('DELETE FROM projects', []).then(() => {
            this.loading.hideLoader();

            this.loading.showLoader('Deleting data from project_tasks table..');
            this.database.executeSql('DELETE FROM project_tasks', []).then(() => {
              this.loading.hideLoader();

              this.loading.showLoader('Deleting data from towns_tasks table..');
              this.database.executeSql('DELETE FROM towns_tasks', []).then(() => {
                this.loading.hideLoader();

                this.loading.showLoader('Deleting data from data table..');
                this.database.executeSql('DELETE FROM data', []).then(() => {
                  this.loading.hideLoader();

                  this.loading.showLoader('Deleting data from locations table..');
                  this.database.executeSql('DELETE FROM locations', []).then(() => {
                    this.loading.hideLoader();

                    this.loading.showLoader('Deleting data from location_pictures table..');
                    this.database.executeSql('DELETE FROM location_pictures', []).then(() => {
                      this.loading.hideLoader();

                      this.loading.showLoader('Deleting data from sur_template table..');
                      this.database.executeSql('DELETE FROM sur_template', []).then(() => {
                        this.loading.hideLoader();

                        this.loading.showLoader('Deleting data from sur_questions table..');
                        this.database.executeSql('DELETE FROM sur_questions', []).then(() => {
                          this.loading.hideLoader();

                          this.loading.showLoader('Deleting data from sur_answers table..');
                          this.database.executeSql('DELETE FROM sur_answers', []).then(() => {
                            this.loading.hideLoader();

                            this.loading.showLoader('Deleting data from sur_survey_answers table..');
                            this.database.executeSql('DELETE FROM sur_survey_answers', []).then(() => {
                              this.loading.hideLoader();

                              this.loading.showLoader('Deleting data from paths table..');
                              this.database.executeSql('DELETE FROM paths', []).then(() => {
                                this.loading.hideLoader();

                                this.loading.showLoader('Deleting data from waypoints table..');
                                this.database.executeSql('DELETE FROM waypoints', []).then(() => {
                                  this.loading.hideLoader();

                                  this.loading.showLoader('Deleting data from household table..');
                                  this.database.executeSql('DELETE FROM contact_household', []).then(() => {
                                    this.loading.hideLoader();

                                    this.loading.showLoader('Deleting data from towns table..');
                                    this.database.executeSql('DELETE FROM towns', []).then(() => {
                                      this.loading.hideLoader();

                                      this.loading.showLoader('Deleting data from contact_docs table..');
                                      this.database.executeSql('DELETE FROM contact_docs', []).then(() => {
                                        this.loading.hideLoader();

                                        this.loading.showLoader('Deleting data from plantation_docs table..');
                                        this.database.executeSql('DELETE FROM plantation_docs', []).then(() => {
                                          this.loading.hideLoader();

                                          let toast = this.toastController.create({
                                            message: 'Data base successfully deleted',
                                            duration: 3000,
                                            position: 'bottom'
                                          });
                                          toast.then(toast => toast.present());

                                        }).catch(() => { this.loading.hideLoader(); });
                                      }).catch(() => { this.loading.hideLoader(); });
                                    }).catch(() => { this.loading.hideLoader(); });
                                  }).catch(() => { this.loading.hideLoader(); });
                                }).catch(() => { this.loading.hideLoader(); });
                              }).catch(() => { this.loading.hideLoader(); });
                            }).catch(() => { this.loading.hideLoader(); });
                          }).catch(() => { this.loading.hideLoader(); });
                        }).catch(() => { this.loading.hideLoader(); });
                      }).catch(() => { this.loading.hideLoader(); });
                    }).catch(() => { this.loading.hideLoader(); });
                  }).catch(() => { this.loading.hideLoader(); });
                }).catch(() => { this.loading.hideLoader(); });
              }).catch(() => { this.loading.hideLoader(); });
            }).catch(() => { this.loading.hideLoader(); });
          }).catch(() => { this.loading.hideLoader(); });
        }).catch(() => { this.loading.hideLoader(); });
      }).catch(() => { this.loading.hideLoader(); });
    }).catch(() => { this.loading.hideLoader(); });

    this.loading.hideLoader();
  }


  async restFetchUser(username, save_login_checked, lang): Promise<any> {
    return new Promise((resolve, reject) => {
      var v_security_new = 'https://idiscover.ch/postgrest/icollect/dev/v_security_mobile?username=eq.' + username;

      this.http.get(v_security_new, {}, {}).then(data => {
        let raw = JSON.parse(data.data);

        if (raw.length == 0) {
          this.translate.get('INCORRECT_USERNAME').subscribe(
            value => { this.presentAlert(value, 'Error'); }
          );

          reject();

        } else {

          var save_login = 0;
          let id_contact = raw[0].id_contact;
          let id_primary_company = raw[0].id_primary_company;
          let id_cooperative = raw[0].id_cooperative;
          let id_user_supchain_type = raw[0].id_user_supchain_type;
          let company_name = raw[0].company_name;
          let username = raw[0].username;
          let password = raw[0].password;
          let name = raw[0].name;
          let agent_type = raw[0].agent_type;
          let password_2 = raw[0].password_2;
          let id_supchain_type = raw[0].id_supchain_type;
          let id_supchain_company = raw[0].id_supchain_company;

          if (save_login_checked == true) { save_login = 1; }
          let pass_value = btoa(password);

          this.agent_id = id_contact;
          this.agent_type = agent_type;
          this.id_primary_company = id_primary_company;
          this.id_supchain_company = id_supchain_company;

          this.addUser(id_contact, id_primary_company, id_user_supchain_type, company_name, username, password, name, agent_type, password_2, lang, save_login, pass_value, id_cooperative, id_supchain_type, id_supchain_company);

          var m = new Date();
          let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
          this.addData('user', timestamp, 1, null, raw.lenth);

          resolve();
        }

      }).catch(error => {
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

        reject();
      });

    });
  }

  restFetchContactDocLenth(agent_id, agent_type, id_supchain_company, id_primary_company) {
    let doc_start;
    if ((agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
      if (id_supchain_company == 331) {
        doc_start = 'https://idiscover.ch/postgrest/icollect/dev/v_contact_docs?id_cooperative=eq.' + id_primary_company;
      } else {
        doc_start = 'https://idiscover.ch/postgrest/icollect/dev/v_contact_docs?id_contractor=eq.' + id_primary_company;
      }

    } else
      if (agent_type == 3) {
        doc_start = 'https://idiscover.ch/postgrest/icollect/dev/v_contact_docs?contact_id=eq.' + agent_id;
      } else {
        doc_start = 'https://idiscover.ch/postgrest/icollect/dev/v_contact_docs?agent_id=eq.' + agent_id;
      }

    return this.http.get(doc_start, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;
      return lenth;
    });
  }

  restFetchHouseholdLenth(agent_id, agent_type, id_supchain_company, id_primary_company) {
    let household;

    if ((agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
      if (id_supchain_company == 331) {
        household = 'https://idiscover.ch/postgrest/icollect/dev/v_contact_household?id_cooperative=eq.' + id_primary_company;
      } else {
        household = 'https://idiscover.ch/postgrest/icollect/dev/v_contact_household?id_contractor=eq.' + id_primary_company;
      }
    } else
      if (agent_type == 3) {
        household = 'https://idiscover.ch/postgrest/icollect/dev/v_contact_household?contact_id=eq.' + agent_id;
      } else {
        household = 'https://idiscover.ch/postgrest/icollect/dev/v_contact_household?agent_id=eq.' + agent_id;
      }

    return this.http.get(household, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;
      return lenth;
    });
  }

  restrestFetchContactLenth(agent_id, agent_type, id_supchain_company, id_primary_company) {
    let v_contact_start;

    if ((agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
      if (id_supchain_company == 331) {
        v_contact_start = 'https://idiscover.ch/postgrest/icollect/dev/v_mob_project_members_contacts?id_cooperative=eq.' + id_primary_company;
      } else {
        v_contact_start = 'https://idiscover.ch/postgrest/icollect/dev/v_mob_project_members?id_contractor=eq.' + id_primary_company;
      }

    } else
      if (agent_type == 3) {
        v_contact_start = 'https://idiscover.ch/postgrest/icollect/dev/v_mob_project_members?id_contact=eq.' + agent_id;
      } else {
        v_contact_start = 'https://idiscover.ch/postgrest/icollect/dev/v_mob_project_members?agent_id=eq.' + agent_id;
      }

    return this.http.get(v_contact_start, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;
      return lenth;
    });
  }

  restFetchLocationPicturesLenth(agent_id, agent_type, id_supchain_company, id_primary_company) {
    let docs;

    if ((agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
      if (id_supchain_company == 331) {
        docs = 'https://idiscover.ch/postgrest/icollect/dev/infrastructure_photos?id_cooperative=eq.' + id_primary_company;
      } else {
        docs = 'https://idiscover.ch/postgrest/icollect/dev/infrastructure_photos?id_contractor=eq.' + id_primary_company;
      }

    } else {
      docs = 'https://idiscover.ch/postgrest/icollect/dev/infrastructure_photos?agent_id=eq.' + agent_id;
    }

    return this.http.get(docs, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;
      return lenth;
    });
  }

  restFetchLocationLenth(agent_id, agent_type, id_supchain_company, id_primary_company) {
    let location_start;

    if ((agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
      if (id_supchain_company == 331) {
        location_start = 'https://idiscover.ch/postgrest/icollect/dev/infrastructure?id_cooperative=eq.' + id_primary_company;
      } else {
        location_start = 'https://idiscover.ch/postgrest/icollect/dev/infrastructure?id_contractor=eq.' + id_primary_company;
      }

    } else {
      location_start = 'https://idiscover.ch/postgrest/icollect/dev/infrastructure?agent_id=eq.' + agent_id;
    }

    return this.http.get(location_start, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;
      return lenth;
    });
  }

  restFetchPathsLenth(agent_id, agent_type, id_primary_company) {
    let plantation_lines_start;

    if (agent_type == 3) {
      plantation_lines_start = 'https://idiscover.ch/postgrest/icollect/dev/v_plantation_lines?id_contact=eq.' + agent_id;
    } else {
      plantation_lines_start = 'https://idiscover.ch/postgrest/icollect/dev/v_plantation_lines?id_company=eq.' + id_primary_company;
    }

    return this.http.get(plantation_lines_start, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;
      return lenth;
    });
  }

  restFetchPlantationLenth(agent_id, agent_type, id_supchain_company, id_primary_company) {
    let v_plantation;

    if (agent_type == 1) {
      v_plantation = 'https://idiscover.ch/postgrest/icollect/dev/v_mob_town_plantation?agent_id=eq.' + agent_id;
    } else
      if ((agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
        if (id_supchain_company == 331) {
          v_plantation = 'https://idiscover.ch/postgrest/icollect/dev/v_project_mob_tplantation?project_coop=eq.' + id_primary_company;
        } else {
          v_plantation = 'https://idiscover.ch/postgrest/icollect/dev/v_plantation_project_company?id_company=eq.' + id_primary_company;
        }

      } else
        if (agent_type == 3) {
          v_plantation = 'https://idiscover.ch/postgrest/icollect/dev/v_mob_town_plantation?id_contact=eq.' + agent_id;
        } else {
          v_plantation = 'https://idiscover.ch/postgrest/icollect/dev/v_mob_town_plantation?id_contact=eq.' + agent_id + '&id_primary_company=eq.' + id_primary_company;
        }

    return this.http.get(v_plantation, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;
      return lenth;
    });
  }

  restFetchPlantationtDocLenth(agent_id, agent_type, id_supchain_company, id_primary_company) {
    let docs;

    if ((agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
      if (id_supchain_company == 331) {
        docs = 'https://idiscover.ch/postgrest/icollect/dev/v_plantation_docs?id_cooperative=eq.' + id_primary_company;
      } else {
        docs = 'https://idiscover.ch/postgrest/icollect/dev/v_plantation_docs?id_contractor=eq.' + id_primary_company;
      }

    } else
      if (agent_type == 3) {
        docs = 'https://idiscover.ch/postgrest/icollect/dev/v_plantation_docs?id_contact=eq.' + agent_id;
      } else {
        docs = 'https://idiscover.ch/postgrest/icollect/dev/v_plantation_docs?agent_id=eq.' + agent_id;
      }

    return this.http.get(docs, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;
      return lenth;
    });
  }

  restFetchProjectsLenth(agent_id, agent_type, id_supchain_company, id_primary_company) {
    let v_mob_agent_projects;

    if(agent_type == 2) {
      v_mob_agent_projects = 'https://idiscover.ch/postgrest/icollect/dev/v_project?cooperative_id=eq.' + id_primary_company;
    } else
    if ((agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
      if (id_supchain_company == 331) {
        v_mob_agent_projects = 'https://idiscover.ch/postgrest/icollect/dev/v_mob_agent_projects?id_cooperative=eq.' + id_primary_company;
      } else {
        v_mob_agent_projects = 'https://idiscover.ch/postgrest/icollect/dev/v_mob_agent_projects?id_company=eq.' + id_primary_company;
      }
    } else {
      v_mob_agent_projects = 'https://idiscover.ch/postgrest/icollect/dev/v_mob_agent_projects?agent_id=eq.' + agent_id;
    }

    return this.http.get(v_mob_agent_projects, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;
      return lenth;
    });
  }

  restFetchTasksLenth(agent_id, agent_type, id_supchain_company, id_primary_company) {
    let v_project_tasks;

    if ((agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
      if (id_supchain_company == 331) {
        v_project_tasks = 'https://idiscover.ch/postgrest/icollect/dev/v_project_tasks?id_cooperative=eq.' + id_primary_company;
      } else {
        v_project_tasks = 'https://idiscover.ch/postgrest/icollect/dev/v_project_tasks?id_company=eq.' + id_primary_company;
      }
    } else {
      v_project_tasks = 'https://idiscover.ch/postgrest/icollect/dev/v_project_tasks?agent_id=eq.' + agent_id;
    }

    return this.http.get(v_project_tasks, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;
      return lenth;
    });
  }

  restFetchTownsTasksLenth(agent_id, agent_type, id_primary_company) {
    let v_mob_towns_tasks;

    if ((agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
      v_mob_towns_tasks = 'https://idiscover.ch/postgrest/icollect/dev/v_mob_towns_tasks?task_delegated_id=eq.' + id_primary_company;
    } else {
      v_mob_towns_tasks = 'https://idiscover.ch/postgrest/icollect/dev/v_mob_towns_tasks?agent_id=eq.' + agent_id;
    }

    return this.http.get(v_mob_towns_tasks, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;
      return lenth;
    });
  }

  restFetchRegvaluesLenth() {
    let v_regvalues = 'https://idiscover.ch/postgrest/icollect/dev/v_regvalues';

    return this.http.get(v_regvalues, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;

      let filepath = this.file.externalRootDirectory + 'icollect/data/';
      this.file.createFile(filepath, 'regvalues.json', false).catch(() => { 
        this.file.writeFile(filepath, 'regvalues.json', JSON.stringify(data), {replace: true});
      });

      return lenth;
    });
  }

  restFetchServeyAswersLenth() {
    let sur_answers = 'https://idiscover.ch/postgrest/icollect/dev/sur_answers';

    return this.http.get(sur_answers, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;
      return lenth;
    });
  }

  restFetchServeyQuestionsLenth(value) {
    let sur_questions = 'https://idiscover.ch/postgrest/icollect/dev/sur_questions?surtemplate_id=eq.' + value;

    return this.http.get(sur_questions, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;
      return lenth;
    });
  }

  restFetchServeyTemplateLenth(value) {
    let sur_template = 'https://idiscover.ch/postgrest/icollect/dev/sur_template?id_survey=eq.' + value;

    return this.http.get(sur_template, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;
      return lenth;
    });
  }

  restFetchServeyUsersAnswersLenth(value, agent_id, agent_type) {
    let sur_servey_answers;

    if (agent_type == 3) {
      sur_servey_answers = 'https://idiscover.ch/postgrest/icollect/dev/sur_survey_answers?surtemplate_id=eq.' + value + '&id_contact=eq.' + agent_id;
    } else
      if (agent_type == 1) {
        sur_servey_answers = 'https://idiscover.ch/postgrest/icollect/dev/sur_survey_answers?surtemplate_id=eq.' + value;
      } else {
        sur_servey_answers = 'https://idiscover.ch/postgrest/icollect/dev/sur_survey_answers?surtemplate_id=eq.' + value + '&id_agent=eq.' + agent_id;
      }

    return this.http.get(sur_servey_answers, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;
      return lenth;
    });
  }

  restFetchTownsLenth() {
    let towns_start = 'https://idiscover.ch/postgrest/icollect/dev/towns?id_country=eq.1';

    return this.http.get(towns_start, {}, {}).then(data => {
      let r = JSON.parse(data.data);
      let lenth: number = r.length;

      let filepath = this.file.externalRootDirectory + 'icollect/data/';
      this.file.createFile(filepath, 'towns.json', false).catch(() => { 
        this.file.writeFile(filepath, 'towns.json', JSON.stringify(data), {replace: true});
      });

      return lenth;
    });
  }
}
