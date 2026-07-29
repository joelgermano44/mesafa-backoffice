import { Component, input, output, AfterViewInit, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, stagger } from 'motion';
import { ProfessionalService } from '../../../../../../core/features/services/models/service.model';
import { API_CONFIG } from '../../../../../../core/config/api.config';

@Component({
  selector: 'app-service-details-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-details-drawer.html',
  styleUrl: './service-details-drawer.css',
})
export class ServiceDetailsDrawer implements AfterViewInit {
  readonly service = input.required<ProfessionalService>();
  readonly close = output<void>();

  public readonly api = API_CONFIG;
  private readonly el = inject(ElementRef);

  ngAfterViewInit(): void {
    const backdrop = this.el.nativeElement.querySelector('.absolute.inset-0');
    const drawer = this.el.nativeElement.querySelector('aside');
    const contentSections = this.el.nativeElement.querySelectorAll('aside > div');

    if (backdrop) {
      animate(backdrop, { opacity: [0, 1] }, { duration: 0.3, ease: [0.16, 1, 0.3, 1] });
    }

    if (drawer) {
      animate(
        drawer,
        { x: ['100%', '0%'] },
        { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
      );
    }

    if (contentSections.length > 0) {
      animate(
        contentSections,
        { opacity: [0, 1], y: [15, 0] },
        { delay: stagger(0.08), duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      );
    }
  }
}