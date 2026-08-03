import { Component, ElementRef, inject, input, AfterViewInit } from '@angular/core';
import { animate, stagger } from 'motion';

@Component({
  selector: 'app-title-header',
  imports: [],
  templateUrl: './title-header.html',
  styleUrl: './title-header.css',
})
export class TitleHeader implements AfterViewInit {
  private el = inject(ElementRef);

  title = input.required<string>();
  subtitle = input.required<string>();

  total = input<number | null | undefined>();

  name = input.required<string>();
  role = input<string>();

  ngAfterViewInit(): void {
    const container = this.el.nativeElement.firstElementChild;

    if (container) {
      animate(
        Array.from(container.children) as HTMLElement[],
        {
          opacity: [0, 1],
          transform: ['translateY(-12px)', 'translateY(0px)'],
        },
        {
          duration: 0.5,
          delay: stagger(0.12),
          ease: [0.16, 1, 0.3, 1],
        },
      );
    }
  }
}
