import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
})
export class SurveyPage implements OnInit {

  templateList: any[] = [];

  template: any;
  dataStored: number;
  user: any;

  constructor(
    private db: DatabaseService,
    public translate: TranslateService,
    private alertCtrl: AlertController,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.db.getSurveyTemplate(2).then(surv => {
      if (surv) {
        this.templateList.push({ value: surv.id_survey, name: surv.description });
        this.dataStored = 1;
      } else {
        this.templateList.push({ value: 2, name: "PPI Côte d'Ivoire 2015" });
        this.dataStored = 0;
      }

    }).catch(err => {
      console.log(err);
      this.templateList.push({ value: 2, name: "PPI Côte d'Ivoire 2015" });
      this.dataStored = 0;
    });

    this.db.lastLogedUser().then(usr => {
      this.user = usr;
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

  startServey() {  
    if (this.dataStored == 0) {
      if (this.template != null) {
        this.db.fetchSurveyData(this.template, 'farmer', this.user.id_contact, this.user.agent_type);
      } else {
        this.translate.get('SEL_SERV_REF').subscribe(
          value => { this.presentAlert(value, 'Info'); }
        );
      }

    } else {
      if (this.template != null) {
        this.db.updateUserSurv(this.user.id_contact, this.template); 
        this.navCtrl.navigateForward(['/survey-question', this.template]);
      } else {
        this.translate.get('SEL_SERV_REF').subscribe(
          value => { this.presentAlert(value, 'Info'); }
        );
      }
    }
  }

}
