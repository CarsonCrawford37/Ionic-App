import {Component, ElementRef, ViewChild} from '@angular/core';
import {RestaurantService} from '../services/restaurant.service';
import {Geolocation, Position} from '@capacitor/geolocation';
import {GoogleMapComponent} from '../components/google-maps/google-map.component';
import {Loader} from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  lat: Number;
  lon: Number;

  constructor(public restaurantService: RestaurantService) {
    this.updateCoords();
  }

  updateCoords() {
    this.restaurantService.getCoords()
      .then( data => {
          console.log(data);
          this.lat = data.coords.latitude;
          this.lon = data.coords.longitude;
        },
        data => {
          console.error(data);
        });
  }

}

