import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-plantation-details',
  templateUrl: './plantation-details.page.html',
  styleUrls: ['./plantation-details.page.scss'],
})
export class PlantationDetailsPage implements OnInit {

  id_plantation: any;
  year_creation: any;
  title_deed: any;
  property: any;
  notes: any;
  area_acres: any;
  area: any;
  geom_json: any;
  culture: any;
  bio: any;
  bio_suisse: any;
  perimeter: any;
  variety: any;
  eco_river: any;
  eco_shallows: any;
  eco_wells: any;
  name_manager: any;
  manager_phone: any;
  seed_type: any;
  numb_feet: any;
  id_primary_company: any;
  fieldNumber: any;
  dc_completed: any;
  inactive: any;
  globalgap: any;
  rspo: any;
  name_town: any;
  fair_trade: any;
  irrigation: any;
  drainage: any;
  slope: any;
  slope_text: any;
  extension: any;
  year_extension: any;
  lands_rights_conflict: any;
  lands_rights_conflict_note: any;
  road_access: any;
  road_access_photo: any;
  farmer_experience: any;
  farmer_experience_level: any;
  day_worker_pay: any;
  gender_workers: any;
  migrant_workers: any;
  children_work: any;

  synthetic_fertilizer: any;
  synthetic_herbicides: any;
  synthetic_pesticide: any;
  adjoining_cultures: any;
  intercropping: any;
  harvest: any = "";
  forest: any;
  fire: any;
  waste: any;
  rating: any;
  manager_civil: any;
  number_staff_permanent: any;
  number_staff_temporary: any;
  yield_estimate: any;
  storage_coordx: any;
  storage_coordy: any;

  synthetic_pesticide_photo: any;
  synthetic_herbicides_photo: any;
  synthetic_fertilizer_photo: any;
  adj_cultures_photo: any;
  storage_photo: any;
  fire_photo: any;
  forest_photo: any;
  waste_photo: any;
  river_photo: any;
  shallows_photo: any;
  wells_photo: any;
  bufferzone_photo: any;
  title_deed_photo: any;
  irrigation_photo: any;
  drainage_photo: any;
  slope_photo: any;
  extension_photo: any;
  replanting_photo: any;
  replanting: any;
  year_to_replant: any;
  pest: any;
  
  synthetic_pesticide_photo_preview = false;
  synthetic_herbicides_photo_preview = false;
  synthetic_fertilizer_photo_preview = false;
  adj_cultures_photo_preview = false;
  storage_photo_preview = false;
  fire_photo_preview = false;
  forest_photo_preview = false;
  waste_photo_preview = false;
  storage_map_preview = false;
  river_photo_preview = false;
  shallows_photo_preview = false;
  wells_photo_preview = false;
  bufferzone_photo_preview = false;
  title_deed_photo_preview = false;
  irrigation_photo_preview = false;
  drainage_photo_preview = false;
  slope_photo_preview = false;
  extension_photo_preview = false;
  year_extension_preview = false;
  year_to_replant_preview = false;
  lands_rights_conflict_note_preview = false;
  road_access_photo_preview = false;

  slope_text_preview = false;
  replanting_photo_preview = false;

  owner_manager: any;
  code_farmer: any;

  plantation_id = null;
  filepath: any;

  constructor(
    private file: File,
    private activatedRoute: ActivatedRoute,
    private photoViewer: PhotoViewer,
    public translate: TranslateService,
    public navCtrl: NavController,
    private db: DatabaseService,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.storage.remove('dataType');

    this.filepath = this.file.externalRootDirectory + 'icollect/plantations/';
    this.loadData();
  }

