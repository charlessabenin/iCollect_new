import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { CacheService } from 'ionic-cache';

@Component({
  selector: 'app-edit-plantation',
  templateUrl: './edit-plantation.page.html',
  styleUrls: ['./edit-plantation.page.scss'],
})
export class EditPlantationPage implements OnInit {

  id_plantation: any;
  propertyList: any;
  titledeedList: any;
  cultureList: any;
  bioList: any;
  globalgapList: any;
  rspoList: any;
  bio_suisseList: any;
  fairTradeList: any;
  eco_riverList: any; eco_shallowsList: any; eco_wellsList: any; perimeterList: any; seed_typeList: any;
  dc_completedList: any;

  extensionList: any; replantingList: any; lands_rights_conflictList: any; road_accessList: any;
  irrigationList: any; drainageList: any; slopeList: any; gender_workersList: any; migrant_workersList: any;
  children_workList: any;

  fertilizerList: any; herbicideList: any; pesticideList: any; adjoining_culturesList: any;
  forestList: any; fireList: any; wasteList: any; civilstList: any; plantManagerList: any;

  year_creation: any; year_creation_old: any;
  title_deed: any; title_deed_old: any;
  property: any; property_old: any;
  notes: any; notes_old: any;
  area_acres: any; 
  area: any; area_old: any;
  manager_firstname: any; manager_lastname: any;
  code_plantation: any; code_plantation_old: any;
  id_culture: any; id_culture_old: any;
  bio: any; bio_old: any;
  bio_suisse: any; bio_suisse_old: any;
  perimeter: any; perimeter_old: any;
  variety: any; variety_old: any;
  eco_river: any; eco_river_old: any;
  eco_shallows: any; eco_shallows_old: any;
  eco_wells: any; eco_wells_old: any;
  name_manager: any; name_manager_old: any;
  manager_phone: any; manager_phone_old: any;
  seed_type: any; seed_type_old: any;
  plantationsite_id: any; plantationsite_id_old: any;
  dc_completed: any; dc_completed_old: any;
  inactive_date: any; inactive_date_old: any;
  inactive: any; inactive_old: any;
  numb_feet: any; numb_feet_old: any;
  globalgap: any; globalgap_old: any;
  rspo: any; rspo_old: any;
  synthetic_fertilizer: any; synthetic_fertilizer_old: any;
  synthetic_herbicides: any; synthetic_herbicides_old: any;
  synthetic_pesticide: any; synthetic_pesticide_old: any;
  adjoining_cultures: any; adjoining_cultures_old: any;
  intercropping: any; intercropping_old: any;
  harvest: any; harvest_old: any;
  forest: any; forest_old: any;
  fire: any; fire_old: any;
  waste: any; waste_old: any;
  rating: any; rating_old: any;
  manager_civil: any; manager_civil_old: any;
  number_staff_permanent: any; number_staff_permanent_old: any;
  number_staff_temporary: any; number_staff_temporary_old: any;
  yield_estimate: any; yield_estimate_old: any;
  name_town: any; name_town_old:any;
  owner_manager: any; owner_manager_old: any;
  code_farmer: any; code_farmer_old: any;
  fair_trade: any; fair_trade_old: any;

  extension: any; extension_old: any;
  year_extension: any; year_extension_old: any;
  replanting: any; replanting_old: any;
  year_to_replant: any; year_to_replant_old: any;
  lands_rights_conflict: any; lands_rights_conflict_old: any;
  lands_rights_conflict_note: any; lands_rights_conflict_note_old: any;
  road_access: any; road_access_old: any;
  irrigation: any; irrigation_old: any;
  drainage: any; drainage_old: any;
  slope: any; slope_old: any;
  slope_text: any; slope_text_old:any;
  farmer_experience: any; farmer_experience_old: any;
  farmer_experience_level: any; farmer_experience_level_old: any;
  day_worker_pay: any; day_worker_pay_old: any;
  gender_workers: any; gender_workers_old: any;
  migrant_workers: any; migrant_workers_old: any;
  children_work: any; children_work_old: any;
  pest: any; pest_old: any;

  year_extension_preview = false;
  year_to_replant_preview = false;
  lands_rights_conflict_note_preview = false;
  slope_text_preview = false;

  public inactive_checked: boolean;

  id_project: any;
  id_task: any;
  id_contact: any;
  created_date: any;
  agent_id: any;
  agent_type: any;

  coordx: any;
  coordy: any;
  storage_coordx: any;
  storage_coordy: any;

  waste_photo_btn = false;
  fire_photo_btn = false;
  forest_photo_btn = false;
  adj_cultures_photo_btn = false;
  synt_pesticide_photo_btn = false;
  synt_herbicides_photo_btn = false;
  synt_fertilizer_photo_btn = false;
  river_photo_btn = false;
  shallows_photo_btn = false;
  wells_photo_btn = false;
  bufferzone_photo_btn = false;
  title_deed_photo_btn = false;

  extension_photo_btn = false;
  road_access_photo_btn = false;
  irrigation_photo_btn = false;
  drainage_photo_btn = false;
  slope_photo_btn = false;
  replanting_photo_btn = false;

