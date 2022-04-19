import { Injectable } from '@angular/core';
import {Geolocation, PermissionStatus} from '@capacitor/geolocation';
import {FS_PLACES_API_KEY} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RestaurantService {

  public coords = {latitude: 0, longitude: 0};

  public parameters = {
    ll: this.coords.latitude.toString() + ',' + this.coords.longitude.toString(),
    radius: '8000',
    categories: '13065',
    fields: 'fsq_id,name,location,description'
  };

  private options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: FS_PLACES_API_KEY
    }
  };

  constructor() { }

  async checkYoSelf() {
    await Geolocation.checkPermissions()
      .then(permissionStatus => {
        if (permissionStatus.location !== 'granted') {
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
    });
    this.updateParameterCoordinates();
    return this.coords;
  }

  public updateParameterCoordinates() {
    this.parameters.ll = this.coords.latitude + ',' + this.coords.longitude;
  }

  public getRestaurants(): Promise<any> {

    return new Promise(((resolve, reject) => {
      this.getRestaurantsFromAPI()
        .then((json) => {

          const places = json.results;
          // const restaurants = places.map( (place) => place.name);
          const restaurants = json.results;

          resolve(restaurants);
        }, (err) => {
          reject(err);
        });
    }));

  }

  public getRestaurantsFromAPI(): Promise<any> {

    const parameters = new URLSearchParams(this.parameters);

    return new Promise((resolve, reject) => {
      fetch('https://api.foursquare.com/v3/places/search?'+parameters, this.options)
        .then(response => response.json())
        .then(response => {
          resolve(response);
        })
        .catch(err => reject(err));
    });

  }

  public getRestaurantPhoto(placeID): Promise<any> {

    return new Promise((resolve, reject) => {
      fetch('https://api.foursquare.com/v3/places/'+placeID+'/photos?limit=1&classifications=outdoor', this.options)
        .then(response => response.json())
        .then(response => {
          resolve(response);
        }, (err) => {
          reject(err);
        })
        .catch(err => console.error(err));
    });

  }

  public getPhotoURL(photoData): string {
    const imageSize = 500;
    return '' + photoData.prefix + imageSize.toString() + photoData.suffix;
  }
}