  loadData() {
    this.activatedRoute.paramMap.subscribe(param => {
      this.plantation_id = param.get('plantation_id');

      this.db.getPlantation(this.plantation_id).then(plantation => {
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
  
  
        this.id_plantation = plantation.id_plantation;
        this.fieldNumber = plantation.code_plantation;
        this.name_town = plantation.name_town;
        this.code_farmer = plantation.code_farmer;
        
        if(plantation.id_culture1 == null){
          this.culture = '';
        } else { 
          this.db.getRegvalue(plantation.id_culture1).then(regvalue => {
            this.culture = regvalue.cvalue;
          });
        }
  
        if (plantation.dc_completed == 1) {
          this.dc_completed = complete;
        } else { this.dc_completed = not_complete; }
  
        if (plantation.inactive == 1) {
          this.inactive = yes;
        } else { this.inactive = no; }
  
        
        if(plantation.fair_trade == null){
          this.fair_trade = '';
        } else { 
          this.db.getRegvalue(plantation.fair_trade).then(regvalue => {
            this.fair_trade = regvalue.cvalue;
          });
        }
  
        if(plantation.globalgap == null){
          this.globalgap = '';
        } else { 
          this.db.getRegvalue(plantation.globalgap).then(regvalue => {
            this.globalgap = regvalue.cvalue;
          });
        }
  
        if(plantation.rspo == null){
          this.rspo = '';
        } else { 
          this.db.getRegvalue(plantation.rspo).then(regvalue => {
            this.rspo = regvalue.cvalue;
          });
        }
  
        if(plantation.bio == null){
          this.bio = '';
        } else { 
          this.db.getRegvalue(plantation.bio).then(regvalue => {
            this.bio = regvalue.cvalue;
          });
        }
  
        if(plantation.bio_suisse == null){
          this.bio_suisse = '';
        } else { 
          this.db.getRegvalue(plantation.bio_suisse).then(regvalue => {
            this.bio_suisse = regvalue.cvalue;
          });
        }
  
        if(plantation.area_acres == null){
          this.area_acres = '';
        } else { this.area_acres = plantation.area_acres; }
  
        if(plantation.area == null){
          this.area = '';
        } else { this.area = plantation.area; }
  
        if(plantation.year_creation == null){
          this.year_creation = '';
        } else { this.year_creation = plantation.year_creation; }
  
        let stored_property;
        if (plantation.property == 1) {
          stored_property = yes;
        } else if (plantation.property == 0) {
          stored_property = no;
        } else { stored_property = ''; }
        this.property = stored_property;
  
        let stored_title_deed;
        if (plantation.title_deed == 0) {
          stored_title_deed = none;
        } else if (plantation.title_deed == 1) {
          stored_title_deed = att_v;
        } else if (plantation.title_deed == 2) {
          stored_title_deed = tt_fonc;
        } else if (plantation.title_deed == 3) {
          stored_title_deed = pop_terr;
        } else {
          stored_title_deed = '';
        }
        this.title_deed = stored_title_deed;
  
        if(plantation.notes == null){
          this.notes = '';
        } else { this.notes = plantation.notes; }
  
        let perimeter;
        if (plantation.perimeter == 1) {
          perimeter = yes;
        } else if (plantation.perimeter == 0) {
          perimeter = no;
        } else { perimeter = ''; }
        this.perimeter = perimeter;
  
        if(plantation.variety == null){
          this.variety = '';
        } else { this.variety = plantation.variety; }
  
        let eco_river;
        if (plantation.eco_river == 1) {
          eco_river = yes;
        } else if (plantation.eco_river == 0) {
          eco_river = no;
        } else { eco_river = ''; }
        this.eco_river = eco_river;
  
        let eco_shallows;
        if (plantation.eco_shallows == 1) {
          eco_shallows = yes;
        } else if (plantation.eco_shallows == 0) {
          eco_shallows = no;
        } else { eco_shallows = ''; }
        this.eco_shallows = eco_shallows;
  
        let eco_wells;
        if (plantation.eco_wells == 1) {
          eco_wells = yes;
        } else if (plantation.eco_wells == 0) {
          eco_wells = no;
        } else { eco_wells = ''; }
        this.eco_wells = eco_wells;
  
        let seed_type;
        if (plantation.seed_type == 1) {
          seed_type = native;
        } else if (plantation.seed_type == 0) {
          seed_type = hybrid;
        } else { seed_type = ''; }
        this.seed_type = seed_type;
  
        if (plantation.synthetic_fertilizer == null) {
          this.synthetic_fertilizer = '';
        } else {
          this.db.getRegvalue(plantation.synthetic_fertilizer).then(regvalue => {
            this.synthetic_fertilizer = regvalue.cvalue;
          });
        }
  
        if (plantation.synthetic_herbicides == null) {
          this.synthetic_herbicides = '';
        } else {
          this.db.getRegvalue(plantation.synthetic_herbicides).then(regvalue => {
            this.synthetic_herbicides = regvalue.cvalue;
          });
        }
  
        if (plantation.synthetic_pesticide == null) {
          this.synthetic_pesticide = '';
        } else {
          this.db.getRegvalue(plantation.synthetic_pesticide).then(regvalue => {
            this.synthetic_pesticide = regvalue.cvalue;
          });
        }
  
        if (plantation.adjoining_cultures == null) {
          this.adjoining_cultures = '';
        } else {
  
          this.adjoining_cultures = '';
          let data = plantation.adjoining_cultures.split(',');
  
          for(var i=0; i<data.length; i++) {
            this.db.getRegvalue(data[i]).then(regvalue => {
              this.adjoining_cultures = this.adjoining_cultures + regvalue.cvalue + ', ';
            });
          }
          
        }
  
        if (plantation.intercropping == null) {
          this.intercropping = '';
        } else { this.intercropping = plantation.intercropping; }
  
        var jan, fev, mar, avr, mai, jun, jul, aou, sep, oct, nov, dec;
  
        this.translate.get('JANUARY').subscribe(value => { jan = value; });
        this.translate.get('FEBRUARY').subscribe(value => { fev = value; });
        this.translate.get('MARCH').subscribe(value => { mar = value; });
        this.translate.get('APRIL').subscribe(value => { avr = value; });
        this.translate.get('MAY').subscribe(value => { mai = value; });
        this.translate.get('JUNE').subscribe(value => { jun = value; });
        this.translate.get('JULY').subscribe(value => { jul = value; });
        this.translate.get('AUGUST').subscribe(value => { aou = value; });
        this.translate.get('SEPTEMBER').subscribe(value => { sep = value; });
        this.translate.get('OCTOBER').subscribe(value => { oct = value; });
        this.translate.get('NOVEMBER').subscribe(value => { nov = value; });
        this.translate.get('DECEMBER').subscribe(value => { dec = value; });
  
        this.harvest = "";
        if(plantation.harvest!=null){
          let data = plantation.harvest.split(",");
          for (var i = 0; i < data.length; i++) {
            if(data[i] == 'jan') { this.harvest = this.harvest + jan +', '; }
            if(data[i] == 'feb') { this.harvest = this.harvest + fev +', '; }
            if(data[i] == 'mar') { this.harvest = this.harvest + mar +', '; }
            if(data[i] == 'apr') { this.harvest = this.harvest + avr +', '; }
            if(data[i] == 'may') { this.harvest = this.harvest + mai +', '; }
            if(data[i] == 'jun') { this.harvest = this.harvest + jun +', '; }
            if(data[i] == 'jul') { this.harvest = this.harvest + jul +', '; }
            if(data[i] == 'aug') { this.harvest = this.harvest + aou +', '; }
            if(data[i] == 'sep') { this.harvest = this.harvest + sep +', '; }
            if(data[i] == 'oct') { this.harvest = this.harvest + oct +', '; }
            if(data[i] == 'nov') { this.harvest = this.harvest + nov +', '; }
            if(data[i] == 'dec') { this.harvest = this.harvest + dec +', '; }
          }
        }
        
        if (plantation.forest == null) {
          this.forest = '';
        } else {
          this.db.getRegvalue(plantation.forest).then(regvalue => {
            this.forest = regvalue.cvalue;
          });
        }
  
        if (plantation.fire == null) {
          this.fire = '';
        } else {
          this.db.getRegvalue(plantation.fire).then(regvalue => {
            this.fire = regvalue.cvalue;
          });
        }
  
        if (plantation.waste == null) {
          this.waste = '';
        } else {
          this.db.getRegvalue(plantation.waste).then(regvalue => {
            this.waste = regvalue.cvalue;
          });
        }
  
        if (plantation.rating == null) {
          this.rating = '';
        } else { this.rating = plantation.rating; }
  
        if (plantation.manager_civil == null) {
          this.manager_civil = '';
        } else {
          this.db.getRegvalue(plantation.manager_civil).then(regvalue => {
            this.manager_civil = regvalue.cvalue;
          });
        }
  
        if(plantation.irrigation == null){
          this.irrigation = '';
        } else { 
          this.db.getRegvalue(plantation.irrigation).then(regvalue => {
            this.irrigation = regvalue.cvalue;
          });
        }

        if(plantation.drainage == null){
          this.drainage = '';
        } else { 
          this.db.getRegvalue(plantation.drainage).then(regvalue => {
            this.drainage = regvalue.cvalue;
          });
        }

        if(plantation.slope == null){
          this.slope = '';
        } else { 
          this.db.getRegvalue(plantation.slope).then(regvalue => {
            this.slope = regvalue.cvalue;
          });
        }

        if(plantation.slope == 508) {
          this.slope_text_preview = true;
          this.slope_text = plantation.slope_text;
        } else {
          this.slope_text_preview = false;
          this.slope_text = '';
        }

        if(plantation.extension == null){
          this.extension = '';
        } else { 
          this.db.getRegvalue(plantation.extension).then(regvalue => {
            this.extension = regvalue.cvalue;
          });
        }

        if(plantation.extension == 508) {
          this.year_extension_preview = true;
          this.year_extension = plantation.year_extension;
        } else {
          this.year_extension_preview = false;
          this.year_extension = '';
        }

        if(plantation.replanting == null){
          this.extension = '';
        } else { 
          this.db.getRegvalue(plantation.replanting).then(regvalue => {
            this.replanting = regvalue.cvalue;
          });
        }

        if(plantation.replanting == 508) {
          this.year_to_replant_preview = true;
          this.year_to_replant = plantation.year_to_replant;
        } else {
          this.year_to_replant_preview = false;
          this.year_to_replant = '';
        }

        this.number_staff_permanent = plantation.number_staff_permanent;
        this.number_staff_temporary = plantation.number_staff_temporary;
        this.yield_estimate = plantation.yield_estimate;
  
        if (plantation.owner_manager == null) {
          this.owner_manager = '';
        } else {
          this.db.getRegvalue(plantation.owner_manager).then(regvalue => {
            this.owner_manager = regvalue.cvalue;
          });
        }
  
        if(plantation.lands_rights_conflict == null){
          this.lands_rights_conflict = '';
        } else { 
          this.db.getRegvalue(plantation.lands_rights_conflict).then(regvalue => {
            this.lands_rights_conflict = regvalue.cvalue;
          });
        }

        if(plantation.lands_rights_conflict == 508) {
          this.lands_rights_conflict_note_preview = true;
          this.lands_rights_conflict_note = plantation.lands_rights_conflict_note;
        } else {
          this.lands_rights_conflict_note_preview = false;
          this.lands_rights_conflict_note = '';
        } 

        if(plantation.road_access == null){
          this.road_access = '';
        } else { 
          this.db.getRegvalue(plantation.road_access).then(regvalue => {
            this.road_access = regvalue.cvalue;
          });
        }

        if(plantation.gender_workers == null){
          this.gender_workers = '';
        } else { 
          this.db.getRegvalue(plantation.gender_workers).then(regvalue => {
            this.gender_workers = regvalue.cvalue;
          }); 
        } 

        if(plantation.migrant_workers == null){
          this.migrant_workers = '';
        } else { 
          this.db.getRegvalue(plantation.migrant_workers).then(regvalue => {
            this.migrant_workers = regvalue.cvalue;
          }); 
        } 

        if(plantation.children_work == null){
          this.children_work = '';
        } else { 
          this.db.getRegvalue(plantation.children_work).then(regvalue => {
            this.children_work = regvalue.cvalue;
          }); 
        }

        this.name_manager = plantation.name_manager;
        this.manager_phone = plantation.manager_phone;
        this.farmer_experience = plantation.farmer_experience;
        this.farmer_experience_level = plantation.farmer_experience_level;
        this.numb_feet = plantation.numb_feet; 
        this.day_worker_pay = plantation.day_worker_pay; 
        this.pest = plantation.pest;
       
        this.storage_coordx = plantation.storage_coordx;
        this.storage_coordy = plantation.storage_coordy;
     
        if((this.storage_coordx==null) && (this.storage_coordy==null)){
          this.storage_map_preview = false;
        } else { this.storage_map_preview = true; }
        
        this.storage_photo = plantation.storage_photo;
        this.river_photo = plantation.river_photo;
        this.shallows_photo = plantation.shallows_photo;
        this.wells_photo = plantation.wells_photo;
        this.bufferzone_photo = plantation.bufferzone_photo;
        this.title_deed_photo = plantation.title_deed_photo;
        this.irrigation_photo = plantation.irrigation_photo;
        this.drainage_photo = plantation.drainage_photo;
        this.slope_photo = plantation.slope_photo;
        this.extension_photo = plantation.extension_photo;
        this.road_access_photo = plantation.road_access_photo;
        this.replanting_photo = plantation.replanting_photo;

        // Photos

        if ((plantation.replanting_photo != null) && (plantation.replanting_photo != 509)) {
          this.db.getPlantationPic(this.plantation_id, 773).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.replanting_photo = this.filepath + picture.filename;
              this.replanting_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.replanting_photo = picture.cloud_path;
                this.replanting_photo_preview = true;
              } else {
                this.replanting_photo_preview = false;
              }
            });
          });
  
        } else {
          this.replanting_photo_preview = false;
        }
  
