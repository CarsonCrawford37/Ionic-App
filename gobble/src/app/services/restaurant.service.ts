import { Injectable } from '@angular/core';
import {Geolocation, PermissionStatus} from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})

export class RestaurantService {

  private coords = {latitude: 0, longitude: 0};

  private options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'fsq34LJedHCwR6kUD9gxBiZb0MAeF4MsgJ3l7+ATWbXnJoc='
    }
  };

  public parameters = {
    ll: this.coords.latitude.toString() + ',' + this.coords.longitude.toString(),
    radius: '8000',
    categories: '13065'
  }

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
    await Geolocation.getCurrentPosition({enableHighAccuracy: false}).then( data => {
      this.coords.latitude = data.coords.latitude;
      this.coords.longitude = data.coords.longitude;
    })
    this.updateParameterCoordinates();
    return this.coords;
  }

  public updateParameterCoordinates() {
    this.parameters.ll = this.coords.latitude + ',' + this.coords.longitude;
  }

  public getRestaurants(): Promise<any> {

    const parameters = new URLSearchParams(this.parameters);

    return new Promise((resolve, reject) => {
      fetch('https://api.foursquare.com/v3/places/search?'+parameters, this.options)
        .then(response => response.json())
        .then(response => resolve(response))
        .catch(err => reject(err));
    });

  }
}