  lastHousholdID = null;
  ticker:number = 0;
  ticker_c:number = 0;

  firstname_field = false;
  lastname_field = false;
  manager_civil_field = false;
  manager_phone_field = false;

  id_cooperative: any;
  id_company: any;

  constructor(
    private file: File,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    public translate: TranslateService,
    public loading: LoadingService,
    public cache: CacheService,
    private camera: Camera,
    private storage: Storage,
    private db: DatabaseService
  ) {
    this.storage.get('id_project').then((val) => { this.id_project = val; });
    this.storage.get('id_task').then((val) => { this.id_task = val; });
    this.storage.get('id_contact').then((val) => { this.id_contact = val; });
  }

  ngOnInit() {
    this.db.getProject(this.id_project).then(prj => {
      this.id_cooperative = prj.id_cooperative;
      this.id_company = prj.id_company;
    });

    var yes, no, none, att_v, tt_fonc, pop_terr, candit, achiev, hybrid, native, complete, not_complete;

    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });
    this.translate.get('NONE').subscribe(value => { none = value; });
    this.translate.get('ATTESTATION_VILLAGOISE').subscribe(value => { att_v = value; });
    this.translate.get('TITRE_FONCIER').subscribe(value => { tt_fonc = value; });
    this.translate.get('PROPRIETAIRE_TERRIAIN').subscribe(value => { pop_terr = value; });
    this.translate.get('CANDIDATE').subscribe(value => { candit = value; });
    this.translate.get('ACHIEVED').subscribe(value => { achiev = value; });
    this.translate.get('HYBRID').subscribe(value => { hybrid = value; });
    this.translate.get('NATIVE').subscribe(value => { native = value; });
    this.translate.get('COMPLETE').subscribe(value => { complete = value; });
    this.translate.get('NOT_COMPLETE').subscribe(value => { not_complete = value; });

    this.propertyList = [
      { id_property: 0, property_name: no },
      { id_property: 1, property_name: yes }
    ];

    this.dc_completedList = [
      { value: 0, name: not_complete },
      { value: 1, name: complete }
    ];

    this.titledeedList = [
      { titledeed_value: 0, titledeed_name: none },
      { titledeed_value: 1, titledeed_name: att_v },
      { titledeed_value: 2, titledeed_name: tt_fonc },
      { titledeed_value: 3, titledeed_name: pop_terr }
    ];

    this.bioList = [];
    this.rspoList = [];
    this.globalgapList = [];
    this.bio_suisseList = [];
    this.fairTradeList = [];
    this.db.getPlantationCertificationList().then(() => {
      this.db.getPlantationCertification().subscribe(data => {
        this.bioList = data;
        this.rspoList = data;
        this.globalgapList = data;
        this.bio_suisseList = data;
        this.fairTradeList = data;
      });
    });

    this.eco_riverList = [
      { value: 0, name: no },
      { value: 1, name: yes }
    ];

    this.eco_shallowsList = [
      { value: 0, name: no },
      { value: 1, name: yes }
    ];

    this.eco_wellsList = [
      { value: 0, name: no },
      { value: 1, name: yes }
    ];

    this.perimeterList = [
      { value: 0, name: no },
      { value: 1, name: yes }
    ];

    this.seed_typeList = [
      { value: 0, name: hybrid },
      { value: 1, name: native }
    ];

    this.cultureList = [];
    this.db.getCultureList().then(() => {
      this.db.getRegvalues().subscribe(data => {
        this.cultureList = data;
      });
    });

    this.fertilizerList = [];
    this.db.getFertilizerList().then(() => {
      this.db.getFertilizer().subscribe(data => {
        this.fertilizerList = data;
      });
    });

    this.herbicideList = [];
    this.db.getHerbicideList().then(() => {
      this.db.getHerbicide().subscribe(data => {
        this.herbicideList = data;
      });
    });

    this.pesticideList = [];
    this.db.getPesticideList().then(() => {
      this.db.getPesticide().subscribe(data => {
        this.pesticideList = data;
      });
    });

    this.adjoining_culturesList = [];
    this.db.getAdjoining_culturesList().then(() => {
      this.db.getAdjoining_cultures().subscribe(data => {
        this.adjoining_culturesList = data;
      });
    });

    this.forestList = [];
    this.fireList = [];
    this.wasteList = [];
    this.extensionList = [];
    this.replantingList = [];
    this.lands_rights_conflictList = [];
    this.road_accessList = [];
    this.irrigationList = [];
    this.drainageList = [];
    this.slopeList = [];
    this.gender_workersList = [];
    this.migrant_workersList = [];
    this.children_workList = [];

    this.db.getYesNoList().then(() => {
      this.db.getYesNo().subscribe(data => {
        this.forestList = data;
        this.fireList = data;
        this.wasteList = data;
        this.extensionList = data;
        this.replantingList = data;
        this.lands_rights_conflictList = data;
        this.road_accessList = data;
        this.irrigationList = data;
        this.drainageList = data;
        this.slopeList = data;
        this.gender_workersList = data;
        this.migrant_workersList = data;
        this.children_workList = data;
      });
    });

    this.civilstList = [];
    this.db.getCivilStateList().then(() => {
      this.db.getCivilState().subscribe(data => {
        this.civilstList = data;
      });
    });

    this.plantManagerList = [];
    this.db.getPlantationManagerList().then(() => {
      this.db.getPlantationManager().subscribe(data => {
        this.plantManagerList = data;
      });
    });

    var m = new Date();
    this.created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    this.db.lastLogedUser().then(usr => {
      this.agent_id = usr.id_contact;
      this.agent_type = usr.agent_type;
    });

    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.geolocation.getCurrentPosition().then((resp) => {
          this.coordx = resp.coords.latitude;
          this.coordy = resp.coords.longitude;
        }).catch((error) => {
          this.translate.get('LOCATION_ERROR').subscribe(value => {
            this.presentAlert(value + error, 'Error');
          });
        });
      }, error => console.log(error));

    this.loadSavedData();
  }

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

  async savePlantationDetails() {
    var yes, no, title, msg;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });
    this.translate.get('SAVE_PLANTATION_PP_TITLE').subscribe(value => { title = value; });
    this.translate.get('SAVE_PLANTATION_PP_MSG').subscribe(value => { msg = value; });

    const promptAlert = await this.alertCtrl.create({
      subHeader: title,
      message: msg,
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
            this.savePlantationConfirm();
          }
        }
      ]
    });
    promptAlert.present();
  }

  loadSavedData() {
    this.id_plantation = this.activatedRoute.snapshot.paramMap.get('plantation_id');
    this.db.getPlantation(this.id_plantation).then(plantation => {

      this.plantationsite_id = plantation.plantationsite_id;
      this.code_plantation = plantation.code_plantation;
      this.code_farmer = plantation.code_farmer;
      this.area_acres = plantation.area_acres;
      this.area = plantation.area;
      this.variety = plantation.variety;

      this.id_culture = plantation.id_culture1;
      this.dc_completed = plantation.dc_completed;

      this.name_town = plantation.name_town; this.name_town_old = plantation.name_town;
      this.inactive = plantation.inactive; this.inactive_old = plantation.inactive;
      this.globalgap = plantation.globalgap; this.globalgap_old = plantation.globalgap;
      this.rspo = plantation.rspo; this.rspo_old = plantation.rspo;
      this.bio = plantation.bio; this.bio_old = plantation.bio;
      this.bio_suisse = plantation.bio_suisse; this.bio_suisse_old = plantation.bio_suisse;
      this.fair_trade = plantation.fair_trade; this.fair_trade_old = plantation.fair_trade;
      this.year_creation = plantation.year_creation; this.year_creation_old = plantation.year_creation;
      this.property = plantation.property; this.property_old = plantation.property;
      this.title_deed = plantation.title_deed; this.title_deed_old = plantation.title_deed;
      this.notes = plantation.notes; this.notes_old = plantation.notes;
      this.perimeter = plantation.perimeter; this.perimeter_old = plantation.perimeter;
      this.eco_river = plantation.eco_river; this.eco_river_old = plantation.eco_river;
      this.eco_shallows = plantation.eco_shallows; this.eco_shallows_old = plantation.eco_shallows;
      this.eco_wells = plantation.eco_wells; this.eco_wells_old = plantation.eco_wells;
      this.seed_type = plantation.seed_type; this.seed_type_old = plantation.seed_type;

      this.extension = plantation.extension; this.extension_old = plantation.extension;
      this.year_extension = plantation.year_extension; this.year_extension_old = plantation.year_extension;
      this.replanting = plantation.replanting; this.replanting_old = plantation.replanting;
      this.year_to_replant = plantation.year_to_replant; this.year_to_replant_old = plantation.year_to_replant;
      this.lands_rights_conflict = plantation.lands_rights_conflict; this.lands_rights_conflict_old = plantation.lands_rights_conflict;
      this.lands_rights_conflict_note = plantation.lands_rights_conflict_note; this.lands_rights_conflict_note_old = plantation.lands_rights_conflict_note;
      this.road_access = plantation.road_access; this.road_access_old = plantation.road_access;
      this.irrigation = plantation.irrigation; this.irrigation_old = plantation.irrigation;
      this.drainage = plantation.drainage; this.drainage_old = plantation.drainage;
      this.slope = plantation.slope; this.slope_old = plantation.slope;
      this.slope_text = plantation.slope_text; this.slope_text_old = plantation.slope_text;
      this.farmer_experience = plantation.farmer_experience; this.farmer_experience_old = plantation.farmer_experience;
      this.farmer_experience_level = plantation.farmer_experience_level; this.farmer_experience_level_old = plantation.farmer_experience_level;
      this.day_worker_pay = plantation.day_worker_pay; this.day_worker_pay_old = plantation.day_worker_pay;
      this.gender_workers = plantation.gender_workers; this.gender_workers_old = plantation.gender_workers;
      this.migrant_workers = plantation.migrant_workers; this.migrant_workers_old = plantation.migrant_workers;
      this.children_work = plantation.children_work; this.children_work_old = plantation.children_work;
      this.pest = plantation.pest; this.pest_old = plantation.pest;

      if(plantation.extension == 508) {
        this.year_extension_preview = true;
      } else {
        this.year_extension_preview = false;
      } 

      if(plantation.replanting == 508) {
        this.year_to_replant_preview = true;
      } else {
        this.year_to_replant_preview = false;
      }

      if(plantation.lands_rights_conflict == 508) {
        this.lands_rights_conflict_note_preview = true;
      } else {
        this.lands_rights_conflict_note_preview = false;
      }  

      if(plantation.slope == 508) {
        this.slope_text_preview = true;
      } else {
        this.slope_text_preview = false;
      }

      if (this.inactive == 1) { this.inactive_checked = true; } else { this.inactive_checked = false; }

      this.name_manager = plantation.name_manager;
      this.manager_firstname = plantation.manager_firstname;
      this.manager_lastname = plantation.manager_lastname;
      this.manager_phone = plantation.manager_phone;
      this.numb_feet = plantation.numb_feet;

      this.id_culture_old = plantation.id_culture1;
      this.dc_completed_old = plantation.dc_completed;
      this.variety_old = plantation.variety;

      this.synthetic_fertilizer = plantation.synthetic_fertilizer; this.synthetic_fertilizer_old = plantation.synthetic_fertilizer;
      this.synthetic_herbicides = plantation.synthetic_herbicides; this.synthetic_herbicides_old = plantation.synthetic_herbicides;
      this.synthetic_pesticide = plantation.synthetic_pesticide; this.synthetic_pesticide_old = plantation.synthetic_pesticide;
      this.adjoining_cultures = plantation.adjoining_cultures; this.adjoining_cultures_old = plantation.adjoining_cultures;

      this.intercropping = plantation.intercropping;

      this.harvest = plantation.harvest; this.harvest_old = plantation.harvest;
      this.forest = plantation.forest; this.forest_old = plantation.forest;
      this.fire = plantation.fire; this.fire_old = plantation.fire;
      this.waste = plantation.waste; this.waste_old = plantation.waste;
      this.rating = plantation.rating; this.rating_old = plantation.rating;
      this.manager_civil = plantation.manager_civil; this.manager_civil_old = plantation.manager_civil;

      this.owner_manager = plantation.owner_manager; this.owner_manager_old = plantation.owner_manager;

      if(this.owner_manager == 639) {
        this.firstname_field = true;
        this.lastname_field = true;
        this.manager_civil_field = true;
        this.manager_phone_field = true;
      } else {
        this.firstname_field = false;
        this.lastname_field = false;
        this.manager_civil_field = false;
        this.manager_phone_field = false;
      }

      this.number_staff_permanent = plantation.number_staff_permanent;
      this.number_staff_temporary = plantation.number_staff_temporary;
      this.yield_estimate = plantation.yield_estimate;

      this.number_staff_permanent_old = plantation.number_staff_permanent;
      this.number_staff_temporary_old = plantation.number_staff_temporary;
      this.yield_estimate_old = plantation.yield_estimate;

      this.intercropping_old = plantation.intercropping;

      this.name_manager_old = plantation.name_manager;
      this.manager_phone_old = plantation.manager_phone;
      this.numb_feet_old = plantation.numb_feet_old;
      this.code_plantation_old = plantation.code_plantation;
      this.code_farmer_old = plantation.code_farmer;
      this.area_old = plantation.area;

      this.storage_coordx = plantation.storage_coordx;
      this.storage_coordy = plantation.storage_coordx;
    });
  }

  PlantManagerValue(owner_manager) {
    if(owner_manager == 639) {
      this.firstname_field = true;
      this.lastname_field = true;
      this.manager_civil_field = true;
      this.manager_phone_field = true;
    } else {
      this.firstname_field = false;
      this.lastname_field = false;
      this.manager_civil_field = false;
      this.manager_phone_field = false;
    }
  }

  savePlantationConfirm() {
    if (this.inactive_checked == true) {
      this.inactive = 1;
    } else { this.inactive = 0; }

    let year;
    if (this.year_creation != null) {
      let date = this.year_creation.split('-');
      year = date[0];
    } else { year = ""; }

    this.translate.get('SAVING_PLANTATION_DATA').subscribe(value => {
      this.loading.showLoader(value);
    });

    if((this.manager_firstname != null)&&(this.manager_lastname != null)){
      this.name_manager = this.manager_lastname+' '+this.manager_firstname;
    } 
     
    let year_extension;
    if(this.year_extension != null){
      let year_extension_date = this.year_extension.split('-'); 
      year_extension = year_extension_date[0];  
    } else { year_extension = null; } 
    
    let year_to_replant;
    if(this.year_to_replant != null){
      let year_to_replant_date = this.year_to_replant.split('-'); 
      year_to_replant = year_to_replant_date[0];
    } else { year_to_replant = null; } 

    let farmer_experience;
    if(this.farmer_experience != null){
      let farmer_experience_date = this.farmer_experience.split('-'); 
      farmer_experience = farmer_experience_date[0]; 
    } else { farmer_experience = null; } 
    
    this.db.updatePlantationtData(this.code_plantation, year, this.title_deed, this.property, this.notes, this.area_acres, this.area, this.id_culture, this.bio, this.bio_suisse, this.perimeter, this.variety, this.eco_river, this.eco_shallows, this.eco_wells, this.manager_firstname, this.manager_lastname, this.name_manager, this.manager_phone, this.seed_type, this.dc_completed, this.inactive, this.numb_feet, this.id_plantation, this.globalgap, this.rspo, this.synthetic_fertilizer, this.synthetic_herbicides, this.synthetic_pesticide, this.adjoining_cultures, this.intercropping, this.harvest, this.forest, this.fire, this.waste, this.rating, this.manager_civil, this.number_staff_permanent, this.number_staff_temporary, this.yield_estimate, this.name_town, this.owner_manager, this.code_farmer, this.fair_trade, this.pest, this.irrigation, this.drainage, this.slope, this.slope_text, this.extension, year_extension, this.replanting, year_to_replant, this.lands_rights_conflict, this.lands_rights_conflict_note, this.road_access, farmer_experience, this.farmer_experience_level, this.day_worker_pay, this.gender_workers, this.migrant_workers, this.children_work)
      .then(async () => {

        setTimeout(() => { 
          if (this.code_plantation !== this.code_plantation_old) { this.saveTicker('code_plantation', this.code_plantation); }
          if (this.year_creation !== this.year_creation_old) { this.saveTicker('year_creation', year); }
          if (this.title_deed !== this.title_deed_old) { this.saveTicker('title_deed', this.title_deed); }
          if (this.property !== this.property_old) { this.saveTicker('property', this.property); }
          if (this.notes !== this.notes_old) { this.saveTicker('notes', this.notes); }
          if (this.id_culture !== this.id_culture_old) { this.saveTicker('id_culture1', this.id_culture); }
          if (this.bio !== this.bio_old) { this.saveTicker('bio', this.bio); }
          if (this.bio_suisse !== this.bio_suisse_old) { this.saveTicker('bio_suisse', this.bio_suisse); }
          if (this.perimeter !== this.perimeter_old) { this.saveTicker('perimeter', this.perimeter); }
   
          if (this.variety !== this.variety_old) { this.saveTicker('variety', this.variety); }
          if (this.eco_river !== this.eco_river_old) { this.saveTicker('eco_river', this.eco_river); }
          if (this.eco_shallows !== this.eco_shallows_old) { this.saveTicker('eco_shallows', this.eco_shallows); }
          if (this.eco_wells !== this.eco_wells_old) { this.saveTicker('eco_wells', this.eco_wells); }
          if (this.name_manager !== this.name_manager_old) { this.saveTicker('name_manager', this.name_manager); }
          if (this.manager_phone !== this.manager_phone_old) { this.saveTicker('manager_phone', this.manager_phone); }
          if (this.seed_type !== this.seed_type_old) { this.saveTicker('seed_type', this.seed_type); }
          if (this.dc_completed !== this.dc_completed_old) { this.saveTicker('dc_completed', this.dc_completed); }
          if (this.inactive !== this.inactive_old) { 
            this.saveTicker('inactive', this.inactive); 
            this.saveTicker('inactive_date', this.created_date);
          }
          if (this.area !== this.area_old) { this.saveTicker('area', this.area); }
          if (this.numb_feet !== this.numb_feet_old) { this.saveTicker('numb_feet', this.numb_feet); }
          if (this.fair_trade !== this.fair_trade_old) { this.saveTicker('fair_trade', this.fair_trade); }
          if (this.globalgap !== this.globalgap_old) { this.saveTicker('globalgap', this.globalgap); }
          if (this.rspo !== this.rspo_old) { this.saveTicker('rspo', this.rspo); }
          if (this.synthetic_fertilizer !== this.synthetic_fertilizer_old) { this.saveTicker('synthetic_fertilizer', this.synthetic_fertilizer); }
          if (this.synthetic_herbicides !== this.synthetic_herbicides_old) { this.saveTicker('synthetic_herbicides', this.synthetic_herbicides); }
          if (this.synthetic_pesticide !== this.synthetic_pesticide_old) { this.saveTicker('synthetic_pesticide', this.synthetic_pesticide); }
          if (this.adjoining_cultures !== this.adjoining_cultures_old) { this.saveTicker('adjoining_cultures', this.adjoining_cultures); }
          if (this.intercropping !== this.intercropping_old) { this.saveTicker('intercropping', this.intercropping); }
          if (this.harvest !== this.harvest_old) { this.saveTicker('harvest', this.harvest); }
          if (this.forest !== this.forest_old) { this.saveTicker('forest', this.forest); }
          if (this.fire !== this.fire_old) { this.saveTicker('fire', this.fire); }
       
          if (this.waste !== this.waste_old) { this.saveTicker('waste', this.waste); } 
          if (this.code_farmer !== this.code_farmer_old) { this.saveTicker('code_farmer', this.code_farmer); }
          if (this.rating !== this.rating_old) { this.saveTicker('rating', this.rating); }
          if (this.manager_civil !== this.manager_civil_old) { this.saveTicker('manager_civil', this.manager_civil); }
          if (this.number_staff_permanent !== this.number_staff_permanent_old) { this.saveTicker('number_staff_permanent', this.number_staff_permanent); }
          if (this.number_staff_temporary !== this.number_staff_temporary_old) { this.saveTicker('number_staff_temporary', this.number_staff_temporary); }
          if (this.yield_estimate !== this.yield_estimate_old) { this.saveTicker('yield_estimate', this.yield_estimate); }
          if (this.name_town !== this.name_town_old) { this.saveTicker('name_town', this.name_town); }
          
          if (this.pest !== this.pest_old) { this.saveTicker('pest', this.pest); }
          if (this.irrigation !== this.irrigation_old) { this.saveTicker('irrigation', this.irrigation); }
          if (this.drainage !== this.drainage_old) { this.saveTicker('drainage', this.drainage); }
          if (this.slope !== this.slope_old) { this.saveTicker('slope', this.slope); }
          if (this.slope_text !== this.slope_text_old) { this.saveTicker('slope_text', this.slope_text); }
          if (this.extension !== this.extension_old) { this.saveTicker('extension', this.extension); }
          if (year_extension !== this.year_extension_old) { this.saveTicker('year_extension', year_extension); }
          if (this.replanting !== this.replanting_old) { this.saveTicker('replanting', this.replanting); }
          if (year_to_replant !== this.year_to_replant_old) { this.saveTicker('year_to_replant', year_to_replant); }
          if (this.lands_rights_conflict !== this.lands_rights_conflict_old) { this.saveTicker('lands_rights_conflict', this.lands_rights_conflict); }
          if (this.lands_rights_conflict_note !== this.lands_rights_conflict_note_old) { this.saveTicker('lands_rights_conflict_note', this.lands_rights_conflict_note); }
          if (this.road_access !== this.road_access_old) { this.saveTicker('road_access', this.road_access); }
          if (farmer_experience !== this.farmer_experience_old) { this.saveTicker('farmer_experience', farmer_experience); }
          if (this.farmer_experience_level !== this.farmer_experience_level_old) { this.saveTicker('farmer_experience_level', this.farmer_experience_level); }
          if (this.day_worker_pay !== this.day_worker_pay_old) { this.saveTicker('day_worker_pay', this.day_worker_pay); }
          if (this.gender_workers !== this.gender_workers_old) { this.saveTicker('gender_workers', this.gender_workers); }
          if (this.migrant_workers !== this.migrant_workers_old) { this.saveTicker('migrant_workers', this.migrant_workers); }
          if (this.children_work !== this.children_work_old) { this.saveTicker('children_work', this.children_work); }

          if (this.owner_manager !== this.owner_manager_old) { this.saveTicker('owner_manager', this.owner_manager);  
            if(this.owner_manager == 640) { 
              this.db.getNewContactId().then(contact => { 
                this.saveContactDetails(contact.new_id);
              });
            }
          }
          
          this.saveTicker('modified_date', this.created_date); 
          this.saveTicker('modified_by', this.agent_id);

          if(this.ticker == 1){
            this.translate.get('TICKER_UPDATED').subscribe(value => {
              this.toastAlert(value);
            });
          }
        }, 4000);

        setTimeout(() => {
          this.loading.hideLoader();

          this.translate.get('PLANTATION_DATA_SAVE_SUCCESS').subscribe(value => {
            this.toastAlert(value);
          });

          //this.db.syncData();
          this.navCtrl.navigateBack(['/plantation-details/', this.id_plantation]);
        }, 4000);

      });
  }

  saveContactDetails(id_contact) {
    let name: string = this.manager_lastname + ' ' + this.manager_firstname; 
    let lname = this.manager_lastname.replace(/\s/g, ''); 
    let code = lname.substring(0, 4); 
    let contact_code = code.toUpperCase(); 

    this.db.saveContact(id_contact, contact_code, this.manager_firstname, this.manager_lastname, name, null, 642, null, null, this.agent_id, 9, this.manager_civil, this.manager_phone, this.agent_type, this.id_cooperative).then(() => {
      this.saveTickerContact('contact_code', contact_code, id_contact);
      this.saveTickerContact('firstname', this.manager_firstname, id_contact);
      this.saveTickerContact('lastname', this.manager_lastname, id_contact);
      this.saveTickerContact('name', name, id_contact);
      this.saveTickerContact('civil_status', this.manager_civil, id_contact);
      this.saveTickerContact('p_phone', this.manager_phone, id_contact);
      this.saveTickerContact('id_supchain_type', 642, id_contact);
      this.saveTickerContact('id_type', 9, id_contact);
      this.saveTickerContact('id_cooperative', this.id_cooperative, id_contact);
     // this.saveTickerContact('id_contractor', this.id_contact, id_contact);
      this.saveTickerContact('created_date', this.created_date, id_contact);
      this.saveTickerContact('created_by', this.agent_id, id_contact);

      if(this.ticker_c == 1){
        this.translate.get('TICKER_UPDATED').subscribe(value => {
          this.toastAlert(value);
        });
      }

      this.db.savePlantationManagerID(id_contact, this.id_plantation).then(() => {
        this.translate.get('CONTACT_CREATE_SUCCESS').subscribe(value => {
          this.saveTicker('id_manager', id_contact); 

          this.presentAlert(value, 'Success');
        });
      })
      
    });
  }

  async backToDetails() {
    var text, save, cancel;
    this.translate.get('SAVE_MSG').subscribe(value => { text = value; });
    this.translate.get('SAVE').subscribe(value => { save = value; });
    this.translate.get('CANCEL').subscribe(value => { cancel = value; });

    const alert = await this.alertCtrl.create({
      message: text,
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          handler: data => {
            console.log(data);
            this.navCtrl.navigateBack(['/plantation-details/', this.id_plantation]);
          }
        },
        {
          text: save,
          handler: data => {
            console.log(data);
            this.savePlantationConfirm();
          }
        }
      ]
    });
    alert.present();
  }

  async toastAlert(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }

  saveTickerContact(field_name, field_value, id_contact) {
    this.db.addTicker(this.agent_id, null, null, id_contact, field_name, field_value, 'contact', this.created_date, this.coordx, this.coordy, null, this.id_project, this.id_task, null, null, null, null, null, this.id_contact, null, null, null, null)
      .then(() => {
        this.cache.clearAll();
        this.ticker_c = 1;
      });
  }

  saveTicker(field_name, field_value) {
    this.db.addTicker(this.agent_id, this.id_plantation, this.plantationsite_id, this.id_contact, field_name, field_value, 'plantation', this.created_date, this.coordx, this.coordy, this.id_plantation, this.id_project, this.id_task, null, null, null, null, null, null, null, null, null, null)
      .then(() => {
        this.ticker = 1;
        this.cache.clearAll();
      });
  }

  get_storage_map() {
    this.navCtrl.navigateForward(['/storage-map', 2]);
  }

  get_storage_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 595);
  }

  get_waste_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 602);
  }

  get_fire_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 601);
  }

  get_forest_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 600);
  }

  get_adj_cultures_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 599);
  }

  get_synt_pesticide_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 598);
  }

  get_synt_herbicides_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 597);
  }

  get_synt_fertilizer_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 596);
  }

  get_river_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 605);
  }

  get_shallows_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 606);
  }

  get_wells_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 607);
  }

  get_bufferzone_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 608);
  }

  get_title_deed_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 626); 
  }

  get_extension_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 689);
  }

  get_road_access_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 693);
  }

  get_irrigation_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 690);
  }

  get_drainage_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 691);
  }

  get_slope_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 692);
  }

  get_replanting_photo() {
    this.takePicture(this.camera.PictureSourceType.CAMERA, 773);
  }

  takePicture(sourceType: PictureSourceType, doc_type) {
    var options: CameraOptions = {
      quality: 100,
      targetWidth: 900,
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
      this.presentPrompt(correctPath, currentName, this.id_plantation, doc_type);
    });

  }

  async presentPrompt(correctPath, currentName, val, doc_type) {
    var pic_desc;
    this.translate.get('PIC_DESCRIPTION').subscribe(value => { pic_desc = value; });

    const alert = await this.alertCtrl.create({
      message: pic_desc,
      inputs: [
        {
          name: 'description',
          placeholder: 'Description'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.moveFile(data.description, correctPath, currentName, val, doc_type);
          }
        }
      ]
    });
    alert.present();
  }

  moveFile(description, correctPath, currentName, id_plantation, doc_type) {
    var d = new Date(), n = d.getTime(), newFileName = id_plantation + '-' + n + ".jpg";
    let newPath = this.file.externalRootDirectory + 'icollect/plantations';

    this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
      this.db.saveDocDataPlantation(id_plantation, newFileName, description, doc_type, this.agent_id);
      this.updatePlantationPhoto(doc_type, newFileName, id_plantation);
    });
  }

  updatePlantationPhoto(doc_type, value, id_plantation) {
    if (doc_type == 595) {
      this.db.savePlantation_storage_photo(value, id_plantation);
    } else if (doc_type == 602) {
      this.db.savePlantation_waste_photo(value, id_plantation);
    } else if (doc_type == 601) {
      this.db.savePlantation_fire_photo(value, id_plantation);
    } else if (doc_type == 600) {
      this.db.savePlantation_forest_photo(value, id_plantation);
    } else if (doc_type == 599) {
      this.db.savePlantation_adj_cultures_photo(value, id_plantation);
    } else if (doc_type == 598) {
      this.db.savePlantation_synt_pesticide_photo(value, id_plantation);
    } else if (doc_type == 597) {
      this.db.savePlantation_synt_herbicides_photo(value, id_plantation);
    } else if (doc_type == 596) {
      this.db.savePlantation_synt_fertilizer_photo(value, id_plantation);
    } else if (doc_type == 605) {
      this.db.savePlantation_river_photo(value, id_plantation);
    } else if (doc_type == 606) {
      this.db.savePlantation_shallows_photo(value, id_plantation);
    } else if (doc_type == 607) {
      this.db.savePlantation_wells_photo(value, id_plantation);
    } else if (doc_type == 608) {
      this.db.savePlantation_bufferzone_photo(value, id_plantation);
    } else if (doc_type == 626) {
      this.db.savePlantation_title_deed_photo(value, id_plantation);
    } else if (doc_type == 689) {
      this.db.savePlantation_extension_photo(value, id_plantation);
    } else if (doc_type == 693) {
      this.db.savePlantation_road_access_photo(value, id_plantation);
    } else if (doc_type == 690) {
      this.db.savePlantation_irrigation_photo(value, id_plantation);
    } else if (doc_type == 691) {
      this.db.savePlantation_drainage_photo(value, id_plantation);
    } else if (doc_type == 692) {
      this.db.savePlantation_slope_photo(value, id_plantation);
    } else if (doc_type == 773) {
      this.db.savePlantation_replanting_photo(value, id_plantation);
    } else { }
  }

  syntheticFertilizer() { 
    if ((this.synthetic_fertilizer != "") && (this.synthetic_fertilizer != 188)) {
      this.synt_fertilizer_photo_btn = true;
    } else {
      this.synt_fertilizer_photo_btn = false;
    }
  }

  syntheticHerbicides() {
    if ((this.synthetic_herbicides != "") && (this.synthetic_herbicides != 590)) {
      this.synt_herbicides_photo_btn = true;
    } else {
      this.synt_herbicides_photo_btn = false;
    }
  }

  syntheticPesticide() {
    if ((this.synthetic_pesticide != "") && (this.synthetic_pesticide != 191)) {
      this.synt_pesticide_photo_btn = true;
    } else {
      this.synt_pesticide_photo_btn = false;
    }
  }

  adjoiningCultures() {
    if (this.adjoining_cultures != "") {
      this.adj_cultures_photo_btn = true;
    } else {
      this.adj_cultures_photo_btn = false;
    }
  }

  forestValue() {
    if ((this.forest != "") && (this.forest != 509)) {
      this.forest_photo_btn = true;
    } else {
      this.forest_photo_btn = false;
    }
  }

  fireValue() {
    if ((this.fire != "") && (this.fire != 509)) {
      this.fire_photo_btn = true;
    } else {
      this.fire_photo_btn = false;
    }
  }

  wasteValue() {
    if ((this.waste != "") && (this.waste != 509)) {
      this.waste_photo_btn = true;
    } else {
      this.waste_photo_btn = false;
    }
  }

  riverPhoto() {
    if ((this.eco_river != "") && (this.eco_river != 0)) {
      this.river_photo_btn = true;
    } else {
      this.river_photo_btn = false;
    }
  }

  shallowsPhoto() {
    if ((this.eco_shallows != "") && (this.eco_shallows != 0)) {
      this.shallows_photo_btn = true;
    } else {
      this.shallows_photo_btn = false;
    }
  }

  wellsPhoto() {
    if ((this.eco_wells != "") && (this.eco_wells != 0)) {
      this.wells_photo_btn = true;
    } else {
      this.wells_photo_btn = false;
    }
  }

  bufferzonePhoto() {
    if ((this.perimeter != "") && (this.perimeter != 0)) {
      this.bufferzone_photo_btn = true;
    } else {
      this.bufferzone_photo_btn = false;
    }
  }
  
  titleDeedPhoto() { 
    if ((this.title_deed != "") && (this.title_deed != 0)) {
      this.title_deed_photo_btn = true;
    } else {
      this.title_deed_photo_btn = false;
    }
  }

  extensionPhoto() { 
    if ((this.extension != "") && (this.extension != 509)) {
      this.extension_photo_btn = true;
      this.year_extension_preview = true;
    } else {
      this.extension_photo_btn = false;
      this.year_extension_preview = false;
    }
  }

  road_accessPhoto() {
    if ((this.road_access != "") && (this.road_access != 509)) {
      this.road_access_photo_btn = true;
    } else {
      this.road_access_photo_btn = false;
    }
  }

  irrigationPhoto() { 
    if ((this.irrigation != "") && (this.irrigation != 509)) {
      this.irrigation_photo_btn = true;
    } else {
      this.irrigation_photo_btn = false;
    }
  }

  drainagePhoto() { 
    if ((this.drainage != "") && (this.drainage != 509)) {
      this.drainage_photo_btn = true;
    } else {
      this.drainage_photo_btn = false;
    }
  }

  slopePhoto() { 
    if ((this.slope != "") && (this.slope != 509)) {
      this.slope_photo_btn = true;
      this.slope_text_preview = true;
    } else {
      this.slope_photo_btn = false;
      this.slope_text_preview = false;
    }
  }

  replantingYearAndPhoto() {
    if(this.replanting == 508) {
      this.year_to_replant_preview = true;
      this.replanting_photo_btn = true;
    } else {
      this.year_to_replant_preview = false;
      this.replanting_photo_btn = false;
    }
  }

  lands_rights_conflictNote() {
    if(this.lands_rights_conflict == 508) {
      this.lands_rights_conflict_note_preview = true;
    } else {
      this.lands_rights_conflict_note_preview = false;
    }  
  }
}
