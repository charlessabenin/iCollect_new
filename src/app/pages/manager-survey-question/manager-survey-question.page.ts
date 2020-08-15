import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { CacheService } from 'ionic-cache';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-manager-survey-question',
  templateUrl: './manager-survey-question.page.html',
  styleUrls: ['./manager-survey-question.page.scss'],
})
export class ManagerSurveyQuestionPage implements OnInit {

  complete = false;
  not_complete = true;

  survey_answers: any;
  template_id: any;
  question_id: any;
  question: any;
  numb_q: any;

  id_project: any;
  id_task: any;
  id_contact: any;

  coordx: any;
  coordy: any;
  heading: any;
  accuracy: any;
  agent_id: any;
  date: any;
  ticker: number = 0;

  answersList: any[] = [];

  constructor(
    private alertCtrl: AlertController,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private toastController: ToastController,
    public loading: LoadingService,
    private db: DatabaseService,
    public navCtrl: NavController,
    public cache: CacheService,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.template_id = this.activatedRoute.snapshot.paramMap.get('template_id');

    this.storage.get('id_project').then((val) => { this.id_project = val; });
    this.storage.get('id_task').then((val) => { this.id_task = val; });
    this.storage.get('id_manager').then((val) => { this.id_contact = val; });

    this.db.lastLogedUser().then(usr => {
      this.agent_id = usr.id_contact;
    });

    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.geolocation.getCurrentPosition().then((resp) => {
          this.coordx = resp.coords.latitude;
          this.coordy = resp.coords.longitude;
          this.accuracy = resp.coords.accuracy;
          this.heading = resp.coords.heading;

        }).catch((error) => {
          this.translate.get('LOCATION_ERROR').subscribe(value => {
            this.presentAlert(value + error, 'Error');
          });
        });
      }
    );

    var m = new Date();
    this.date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    this.loadData();
  }

  loadData() {
    this.db.getQuestionNumber(this.template_id).then(cQnb => {
      this.numb_q = cQnb.total;
      this.getCurrentQuestion();
    });
  }

  getCurrentQuestion() {
    this.storage.get('id_manager').then((val) => {
      this.db.getCurrentSurQuestion(val).then(q => {
        let question = q.total + 1;
        if (question > this.numb_q) {
          this.not_complete = false;
          this.complete = true;
        } else {
          this.getQuestion(question);
        }
      });
    });
  }

  getQuestion(seq) {
    this.db.getSur_question(seq, this.template_id).then(qst => {
      this.question = qst.q_text;
      this.question_id = qst.id_surq;
      this.getAnswers(qst.id_surq);
    });
  }

  getAnswers(question_id) {
    this.db.getSur_answers(question_id).then(_ => {
      this.db.getSurAnswer().subscribe(data => {
        this.answersList = data;
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

  nextQuestion() {
    this.translate.get('SAVING_SUR_ANSWER').subscribe(value => {
      this.loading.showLoader(value);
    });

    this.storage.get('id_manager').then((val) => {
      this.db.getSur_answer(this.survey_answers).then(ans => {
        let suranswer = ans.ans_text_fr;
        suranswer = suranswer.split("'").join('’');

        this.db.addContactSurveyAnswers(ans.id_suranswer, this.template_id, this.question_id, this.survey_answers, suranswer, ans.score, val, this.date, this.agent_id, this.coordx, this.coordy, this.accuracy, this.heading).then(() => {
          this.translate.get('SERV_ANSWER_SAVED').subscribe(
            value => { this.presentAlert(value, 'Success'); }
          );

          this.saveTicker('id_suranswer', ans.id_suranswer);
          this.saveTicker('surtemplate_id', this.template_id);
          this.saveTicker('surquest_id', this.question_id);
          this.saveTicker('suranswer_id', this.survey_answers);
          this.saveTicker('suranswer', suranswer);
          this.saveTicker('surscore', ans.score);
          this.saveTicker('id_contact', val);
          this.saveTicker('sur_datetime', this.date);
          this.saveTicker('id_agent', this.agent_id);
          this.saveTicker('coordx', this.coordx);
          this.saveTicker('coordy', this.coordy);
          this.saveTicker('accuracy', this.accuracy);
          this.saveTicker('heading', this.heading);

          this.loading.hideLoader();

          if(this.ticker == 1) {
            this.translate.get('TICKER_UPDATED').subscribe(value => {
              this.toastAlert(value);
            });
          }

          this.getCurrentQuestion();
        });

      });
    });
  }

  saveTicker(field_name, field_value) {
    var m = new Date();
    let created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
    let id_sur_survey_answers = this.agent_id + this.survey_answers;

    this.db.addTicker(this.agent_id, null, null, this.id_contact, field_name, field_value, 'sur_survey_answers', created_date, this.coordx, this.coordy, null, this.id_project, this.id_task, null, null, null, null, id_sur_survey_answers, null, null, this.survey_answers, null, null).then(() => {
      this.cache.clearAll();
      this.ticker = 1;
    });
  }

  async toastAlert(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }

  navback() {
    this.navCtrl.navigateForward(['/manager-survey']);
  }
}
