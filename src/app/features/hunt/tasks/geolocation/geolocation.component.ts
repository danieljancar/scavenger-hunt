import { Component, OnInit } from '@angular/core';
import { HuntMeta } from '../../../../types/hunt.types';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss'],
  standalone: true,
})
export class GeolocationComponent implements OnInit {
  huntMeta!: HuntMeta;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.huntMeta = history.state.huntMeta;
    console.log('Hunt Meta:', this.huntMeta);
  }
}
