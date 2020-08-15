import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { NetworkService, ConnectionStatus } from '../../services/network.service';
import mapboxgl from "../../../assets/mapbox-gl-cordova-offline.js";
import { DatabaseService } from 'src/app/services/database.service';
import { LoadingService } from 'src/app/services/loading.service';
import { File } from '@ionic-native/file/ngx';
import { CacheService } from "ionic-cache";
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-field-map',
  templateUrl: './field-map.page.html',
  styleUrls: ['./field-map.page.scss'],
})
export class FieldMapPage implements OnInit {

  map: any;
  contacts: any[] = [];
  x: number = 0;

  id_project: any;
  public searchTerm: string = "";

  plantations: any[] = [];
  id_contact: any = "";

  constructor(
    private platform: Platform,
    private db: DatabaseService,
    public loading: LoadingService,
    private networkService: NetworkService,
    public translate: TranslateService,
    public navCtrl: NavController,
    public cache: CacheService,
    private storage: Storage,
    private file: File
  ) {
    this.cache.clearAll();

    this.platform.ready().then(() => {
      mapboxgl.accessToken = 'pk.eyJ1IjoiY3JvdGg1MyIsImEiOiJjajRsazkxenowdnZuMnducjRiam90djlnIn0.XMeuMgUwPncR3fMwSgS7WA';
    });
  }

  ngOnInit() {
    this.storage.get('town_id').then((val) => {
      
      this.translate.get('LOADING_CONTACT').subscribe(value => { 
        this.loading.showLoader(value);
      });

      this.db.lastLogedUser().then(usr => {
        this.db.loadContacts(usr.id_contact, usr.agent_type, val).then(_ => {
          this.db.getContacts().subscribe(data => {

            data.forEach(contact => {
              let filepath = this.file.externalRootDirectory + 'icollect/avatar/';
              let filename = contact.avatar;

              this.file.checkFile(filepath, filename)
                .then(() => {
                  this.contacts.push({
                    id_contact: contact.id_contact,
                    name: contact.name,
                    town_name: contact.town_name,
                    status_data: contact.status_data,
                    photo: filepath + filename
                  });
                })
                .catch(() => {
                  this.contacts.push({
                    id_contact: contact.id_contact,
                    name: contact.name,
                    town_name: contact.town_name,
                    status_data: contact.status_data,
                    photo: '../../../assets/user.png'
                  });
                });
            });

            this.loading.hideLoader();
          });

          this.platform.ready().then(() => {
            this.loadMap();
          });
        });
      });

    }).catch(() => {
      this.navCtrl.navigateRoot(['/menu/field-mapping']);
    });
  }

  loadPlantationData(id_contact) {
    this.plantations = [];
    this.db.loadFieldPlantations(id_contact).then(_ => {
      this.db.getPlantations().subscribe(data => {
        this.plantations = data;
        this.loadMap();
      });
    });
  }

  loadMap() {
    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        this.map_Online();
      }

      if (status == ConnectionStatus.Offline) {
        this.map_Offline();
      }
    });
  }

  cPlantationOnMap(id_contact) {
    this.id_contact = "";
    this.id_contact = id_contact;
    this.loadPlantationData(id_contact);
  }

  map_Offline() {
    new mapboxgl.OfflineMap({
      container: 'field-map',
      style: 'assets/styles/osm-bright/style-offline.json',
      //center: [coordy, coordx],
      //zoom: 10,
      bearing: -45,
      hash: true
    }).then((map) => {
      map.addControl(new mapboxgl.NavigationControl());

      map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      }));

      map.fitBounds([[-8.665129, 4.141916], [-2.476215, 10.74769]]);

      if (this.id_contact != "") {
        var i = 1;
        this.plantations.forEach((item, index) => {
          console.log(item); //value
          console.log(index); //index

          if ((item.geom_json != null) || (item.geom_json != 'null')) {
            let polygon: any;
            if (item.mobile_data == 0) {
              let json = JSON.parse(item.geom_json.replace(/\\/g, '"'));
              let geoJson = json.coordinates[0];

              polygon = {
                "type": "Feature",
                "geometry": {
                  "type": "Polygon",
                  "coordinates": geoJson
                }
              };

            } else {
              polygon = JSON.parse(item.geom_json);
            }

            map.addLayer({
              'id': 'plantation_polygon-Off-' + i,
              'type': 'fill',
              'source': {
                'type': 'geojson',
                'data': polygon
              },
              'layout': {},
              'paint': {
                'fill-color': '#ff0000',
                'fill-opacity': 0.8
              }
            });

            var bounds = polygon.geometry.coordinates[0];
            map.fitBounds(bounds);

            map.on('click', 'plantation_polygon-Off-' + i, (e) => {
              new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML('<strong>' + item.code_plantation + '</strong> <p>' + item.area_round + ' m2</p>')
                .addTo(map);
            });
          }

          if ((item.coordx != null) || (item.coordx != 'null')) {
            new mapboxgl.Marker()
              .setLngLat([item.coordy, item.coordx])
              .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(item.code_plantation))
              .addTo(map);
          }
          i = i + 1;
        });
      }

    });
  }

  map_Online() {
    this.map = new mapboxgl.Map({
      container: 'field-map',
      style: 'mapbox://styles/mapbox/satellite-v9',
      //center: [coordy, coordx],
      //zoom: 10
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }));

    this.map.fitBounds([[-8.665129, 4.141916], [-2.476215, 10.74769]]);

    if (this.id_contact != "") {
      var i = 1;
      this.plantations.forEach((item, index) => {
        console.log(item); //value
        console.log(index); //index

        if ((item.geom_json != null) || (item.geom_json != 'null')) {
          let polygon: any;
          if (item.mobile_data == 0) {
            let json = JSON.parse(item.geom_json.replace(/\\/g, '"'));
            let geoJson = json.coordinates[0];

            polygon = {
              "type": "Feature",
              "geometry": {
                "type": "Polygon",
                "coordinates": geoJson
              }
            };

          } else {
            polygon = JSON.parse(item.geom_json);
          }

          this.map.on('load', () => {
            this.map.addLayer({
              'id': 'plantation_polygon-Off-' + i,
              'type': 'fill',
              'source': {
                'type': 'geojson',
                'data': polygon
              },
              'layout': {},
              'paint': {
                'fill-color': '#ff0000',
                'fill-opacity': 0.8
              }
            });

            var bounds = polygon.geometry.coordinates[0];
            this.map.fitBounds(bounds);

            this.map.on('click', 'plantation_polygon-Off-' + i, (e) => {
              new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML('<strong>' + item.code_plantation + '</strong> <p>' + item.area_round + ' m2</p>')
                .addTo(this.map);
            });
          });
        }

        if ((item.coordx != null) || (item.coordx != 'null')) {
          new mapboxgl.Marker()
            .setLngLat([item.coordy, item.coordx])
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(item.code_plantation))
            .addTo(this.map);
        }
        i = i + 1;
      });
    }

  }

}
