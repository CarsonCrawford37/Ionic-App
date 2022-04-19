import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DecisionService {

  private approved = [];
  private denied = [];

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
    return this.approved[Math.floor(Math.random() * this.approved.length)];
  }

}
