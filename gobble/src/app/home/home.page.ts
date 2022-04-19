import {Component, ElementRef, ViewChild} from '@angular/core';
import {RestaurantService} from '../services/restaurant.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  lat: Number;
  lon: Number;
  foods: any;


  constructor(public restaurantService: RestaurantService) {
    this.updateCoords();
  }

  getFoods() {
    this.restaurantService.getRestaurants()
      .then((res) => {
        console.log(res);
        this.foods = JSON.stringify(res, null, 4);
      }, (err) => {
        console.error(err);
        this.foods = 'there was a problem finding places to eat near you :(';
      });
  }

  updateCoords() {
    this.restaurantService.getCoords()
      .then( data => {
          console.log(data);
          this.lat = data.latitude;
          this.lon = data.longitude;
        },
        data => {
          console.error(data);
        });
  }

}





