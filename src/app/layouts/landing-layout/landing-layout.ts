import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { Landing } from '../../pages/landing/landing';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-landing-layout',
  imports: [Header, Landing, Footer],
  templateUrl: './landing-layout.html',
  styleUrl: './landing-layout.css',
})
export class LandingLayout {
   navigationLinks = [
    {
      label: 'FAQs',
      link: '/faqs',
    },
    {
      label: 'Contact Us',
      link: '/contact-us',
    },
  ];

}
