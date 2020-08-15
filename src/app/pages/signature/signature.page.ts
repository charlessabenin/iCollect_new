import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { DatabaseService } from 'src/app/services/database.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
})
export class SignaturePage implements OnInit {

  signature = '';
  isDrawing = false;
  id_contact: any;
  type: any;
  title: any;
  agent_id: any;

  @ViewChild(SignaturePad, {static: false}) signaturePad: SignaturePad;

  public signaturePadOptions: Object = { 
    'minWidth': 2,
    'canvasWidth': 400,
    'canvasHeight': 200,
    'backgroundColor': '#f6fbff',
    'penColor': '#666a73'
  };

  constructor(
    private db: DatabaseService,
    public storage: Storage,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    public navCtrl: NavController,
    public translate: TranslateService,
    private file: File
  ) { }

  ngOnInit() {
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    if(this.type == 'farmer') {
      this.translate.get('FARMER_SIGNATURE').subscribe(value => { 
        this.title = value;
      });
    } else {
      this.translate.get('AGENT_SIGNATURE').subscribe(value => { 
        this.title = value;
      });
    }

    this.storage.get('savedSignature').then((data) => {
      this.signature = data;
      if(this.signature){ this.signaturePad.clear(); }
    });

    this.storage.get('id_contact').then((val) => {
      this.id_contact = val;
    });

    this.db.lastLogedUser().then(usr => {
      this.agent_id = usr.id_contact;
    });

  }

  drawComplete() {
    this.isDrawing = false;
  }
 
  drawStart() {
    this.isDrawing = true;
  }
 
  savePad() {
    this.signature = this.signaturePad.toDataURL("image/jpeg");
    this.storage.set('savedSignature', this.signature);

    var m = new Date();
    let created_date = m.getUTCFullYear() + "-" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + "-" + ("0" + m.getUTCMinutes()).slice(-2) + "-" + ("0" + m.getUTCSeconds()).slice(-2);
 
    let realData = this.signature.split(",")[1];
    let blob = this.b64toBlob(realData, 'image/jpeg'); 
    let filepath = this.file.externalRootDirectory + 'icollect/documents/'; 

    if(this.type == 'farmer') {
      var newFileName = this.id_contact+'_603_'+created_date + ".jpg";
      this.file.writeFile(filepath, newFileName, blob).then(() =>{
        this.db.saveDocDataContact(this.id_contact, newFileName, 'Farmer signature', 603, this.agent_id, null);
      });

    } else {
      var newFileName = this.id_contact+'_604_'+created_date + ".jpg";
      this.file.writeFile(filepath, newFileName, blob).then(() =>{
        this.db.saveDocDataContact(this.id_contact, newFileName, 'Agent signature', 604, this.agent_id, null);
      });
    }
    
    this.signaturePad.clear();

    this.translate.get('SIGNATURE_SAVE_SUCCESS').subscribe(value => { 
      this.toastAlert(value);
    });
 
    this.navCtrl.navigateBack(['/edit-contact', this.id_contact]);
  }
 
  async toastAlert(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  clearPad() {
    this.signaturePad.clear();
  }

  backToEdit() {
    this.navCtrl.navigateBack(['/edit-contact', this.id_contact]);
  }

}
