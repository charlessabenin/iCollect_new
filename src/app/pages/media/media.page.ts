import { Component, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { EditMediaPage } from '../edit-media/edit-media.page';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { VideoPlayer } from '@ionic-native/video-player/ngx';

@Component({
  selector: 'app-media',
  templateUrl: './media.page.html',
  styleUrls: ['./media.page.scss'],
})
export class MediaPage implements OnInit {

  medias: any[] = [];
  fetch_media: any[] = [];

  plantation_data = false;
  contact_data = false;
  dataType: any;

  id_contact: any;
  id_plantation: any;

  constructor(
    private file: File,
    public navCtrl: NavController,
    private storage: Storage,
    private alertCtrl: AlertController,
    public loading: LoadingService,
    public translate: TranslateService,
    private photoViewer: PhotoViewer,
    private db: DatabaseService,
    private webview: WebView,
    private videoPlayer: VideoPlayer,
    private modalController: ModalController
  ) { }

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

  ngOnInit() {
    this.storage.get('id_contact').then((val) => { this.id_contact = val; });
    this.storage.get('id_plantation').then((val1) => { this.id_plantation = val1; });

    this.storage.get('dataType').then((val2) => {
      this.dataType = val2;
      if (val2 == 'contact') {
        this.contact_data = true;
        this.db.loadDocDataContact(this.id_contact).then(_ => {
          this.db.getContactDoc().subscribe(data => {
            this.fetch_media = [];
            this.fetch_media = data;
            this.loadData();
          });
        });
      }

      if (val2 == 'plantation') {
        this.plantation_data = true;
        this.db.loadDocDataPlantation(this.id_plantation).then(_ => {
          this.db.getPlantationDoc().subscribe(data => {
            this.fetch_media = [];
            this.fetch_media = data;
            this.loadData();
          });
        });
      }
    });

  }

  loadData() {
    this.medias = [];

    this.fetch_media.forEach(data => {

      var filePath, folder;
      if (this.dataType == 'contact') {
        if (data.description == 'household_avatar') {
          filePath = this.file.externalRootDirectory + 'icollect/household/' + data.filename;
          folder = 'household/';
        } else if (data.description == 'user_avatar') {
          filePath = this.file.externalRootDirectory + 'icollect/avatar/' + data.filename;
          folder = 'avatar/';
        } else {
          filePath = this.file.externalRootDirectory + 'icollect/documents/' + data.filename;
          folder = 'documents/';
        }  
      }
  
      if (this.dataType == 'plantation') {
        if(data.doc_type == 155){
          filePath = data.path;
        } else {
          filePath = this.file.externalRootDirectory + 'icollect/plantations/' + data.filename;
        }
        
        folder = 'plantations/';
      }
      
      this.file.checkFile(this.file.externalRootDirectory+ 'icollect/'+ folder, data.filename)
        .then(() => { 
          this.medias.push({
            id_doc: data.id_doc,
            name: data.name,
            filename: data.filename,
            description: data.description,
            doc_date: data.doc_date,
            doc_type: data.doc_type,
            sync: data.sync,
            cloud_path: data.cloud_path,
            cvalue: data.cvalue,
            path: this.webview.convertFileSrc(filePath)
          });

        })
        .catch(() => { 
          if(data.cloud_path!=null) {
            this.medias.push({
              id_doc: data.id_doc,
              name: data.name,
              filename: data.filename,
              description: data.description,
              doc_date: data.doc_date,
              doc_type: data.doc_type,
              sync: data.sync,
              cloud_path: data.cloud_path,
              cvalue: data.cvalue,
              path: this.webview.convertFileSrc(data.cloud_path) 
            });

          } else {
            this.medias.push({
              id_doc: data.id_doc,
              name: data.name,
              filename: data.filename,
              description: data.description,
              doc_date: data.doc_date,
              doc_type: data.doc_type,
              sync: data.sync,
              cloud_path: data.cloud_path,
              cvalue: data.cvalue,
              path: '../../../assets/not_found.jpg'
            });
          }
          
        }
      );
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

  showMedia(item) {
    if(item.doc_type == 155) {
      this.playVideo(item.filename);
    } else {
      if (this.dataType == 'contact') {
        var correctPath;
        if(item.cloud_path!=null) {
          correctPath = item.cloud_path;
        } else {
          if (item.description == 'user_avatar') {
            correctPath = this.file.externalRootDirectory + 'icollect/avatar/' + item.filename;
          } else
          if(item.description == 'household_avatar') {
            correctPath = this.file.externalRootDirectory + 'icollect/household/' + item.filename;
          } else {
            correctPath = this.file.externalRootDirectory + 'icollect/documents/' + item.filename;
          }  
        }
        
        this.photoViewer.show(correctPath);
      }
  
      if (this.dataType == 'plantation') {
        var correctPath;
        if(item.cloud_path!=null) {
          correctPath = item.cloud_path;
        } else {
          correctPath = this.file.externalRootDirectory + 'icollect/plantations/' + item.filename;
        }
   
        this.photoViewer.show(correctPath);
      }
    }
  }

  async playVideo(filename) { 
    let correctPath = this.file.externalRootDirectory + 'icollect/plantations/' + filename;
    this.videoPlayer.play(correctPath);
  }

  newMedia() {
    this.navCtrl.navigateForward(['/new-media']);
  }

  async openMeia(item) {
    const modal = await this.modalController.create({
      component: EditMediaPage,
      componentProps: {
        id_doc: item.id_doc
      }
    });
    modal.present();
  }

  async deleteConfirm(item) {
    var yes, no, title, msg;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });
    this.translate.get('DELETE_MEDIA_PP_TITLE').subscribe(value => { title = value; });
    this.translate.get('DELETE_MEDIA_PP_MSG').subscribe(value => { msg = value; });

    const alert = await this.alertCtrl.create({
      message: msg + item.filename + '?',
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
            this.deleteMedia(item.id_doc, item.filename);
          }
        }
      ]
    });
    alert.present();
  }

  deleteMedia(id_doc, filename) {
    if (this.dataType == 'contact') {
      this.db.deleteContactDoc(id_doc, this.id_contact).then(_ => {
        let correctPath = this.file.externalRootDirectory + 'icollect/documents/' + filename;

        this.file.removeFile(correctPath, filename).then(() => {
          this.translate.get('DOCUMENT_DELETE_SUCCESS').subscribe(value => { 
            this.presentAlert(value, 'Success');
          });
        })
      });
    }

    if (this.dataType == 'plantation') {
      this.db.deletePlantationDoc(id_doc, this.id_plantation).then(_ => {
        let correctPath = this.file.externalRootDirectory + 'icollect/plantations/' + filename;

        this.file.removeFile(correctPath, filename).then(() => {
          this.translate.get('MEDIA_DELETE_SUCCESS').subscribe(value => { 
            this.presentAlert(value, 'Success');
          });
        })
      });
    }
  }

}
