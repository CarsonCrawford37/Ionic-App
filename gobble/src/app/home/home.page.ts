import {Component, ElementRef, ViewChild} from '@angular/core';
import {RestaurantService} from '../services/restaurant.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  lat: number;
  lon: number;
  restaurantsString: string;
  restaurants = [];
  photoURLS = [];


  constructor(public restaurantService: RestaurantService) {
    this.updateCoords();
  }

  getRestaurants() {

    this.restaurants = [];

    this.restaurantService.getRestaurants()
      .then((res) => {

        for (const re of res) {
          this.restaurants.push({
            id: re.fsq_id,
            name: re.name,
            address: re.location.address,
            photoURL: '',
          });
        }

        this.getRestaurantPhotos();
        // this.restaurantsString = JSON.stringify(this.restaurants, null, 4);
        this.restaurantsString = 'got foods!';

        console.log(this.restaurants);

      }, (err) => {
        console.error(err);
        this.restaurantsString = 'there was a problem finding places to eat near you :(';
      });
  }

  getRestaurantPhotos() {

    this.photoURLS = [];

    for (const restaurant of this.restaurants) {
      this.restaurantService.getRestaurantPhoto(restaurant.id)
        .then((photoData) => {

          if (photoData.length !== 0) {
            this.photoURLS.push({
              url: this.restaurantService.getPhotoURL(photoData[0])
            });

            restaurant.photoURL = this.restaurantService.getPhotoURL(photoData[0]);

          }

        }, (err) => {
          console.error(err);
        });
    }

  }

  updateCoords() {
    this.restaurantService.getCoords()
      .then( data => {
          this.lat = data.latitude;
          this.lon = data.longitude;
        },
        data => {
          console.error(data);
        });
  }

}





