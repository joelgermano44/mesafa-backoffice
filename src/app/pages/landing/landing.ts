import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { WeOffer } from './components/we-offer/we-offer';

@Component({
  selector: 'app-landing',
  imports: [Hero, WeOffer],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  
}
