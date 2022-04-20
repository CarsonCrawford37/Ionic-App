import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


// particular imports for hammerjs
import * as Hammer from 'hammerjs';
import {
  HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG}
  from '@angular/platform-browser';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides: any = {
    pan: { threshold: 10 }
  };
}


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HammerModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },{provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig}],
  bootstrap: [AppComponent],
})
export class AppModule {}
