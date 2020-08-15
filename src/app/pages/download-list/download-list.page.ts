import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { NavController, AlertController } from '@ionic/angular';
import { NetworkService, ConnectionStatus } from 'src/app/services/network.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-download-list',
  templateUrl: './download-list.page.html',
  styleUrls: ['./download-list.page.scss'],
})
export class DownloadListPage implements OnInit {

  ctd_progress: number;
  ctd_total_row: any;
  ctd_data_date: any;
  ctd_total_rows: any;
  ctd_total: any;
  ctd_row_less = false;
  ctd_row_ok = false;
  ctd_spinner = false;

  cth_progress: number;
  cth_total_row: any;
  cth_data_date: any;
  cth_total_rows: any;
  cth_total: any;
  cth_row_less = false;
  cth_row_ok = false;
  cth_spinner = false;

  ct_progress: number;
  ct_total_row: any;
  ct_data_date: any;
  ct_total_rows: any;
  ct_total: any;
  ct_row_less = false;
  ct_row_ok = false;
  ct_spinner = false;

  locp_progress: number;
  locp_total_row: any;
  locp_data_date: any;
  locp_total_rows: any;
  locp_total: any;
  locp_row_less = false;
  locp_row_ok = false;
  locp_spinner = false;

  loc_progress: number;
  loc_total_row: any;
  loc_data_date: any;
  loc_total_rows: any;
  loc_total: any;
  loc_row_less = false;
  loc_row_ok = false;
  loc_spinner = false;

  path_progress: number;
  path_total_row: any;
  path_data_date: any;
  path_total_rows: any;
  path_total: any;
  path_row_less = false;
  path_row_ok = false;
  path_spinner = false;

  plt_progress: number;
  plt_total_row: any;
  plt_data_date: any;
  plt_total_rows: any;
  plt_total: any;
  plt_row_less = false;
  plt_row_ok = false;
  plt_spinner = false;

  pltd_progress: number;
  pltd_total_row: any;
  pltd_data_date: any;
  pltd_total_rows: any;
  pltd_total: any;
  pltd_row_less = false;
  pltd_row_ok = false;
  pltd_spinner = false;

  pjt_progress: number;
  pjt_total_row: any;
  pjt_data_date: any;
  pjt_total_rows: any;
  pjt_total: any;
  pjt_row_less = false;
  pjt_row_ok = false;
  pjt_spinner = false;

  ptsk_progress: number;
  ptsk_total_row: any;
  ptsk_data_date: any;
  ptsk_total_rows: any;
  ptsk_total: any;
  ptsk_row_less = false;
  ptsk_row_ok = false;
  ptsk_spinner = false;

  ttsk_progress: number;
  ttsk_total_row: any;
  ttsk_data_date: any;
  ttsk_total_rows: any;
  ttsk_total: any;
  ttsk_row_less = false;
  ttsk_row_ok = false;
  ttsk_spinner = false;

  reg_progress: number;
  reg_total_row: any;
  reg_data_date: any;
  reg_total_rows: any;
  reg_total: any;
  reg_row_less = false;
  reg_row_ok = false;
  reg_spinner = false;

  sra_progress: number;
  sra_total_row: any;
  sra_data_date: any;
  sra_total_rows: any;
  sra_total: any;
  sra_row_less = false;
  sra_row_ok = false;
  sra_spinner = false;

  srq_progress: number;
  srq_total_row: any;
  srq_data_date: any;
  srq_total_rows: any;
  srq_total: any;
  srq_row_less = false;
  srq_row_ok = false;
  srq_spinner = false;

  srt_progress: number;
  srt_total_row: any;
  srt_data_date: any;
  srt_total_rows: any;
  srt_total: any;
  srt_row_less = false;
  srt_row_ok = false;
  srt_spinner = false;

  srua_progress: number;
  srua_total_row: any;
  srua_data_date: any;
  srua_total_rows: any;
  srua_total: any;
  srua_row_less = false;
  srua_row_ok = false;
  srua_spinner = false;

  twn_progress: number;
  twn_total_row: any;
  twn_data_date: any;
  twn_total_rows: any;
  twn_total: any;
  twn_row_less = false;
  twn_row_ok = false;
  twn_spinner = false;

  user: any;
  type: any;
  login = false;

  private _jsonURL = 'assets/SampleJson.json';
  
