/// <reference types="@types/google.maps" />

import {Component, ElementRef, Inject, Input, OnInit, Renderer2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Geolocation} from '@capacitor/geolocation';
import {Network} from '@capacitor/network';
import {Loader} from '@googlemaps/js-api-loader';

@Component({
  selector: 'google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements OnInit {

  @Input('apiKey') apiKey: string;

  public map: any;
  public markers: any[] = [];
  private mapsLoaded: boolean = false;
  private networkHandler = null;

  private loader = new Loader({
    apiKey: 'AIzaSyD-TX7tFoPMyeAnCDFD5BV1kpoGJeS6vcI',
    version: 'weekly',
    libraries: ['places']
  })

  constructor(private renderer: Renderer2, private element: ElementRef, @Inject(DOCUMENT) private _document) { }

  ngOnInit() {

    // service = new google.maps.places.PlacesService(this.map);

    this.loader.load().then(() => {
      this.initMap().then((res) => {
        console.log('Google Maps ready.');
      }, (err) => {
        console.log(err);
      });
    })

  }

  private initMap(): Promise<any> {

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition().then((position) => {
        console.log(position);

        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        let mapOptions = {
          center: latLng,
          zoom: 15
        };

        this.map = new google.maps.Map(this.element.nativeElement, mapOptions);
        resolve(true);

      }, (err) => {

        reject('Could not initialize map');

      });
    });

  }

}
