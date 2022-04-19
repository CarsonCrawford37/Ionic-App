import { Injectable } from '@angular/core';
import {Geolocation, PermissionStatus} from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor() { }

  async checkYoSelf() {
    await Geolocation.checkPermissions()
      .then(permissionStatus => {
        if (permissionStatus.location != 'granted') {
          Geolocation.requestPermissions({permissions: ['location']});
        }
      });
  }

  public async getCoords() {
    await this.checkYoSelf();
    // if (this.permissionStatus.location)
    return await Geolocation.getCurrentPosition({enableHighAccuracy: false}).then( data => {
      return data;
    })
  }
}
