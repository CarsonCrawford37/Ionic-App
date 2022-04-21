import { Injectable } from '@angular/core';
import {Geolocation, PermissionStatus} from '@capacitor/geolocation';
import {FS_PLACES_API_KEY} from '../../environments/environment';


interface RestaurantCategory {
  name: string;
  id: string;
}


@Injectable({
  providedIn: 'root'
})


export class RestaurantService {

  public coords = {latitude: 0, longitude: 0};

  public categories: RestaurantCategory[] = [
    {
      name: 'Bagel Shop',
      id: '13001'
    },
    {
      name: 'Bakery',
      id: '13002'
    },
    {
      name: 'Bar',
      id: '13003'
    },
    {
      name: 'Breakfast Spot',
      id: '13028'
    },
    {
      name: 'Brewery',
      id: '13029'
    },
    {
      name: 'Cafes, Coffee, and Tea Houses',
      id: '13032'
    },
    {
      name: 'Dessert Shop',
      id: '13040'
    },
    {
      name: 'Food Stand',
      id: '13053'
    },
    {
      name: 'Food Truck',
      id: '15054'
    },
    {
      name: 'Juice Bar',
      id: '13059'
    },
    {
      name: 'Fast Food',
      id: '13145'
    },
    {
      name: 'Greek Restaurant',
      id: '13177'
    },
    {
      name: 'Indian Restaurant',
      id: '13199'
    },
    {
      name: 'Italian Restaurant',
      id: '13236'
    },
    {
      name: 'Japanese Restaurant',
      id: '13263'
    },
    {
      name: 'Korean Restaurant',
      id: '13289'
    },
    {
      name: 'Mexican Restaurant',
      id: '13303'
    },
    {
      name: 'Pizzeria',
      id: '13064'
    },
    {
      name: 'Soup Restaurant',
      id: '13342'
    },
    {
      name: 'Wings Joint',
      id: '13388'
    },
    {
      name: 'Smoothie Shop',
      id: '13381'
    },
    {
      name: 'Snack Place',
      id: '13382'
    },
    {
      name: 'Vineyard',
      id: '13386'
    },
    {
      name: 'Winery',
      id: '13387'
    }
  ];

  public parameters = {
    ll: this.coords.latitude.toString() + ',' + this.coords.longitude.toString(),
    radius: '8000',
    categories: '13065',
    fields: 'fsq_id,name,location,description,photos,price,website',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    min_price: '1',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    max_price: '4',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    open_now: '',
    limit: '10'
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

  public getRestaurants(searchParams): Promise<any> {

    if ( searchParams.priceRange > 0 && searchParams.priceRange < 5 ) {
      this.parameters.min_price = searchParams.priceRange.toString();
      this.parameters.max_price = searchParams.priceRange.toString();
    } else {

      this.parameters.min_price = '1';
      this.parameters.max_price = '4';
    }

    if ( Array.isArray(searchParams.categories) ) {
      this.parameters.categories = searchParams.categories.toString();
    }

    this.parameters.open_now = searchParams.openNow === true ? 'true' : '';

    return new Promise(((resolve, reject) => {
      this.getRestaurantsFromAPI()
        .then((json) => {

          const restaurants = json.results;
          this.getFirstPhoto(restaurants);

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

  public getFirstPhoto(restaurantData) {

    for (const r of restaurantData) {

      const photo = r.photos[0];
      r.photoURL = this.getPhotoURL(photo);

    }
  }

  public getPhotoURL(photoData): string {
    if ( photoData !== null && photoData !== undefined ) {
      const imageSize = 500;
      return '' + photoData.prefix + imageSize.toString() + photoData.suffix;
    } else {
      return '../../assets/killer-fish.gif';
    }
  }
}
