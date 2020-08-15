import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HTTP } from '@ionic-native/http/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Md5 } from 'ts-md5/dist/md5';
import { File } from '@ionic-native/file/ngx';
import { Network } from '@ionic-native/network/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { CacheModule } from "ionic-cache";
import { IonicImageLoader } from 'ionic-image-loader';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { SignaturePadModule } from 'angular2-signaturepad';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EditMediaPageModule } from './pages/edit-media/edit-media.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    AppRoutingModule,
    IonicModule.forRoot(), 
    CacheModule.forRoot(),
    SignaturePadModule,
    IonicStorageModule.forRoot(),
    IonicImageLoader.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    EditMediaPageModule
  ],
  providers: [
    File,
    Md5,
    HTTP,
    Network,
    Geolocation,
    AndroidPermissions,
    LocationAccuracy,
    SQLitePorter,
    SQLite,
    WebView,
    FileTransfer,
    Camera,
    PhotoViewer,
    VideoPlayer,
    MediaCapture,
    BackgroundMode,
    Insomnia,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
