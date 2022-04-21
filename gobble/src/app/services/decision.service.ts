import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DecisionService {

  public approved = [];
  public denied = [];
  public eatAtHome = {
    id: 0,
    name: 'eat at home',
    address: '123 your st',
    photoURL: '../../assets/killer-fish.gif',
    description: 'maybe try making a new recipe at home... here\'s a killer fish for inspiration!',
    price: '1'
  };

  constructor() { }

  public approve(item) {
    this.approved.push(item);
  }

  public deny(item) {
    this.denied.push(item);
  }

  public resetDecisions() {
    this.approved = [];
    this.denied = [];
  }

  public getRandomApproved() {
    if (this.approved.length > 0) {
      return this.approved[Math.floor(Math.random() * this.approved.length)];
    } else {
      return this.eatAtHome;
    }
  }

}
