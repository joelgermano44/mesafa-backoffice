import { Component, computed, input, inject, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { animate } from 'motion';

@Component({
  selector: 'app-dashcard',
  imports: [RouterLink],
  templateUrl: './dashcard.html',
  styleUrl: './dashcard.css',
})
export class Dashcard implements AfterViewInit {
  private readonly el = inject(ElementRef);

  title = input.required<string>();
  stats = input.required<number>();
  text = input.required<string>();
  money = input.required<boolean>();
  link = input.required<string>();

  formattedStats = computed(() => this.stats().toLocaleString('en-US'));

  ngAfterViewInit(): void {
    const nativeEl = this.el.nativeElement as HTMLElement;

    const icon = nativeEl.querySelector('img');
    if (icon) {
      animate(
        icon,
        { scale: [0.8, 1], opacity: [0, 1] },
        { duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
      );
    }
  }
}