  constructor(
    public http: HTTP,
    private file: File,
    public navCtrl: NavController,
    public translate: TranslateService,
    private alertCtrl: AlertController,
    private activatedRoute: ActivatedRoute,
    private networkService: NetworkService,
    private httpClient: HttpClient,
    private db: DatabaseService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(param => {
      this.type = param.get('type');

      this.db.lastLogedUser().then(usr => {
        this.user = usr;

        if (this.type == 'login') {
          this.login = false;
          this.updateLocalDB();

        } else {
          this.login = true;
          this.loadContactDoc();
          this.loadContactHousehold();
          this.loadContact();
          this.loadLocationPicture();
          this.loadLocation();
          this.loadPaths();
          this.loadPlantation();
          this.loadPlantationDoc();
          if (this.user.agent_type != 3) {
            this.loadProject();
            this.loadProjectTask();
            this.loadTownTask();
          }
          this.loadRegister();
          this.loadSurvey_answers();
          this.loadSurvey_question();
          this.loadSurvey_template();
          this.loadSurvey_UserAnswers();
          this.loadTown();
        }
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

  loadContactDoc() {
    this.db.countContactDoc().then(data => {
      this.db.loadContactDocData().then(ctd => {
        this.ctd_spinner = false;
        this.ctd_data_date = ctd.data_date;
        this.ctd_total_rows = ctd.total_rows;
        this.ctd_total = data.total;

        if (data.total == ctd.total_rows) { this.ctd_row_ok = true; }
        else { this.ctd_row_less = true; }
      });
    });
  }

  loadContactHousehold() {
    this.db.countContactHousehold().then(data => {
      this.db.loadContactHouseholdData().then(cth => {
        this.cth_spinner = false;
        this.cth_data_date = cth.data_date;
        this.cth_total_rows = cth.total_rows;
        this.cth_total = data.total;

        if (data.total == cth.total_rows) { this.cth_row_ok = true; }
        else { this.cth_row_less = true; }
      });
    });
  }

  loadContact() {
    this.db.countContact().then(data => {
      this.db.lastContactData().then(ct => {
        this.ct_spinner = false;
        this.ct_data_date = ct.data_date;
        this.ct_total_rows = ct.total_rows;
        this.ct_total = data.total;

        if (data.total == ct.total_rows) { this.ct_row_ok = true; }
        else { this.ct_row_less = true; }
      });
    });
  }

  loadLocationPicture() {
    this.db.countLocationPicture().then(data => {
      this.db.loadLocationPictureData().then(locp => {
        this.locp_spinner = false;
        this.locp_data_date = locp.data_date;
        this.locp_total_rows = locp.total_rows;
        this.locp_total = data.total;

        if (data.total == locp.total_rows) { this.locp_row_ok = true; }
        else { this.locp_row_less = true; }
      });
    });
  }

  loadLocation() {
    this.db.countLocation().then(data => {
      this.db.loadLocationData().then(loc => {
        this.loc_spinner = false;
        this.loc_data_date = loc.data_date;
        this.loc_total_rows = loc.total_rows;
        this.loc_total = data.total;

        if (data.total == loc.total_rows) { this.loc_row_ok = true; }
        else { this.loc_row_less = true; }
      });
    });
  }

  loadPaths() {
    this.db.countLocationPaths().then(data => {
      this.db.loadPathsData().then(path => {
        this.path_spinner = false;
        this.path_data_date = path.data_date;
        this.path_total_rows = path.total_rows;
        this.path_total = data.total;

        if (data.total == path.total_rows) { this.path_row_ok = true; }
        else { this.path_row_less = true; }
      });
    });
  }

  loadPlantation() {
    this.db.countPlantation().then(data => {
      this.db.lastPlantationData().then(plt => {
        this.plt_spinner = false;
        this.plt_data_date = plt.data_date;
        this.plt_total_rows = plt.total_rows;
        this.plt_total = data.total;

        if (data.total == plt.total_rows) { this.plt_row_ok = true; }
        else { this.plt_row_less = true; }
      });
    });
  }

  loadPlantationDoc() {
    this.db.countPlantationDoc().then(data => {
      this.db.loadPlantationDocData().then(pltd => {
        this.pltd_spinner = false;
        this.pltd_data_date = pltd.data_date;
        this.pltd_total_rows = pltd.total_rows;
        this.pltd_total = data.total;

        if (data.total == pltd.total_rows) { this.pltd_row_ok = true; }
        else { this.pltd_row_less = true; }
      });
    });
  }

  loadProject() {
    this.db.countProject().then(data => {
      this.db.loadProjectData().then(pjt => {
        this.pjt_spinner = false;
        this.pjt_data_date = pjt.data_date;
        this.pjt_total_rows = pjt.total_rows;
        this.pjt_total = data.total;

        if (data.total == pjt.total_rows) { this.pjt_row_ok = true; }
        else { this.pjt_row_less = true; }
      });
    });
  }

  loadProjectTask() {
    this.db.countProjectTask().then(data => {
      this.db.loadProjecTasktData().then(ptsk => {
        this.ptsk_spinner = false;
        this.ptsk_data_date = ptsk.data_date;
        this.ptsk_total_rows = ptsk.total_rows;
        this.ptsk_total = data.total;

        if (data.total == ptsk.total_rows) { this.ptsk_row_ok = true; }
        else { this.ptsk_row_less = true; }
      });
    });
  }

  loadTownTask() {
    this.db.countTownTask().then(data => {
      this.db.loadTownTasktData().then(ttsk => {
        this.ttsk_spinner = false;
        this.ttsk_data_date = ttsk.data_date;
        this.ttsk_total_rows = ttsk.total_rows;
        this.ttsk_total = data.total;

        if (data.total == ttsk.total_rows) { this.ttsk_row_ok = true; }
        else { this.ttsk_row_less = true; }
      });
    });
  }

  loadRegister() {
    this.db.countRegvalues().then(data => {
      this.db.loadRegisterData().then(reg => {
        this.reg_spinner = false;
        this.reg_data_date = reg.data_date;
        this.reg_total_rows = reg.total_rows;
        this.reg_total = data.total;

        if (data.total == reg.total_rows) { this.reg_row_ok = true; }
        else { this.reg_row_less = true; }
      });
    });
  }

  loadSurvey_answers() {
    this.db.countSurvey_answers().then(data => {
      this.db.loadSurvey_answersData().then(sra => {
        this.sra_spinner = false;
        this.sra_data_date = sra.data_date;
        this.sra_total_rows = sra.total_rows;
        this.sra_total = data.total;

        if (data.total == sra.total_rows) { this.sra_row_ok = true; }
        else { this.sra_row_less = true; }
      });
    });
  }

  loadSurvey_question() {
    this.db.countSurvey_question().then(data => {
      this.db.loadSurvey_questionData().then(srq => {
        this.srq_spinner = false;
        this.srq_data_date = srq.data_date;
        this.srq_total_rows = srq.total_rows;
        this.srq_total = data.total;

        if (data.total == srq.total_rows) { this.srq_row_ok = true; }
        else { this.srq_row_less = true; }
      });
    });
  }

  loadSurvey_template() {
    this.db.countSurvey_template().then(data => {
      this.db.loadSurvey_templateData().then(srt => {
        this.srt_spinner = false;
        this.srt_data_date = srt.data_date;
        this.srt_total_rows = srt.total_rows;
        this.srt_total = data.total;

        if (data.total == srt.total_rows) { this.srt_row_ok = true; }
        else { this.srt_row_less = true; }
      });
    });
  }

  loadSurvey_UserAnswers() {
    this.db.countSurvey_UserAnswers().then(data => {
      this.db.loadSurvey_UserAnswersData().then(srua => {
        this.srua_spinner = false;
        this.srua_data_date = srua.data_date;
        this.srua_total_rows = srua.total_rows;
        this.srua_total = data.total;

        if (data.total == srua.total_rows) { this.srua_row_ok = true; }
        else { this.srua_row_less = true; }
      });
    });
  }

  loadTown() {
    this.db.countTowns().then(data => {
      this.db.loadTownData().then(twn => {
        this.twn_spinner = false;
        this.twn_data_date = twn.data_date;
        this.twn_total_rows = twn.total_rows;
        this.twn_total = data.total;

        if (data.total == twn.total_rows) { this.twn_row_ok = true; }
        else { this.twn_row_less = true; }
      });
    });
  }

  hideall() {
    this.ctd_row_less = false; this.ctd_row_ok = false;
    this.cth_row_less = false; this.cth_row_ok = false;
    this.ct_row_less = false; this.ct_row_ok = false;
    this.locp_row_less = false; this.locp_row_ok = false;
    this.loc_row_less = false; this.loc_row_ok = false;
    this.path_row_less = false; this.path_row_ok = false;
    this.plt_row_less = false; this.plt_row_ok = false;
    this.pltd_row_less = false; this.pltd_row_ok = false;
    this.pjt_row_less = false; this.pjt_row_ok = false;
    this.ptsk_row_less = false; this.ptsk_row_ok = false;
    this.ttsk_row_less = false; this.ttsk_row_ok = false;
    this.reg_row_less = false; this.reg_row_ok = false;
    this.sra_row_less = false; this.sra_row_ok = false;
    this.srq_row_less = false; this.srq_row_ok = false;
    this.srt_row_less = false; this.srt_row_ok = false;
    this.srua_row_less = false; this.srua_row_ok = false;
    this.twn_row_less = false; this.twn_row_ok = false;

    this.ctd_total = null; 
    this.cth_total = null; 
    this.ct_total = null; 
    this.locp_total = null; 
    this.loc_total = null;
    this.path_total = null; 
    this.plt_total = null;
    this.pltd_total = null; 
    this.pjt_total = null;
    this.ptsk_total = null; 
    this.ttsk_total = null;
    this.reg_total = null; 
    this.sra_total = null; 
    this.srq_total = null; 
    this.srt_total = null; 
    this.srua_total = null; 
    this.twn_total = null;
  }

  async download() {
    
    this.hideall();

    var yes, no, upLocalDB, upLocalDBText;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });
    this.translate.get('MSG_UPDATE_LOCAL_DB').subscribe(value => { upLocalDB = value; });
    this.translate.get('MSQ_UPDATE_LOCAL_DB_TEXT').subscribe(value => { upLocalDBText = value; });

    let promptAlert = await this.alertCtrl.create({
      message: upLocalDBText,
      subHeader: upLocalDB,
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
            this.updateLocalDB();
          }
        }
      ]
    });
    promptAlert.present();
  }

