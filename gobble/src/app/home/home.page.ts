import { Component } from '@angular/core';
import { RestaurantService } from '../services/restaurant.service';
import {DecisionService} from '../services/decision.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {
  lat: number;
  lon: number;
  priceRange: number;
  selectedCategories: any;
  openNow: boolean;
  restaurantCategories = this.restaurantService.categories;
  restaurantsString: string;
  restaurants = [];
  photoURLS = [];
  canGetRestaurants = false;
  hideWhereToEat = true;
  whereToEat: any = {
    id: null,
    name: null,
    address: null,
    photoURL: null,
    description: null,
  };

  constructor(public restaurantService: RestaurantService, public decisionService: DecisionService) {

  }

  // loadRestaurants() {
  //   this.getRestaurants();
  // }

  async loadRestaurants() {

    this.decisionService.resetDecisions();
    await this.updateCoords();

    if (this.canGetRestaurants) {

      this.canGetRestaurants = false;

      this.restaurants = [];
      this.whereToEat = {
        id: null,
        name: null,
        address: null,
        photoURL: null,
        description: null,
      };

      this.restaurantService.getRestaurants({
        priceRange: this.priceRange,
        categories: this.selectedCategories,
        openNow: this.openNow
      })
        .then((res) => {

          for (const re of res) {
            this.restaurants.push({
              id: re.fsq_id,
              name: re.name,
              address: re.location.address,
              photoURL: re.photoURL,
              description: re.description,
              price: re.price,
              website: re.website
            });
          }

          // this.getRestaurantPhotos();
          // this.restaurantsString = JSON.stringify(this.restaurants, null, 4);
          this.restaurantsString = 'got foods!';

        }, (err) => {
          console.error(err);
          this.restaurantsString = 'there was a problem finding places to eat near you :(';
        });
    }

    this.canGetRestaurants = true;

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

          } else {
            restaurant.photoURL = '../../assets/killer-fish.gif';
          }

        }, (err) => {
          console.error(err);
        });
    }

  }

  updateCoords(): Promise<any> {

    return new Promise(((resolve, reject) => {
      this.restaurantService.getCoords()
        .then(data => {
          this.lat = data.latitude;
          this.lon = data.longitude;
          this.canGetRestaurants = true;
          resolve(true);
        },
          (err) => {
            console.error(err);
          });
    }));

  }

  logChoice(evt) {
    if (evt.choice === true) {
      this.decisionService.approve(evt.restaurant);
    } else {
      this.decisionService.deny(evt.restaurant);
    }

    if (evt.cardsLeft === 0) {
      this.whereToEat = this.decisionService.getRandomApproved();
      this.hideWhereToEat = false;
    }

  }

}





