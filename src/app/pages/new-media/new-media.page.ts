import { Component, OnInit } from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-new-media',
  templateUrl: './new-media.page.html',
  styleUrls: ['./new-media.page.scss'],
})
export class NewMediaPage implements OnInit {

  plantationDoc = false;
  contactDoc = false;
  doc_date: any;
  docImg: any;
  description: any;
  doc_type: any;

  docTypeList: any[] = [];

  dataType: any;
  id_contact: any;
  id_plantation: any;

  constructor(
    private file: File,
    private camera: Camera,
    private webview: WebView,
    private storage: Storage,
    public navCtrl: NavController,
    private db: DatabaseService
  ) {
 
  }

  ngOnInit() {
    var m = new Date();
    let date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
    this.doc_date = date;

    this.storage.get('id_contact').then((val) => { this.id_contact = val; });
    this.storage.get('id_plantation').then((val1) => { this.id_plantation = val1; });

    this.storage.get('dataType').then((val2) => {
      this.dataType = val2; 
      if (val2 == 'contact') {
        this.contactDoc = true;
        this.db.getDocTypeContactList().then(() => {
          this.db.getRegvalues().subscribe(data => {
            this.docTypeList = [];
            this.docTypeList = data;
          });
        });
      }

      if (val2 == 'plantation') {
        this.plantationDoc = true;
        this.db.getDocTypePlantationList().then(() => {
          this.db.getRegvalues().subscribe(data => {
            this.docTypeList = [];
            this.docTypeList = data;
          });
        });
      }
    });
  }

  getDocument(docType) {
    this.takePicture(this.camera.PictureSourceType.CAMERA, docType);
  }

  takePicture(sourceType: PictureSourceType, docType) {
    var options: CameraOptions = {
      quality: 100,
      targetWidth: 1024,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(imagePath => {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

      var id;
      if (docType == 'documents') { id = this.id_contact; } else { id = this.id_plantation; }

      var m = new Date();
      let created_date = m.getUTCFullYear() + "-" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + "-" + ("0" + m.getUTCMinutes()).slice(-2) + "-" + ("0" + m.getUTCSeconds()).slice(-2);

      var newFileName = id + '_' + created_date + ".jpg"; 

      let newPath = this.file.externalRootDirectory + 'icollect/' + docType;  
      this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => { 
        this.docImg = this.webview.convertFileSrc(newPath + '/' + newFileName); 

        this.db.lastLogedUser().then(usr => {
          if (docType == 'documents') {
            this.db.saveDocDataContact(this.id_contact, newFileName, this.description, this.doc_type, usr.id_contact, null);
          } else {
            this.db.saveDocDataPlantation(this.id_plantation, newFileName, this.description, this.doc_type, usr.id_contact);
          }
        });

        setTimeout(() => {
          this.navCtrl.navigateBack(['/media']);
        }, 2000);

      });
    });

  }

}