        if ((plantation.synthetic_fertilizer != null) && (plantation.synthetic_fertilizer != 188)) {
          this.db.getPlantationPic(this.plantation_id, 596).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.synthetic_fertilizer_photo = this.filepath + picture.filename;
              this.synthetic_fertilizer_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.synthetic_fertilizer_photo = picture.cloud_path;
                this.synthetic_fertilizer_photo_preview = true;
              } else {
                this.synthetic_fertilizer_photo_preview = false;
              }
            });
          });
  
        } else {
          this.synthetic_fertilizer_photo_preview = false;
        }
    
        if ((plantation.synthetic_herbicides != null) && (plantation.synthetic_herbicides != 590)) {
          this.db.getPlantationPic(this.plantation_id, 597).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.synthetic_herbicides_photo = this.filepath + picture.filename;
              this.synthetic_herbicides_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.synthetic_herbicides_photo = picture.cloud_path;
                this.synthetic_herbicides_photo_preview = true;
              } else {
                this.synthetic_herbicides_photo_preview = false;
              }
            });
          });
  
        } else {
          this.synthetic_herbicides_photo_preview = false;
        }
   
        if ((plantation.synthetic_pesticide != null) && (plantation.synthetic_pesticide != 191)) {
          this.db.getPlantationPic(this.plantation_id, 598).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.synthetic_pesticide_photo = this.filepath + picture.filename;
              this.synthetic_pesticide_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.synthetic_pesticide_photo = picture.cloud_path;
                this.synthetic_pesticide_photo_preview = true;
              } else {
                this.synthetic_pesticide_photo_preview = false;
              }
            });
          });
          
        } else {
          this.synthetic_pesticide_photo_preview = false;
        }
     
        if (plantation.adjoining_cultures != null) {
          this.db.getPlantationPic(this.plantation_id, 599).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.adj_cultures_photo = this.filepath + picture.filename;
              this.adj_cultures_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.adj_cultures_photo = picture.cloud_path;
                this.adj_cultures_photo_preview = true;
              } else {
                this.adj_cultures_photo_preview = false;
              }
            });
          });
  
        } else {
          this.adj_cultures_photo_preview = false;
        }
    
        if ((plantation.forest != null) && (plantation.forest != 509)) {
          this.db.getPlantationPic(this.plantation_id, 600).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.forest_photo = this.filepath + picture.filename;
              this.forest_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.forest_photo = picture.cloud_path;
                this.forest_photo_preview = true;
              } else {
                this.forest_photo_preview = false;
              }
            });
          });
  
        } else {
          this.forest_photo_preview = false;
        }
    
        if ((plantation.fire != null) && (plantation.fire != 509)) {
          this.db.getPlantationPic(this.plantation_id, 601).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.fire_photo = this.filepath + picture.filename;
              this.fire_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.fire_photo = picture.cloud_path;
                this.fire_photo_preview = true;
              } else {
                this.fire_photo_preview = false;
              }
            });
          });
  
        } else {
          this.fire_photo_preview = false;
        }
    
        if ((plantation.waste != null) && (plantation.waste != 509)) {
          this.db.getPlantationPic(this.plantation_id, 602).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.waste_photo = this.filepath + picture.filename;
              this.waste_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.waste_photo = picture.cloud_path;
                this.waste_photo_preview = true;
              } else {
                this.waste_photo_preview = false;
              }
            });
          });
  
        } else {
          this.waste_photo_preview = false;
        }
    
        if ((plantation.eco_river != null) && (plantation.eco_river != 0)) { 
          this.db.getPlantationPic(this.plantation_id, 605).then(picture => { 
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.river_photo = this.filepath + picture.filename;
              this.river_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.river_photo = picture.cloud_path;
                this.river_photo_preview = true;
              } else {
                this.river_photo_preview = false;
              }
            });
          });
  
        } else {
          this.river_photo_preview = false;
        }
    
        if ((plantation.eco_shallows != null) && (plantation.eco_shallows != 0)) {
          this.db.getPlantationPic(this.plantation_id, 606).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.shallows_photo = this.filepath + picture.filename;
              this.shallows_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.shallows_photo = picture.cloud_path;
                this.shallows_photo_preview = true;
              } else {
                this.shallows_photo_preview = false;
              }
            });
          });
  
        } else {
          this.shallows_photo_preview = false;
        }
      
        if ((plantation.eco_wells != null) && (plantation.eco_wells != 0)) {
          this.db.getPlantationPic(this.plantation_id, 607).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.wells_photo = this.filepath + picture.filename;
              this.wells_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.wells_photo = picture.cloud_path;
                this.wells_photo_preview = true;
              } else {
                this.wells_photo_preview = false;
              }
            });
          });
  
        } else {
          this.wells_photo_preview = false;
        }
      
        if ((plantation.perimeter != null) && (plantation.perimeter != 0)) {
          this.db.getPlantationPic(this.plantation_id, 608).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.bufferzone_photo = this.filepath + picture.filename;
              this.bufferzone_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.bufferzone_photo = picture.cloud_path;
                this.bufferzone_photo_preview = true;
              } else {
                this.bufferzone_photo_preview = false;
              }
            });
          });
  
        } else {
          this.bufferzone_photo_preview = false;
        }
    
        if ((plantation.title_deed != null) && (plantation.title_deed != 0)) {
          this.db.getPlantationPic(this.plantation_id, 626).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.title_deed_photo = this.filepath + picture.filename;
              this.title_deed_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.title_deed_photo = picture.cloud_path;
                this.title_deed_photo_preview = true;
              } else {
                this.title_deed_photo_preview = false;
              }
            });
          });
  
        } else {
          this.title_deed_photo_preview = false;
        }
  
        if(this.storage_photo!=null){ 
          this.db.getPlantationPic(this.plantation_id, 595).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.storage_photo = this.filepath + picture.filename;
              this.storage_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.storage_photo = picture.cloud_path;
                this.storage_photo_preview = true;
              } else {
                this.storage_photo_preview = false;
              }
            });
          });
  
        } else { this.storage_photo_preview = false; }

        if ((plantation.irrigation != null) && (plantation.irrigation != 509)) {
          this.db.getPlantationPic(this.plantation_id, 690).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.irrigation_photo = this.filepath + picture.filename;
              this.irrigation_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.irrigation_photo = picture.cloud_path;
                this.irrigation_photo_preview = true;
              } else {
                this.irrigation_photo_preview = false;
              }
            });
          });
  
        } else {
          this.irrigation_photo_preview = false;
        }

        if ((plantation.drainage != null) && (plantation.drainage != 509))  { 
          this.db.getPlantationPic(this.plantation_id, 691).then(picture => { 
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.drainage_photo = this.filepath + picture.filename;
              this.drainage_photo_preview = true;
            }).catch(() => { 
              if( picture.cloud_path != null) {
                this.drainage_photo = picture.cloud_path;
                this.drainage_photo_preview = true;
              } else {
                this.drainage_photo_preview = false;
              }
            });
          });
  
        } else {
          this.drainage_photo_preview = false;
        } 

        if ((plantation.slope != null) && (plantation.slope != 509))  {
          this.db.getPlantationPic(this.plantation_id, 692).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.slope_photo = this.filepath + picture.filename;
              this.slope_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.slope_photo = picture.cloud_path;
                this.slope_photo_preview = true;
              } else {
                this.slope_photo_preview = false;
              }
            });
          });
  
        } else {
          this.slope_photo_preview = false;
        }

        if ((plantation.extension != null) && (plantation.extension != 509))  {
          this.db.getPlantationPic(this.plantation_id, 689).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.extension_photo = this.filepath + picture.filename;
              this.extension_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.extension_photo = picture.cloud_path;
                this.extension_photo_preview = true;
              } else {
                this.extension_photo_preview = false;
              }
            });
          });
  
        } else {
          this.extension_photo_preview = false;
        }

        if ((plantation.road_access != null) && (plantation.road_access != 509)) {
          this.db.getPlantationPic(this.plantation_id, 693).then(picture => {
            this.file.checkFile(this.filepath, picture.filename).then(file => { 
              console.log(file);
              this.road_access_photo = this.filepath + picture.filename;
              this.road_access_photo_preview = true;
            }).catch(() => {
              if( picture.cloud_path != null) {
                this.road_access_photo = picture.cloud_path;
                this.road_access_photo_preview = true;
              } else {
                this.road_access_photo_preview = false;
              }
            });
          });
  
        } else {
          this.road_access_photo_preview = false;
        }

      });
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

  show_synt_fertilizer_photo() {
    this.photoViewer.show(this.synthetic_fertilizer_photo);
  }

  show_synt_herbicides_photo() {
    this.photoViewer.show(this.synthetic_herbicides_photo);
  }

  show_synt_pesticide_photo() {
    this.photoViewer.show(this.synthetic_pesticide_photo);
  }

  show_adj_cultures_photo() {
    this.photoViewer.show(this.adj_cultures_photo); 
  }

  show_fire_photo() {
    this.photoViewer.show(this.fire_photo);
  }

  show_forest_photo() {
    this.photoViewer.show(this.forest_photo); 
  }

  show_waste_photo() {
    this.photoViewer.show(this.waste_photo); 
  }

  show_storage_photo() {
    this.photoViewer.show(this.storage_photo); 
  }

  show_storage_map() {
    this.navCtrl.navigateForward(['/storage-map', 1]);
  }

  show_river_photo() {
    this.photoViewer.show(this.river_photo); 
  }

  show_shallows_photo() {
    this.photoViewer.show(this.shallows_photo); 
  }

  show_wells_photo() {
    this.photoViewer.show(this.wells_photo); 
  }

  show_bufferzone_photo() {
    this.photoViewer.show(this.bufferzone_photo); 
  }

  show_title_deed_photo() {
    this.photoViewer.show(this.title_deed_photo); 
  }

  show_irrigation_photo() {
    this.photoViewer.show(this.irrigation_photo); 
  }

  show_extension_photo() {
    this.photoViewer.show(this.extension_photo); 
  }

  show_road_access_photo() {
    this.photoViewer.show(this.road_access_photo); 
  }

  show_dranage_photo() { 
    this.photoViewer.show(this.drainage_photo); 
  }

  show_slope_photo() {
    this.photoViewer.show(this.slope_photo); 
  }

  show_replanting_photo() {
    this.photoViewer.show(this.replanting_photo); 
  }

  plantPictures() {
    this.storage.set('dataType', 'plantation');
    this.navCtrl.navigateForward(['/media']);
  }

  editPlantation() {
    this.navCtrl.navigateForward(['/edit-plantation', this.plantation_id]);
  }

}
