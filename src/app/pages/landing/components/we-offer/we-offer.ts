import { Component } from '@angular/core';

@Component({
  selector: 'app-we-offer',
  imports: [],
  templateUrl: './we-offer.html',
  styleUrl: './we-offer.css',
})
export class WeOffer {
  offerItems = [
    {
      id: '01',
      title: 'Serviços',
      description:
        'O MeSafa te oferece serviços básicos e complexo e muito mais na palma da tua mão.',
    },
    {
      id: '02',
      title: 'Segurança',
      description:
        'O MeSafa te oferece a comodidade na contratação e a garantia de cumprimento de serviços, onde o cliente e o prestador de serviço tem confiança um no outro através do mesafa.',
    },
    {
      id: '03',
      title: 'Clientes',
      description:
        'Um bom profissional deve e saber quais clientes na sua zona de atuação precisam de si.',
    },
     {
      id: '04',
      title: 'Dinamismos',
      description:
        'Todos vivemos em algum momento no mundo do agora com o me safa seus problemas não serão adiados.',
    },
  ];
}