  updateLocalDB() {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      this.translate.get('NO_DATA_STORED').subscribe(
        value => { this.presentAlert(value, 'Error'); }
      );

    } else {
      this.login = false;
      this.db.clearData();
      this.restFetchContactDoc(this.user.id_contact, this.user.agent_type, this.user.id_supchain_company, this.user.id_primary_company);
    }
  }

  async restFetchContactDoc(agent_id, agent_type, id_supchain_company, id_primary_company): Promise<any> {
    let doc_start;

    this.ctd_spinner = true;
    this.ctd_progress = 0;
    this.db.restFetchContactDocLenth(agent_id, agent_type, id_supchain_company, id_primary_company).then(total_rows => {
      this.ctd_total_row = total_rows;
      this.ctd_total = total_rows;

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

      this.db.deleteContactDocs().then(() => {
        this.http.get(doc_start, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let lenth: number = r.length;

          if (lenth == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('contact_docs', timestamp, 1, null, lenth);

            this.loadContactDoc();
            this.ctd_spinner = false;
            this.restFetchHousehold(agent_id, agent_type, id_supchain_company, id_primary_company);

          } else {
            let i = 1;
            r.forEach(value => {
              let id_doc = value.id_condoc;
              let id_contact = value.contact_id;
              let doc_date = value.doc_date;
              let doc_type = value.doc_type;
              let cloud_path = value.doc_link;
              let coordx = value.coordx;
              let coordy = value.coordy;
              let accuracy = value.accuracy;
              let heading = value.heading;
              let description = value.description;
              let id_household = value.id_household;
              let sync = value.sync;

              this.db.addContactDoc(id_doc, id_contact, doc_date, doc_type, cloud_path, coordx, coordy, accuracy, heading, description, sync, id_household, agent_id).then(() => {
                this.ctd_progress = (i / this.ctd_total_row);
                this.ctd_total_rows = i;

                if (i == lenth) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('contact_docs', timestamp, 1, null, lenth);

                  this.loadContactDoc();
                  this.ctd_spinner = false;
                  this.restFetchHousehold(agent_id, agent_type, id_supchain_company, id_primary_company);
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });
      });
    });
  }

  async restFetchHousehold(agent_id, agent_type, id_supchain_company, id_primary_company): Promise<any> {
    let household;

    this.cth_spinner = true;
    this.cth_progress = 0;
    this.db.restFetchHouseholdLenth(agent_id, agent_type, id_supchain_company, id_primary_company).then(total_rows => {
      this.cth_total_row = total_rows;
      this.cth_total = total_rows;

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

      this.db.deleteHouseholds().then(() => {
        this.http.get(household, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let lenth: number = r.length;

          if (lenth == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('contact_household', timestamp, 1, null, lenth);

            this.loadContactHousehold();
            this.cth_spinner = false;
            this.restFetchContact(agent_id, agent_type, id_supchain_company, id_primary_company);

          } else {
            let i = 1;
            r.forEach(value => {
              let id_household = value.id_household;
              let contact_id = value.contact_id;
              let fname = value.firstname;
              let lname = value.lastname;
              let birth_year = value.birth_year;
              let relation = value.id_relation;
              let graduate_primary = value.id_graduate_primary;
              let graduate_secondary = value.id_graduate_secondary;
              let graduate_tertiary = value.id_graduate_tertiary;
              let working_on_farm = value.id_working_on_farm;
              let working_off_farm = value.id_working_off_farm;
              let agent_id = value.agent_id;
              let created_date = value.created_date;
              let created_by = value.created_by;
              let modified_date = value.modified_date;
              let modified_by = value.modified_by;
              let gender = value.id_gender;
              let sync = value.sync;
              let avatar_path = value.avatar_path;
              let read_write = value.read_write;
              let schooling = value.schooling;

              this.db.addHousehold(id_household, contact_id, fname, lname, birth_year, relation, graduate_primary, graduate_secondary, graduate_tertiary, working_on_farm, working_off_farm, agent_id, created_date, created_by, modified_date, modified_by, gender, avatar_path, read_write, schooling).then(() => {
                this.cth_progress = (i / this.cth_total_row);
                this.cth_total_rows = i;

                if (i == lenth) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('contact_household', timestamp, 1, null, lenth);

                  this.loadContactHousehold();
                  this.cth_spinner = false;
                  this.restFetchContact(agent_id, agent_type, id_supchain_company, id_primary_company);
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });
      });

    });
  }

  async restFetchContact(agent_id, agent_type, id_supchain_company, id_primary_company): Promise<any> {
    let v_contact_start;

    this.ct_spinner = true;
    this.ct_progress = 0;
    this.db.restrestFetchContactLenth(agent_id, agent_type, id_supchain_company, id_primary_company).then(total_rows => {
      this.ct_total_row = total_rows;
      this.ct_total = total_rows;

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

      this.db.deleteContacts().then(() => {
        this.http.get(v_contact_start, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let lenth: number = r.length;

          if (lenth == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('contacts', timestamp, 1, null, lenth);

            this.loadContact();
            this.ct_spinner = false;

            if ((agent_type == 1) || (agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
              this.restFetchLocationPictures(agent_id, agent_type, id_supchain_company, id_primary_company);
            } else {
              this.restFetchPaths(agent_id, agent_type, id_primary_company);
            }

          } else {
            let i = 1;
            r.forEach(value => {
              let id_contact = value.id_contact;
              let contact_code = value.contact_code;
              let firstname = value.firstname;
              let lastname = value.lastname;
              let middlename = value.middlename;
              let name = value.name;
              let state = value.state;
              let district = value.district;
              let coordx = value.coordx;
              let coordy = value.coordy;
              let id_gender = value.id_gender;
              let birth_date = value.birth_date;
              let national_lang = value.national_lang;
              let p_phone = value.p_phone;
              let p_phone2 = value.p_phone2;
              let p_phone3 = value.p_phone3;
              let p_phone4 = value.p_phone4;
              let p_email = value.p_email;
              let p_email2 = value.p_email2;
              let p_email3 = value.p_email3;
              let notes = value.notes;
              let id_type = value.id_type;
              let id_supchain_type = value.id_supchain_type;
              let id_title = value.id_title;
              let id_coop_member = value.id_coop_member;
              let id_coop_member_no = value.id_coop_member_no;
              let id_cooperative = value.id_cooperative;
              let town_name = value.town_name;
              let id_town = value.id_town;
              let p_street1 = value.p_street1;
              let dc_completed = value.dc_completed;
              let agent_id = value.agent_id;
              let id_contractor = value.id_contractor;
              let task_owner_id = value.task_owner_id;
              let avatar_path = value.avatar_path;
              let civil_status = value.civil_status;
              let nationality = value.nationality;
              let number_children = value.number_children;
              let place_birth = value.place_birth;
              let agent = value.agent;
              let dc_collector = value.dc_collector;
              let bankname = value.bankname;
              let mobile_money_operator = value.mobile_money_operator;
              let cooperative_name = value.cooperative_name;
              let other_lang = value.other_lang;

              this.db.addContact(id_contact, contact_code, firstname, lastname, middlename, name, state, district, coordx, coordy, id_gender, birth_date, national_lang, p_phone, p_phone2, p_phone3, p_phone4, p_email, p_email2, p_email3, notes, id_type, id_supchain_type, id_title, id_coop_member, id_coop_member_no, id_cooperative, town_name, id_town, p_street1, dc_completed, agent_id, id_contractor, task_owner_id, avatar_path, civil_status, nationality, number_children, place_birth, agent, dc_collector, bankname, mobile_money_operator, cooperative_name, other_lang).then(() => {
                this.ct_progress = (i / this.ct_total_row);
                this.ct_total_rows = i;

                if (i == lenth) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('contacts', timestamp, 1, null, lenth);

                  this.loadContact();
                  this.ct_spinner = false;

                  if ((agent_type == 1) || (agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
                    this.restFetchLocationPictures(agent_id, agent_type, id_supchain_company, id_primary_company);
                  } else {
                    this.restFetchPaths(agent_id, agent_type, id_primary_company);
                  }
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);

        });
      });

    });
  }

  async restFetchLocationPictures(agent_id, agent_type, id_supchain_company, id_primary_company): Promise<any> {
    var docs;

    this.locp_spinner = true;
    this.locp_progress = 0;
    this.db.restFetchLocationPicturesLenth(agent_id, agent_type, id_supchain_company, id_primary_company).then(total_rows => {
      this.locp_total_row = total_rows;
      this.locp_total = total_rows;

      if ((agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
        if (id_supchain_company == 331) {
          docs = 'https://idiscover.ch/postgrest/icollect/dev/infrastructure_photos?id_cooperative=eq.' + id_primary_company;
        } else {
          docs = 'https://idiscover.ch/postgrest/icollect/dev/infrastructure_photos?id_contractor=eq.' + id_primary_company;
        }

      } else {
        docs = 'https://idiscover.ch/postgrest/icollect/dev/infrastructure_photos?agent_id=eq.' + agent_id;
      }

      this.db.deleteLocationPictures().then(() => {
        this.http.get(docs, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let lenth: number = r.length;

          if (lenth == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('location_pictures', timestamp, 1, null, lenth);

            this.loadLocationPicture();
            this.locp_spinner = false;
            this.restFetchLocation(agent_id, agent_type, id_supchain_company, id_primary_company);

          } else {
            let i = 1;
            r.forEach(value => {
              let sync_id = value.id_infrastructure_photo;
              let date = value.photo_date;
              let agent_id = value.agent_id;
              let coordx = value.coordx;
              let coordy = value.coordy;
              let accuracy = value.accuracy;
              let heading = value.heading;
              let sync = value.sync;
              let description = value.photo_description;
              let cloud_path = value.photo_link;
              let id_location = value.id_infrastructure;
              let id_cooperative = value.id_cooperative;
              let id_contractor = value.id_contractor;

              this.db.addLocationPicture(id_location, null, date, agent_id, coordx, coordy, sync, accuracy, heading, null, description, cloud_path, sync_id, id_cooperative, id_contractor).then(() => {
                this.locp_progress = (i / this.locp_total_row);
                this.locp_total_rows = i;

                if (i == lenth) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('location_pictures', timestamp, 1, null, lenth);

                  this.loadLocationPicture();
                  this.locp_spinner = false;
                  this.restFetchLocation(agent_id, agent_type, id_supchain_company, id_primary_company);
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });

      });
    });
  }

  async restFetchLocation(agent_id, agent_type, id_supchain_company, id_primary_company): Promise<any> {
    var location_start;

    this.loc_spinner = true;
    this.loc_progress = 0;
    this.db.restFetchLocationLenth(agent_id, agent_type, id_supchain_company, id_primary_company).then(total_rows => {
      this.loc_total_row = total_rows;
      this.loc_total = total_rows;

      if ((agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
        if (id_supchain_company == 331) {
          location_start = 'https://idiscover.ch/postgrest/icollect/dev/infrastructure?id_cooperative=eq.' + id_primary_company;
        } else {
          location_start = 'https://idiscover.ch/postgrest/icollect/dev/infrastructure?id_contractor=eq.' + id_primary_company;
        }

      } else {
        location_start = 'https://idiscover.ch/postgrest/icollect/dev/infrastructure?agent_id=eq.' + agent_id;
      }

      this.db.deleteLocations().then(() => {
        this.http.get(location_start, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let lenth: number = r.length;

          if (lenth == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('locations', timestamp, 1, null, lenth);

            this.loadLocation();
            this.loc_spinner = false;
            this.restFetchPaths(agent_id, agent_type, id_primary_company);

          } else {
            let i = 1;
            r.forEach(value => {
              let id_location = value.id_infrastructure;
              let location_type = value.infrastructure_type;
              let description = value.description1;
              let date = value.date;
              let agent_id = value.agent_id;
              let coordx = value.coordx;
              let coordy = value.coordy;
              let town = value.city_name;
              let area = value.description2;
              let id_region = value.id_region;
              let region_name = value.region_name;
              let id_proj_company = value.id_proj_company;
              let accuracy = value.accuracy;
              let id_cooperative = value.id_cooperative;
              let id_contractor = value.id_contractor;

              this.db.addLocation(id_location, location_type, description, date, coordx, coordy, town, area, agent_id, 0, id_region, region_name, id_proj_company, accuracy, id_cooperative, id_contractor).then(() => {
                this.loc_progress = (i / this.loc_total_row);
                this.loc_total_rows = i;

                if (i == lenth) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('locations', timestamp, 1, null, lenth);

                  this.loadLocation();
                  this.loc_spinner = false;
                  this.restFetchPaths(agent_id, agent_type, id_primary_company);
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });
      });

    });
  }

  async restFetchPaths(agent_id, agent_type, id_primary_company): Promise<any> {
    var plantation_lines_start;

    this.path_spinner = true;
    this.path_progress = 0;
    this.db.restFetchPathsLenth(agent_id, agent_type, id_primary_company).then(total_rows => {
      this.path_total_row = total_rows;
      this.path_total = total_rows;

      if (agent_type == 3) {
        plantation_lines_start = 'https://idiscover.ch/postgrest/icollect/dev/v_plantation_lines?id_contact=eq.' + agent_id;
      } else 
      if (agent_type == 2) {
        plantation_lines_start = 'https://idiscover.ch/postgrest/icollect/dev/v_plantation_lines?id_company=eq.' + id_primary_company;
      } else {
        plantation_lines_start = 'https://idiscover.ch/postgrest/icollect/dev/v_plantation_lines?id_company=eq.' + id_primary_company;
      }

      this.db.deletePaths().then(() => {
        this.http.get(plantation_lines_start, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let n: number = r.length;

          if (n == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('paths', timestamp, 1, null, n);

            this.loadPaths();
            this.path_spinner = false;
            this.restFetchPlantation(agent_id, agent_type, this.user.id_supchain_company, id_primary_company);

          } else {
            let i = 1;
            r.forEach(value => {
              let path_json;
              let id_path = value.plant_line_id;
              let path_name = null;

              let plantation_id = value.id_plantation;
              let id_region = value.id_region;

              let rest_path = value.geom_json;
              if (rest_path == 'null') { path_json = null; }
              else { path_json = rest_path; }

              let id_agent = value.id_agent;
              let created_date = value.created_date;
              let sync = 0;
              let id_company = value.id_company;
              let id_contact = value.id_contact;

              this.db.addPath(id_path, path_name, plantation_id, id_region, path_json, id_agent, created_date, sync, id_company, id_contact).then(() => {
                this.path_progress = (i / this.path_total_row);
                this.path_total_rows = i;

                if (i == n) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('paths', timestamp, 1, null, n);

                  this.loadPaths();
                  this.path_spinner = false;
                  this.restFetchPlantation(agent_id, agent_type, this.user.id_supchain_company, id_primary_company);
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });
      });
    });
  }

  async restFetchPlantation(agent_id, agent_type, id_supchain_company, id_primary_company): Promise<any> {
    var v_plantation;

    this.plt_spinner = true;
    this.plt_progress = 0;
    this.db.restFetchPlantationLenth(agent_id, agent_type, id_supchain_company, id_primary_company).then(total_rows => {
      this.plt_total_row = total_rows;
      this.plt_total = total_rows;

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

      this.db.deletePlantations().then(() => {
        this.http.get(v_plantation, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let lenth: number = r.length;

          if (lenth == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('plantations', timestamp, 1, null, lenth);

            this.loadPlantation();
            this.plt_spinner = false;
            this.restFetchPlantationtDoc(agent_id, agent_type, id_supchain_company, id_primary_company);

          } else {
            let i = 1;
            r.forEach(value => {
              let geom_json;
              let id_plantation = value.id_plantation;
              let plantationsite_id = value.plantationsite_id;
              let id_contact = value.id_contact;

              let id_town = value.id_town;
              let name_town = value.name_town;
              let property = value.property;
              let coordx = value.coordx;
              let coordy = value.coordy;

              let rest_geom_json = JSON.stringify(value.geom_json);
              if (rest_geom_json == 'null') { geom_json = null; }
              else { geom_json = rest_geom_json; }

              let year_creation = value.year_creation;
              let title_deed = value.title_deed;
              let notes = value.notes;
              let area_acres = value.area_acres;
              let surface_ha = value.surface_ha;
              let area = value.area;
              let code_plantation = value.code_plantation;

              let checked_out = null;
              let checked_out_by = null;
              let checked_out_date = null;

              let id_culture = value.id_culture;
              let id_culture1 = value.id_culture1;
              let id_culture2 = value.id_culture2;
              let id_culture3 = value.id_culture3;
              let id_culture4 = value.id_culture4;
              let bio = value.bio;
              let bio_suisse = value.bio_suisse;
              let perimeter = value.perimeter;
              let variety = value.variety;
              let eco_river = value.eco_river;
              let eco_shallows = value.eco_shallows;
              let eco_wells = value.eco_wells;
              let name_manager = value.name_manager;
              let manager_phone = value.manager_phone;
              let seed_type = value.seed_type;
              let dc_completed = value.dc_completed;
              let inactive = value.inactive;
              let inactive_date = value.inactive_date;
              let id_contractor = value.id_contractor;
              let agent_id = value.agent_id;
              let globalgap = value.globalgap;
              let rspo = value.rspo;

              let numb_feet = value.numb_feet;
              let mobile_data = 0;

              let synthetic_fertilizer = value.synthetic_fertilizer;
              let synthetic_fertilizer_photo = value.synthetic_fertilizer_photo;
              let synthetic_herbicides = value.synthetic_herbicides;
              let synthetic_herbicides_photo = value.synthetic_herbicides_photo;
              let synthetic_pesticide = value.synthetic_pesticide;
              let synthetic_pesticide_photo = value.synthetic_pesticide_photo;
              let adjoining_cultures = value.adjoining_cultures;
              let intercropping = value.intercropping;
              let harvest = value.harvest;
              let forest = value.forest;
              let sewage = value.sewage;
              let waste = value.waste;
              let rating = value.rating;
              let manager_civil = value.manager_civil;
              let number_staff_permanent = value.number_staff_permanent;
              let number_staff_temporary = value.number_staff_temporary;
              let yield_estimate = value.yield_estimate;
              let storage_coordx = value.storage_coordx;
              let storage_coordy = value.storage_coordy;
              let storage_photo = value.storage_photo;
              let area_estimate_ha = value.area_estimate_ha;
              let fire = value.fire;
              let owner_manager = value.id_owner_manager;
              let id_manager = value.id_manager;
              let code_farmer = value.code_farmer;
              let fair_trade = value.fair_trade;

              let pest = value.pest;
              let irrigation = value.irrigation;
              let drainage = value.drainage;
              let slope = value.slope;
              let slope_text = value.slope_text;
              let extension = value.extension;
              let year_extension = value.year_extension;
              let replanting = value.replanting;
              let year_to_replant = value.year_to_replant;
              let lands_rights_conflict = value.lands_rights_conflict;
              let lands_rights_conflict_note = value.lands_rights_conflict_note;
              let road_access = value.road_access;
              let farmer_experience = value.farmer_experience;
              let farmer_experience_level = value.farmer_experience_level;
              let day_worker_pay = value.day_worker_pay;
              let gender_workers = value.gender_workers;
              let migrant_workers = value.migrant_workers;
              let children_work = value.children_work;

              this.db.addPlantation(id_plantation, plantationsite_id, id_contact, id_town, name_town, property, coordx, coordy, geom_json, year_creation, title_deed, notes, area_acres, surface_ha, area, code_plantation, checked_out, checked_out_by, checked_out_date, id_culture, id_culture1, id_culture2, id_culture3, id_culture4, bio, bio_suisse, perimeter, variety, eco_river, eco_shallows, eco_wells, name_manager, manager_phone, seed_type, dc_completed, inactive, inactive_date, id_contractor, agent_id, numb_feet, mobile_data, globalgap, rspo, synthetic_fertilizer, synthetic_fertilizer_photo, synthetic_herbicides, synthetic_herbicides_photo, synthetic_pesticide, synthetic_pesticide_photo, adjoining_cultures, intercropping, harvest, forest, sewage, waste, rating, manager_civil, number_staff_permanent, number_staff_temporary, yield_estimate, storage_coordx, storage_coordy, storage_photo, area_estimate_ha, fire, owner_manager, id_manager, code_farmer, fair_trade, pest, irrigation, drainage, slope, slope_text, extension, year_extension, replanting, year_to_replant, lands_rights_conflict, lands_rights_conflict_note, road_access, farmer_experience, farmer_experience_level, day_worker_pay, gender_workers, migrant_workers, children_work).then(() => {
                this.plt_progress = (i / this.plt_total_row);
                this.plt_total_rows = i;

                if (i == lenth) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('plantations', timestamp, 1, null, lenth);

                  this.loadPlantation();
                  this.plt_spinner = false;
                  this.restFetchPlantationtDoc(agent_id, agent_type, id_supchain_company, id_primary_company);
                }

                i = i + 1;
              }).catch(err => alert(JSON.stringify(err)));
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });

      });
    });
  }


  async restFetchPlantationtDoc(agent_id, agent_type, id_supchain_company, id_primary_company): Promise<any> {
    let docs;

    this.pltd_spinner = true;
    this.pltd_progress = 0;
    this.db.restFetchPlantationtDocLenth(agent_id, agent_type, id_supchain_company, id_primary_company).then(total_rows => {
      this.pltd_total_row = total_rows;
      this.pltd_total = total_rows;

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

      this.db.deletePlantationsDoc().then(() => {
        this.http.get(docs, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let lenth: number = r.length;

          if (lenth == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('plantation_docs', timestamp, 1, null, lenth);

            this.loadPlantationDoc();
            this.pltd_spinner = false;
            if ((agent_type == 1) || (agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
              this.restFetchProjects(agent_id, agent_type, id_supchain_company, id_primary_company);
            } else {
              //if (this.type == 'login') {
              //  this.restFetchRegvalues(0);
              //} else {
              //  this.restFetchServeyAswers();
              //}

              this.restFetchServeyAswers();
            }

          } else {
            let i = 1;
            r.forEach(value => {
              let id_doc = value.id_plantdoc;
              let id_plantation = value.plantation_id;
              let doc_date = value.doc_date;
              let doc_type = value.doc_type;
              let cloud_path = value.doc_link;
              let coordx = value.coordx;
              let coordy = value.coordy;
              let accuracy = value.accuracy;
              let heading = value.heading;
              let description = value.description;
              let sync = value.sync;

              this.db.addPlantationDoc(id_doc, id_plantation, doc_date, doc_type, cloud_path, coordx, coordy, accuracy, heading, description, sync, agent_id).then(() => {
                this.pltd_progress = (i / this.pltd_total_row);
                this.pltd_total_rows = i;

                if (i == lenth) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('plantation_docs', timestamp, 1, null, lenth);

                  this.loadPlantationDoc();
                  this.pltd_spinner = false;
                  if ((agent_type == 1) || (agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
                    this.restFetchProjects(agent_id, agent_type, id_supchain_company, id_primary_company);
                  } else {
                    //if (this.type == 'login') {
                    //  this.restFetchRegvalues(0);
                    //} else {
                    //  this.restFetchServeyAswers();
                    //}

                    this.restFetchServeyAswers();
                  }
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });

      });
    });
  }

  async restFetchProjects(agent_id, agent_type, id_supchain_company, id_primary_company): Promise<any> {
    var v_mob_agent_projects;

    this.pjt_spinner = true;
    this.pjt_progress = 0;
    this.db.restFetchProjectsLenth(agent_id, agent_type, id_supchain_company, id_primary_company).then(total_rows => {
      this.pjt_total_row = total_rows;
      this.pjt_total = total_rows;

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

      this.db.deleteProjects().then(() => {
        this.http.get(v_mob_agent_projects, {}, {}).then(data => {
          let raw = JSON.parse(data.data);
          let lenth: number = raw.length;

          if (lenth == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('projects', timestamp, 1, null, lenth);

            this.loadProject();
            this.pjt_spinner = false;
            this.restFetchTasks(agent_id, agent_type, id_supchain_company, id_primary_company);

          } else {
            let i = 1;
            let agent_id;

            raw.forEach(value => {
              let id_project = value.id_project;
              let project_name = value.project_name;
              let project_type = value.project_type;
              let project_type_name = value.project_type_name;
              let start_date = value.start_date;
              let due_date = value.due_date;
              let project_status = value.project_status;
              let id_company = value.id_company;
              let company_name = value.company_name;
              let id_culture = value.id_culture;
              let name_culture = value.name_culture;
              let country_id = value.country_id;
              let name_country = value.name_country;
              let region_id = value.region_id;

              if(agent_type == 2) {
                agent_id = this.user.id_contact;
              } else { agent_id = value.agent_id; }
              
              let id_cooperative = value.id_cooperative;

              this.db.addProject(id_project, project_name, project_type, project_type_name, start_date, due_date, project_status, id_company, company_name, id_culture, name_culture, country_id, name_country, region_id, agent_id, this.user.agent_type, id_cooperative).then(() => {
                this.pjt_progress = (i / this.pjt_total_row);
                this.pjt_total_rows = i;

                if (i == lenth) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('projects', timestamp, 1, null, lenth);

                  this.loadProject();
                  this.pjt_spinner = false;
                  this.restFetchTasks(agent_id, agent_type, id_supchain_company, id_primary_company);
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });

      });
    });
  }

  async restFetchTasks(agent_id, agent_type, id_supchain_company, id_primary_company): Promise<any> {
    var v_project_tasks;

    this.ptsk_spinner = true;
    this.ptsk_progress = 0;
    this.db.restFetchTasksLenth(agent_id, agent_type, id_supchain_company, id_primary_company).then(total_rows => {
      this.ptsk_total_row = total_rows;
      this.ptsk_total = total_rows;

      if ((agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
        if (id_supchain_company == 331) {
          v_project_tasks = 'https://idiscover.ch/postgrest/icollect/dev/v_project_tasks?id_cooperative=eq.' + id_primary_company;
        } else {
          v_project_tasks = 'https://idiscover.ch/postgrest/icollect/dev/v_project_tasks?id_company=eq.' + id_primary_company;
        }
      } else {
        v_project_tasks = 'https://idiscover.ch/postgrest/icollect/dev/v_project_tasks?agent_id=eq.' + agent_id;
      }

      this.db.deleteProjectTask().then(() => {
        this.http.get(v_project_tasks, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let lenth: number = r.length;

          if (lenth == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('project_tasks', timestamp, 1, null, lenth);

            this.loadProjectTask();
            this.ptsk_spinner = false;
            this.restFetchTownsTasks(agent_id, agent_type, id_primary_company);

          } else {
            let i = 1;
            r.forEach(value => {
              let id_task = value.id_task;
              let task_done = value.task_done;
              let task_type = value.task_type;
              let task_type_name = value.task_type_name;
              let id_project = value.id_project;
              let project_name = value.project_name;
              let task_titleshort = value.task_titleshort;
              let task_description = value.task_description;
              let start_date = value.start_date;
              let due_date = value.due_date;
              let task_status = value.task_status;
              let task_status_name = value.task_status_name;
              let task_public = value.task_public;
              let task_public_name = value.task_public_name;
              let status_name = value.status_name;
              let task_delegated_id = value.task_delegated_id;
              let task_delegated_name = value.task_delegated_name;
              let agent_id = value.agent_id;
              let agent_assist_id = value.agent_assist_id;
              let agent_name = value.agent_name;
              let tt_farmers = value.tt_farmers;
              let tt_plantation = value.tt_plantation;
              let planned_start_date = value.planned_start_date;
              let planned_end_date = value.planned_end_date;
              let town_id = value.town_id;
              let id_cooperative = value.id_cooperative;

              this.db.addProjectTask(id_task, task_done, task_type, task_type_name, id_project, project_name, task_titleshort, task_description, start_date, due_date, task_status, task_status_name, task_public, task_public_name, status_name, task_delegated_id, task_delegated_name, agent_id, agent_assist_id, agent_name, tt_farmers, tt_plantation, planned_start_date, planned_end_date, town_id, this.user.agent_type, id_cooperative).then(() => {
                this.ptsk_progress = (i / this.ptsk_total_row);
                this.ptsk_total_rows = i;

                if (i == lenth) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('project_tasks', timestamp, 1, null, lenth);

                  this.loadProjectTask();
                  this.ptsk_spinner = false;
                  this.restFetchTownsTasks(agent_id, agent_type, id_primary_company);
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });

      });
    });
  }

  async restFetchTownsTasks(agent_id, agent_type, id_primary_company): Promise<any> {
    var v_mob_towns_tasks;

    this.ttsk_spinner = true;
    this.ttsk_progress = 0;
    this.db.restFetchTownsTasksLenth(agent_id, agent_type, id_primary_company).then(total_rows => {
      this.ttsk_total_row = total_rows;
      this.ttsk_total = total_rows;

      if ((agent_type == 2) || (agent_type == 4) || (agent_type == 5) || (agent_type == 6)) {
        v_mob_towns_tasks = 'https://idiscover.ch/postgrest/icollect/dev/v_mob_towns_tasks?task_delegated_id=eq.' + id_primary_company;
      } else {
        v_mob_towns_tasks = 'https://idiscover.ch/postgrest/icollect/dev/v_mob_towns_tasks?agent_id=eq.' + agent_id;
      }

      this.db.deleteTownsTask().then(() => {
        this.http.get(v_mob_towns_tasks, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let n: number = r.length;

          if (n == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('town_tasks', timestamp, 1, null, n);

            this.loadTownTask();
            this.ttsk_spinner = false;
            //if (this.type == 'login') {
            //  this.restFetchRegvalues(0);
            //} else {
            //  this.restFetchServeyAswers();
            //}

            this.restFetchServeyAswers();

          } else {
            let i = 1;
            r.forEach(value => {
              let town_name;

              let town_id = value.town_id;
              let agent_id = value.agent_id;
              let rest_town_name = value.town_name;
              if (rest_town_name == 'null') { town_name = null }
              else { town_name = rest_town_name; }

              let id_project = value.id_project;
              let task_owner_id = value.task_owner_id;
              let task_delegated_id = value.task_delegated_id;

              this.db.addTownsTask(town_id, agent_id, town_name, id_project, task_owner_id, task_delegated_id, this.user.agent_type).then(() => {
                this.ttsk_progress = (i / this.ttsk_total_row);
                this.ttsk_total_rows = i;

                if (i == n) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('town_tasks', timestamp, 1, null, n);

                  this.loadTownTask();
                  this.ttsk_spinner = false;
                  //if (this.type == 'login') {
                  //  this.restFetchRegvalues(0);
                  //} else {
                  //  this.restFetchServeyAswers();
                  //}

                  this.restFetchServeyAswers();
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error);  // error message as string
          console.log(error.headers);
        });

      });
    });
  }

  async restFetchRegvalues(conf): Promise<any> {
    let v_regvalues = 'https://idiscover.ch/postgrest/icollect/dev/v_regvalues';

    if(conf==1){
      this.hideall();
      this.login = false;
    }

    this.reg_spinner = true;
    this.reg_progress = 0;
    this.db.restFetchRegvaluesLenth().then(total_rows => {
      this.reg_total_row = total_rows;
      this.reg_total = total_rows;

      this.db.deleteRegvalues().then(() => {
        this.http.get(v_regvalues, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let lenth = r.length;

          if (lenth == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('registervalue', timestamp, 1, null, lenth);

            this.loadRegister();
            this.reg_spinner = false;
            if(conf==0){
              this.restFetchServeyAswers();
            }
            
          } else {
            let i = 1;
            r.forEach(value => {
              let id_regvalue = value.id_regvalue;
              let id_register = value.id_register;
              let regname = value.regname;
              let regcode = value.regcode;
              let nvalue = value.nvalue;
              let cvalue = value.cvalue;
              let cvaluede = value.cvaluede;
              let cvaluefr = value.cvaluefr;
              let cvaluept = value.cvaluept;
              let cvaluees = value.cvaluees;
              let dvalue = value.dvalue;

              this.db.addRegvalue(id_regvalue, id_register, regname, regcode, nvalue, cvalue, cvaluede, cvaluefr, cvaluept, cvaluees, dvalue).then(() => {
                this.reg_progress = (i / this.reg_total_row);
                this.reg_total_rows = i;

                if (i == lenth) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('registervalue', timestamp, 1, null, lenth);

                  this.loadRegister();
                  this.reg_spinner = false;
                  if(conf==0){
                    this.restFetchServeyAswers();
                  } else {
                    this.login = true;
                  }
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });
      });
    });
  }

  async restFetchServeyAswers(): Promise<any> {
    let sur_answers = 'https://idiscover.ch/postgrest/icollect/dev/sur_answers';

    this.sra_spinner = true;
    this.sra_progress = 0;
    this.db.restFetchServeyAswersLenth().then(total_rows => {
      this.sra_total_row = total_rows;
      this.sra_total = total_rows;

      this.db.deleteSurvey_answers().then(() => {
        this.http.get(sur_answers, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let lenth: number = r.length;

          if (lenth == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('sur_answers', timestamp, 1, null, lenth);

            this.loadSurvey_answers();
            this.sra_spinner = false;
            this.restFetchServeyQuestions(2);

          } else {
            let i = 1;
            r.forEach(value => {
              let id_suranswer = value.id_suranswer;
              let surq_id = value.surq_id;
              let ans_code = value.ans_code;
              let ans_text_fr = value.ans_text_fr;
              let ans_text_en = value.ans_text_en;
              let score = value.score;

              this.db.addSur_answers(id_suranswer, surq_id, ans_code, ans_text_fr, ans_text_en, score).then(() => {
                this.sra_progress = (i / this.sra_total_row);
                this.sra_total_rows = i;

                if (i == lenth) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('sur_answers', timestamp, 1, null, lenth);

                  this.loadSurvey_answers();
                  this.sra_spinner = false;
                  this.restFetchServeyQuestions(2);
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });

      });
    });
  }

  async restFetchServeyQuestions(value): Promise<any> {
    let sur_questions = 'https://idiscover.ch/postgrest/icollect/dev/sur_questions?surtemplate_id=eq.' + value;

    this.srq_spinner = true;
    this.srq_progress = 0;
    this.db.restFetchServeyQuestionsLenth(value).then(total_rows => {
      this.srq_total_row = total_rows;
      this.srq_total = total_rows;

      this.db.deleteSur_question().then(() => {
        this.http.get(sur_questions, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let n: number = r.length;

          if (n == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('sur_questions', timestamp, 1, null, n);

            this.loadSurvey_question();
            this.srq_spinner = false;
            this.restFetchServeyTemplate(2);

          } else {
            let i = 1;
            r.forEach(value => {
              let id_surq = value.id_surq;
              let q_seq = value.q_seq;
              let q_text = value.q_text;
              let q_type = value.q_type;
              let surtemplate_id = value.surtemplate_id;

              this.db.addSur_question(id_surq, q_seq, q_text, q_type, surtemplate_id).then(() => {
                this.srq_progress = (i / this.srq_total_row);
                this.srq_total_rows = i;

                if (i == n) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('sur_questions', timestamp, 1, null, n);

                  this.loadSurvey_question();
                  this.srq_spinner = false;
                  this.restFetchServeyTemplate(2);
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });
      });
    });
  }

  async restFetchServeyTemplate(value): Promise<any> {
    let sur_template = 'https://idiscover.ch/postgrest/icollect/dev/sur_template?id_survey=eq.' + value;

    this.srt_spinner = true;
    this.srt_progress = 0;
    this.db.restFetchServeyTemplateLenth(value).then(total_rows => {
      this.srt_total_row = total_rows;
      this.srt_total = total_rows;

      this.db.deleteSurveyTemplate().then(() => {
        this.http.get(sur_template, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let n: number = r.length;

          if (n == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('sur_template', timestamp, 1, null, n);

            this.loadSurvey_template();
            this.srt_spinner = false;
            this.restFetchServeyUsersAnswers(2, this.user.agent_id, this.user.agent_type);

          } else {
            let i = 1;
            r.forEach(value => {
              let id_survey = value.id_survey;
              let survey_date = value.survey_date;
              let description = value.description;
              let survey_type = value.survey_type;

              this.db.addSurveyTemplate(id_survey, survey_date, description, survey_type).then(() => {
                this.srt_progress = (i / this.srt_total_row);
                this.srt_total_rows = i;

                if (i == n) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('sur_template', timestamp, 1, null, n);

                  this.loadSurvey_template();
                  this.srt_spinner = false;
                  this.restFetchServeyUsersAnswers(2, this.user.id_contact, this.user.agent_type);
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });
      });
    });
  }

  async restFetchServeyUsersAnswers(value, agent_id, agent_type): Promise<any> { 
    var sur_servey_answers;

    this.srua_spinner = true;
    this.srua_progress = 0;
    this.db.restFetchServeyUsersAnswersLenth(value, agent_id, agent_type).then(total_rows => {
      this.srua_total_row = total_rows;  
      this.srua_total = total_rows;  

      if (agent_type == 3) {
        sur_servey_answers = 'https://idiscover.ch/postgrest/icollect/dev/sur_survey_answers?surtemplate_id=eq.' + value + '&id_contact=eq.' + agent_id;
      } else
        if (agent_type == 1) {
          sur_servey_answers = 'https://idiscover.ch/postgrest/icollect/dev/sur_survey_answers?surtemplate_id=eq.' + value;
        } else {
          sur_servey_answers = 'https://idiscover.ch/postgrest/icollect/dev/sur_survey_answers?surtemplate_id=eq.' + value + '&id_agent=eq.' + agent_id;
        }

      this.db.deleteContactSurveyAnswers().then(() => { 
        this.http.get(sur_servey_answers, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let lenth: number = r.length;  

          if (lenth == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('sur_survey_answers', timestamp, 1, null, lenth);

            this.loadSurvey_UserAnswers();
            this.srua_spinner = false;
            //if (this.type == 'login') {
            //  this.restFetchTowns(0);
            //} else {
            //  this.login = true;
            //}

            this.login = true;

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

              this.db.addSurvey_answers(id_suranswer, sur_survey_id, surtemplate_id, surquest_id, suranswer_id, suranswer, surscore, id_contact, sur_datetime, id_agent, sync, coordx, coordy).then(() => {
                this.srua_progress = (i / this.srua_total_row);
                this.srua_total_rows = i;

                if (i == lenth) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('sur_survey_answers', timestamp, 1, null, lenth);

                  this.loadSurvey_UserAnswers();
                  this.srua_spinner = false;
                  //if (this.type == 'login') {
                  //  this.restFetchTowns(0);
                  //} else {
                  //  this.login = true;
                  //}

                  this.login = true;
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });
      });
    });
  }

  async restFetchTowns(conf): Promise<any> {
    let towns_start = 'https://idiscover.ch/postgrest/icollect/dev/towns?id_country=eq.1';

    if(conf==1){
      this.hideall();
      this.login = false;
    }

    this.twn_spinner = true;
    this.twn_progress = 0;
    this.db.restFetchTownsLenth().then(total_rows => {
      this.twn_total_row = total_rows;
      this.twn_total = total_rows;

      this.db.deleteTowns().then(() => {
        this.http.get(towns_start, {}, {}).then(data => {
          let r = JSON.parse(data.data);
          let lenth: number = r.length;

          if (lenth == 0) {
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('towns', timestamp, 1, null, lenth);

            this.loadTown();
            this.twn_spinner = false;
            this.db.logIn(this.user.username, this.user.save_login).then(() => {
              if (this.type == 'login') {
                this.navCtrl.navigateRoot(['/menu/project-list']);
              } else {
                this.login = true;
              }
            });

          } else {
            let i = 1;
            r.forEach(value => {
              let gid_town = value.gid_town;
              let name_town = value.name_town;

              this.db.addTown(gid_town, name_town).then(() => {
                this.twn_progress = (i / this.twn_total_row);
                this.twn_total_rows = i;

                if (i == lenth) {
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('towns', timestamp, 1, null, lenth);

                  this.loadTown();
                  this.twn_spinner = false;
                  this.db.logIn(this.user.username, this.user.save_login).then(() => {
                    if (this.type == 'login') {
                      this.navCtrl.navigateRoot(['/menu/project-list']);
                    } else {
                      this.login = true;
                    }
                  });
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });

      });
    });
  }

  back() {
    this.navCtrl.navigateBack(['/menu/settings']);
  }

}
