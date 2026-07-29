import { Component, input, output, AfterViewInit, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, stagger } from 'motion';
import { ProfessionalService } from '../../../../../../core/features/services/models/service.model';
import { API_CONFIG } from '../../../../../../core/config/api.config';
import { ServicesService } from '../../../../../../core/features/services/services/services.service';
import { toast } from 'ngx-sonner';
import { ConfirmDialogComponent } from "../../../../components/confirm-dialog-component/confirm-dialog-component";

@Component({
  selector: 'app-service-details-drawer',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  templateUrl: './service-details-drawer.html',
  styleUrl: './service-details-drawer.css',
})
export class ServiceDetailsDrawer implements AfterViewInit {
  readonly service = input.required<ProfessionalService>();
  readonly close = output<void>();

  public readonly api = API_CONFIG;
  private readonly el = inject(ElementRef);
  private readonly servicesService = inject(ServicesService);
  readonly serviceDeleted = output<number>();

  isConfirmOpen = signal(false);
  isDeleting = signal(false);

  ngAfterViewInit(): void {
    const backdrop = this.el.nativeElement.querySelector('.absolute.inset-0');
    const drawer = this.el.nativeElement.querySelector('aside');
    const contentSections = this.el.nativeElement.querySelectorAll('aside > div');

    if (backdrop) {
      animate(backdrop, { opacity: [0, 1] }, { duration: 0.3, ease: [0.16, 1, 0.3, 1] });
    }

    if (drawer) {
      animate(drawer, { x: ['100%', '0%'] }, { duration: 0.45, ease: [0.16, 1, 0.3, 1] });
    }

    if (contentSections.length > 0) {
      animate(
        contentSections,
        { opacity: [0, 1], y: [15, 0] },
        { delay: stagger(0.08), duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      );
    }
  }

  openDeleteModal(): void {
    this.isConfirmOpen.set(true);
  }

  closeDeleteModal(): void {
    if (!this.isDeleting()) {
      this.isConfirmOpen.set(false);
    }
  }

  confirmDelete(): void {
    const s = this.service();
    if (!s) return;

    this.isDeleting.set(true);

    this.servicesService.deleteService(s.id).subscribe({
      next: () => {
        toast.success('Serviço removido com sucesso');
        this.isDeleting.set(false);
        this.isConfirmOpen.set(false);
        this.serviceDeleted.emit(s.id);
        this.close.emit();
      },
      error: (err) => {
        console.error('Erro ao eliminar serviço:', err);
        toast.error('Erro ao eliminar o serviço');
        this.isDeleting.set(false);
      },
    });
  }
}
