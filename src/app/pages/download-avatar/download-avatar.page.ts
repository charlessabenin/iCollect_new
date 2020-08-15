import { Component, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { TranslateService } from '@ngx-translate/core';
import { NetworkService, ConnectionStatus } from 'src/app/services/network.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-download-avatar',
  templateUrl: './download-avatar.page.html',
  styleUrls: ['./download-avatar.page.scss'],
})
export class DownloadAvatarPage implements OnInit {

  status = true;
  avatar: any[] = [];
  avatarData: any[] = [];

  download = false;
  progress: any;

  constructor(
    private toastController: ToastController,
    private networkService: NetworkService,
    private alertCtrl: AlertController,
    public translate: TranslateService,
    private transfer: FileTransfer,
    public loading: LoadingService,
    private db: DatabaseService,
    private file: File
  ) { }

  ngOnInit() {
    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        this.status = true;
        this.loadData();
      }

      if (status == ConnectionStatus.Offline) {
        this.status = false;

        this.translate.get('CHECK_INTERNET').subscribe(value => { 
          this.toastAlert(value);
        });
      }
    });
  }

  createAvatarDir() {
    this.file.checkDir(this.file.externalRootDirectory, 'icollect/avatar').then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
      this.file.createDir(this.file.externalRootDirectory, 'icollect/avatar', false).then(response => {
        console.log('Directory create' + response);

      }).catch(err => { console.log('Directory no create' + JSON.stringify(err)); });
    });
  }

  async toastAlert(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

  loadData() {
    this.db.lastLogedUser().then(usr => {
      this.db.loadContactsAvatar(usr.id_contact, usr.agent_type).then(_ => {
        this.db.getContacts().subscribe(data => {
          this.avatarData = data;
          this.loadAvatar();
        });
      });
    });
  }

  loadAvatar() {
    this.avatar = [];
    this.avatarData.forEach(data => {

      var status_data;
      if (data.avatar_download == 1) {
        status_data = true;
      } else {
        status_data = false;
      }

      this.avatar.push({
        id_contact: data.id_contact,
        name: data.name,
        birth_date: data.birth_date,
        avatar_path: data.avatar_path,
        avatar_download: data.avatar_download,
        status_data: status_data,
        avatar: data.avatar
      });
    });
  }

  ionRefresh(event) {
    console.log('Pull Event Triggered!');
    setTimeout(() => {
      console.log('Async operation has ended');
      this.loadAvatar();
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

  dataDownload() {
    this.createAvatarDir();

    if (this.status == true) {
      var x = 0;
      this.translate.get('AVATAR_DOWNLOAD_BACKGROUND').subscribe(value => {
        this.loading.showLoader(value);
      });

      this.download = true;

      this.avatar.forEach(row => {
        let path = this.file.externalRootDirectory + 'icollect/avatar/' + row.avatar;
        let url = encodeURI(row.avatar_path);

        const fileTransfer: FileTransferObject = this.transfer.create();

        fileTransfer.onProgress((ProgressEvent: any) => {
          if (ProgressEvent.lengthComputable) {
            this.progress = Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) / 100;
            this.updateProgress(row.id_contact, this.progress);
          }
        });

        fileTransfer.download(url, path)
          .then((data) => {
            console.log(data);
            x = x + 1;
            
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
      
            this.db.addData('avatar', timestamp, 1, null, null);
            this.loadAvatar();

            this.download = false;
            this.loading.hideLoader();

            this.translate.get('PICTURE_DOWNLOADED').subscribe(value => { 
              this.presentAlert(x + value, 'Avatar');
            });

          }, (err) => { 
            console.log(err); 
            this.download = false;
            this.loading.hideLoader();
          });
      });
    }

  }

  updateProgress(id_contact, avatar_download) { 
    this.db.avatarDownload(id_contact, avatar_download).then(_ => {
      this.loadAvatar();
    });
  }

}
