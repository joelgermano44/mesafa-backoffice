import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  navItems = [
    {
      id: 1,
      label: 'FAQs',
      link: '/faqs',
    },
    {
      id: 2,
      label: 'Termos e Políticas de Uso',
      link: '/terms',
    },
  ];
}
