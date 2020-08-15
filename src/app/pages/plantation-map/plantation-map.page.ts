import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, ToastController, NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service.js';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NetworkService, ConnectionStatus } from 'src/app/services/network.service.js';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';

import mapboxgl from "../../../assets/mapbox-gl-cordova-offline.js";
import turf from '../../../assets/turf.min.js';
import { TranslateService } from '@ngx-translate/core';
import { CacheService } from 'ionic-cache';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-plantation-map',
  templateUrl: './plantation-map.page.html',
  styleUrls: ['./plantation-map.page.scss'],
})
export class PlantationMapPage implements OnInit {

  map: any;

  public saveColPoint = false;
  public showColPoint = false;
  public plantPoly = false;
  public savePlantPoly = false;
  public backBtn = true;

  public pathStop = false;
  public pathStart = false;
  public savePath = false;
  public showPaths = false;
  public pathLine = false;

  coordx: any;
  coordy: any;
  precision: any;
  watch: any;
  subscription: any;
  plantation: any;
  user: any;

  drawStart = false;
  drawStop = false;
  drawAdd = false;

  area_acres: any;
  surface_ha: any;
  area: any;

  your_location: any;
  collection_point: any;

  polygonFeature: any = {
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": []
    },
    "crs": { "type": "name", "properties": { "name": "EPSG:4326" } }
  };

  polylineFeature: any;

  waypoints: any[] = [];
  pathway: any[] = [];
  paths: any;

  id_project: any;
  id_contact: any;
  id_task: any;
  id_company: any;

  constructor(
    private platform: Platform,
    private storage: Storage,
    private db: DatabaseService,
    public translate: TranslateService,
    private geolocation: Geolocation,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private networkService: NetworkService,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private mediaCapture: MediaCapture,
    public router: ActivatedRoute,
    public navCtrl: NavController,
    public cache: CacheService,
    private camera: Camera,
    private file: File
    //private screenOrientation: ScreenOrientation
  ) {
    this.cache.clearAll();
    this.platform.ready().then(() => {
      mapboxgl.accessToken = 'pk.eyJ1IjoiY3JvdGg1MyIsImEiOiJjajRsazkxenowdnZuMnducjRiam90djlnIn0.XMeuMgUwPncR3fMwSgS7WA';
    });

    this.translate.get('COLLECTION_POINT').subscribe(value => { this.collection_point = value; });
    this.translate.get('YOUR_LOCATION').subscribe(value => { this.your_location = value; });
  }

  ngOnInit() {
    this.db.lastLogedUser().then(usr => {
      this.user = usr;
    });

    this.storage.get('id_plantation').then((val) => {
      this.db.loadPlantationPaths(val).then(path => {
        if (path == null) {
          this.pathLine = false;
        } else { this.pathLine = true; }

        this.paths = path;
        this.showPaths = true;
      });
    });

    this.storage.get('id_task').then((id_task) => { this.id_task = id_task; });
    this.storage.get('id_contact').then((id_contact) => { this.id_contact = id_contact; });
    this.storage.get('id_project').then((id_project) => {
      this.id_project = id_project;

      this.db.getProject(id_project).then(project => {
        this.id_company = project.id_company;
      });
    });

    this.platform.ready().then(() => {
      this.init();
    });
  }

  init() {
    this.waypoints = [];
    this.polygonFeature.geometry.coordinates = [];

    this.storage.get('id_plantation').then((val) => {
      this.db.getPlantation(val).then(plt => {
        this.plantation = plt;

        if (this.plantation.geom_json != null) {
          this.plantPoly = true;
        } else { this.plantPoly = false; }

        this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
          if ((plt.coordx == null) && (plt.coordy == null)) {
            this.showColPoint = false;

            this.translate.get('NO_COLLECTION_POINT').subscribe(value => {
              //this.presentAlert(value, 'Info');
            });

            this.checkGPSPermission(0);

          } else {
            this.showColPoint = true;

            if (status == ConnectionStatus.Online) {
              setTimeout(() => {
                this.map_Online(plt.coordx, plt.coordy, 1);
              }, 600);
            }
            if (status == ConnectionStatus.Offline) {
              setTimeout(() => {
                this.map_Offline(plt.coordx, plt.coordy, 1);
              }, 600);
            }
          }

          if (this.plantation.dc_completed == 1) {
            this.plantPoly = true; this.showColPoint = true; this.pathLine = true;
          }

        });

      });

    });
  }

  map_Offline(coordx, coordy, conf) {
    new mapboxgl.OfflineMap({
      container: 'plantation-map',
      style: 'assets/styles/osm-bright/style-offline.json',
      center: [coordy, coordx],
      zoom: 10,
      bearing: -45,
      hash: true
    }).then((map) => {
      map.addControl(new mapboxgl.NavigationControl());

      map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      }));

      if (conf == 0) {
        new mapboxgl.Marker({ color: 'red' })
          .setLngLat([coordy, coordx])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(this.your_location))
          .addTo(map);

      } else {
        new mapboxgl.Marker()
          .setLngLat([coordy, coordx])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(this.collection_point))
          .addTo(map);
      }

      let preview_waypoints: any = this.router.snapshot.paramMap.get('preview_waypoints');

      if ((preview_waypoints == 1) && (this.plantPoly == false)) {
        this.plantPoly = true;
        this.db.loadWayPoints(this.plantation.id_plantation, 0).then(_ => {
          this.db.getWayPoints().subscribe(data => {
            for (var i = 0; i < data.length; i++) {
              new mapboxgl.Marker({ color: 'red' })
                .setLngLat([data[i].coordx, data[i].coordy])
                .setPopup(new mapboxgl.Popup({ offset: 25 })
                  .setHTML(data[i].seq))
                .addTo(map);

              this.waypoints.push([data[i].coordx, data[i].coordy]);
            }
          });

          this.polygonFeature.geometry.coordinates.push(this.waypoints);

          map.addLayer({
            'id': 'plantation_waypoin-10',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': this.polygonFeature
            },
            'layout': {},
            'paint': {
              'fill-color': '#ff0000',
              'fill-opacity': 0.8
            }
          });

          map.fitBounds(turf.bbox(this.polygonFeature), { padding: 20 });

          this.savePlantPoly = true;

          var area = turf.area(this.polygonFeature);
          var rounded_area = Math.round(area * 100) / 100;
          this.area = area;

          this.area_acres = area * 0.000247105381;
          var rounded_area_acres = Math.round(this.area_acres * 100) / 100;

          this.surface_ha = area * 0.0001;
          var rounded_surface_ha = Math.round(this.surface_ha * 100) / 100;

          let html = '<p><strong>Area :</strong> ' + rounded_area + ' m2<br/>'
            + '<strong>Area Acres :</strong> ' + rounded_area_acres + ' Acres<br/>'
            + '<strong>Surface :</strong> ' + rounded_surface_ha + ' Ha</p>';

          this.presentAlert(html, 'Info');

          map.on('click', 'plantation_waypoin-10', (e) => {
            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML('<strong>' + this.plantation.code_plantation + '</srong>' + html)
              .addTo(map);
          });

        });
      }

      if (this.plantation.geom_json != null) {

        let polygon: any;
        if (this.plantation.mobile_data == 0) {

          let json = this.plantation.geom_json;
          json = json.replace(/\\/g, '"');

          let geoJson = JSON.parse(json);
          geoJson = geoJson.coordinates[0];

          polygon = {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": geoJson
            }
          }

        } else {
          polygon = JSON.parse(this.plantation.geom_json);
        }

        map.addLayer({
          'id': 'plantation_polygon-20',
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': polygon
          },
          'layout': {},
          'paint': {
            'fill-color': '#088',
            'fill-opacity': 0.8
          }
        });

        map.fitBounds(turf.bbox(polygon), { padding: 20 });

        map.on('click', 'plantation_polygon-20', (e) => {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('<strong>' + this.plantation.code_plantation + '</strong> <p>' + this.plantation.area + '</p>')
            .addTo(map);
        });
      }

      if (this.pathway.length > 0) {
        var i;
        this.pathway.forEach((item, index) => {
          console.log(item); //value
          console.log(index); //index

          new mapboxgl.Marker({ color: 'red' })
            .setLngLat([item[0], item[1]])
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(i))
            .addTo(map);

          i++;
        });
      }

      if (this.showPaths == true) {
        if (this.paths.plantation_id == this.plantation.id_plantation) {
          map.addLayer({
            "id": "path_line-40",
            "type": "line",
            "source": {
              "type": "geojson",
              "data": JSON.parse(this.paths.path_json)
            },
            "layout": {
              "line-join": "round",
              "line-cap": "round"
            },
            "paint": {
              "line-color": "#8A2BE2",
              "line-width": 4
            }
          });
        }
      }
    });
  }

  map_Online(coordx, coordy, conf) {
    this.map = new mapboxgl.Map({
      container: 'plantation-map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coordy, coordx],
      zoom: 10
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }));

    if (conf == 0) {
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat([coordy, coordx])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(this.your_location))
        .addTo(this.map);

    } else {
      new mapboxgl.Marker()
        .setLngLat([coordy, coordx])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(this.collection_point))
        .addTo(this.map);
    }

    let preview_waypoints: any = this.router.snapshot.paramMap.get('preview_waypoints');

    if ((preview_waypoints == 1) && (this.plantPoly == false)) {

      this.plantPoly = true;
      this.db.loadWayPoints(this.plantation.id_plantation, 0).then(_ => {
        this.db.getWayPoints().subscribe(data => {
          for (var i = 0; i < data.length; i++) {
            new mapboxgl.Marker({ color: 'red' })
              .setLngLat([data[i].coordx, data[i].coordy])
              .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(data[i].seq))
              .addTo(this.map);

            this.waypoints.push([data[i].coordx, data[i].coordy]);
          }
        });

        this.polygonFeature.geometry.coordinates.push(this.waypoints);

        this.map.on('load', () => {
          this.map.addLayer({
            'id': 'plantation_waypoin-10',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': this.polygonFeature
            },
            'layout': {},
            'paint': {
              'fill-color': '#ff0000',
              'fill-opacity': 0.8
            }
          });
        });

        this.map.fitBounds(turf.bbox(this.polygonFeature), { padding: 20 });

        this.savePlantPoly = true;

        var area = turf.area(this.polygonFeature);
        var rounded_area = Math.round(area * 100) / 100;
        this.area = area;

        this.area_acres = area * 0.000247105381;
        var rounded_area_acres = Math.round(this.area_acres * 100) / 100;

        this.surface_ha = area * 0.0001;
        var rounded_surface_ha = Math.round(this.surface_ha * 100) / 100;

        let html = '<p><strong>Area :</strong> ' + rounded_area + ' m2<br/>'
          + '<strong>Area Acres :</strong> ' + rounded_area_acres + ' Acres<br/>'
          + '<strong>Surface :</strong> ' + rounded_surface_ha + ' Ha</p>';

        this.presentAlert(html, 'Info');

        this.map.on('click', 'plantation_waypoin-10', (e) => {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('<strong>' + this.plantation.code_plantation + '</strong>' + html)
            .addTo(this.map);
        });
      });
    }

    if (this.plantation.geom_json != null) {

      let polygon: any;
      if (this.plantation.mobile_data == 0) {

        let json = this.plantation.geom_json;
        json = json.replace(/\\/g, '"');

        let geoJson = JSON.parse(json);
        geoJson = geoJson.coordinates[0];

        polygon = {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": geoJson
          }
        }

      } else {
        polygon = JSON.parse(this.plantation.geom_json);
      }

      this.map.on('load', () => {
        this.map.addLayer({
          'id': 'plantation_polygon-2',
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': polygon
          },
          'layout': {},
          'paint': {
            'fill-color': '#088',
            'fill-opacity': 0.8
          }
        });
      });

      this.map.fitBounds(turf.bbox(polygon), { padding: 20 });

      this.map.on('click', 'plantation_polygon-2', (e) => {
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML('<strong>' + this.plantation.code_plantation + '</strong> <p>' + this.plantation.area + '</p>')
          .addTo(this.map);
      });
    }

    if (this.pathway.length > 0) {
      var i;
      this.pathway.forEach((item, index) => {
        console.log(item); //value
        console.log(index); //index

        new mapboxgl.Marker({ color: 'red' })
          .setLngLat([item[0], item[1]])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(i))
          .addTo(this.map);

        i++;
      });
    }

    if (this.showPaths == true) {
      this.map.on('load', () => {
        if (this.paths.plantation_id == this.plantation.id_plantation) {
          this.map.addLayer({
            "id": "path_line-30",
            "type": "line",
            "source": {
              "type": "geojson",
              "data": JSON.parse(this.paths.path_json)
            },
            "layout": {
              "line-join": "round",
              "line-cap": "round"
            },
            "paint": {
              "line-color": "#8A2BE2",
              "line-width": 4
            }
          });
        }
      });
    }

  }

  async presentAlert(message, title) {
    const alert = this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  async toastAlert(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }

  saveCollectionPoint() {
    this.colPPrompt();
  }

  async colPPrompt() {
    var yes, no, msg, headerText;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });
    this.translate.get('SAVE_COLLECTION_POINT_PP_TITLE').subscribe(value => { headerText = value; });
    this.translate.get('SAVE_COLLECTION_POINT_PP_MSG').subscribe(value => { msg = value; });

    const promptAlert = await this.alertCtrl.create({
      subHeader: headerText,
      message: msg,
      buttons: [
        {
          text: no,
          handler: data => {
            console.log(data);
            this.backBtn = true;
            this.saveColPoint = false;
          }
        },
        {
          text: yes,
          handler: data => {
            console.log(data);
            this.saveCollectionPointAction();
          }
        }
      ]
    });
    promptAlert.present();
  }

  saveCollectionPointAction() {
    this.storage.get('id_plantation').then((val) => {
      this.db.saveCollectionPoint(this.coordx, this.coordy, val).then(
        () => {
          this.showColPoint = true;
          this.saveColPoint = false;

          this.translate.get('SAVE_COLLECTION_POINT_SUCCESS').subscribe(value => {
            this.presentAlert(value, 'Success');
          });

          this.db.lastLogedUser().then(usr => {
            var m = new Date();
            let date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

            this.geolocation.getCurrentPosition().then((resp) => {
              var ticker = 0;
              this.db.addTicker(usr.id_contact, val, this.plantation.plantationsite_id, this.id_contact, 'coordx', this.coordx, 'plantation', date, resp.coords.latitude, resp.coords.longitude, val, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, null, null).then(() => { ticker = 1; });
              this.db.addTicker(usr.id_contact, val, this.plantation.plantationsite_id, this.id_contact, 'coordy', this.coordy, 'plantation', date, resp.coords.latitude, resp.coords.longitude, val, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, null, null).then(() => { ticker = 1; });
              if (ticker == 1) {
                this.translate.get('TICKER_UPDATED').subscribe(value => {
                  this.toastAlert(value);
                });
              }
            });
          });

          setTimeout(() => { this.init(); }, 2000);
        });
    });

    this.backBtn = true;
  }

  checkGPSPermission(value) {
    if (value == 1) {
      this.saveColPoint = true;
      this.savePlantPoly = false;
      this.savePath = false;
      this.pathStart = false;

      this.backBtn = false;
    }

    this.getLocationCoordinates();

    /*
    //if(this.user.high_accuracy == 1){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {
          //If not having permission ask for permission
          this.getLocationCoordinates();
        }
      }, err => {
        console.log(err);
      }
    );
    // } else {
    //  this.getLocationCoordinates();
    //} */
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(() => { this.askToTurnOnGPS(); },
            error => {
              //Show alert if user click on 'No Thanks'
              //this.presentAlert('Error requesting location permissions ' + error, 'Error');
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.getLocationCoordinates()
      },
      error => {
        //this.presentAlert('Requesting location permissions.' + JSON.stringify(error), 'Error')
      } 
    );
  }

  // Methos to get device accurate coordinates using device GPS
  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.coordx = resp.coords.latitude;
      this.coordy = resp.coords.longitude;
      this.precision = resp.coords.accuracy;

      this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
        if (status == ConnectionStatus.Online) {
          this.map_Online(resp.coords.latitude, resp.coords.longitude, 0);
        }
        if (status == ConnectionStatus.Offline) {
          this.map_Offline(resp.coords.latitude, resp.coords.longitude, 0);
        }
      });

      this.precision = Math.round(resp.coords.accuracy * 100) / 100;

      this.translate.get('ACCURACY').subscribe(value => {
        this.toastAlert(value + ' : ' + this.precision + 'm');
      });

    }).catch((error) => {
      this.translate.get('LOCATION_ERROR').subscribe(value => {
        //this.presentAlert(value + error, 'Error');
      });
    });
  }

  polyAction() {
    this.navCtrl.navigateForward(['/waypoint']);
  }

  savePlantPolygon() {
    this.polyPrompt();
  }

  async polyPrompt() {
    var yes, no, msg, headerText;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });
    this.translate.get('SAVE_POLY_PP_TITLE').subscribe(value => { headerText = value; });
    this.translate.get('SAVE_POLY_PP_MSG').subscribe(value => { msg = value; });

    const promptAlert = await this.alertCtrl.create({
      subHeader: headerText,
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
            this.savePlantPolygonAction();
          }
        }
      ]
    });
    promptAlert.present();
  }

  savePlantPolygonAction() {
    this.storage.get('id_plantation').then((val) => {
      this.db.savePlantationPolygon(this.polygonFeature, this.area_acres, this.area, this.surface_ha, val)
        .then(() => {
          this.plantPoly = true;
          this.savePlantPoly = false;

          this.translate.get('PLANTATION_SAVE_SUCCESS').subscribe(value => {
            this.presentAlert(value, 'Success');
          });

          this.db.lastLogedUser().then(usr => {
            var m = new Date();
            let date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

            this.geolocation.getCurrentPosition().then((resp) => {
              var ticker = 0;
              this.db.addTicker(usr.id_contact, val, this.plantation.plantationsite_id, this.id_contact, 'area_acres', this.area_acres, 'plantation', date, resp.coords.latitude, resp.coords.longitude, val, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, null, null).then(() => { ticker = 1; });
              this.db.addTicker(usr.id_contact, val, this.plantation.plantationsite_id, this.id_contact, 'area', this.area, 'plantation', date, resp.coords.latitude, resp.coords.longitude, val, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, null, null).then(() => { ticker = 1; });
              this.db.addTicker(usr.id_contact, val, this.plantation.plantationsite_id, this.id_contact, 'surface_ha', this.surface_ha, 'plantation', date, resp.coords.latitude, resp.coords.longitude, val, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, null, null).then(() => { ticker = 1; });
              this.db.addTicker(usr.id_contact, val, this.plantation.plantationsite_id, this.id_contact, 'modified_by', this.user.id_contact, 'plantation', date, resp.coords.latitude, resp.coords.longitude, val, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, null, null).then(() => { ticker = 1; });
              this.db.addTicker(usr.id_contact, val, this.plantation.plantationsite_id, this.id_contact, 'modified_date', date, 'plantation', date, resp.coords.latitude, resp.coords.longitude, val, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, null, null).then(() => { ticker = 1; });
              
              if (ticker == 1) {
                this.translate.get('TICKER_UPDATED').subscribe(value => {
                  this.toastAlert(value);
                });
              }

              let json: any = {
                "type": "MultiPolygon",
                "coordinates": [
                  [this.waypoints]
                ]
              };

              let json_string = JSON.stringify(json);
              let geom_json = json_string.split(":").join("@");

              this.db.addTicker(usr.id_contact, val, this.plantation.plantationsite_id, this.id_contact, 'geom_json', geom_json, 'plantation', date, resp.coords.latitude, resp.coords.longitude, val, this.id_project, this.id_task, null, null, null, null, null, null, null, null, null, null).then(() => {
                this.translate.get('TICKER_UPDATED').subscribe(value => {
                  this.toastAlert(value);
                });
              });

              this.db.saveWayPoint(val);
            });
          });

          setTimeout(() => { this.init(); }, 2000);
        });
    });

    this.backBtn = true;
  }

  pathAction() {
    this.saveColPoint = false;
    this.pathStart = true;
    this.savePath = false;

    this.drawStart = false;
    this.drawAdd = false;
    this.pathway = [];

    this.init();
  }

  pathActionStop() {
    this.pathStop = false;
    this.savePath = true;

    this.backBtn = false;

    this.subscription.unsubscribe();
    this.init();
  }

  pathActionStart() {
    this.pathStart = false;
    this.pathStop = true;

    let options = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 7000,
    };

    var i = 1;
    this.watch = this.geolocation.watchPosition(options);
    this.subscription = this.watch.subscribe((data) => {
      this.pathway.push([data.coords.longitude, data.coords.latitude]);

      this.translate.get('POINT_ADDED').subscribe(value => {
        this.toastAlert(i + value);
      });

      i = i + 1;
    });
  }

  savePathLine() {
    var title, msg, titleU, msgU;
    this.translate.get('SAVE_PATH_PP_TITLE').subscribe(value => { title = value });
    this.translate.get('SAVE_PATH_PP_MSG').subscribe(value => { msg = value });
    this.translate.get('UPDATE_PATH_PP_TITLE').subscribe(value => { titleU = value });
    this.translate.get('UPDATE_PATH_PP_MSG').subscribe(value => { msgU = value });

    if (this.showPaths == true) {
      this.pathPrompt(msgU, titleU, true);
    } else {
      this.pathPrompt(msg, title, false);
    }
  }

  async pathPrompt(msg, headerText, update) {
    var yes, no;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });

    const promptAlert = await this.alertCtrl.create({
      subHeader: headerText,
      message: msg,
      buttons: [
        {
          text: no,
          handler: data => {
            console.log(data);
            this.backBtn = true;
            this.savePath = false;
          }
        },
        {
          text: yes,
          handler: data => {
            console.log(data);
            this.pathSaveAction(update);
          }
        }
      ]
    });
    promptAlert.present();
  }

  pathSaveAction(update) {
    this.polylineFeature = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": this.pathway
      },
      "crs": { "type": "name", "properties": { "name": "EPSG:4326" } }
    };

    this.storage.get('id_plantation').then((val) => {
      this.db.getNewContactId().then(contact => {
        this.newPath(contact.new_id, val, update);
      });
    });
  }

  newPath(newId, plantation_id, update) {
    var m = new Date();
    let created_date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
    let path_name = newId + '-' + this.user.id_contact + '-' + plantation_id;

    if (update == true) {
      this.db.updatePath(this.paths.id_path, path_name, plantation_id, this.plantation.id_town, this.polylineFeature, this.user.id_contact, created_date, 0)
        .then(() => {
          this.savePath = false;
          this.translate.get('PATH_UPDATE_SUCCESS').subscribe(value => {
            this.presentAlert(value, 'Success');
          });

          this.db.lastLogedUser().then(usr => {
            var m = new Date();
            let date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

            this.geolocation.getCurrentPosition().then((resp) => {
              let json = this.polylineFeature.geometry;
              let newJson = JSON.stringify(json);
              let path_json = newJson.split(":").join("@");

              var ticker = 0;
              this.db.addTicker(usr.id_contact, plantation_id, this.plantation.plantationsite_id, this.id_contact, 'id_agent', this.user.id_contact, 'plantation_lines', date, resp.coords.latitude, resp.coords.longitude, null, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, this.paths.id_path, null).then(() => { ticker = 1; });
              this.db.addTicker(usr.id_contact, plantation_id, this.plantation.plantationsite_id, this.id_contact, 'id_company', this.id_company, 'plantation_lines', date, resp.coords.latitude, resp.coords.longitude, null, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, this.paths.id_path, null).then(() => { ticker = 1; });
              this.db.addTicker(usr.id_contact, plantation_id, this.plantation.plantationsite_id, this.id_contact, 'geom_json', path_json, 'plantation_lines', date, resp.coords.latitude, resp.coords.longitude, null, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, this.paths.id_path, null).then(() => { ticker = 1; });
              this.db.addTicker(usr.id_contact, plantation_id, this.plantation.plantationsite_id, this.id_contact, 'modified_by', this.user.id_contact, 'plantation_lines', date, resp.coords.latitude, resp.coords.longitude, null, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, this.paths.id_path, null).then(() => { ticker = 1; });
              this.db.addTicker(usr.id_contact, plantation_id, this.plantation.plantationsite_id, this.id_contact, 'modified_date', date, 'plantation_lines', date, resp.coords.latitude, resp.coords.longitude, null, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, this.paths.id_path, null).then(() => { ticker = 1; });

              if (ticker == 1) {
                this.translate.get('TICKER_UPDATED').subscribe(value => {
                  this.toastAlert(value);
                });
              }
            });
          });

          this.pathway = [];
          setTimeout(() => { this.init(); }, 2000);
        });

    } else {
      this.db.addPath(newId, path_name, plantation_id, this.plantation.id_town, this.polylineFeature, this.user.id_contact, created_date, 0, this.id_company, this.user.id_contact)
        .then(() => {
          this.savePath = false;
          this.translate.get('PATH_SAVE_SUCCESS').subscribe(value => {
            this.presentAlert(value, 'Success');
          });

          this.db.lastLogedUser().then(usr => {
            var m = new Date();
            let date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

            this.geolocation.getCurrentPosition().then((resp) => {
              let json = this.polylineFeature.geometry;
              let newJson = JSON.stringify(json);
              let path_json = newJson.split(":").join("@");

              var ticker = 0;
              this.db.addTicker(usr.id_contact, plantation_id, this.plantation.plantationsite_id, this.id_contact, 'id_agent', this.user.id_contact, 'plantation_lines', date, resp.coords.latitude, resp.coords.longitude, null, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, newId, null).then(() => { ticker = 1; });
              this.db.addTicker(usr.id_contact, plantation_id, this.plantation.plantationsite_id, this.id_contact, 'id_company', this.id_company, 'plantation_lines', date, resp.coords.latitude, resp.coords.longitude, null, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, newId, null).then(() => { ticker = 1; });
              this.db.addTicker(usr.id_contact, plantation_id, this.plantation.plantationsite_id, this.id_contact, 'geom_json', path_json, 'plantation_lines', date, resp.coords.latitude, resp.coords.longitude, null, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, newId, null).then(() => { ticker = 1; });
              this.db.addTicker(usr.id_contact, plantation_id, this.plantation.plantationsite_id, this.id_contact, 'modified_by', this.user.id_contact, 'plantation_lines', date, resp.coords.latitude, resp.coords.longitude, null, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, newId, null).then(() => { ticker = 1; });
              this.db.addTicker(usr.id_contact, plantation_id, this.plantation.plantationsite_id, this.id_contact, 'modified_date', date, 'plantation_lines', date, resp.coords.latitude, resp.coords.longitude, null, this.id_project, this.id_task, null, null, null, null, null, this.id_company, null, null, newId, null).then(() => { ticker = 1; });

              if (ticker == 1) {
                this.translate.get('TICKER_UPDATED').subscribe(value => {
                  this.toastAlert(value);
                });
              }
            });
          });

          this.pathway = [];
          setTimeout(() => { this.init(); }, 2000);
        });
    }

    this.backBtn = true;
  }

  selectImage() {
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  takePicture(sourceType: PictureSourceType) {
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
      this.storage.get('id_plantation').then((val) => {
        this.presentPrompt(correctPath, currentName, val);
      });
    });

  }

  async presentPrompt(correctPath, currentName, val) {
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
            this.moveFile(data.description, correctPath, currentName, val);
          }
        }
      ]
    });
    alert.present();
  }

  captureVideo() {
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 30
    }

    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      let capturedFile = res[0];
      let fileName = capturedFile.name;
      let dir = capturedFile['localURL'].split('/');
      dir.pop();
      let fromDirectory = dir.join('/');
      var toDirectory = this.file.externalRootDirectory + 'icollect/plantations';

      this.storage.get('id_plantation').then((val) => {
        var d = new Date(), n = d.getTime(), newFileName = val + '-' + n + ".mp4";

        this.file.moveFile(fromDirectory, fileName, toDirectory, newFileName).then(_ => {
          this.db.saveDocDataPlantation(val, newFileName, 'video', 155, this.user.id_contact);
        });
      });

    }, (err: CaptureError) => console.error(err));
  }

  moveFile(description, correctPath, currentName, id_plantation) {
    var d = new Date(), n = d.getTime(), newFileName = id_plantation + '-' + n + ".jpg";
    let newPath = this.file.externalRootDirectory + 'icollect/plantations';

    this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
      this.db.saveDocDataPlantation(id_plantation, newFileName, description, 154, this.user.id_contact);
    });
  }

}
