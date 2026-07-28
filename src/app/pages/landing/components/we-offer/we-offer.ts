import { Component, ElementRef, AfterViewInit, inject } from '@angular/core';
import { animate, inView, stagger } from 'motion';

@Component({
  selector: 'app-we-offer',
  imports: [],
  templateUrl: './we-offer.html',
  styleUrl: './we-offer.css',
})
export class WeOffer implements AfterViewInit {
  private elementRef = inject(ElementRef);

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

  ngAfterViewInit(): void {
    const root = this.elementRef.nativeElement as HTMLElement;

    const leftTitle = root.querySelector('h1');
    const appText = root.querySelector('p');
    const storeButtons = root.querySelectorAll('a');
    const rightTitle = root.querySelectorAll('h1')[1];
    const listItems = root.querySelectorAll('li');

    inView(root, () => {
      if (leftTitle) {
        animate(
          leftTitle,
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        );
      }

      if (appText) {
        animate(
          appText,
          { opacity: [0, 1], y: [15, 0] },
          { duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }
        );
      }

      if (storeButtons.length > 0) {
        animate(
          storeButtons,
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.6, delay: stagger(0.1), ease: [0.16, 1, 0.3, 1] }
        );
      }

      if (rightTitle) {
        animate(
          rightTitle,
          { opacity: [0, 1], x: [20, 0] },
          { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
        );
      }

      if (listItems.length > 0) {
        animate(
          listItems,
          { opacity: [0, 1], y: [25, 0] },
          { duration: 0.7, delay: stagger(0.12), ease: [0.16, 1, 0.3, 1] }
        );
      }

      storeButtons.forEach((btn, index) => {
        animate(
          btn,
          { y: [0, -6, 0] },
          {
            duration: 3 + index * 0.5,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1],
            delay: 1 + index * 0.3,
          }
        );
      });

      listItems.forEach((item, index) => {
        animate(
          item,
          { y: [0, -4, 0] },
          {
            duration: 4,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1],
            delay: 1.2 + index * 0.4,
          }
        );
      });
    });
  }
}