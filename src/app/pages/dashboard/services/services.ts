import {
  Component,
  computed,
  effect,
  inject,
  signal,
  AfterViewInit,
  ElementRef,
  viewChildren,
  viewChild,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { animate, stagger } from 'motion';

import { TitleHeader } from '../../components/title-header/title-header';
import { AdminService } from '../../../../core/features/administrators/services/admin.service';
import { ServicesService } from '../../../../core/features/services/services/services.service';
import { CreateServiceModalComponent } from './components/create-service-modal-component/create-service-modal-component';
import { ProfessionalService } from '../../../../core/features/services/models/service.model';
import { API_CONFIG } from '../../../../core/config/api.config';
import { ServiceDetailsDrawer } from './components/service-details-drawer/service-details-drawer';
import { toast } from 'ngx-sonner';
import { ConfirmDialogComponent } from '../../components/confirm-dialog-component/confirm-dialog-component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-services',
  imports: [TitleHeader, CreateServiceModalComponent, ServiceDetailsDrawer, ConfirmDialogComponent],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements AfterViewInit, OnInit {
  private readonly adminService = inject(AdminService);
  private readonly servicesService = inject(ServicesService);
  private readonly el = inject(ElementRef);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  public readonly api = API_CONFIG;
  readonly admin = this.adminService.admin;

  public totalServices = computed(() => this.filteredServices().length);

  public selectedService = signal<ProfessionalService | null>(null);
  readonly selectedCategory = signal<string>('all');
  readonly searchQuery = signal<string>('');

  isConfirmOpen = signal(false);
  isDeleting = signal(false);
  serviceToDelete = signal<number | null>(null);

  public searchTerm = signal('');
  public selectedType = signal('Tudo');
  public selectedPriceFilter = signal('Tudo');

  public isModalOpen = signal(false);

  private readonly rawServices = toSignal(
    this.servicesService.getAll().pipe(
      catchError((error) => {
        console.error('Erro ao carregar serviços:', error);
        return of([]);
      }),
    ),
    {
      initialValue: [],
    },
  );

  public services = signal<ProfessionalService[]>([]);
  cards = viewChildren<ElementRef>('serviceCard');
  cardsContainer = viewChild<ElementRef>('cardsContainer');

  constructor() {
    // Sincroniza rawServices com a signal de services
    effect(() => {
      const data = this.rawServices();
      this.services.set(data);

      setTimeout(() => this.animateCards(), 50);
    });

    // Abre automaticamente o drawer se houver `serviceId` na URL
    effect(() => {
      const list = this.services();
      const currentSelected = this.selectedService();

      if (list.length > 0 && !currentSelected) {
        const targetId = Number(this.route.snapshot.queryParams['serviceId']);
        if (targetId) {
          const found = list.find((s) => s.id === targetId);
          if (found) {
            this.selectedService.set(found);
          }
        }
      }
    });
  }

  ngOnInit(): void {
    // Escuta alterações de queryParams enquanto o utilizador navega
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const serviceId = params['serviceId'] ? Number(params['serviceId']) : null;
      if (serviceId && this.services().length > 0) {
        const found = this.services().find((s) => s.id === serviceId);
        if (found) {
          this.selectedService.set(found);
        }
      }
    });
  }

  loadServices(): void {
    this.servicesService
      .getAll()
      .pipe(
        catchError((err) => {
          console.error('Erro ao carregar serviços:', err);
          return of([]);
        }),
      )
      .subscribe((data) => {
        this.services.set(data);
      });
  }

  ngAfterViewInit(): void {
    const header = this.el.nativeElement.querySelector('.sticky');
    if (header) {
      animate(header, { opacity: [0, 1], y: [-20, 0] }, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    }

    this.animateCards();
  }

  private animateCards(): void {
    const cards = this.el.nativeElement.querySelectorAll('.flex-wrap > div');
    if (cards.length > 0) {
      animate(
        cards,
        { opacity: [0, 1], y: [20, 0], scale: [0.95, 1] },
        { delay: stagger(0.05), duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      );
    }
  }

  public filteredServices = computed(() => {
    const search = (this.searchTerm() || this.searchQuery()).toLowerCase().trim();
    const type = this.selectedType();
    const category = this.selectedCategory();
    const priceFilter = this.selectedPriceFilter();

    let result = this.services().filter((service) => {
      const serviceName = service.name.toLowerCase();
      const serviceDesc = service.description ? service.description.toLowerCase() : '';

      const professionals =
        service.professionals?.some((professional) =>
          professional.name.toLowerCase().includes(search),
        ) ?? false;

      const matchesSearch =
        search === '' ||
        serviceName.includes(search) ||
        serviceDesc.includes(search) ||
        professionals;

      const matchesType =
        type === 'Tudo' || service.category?.name?.toLowerCase() === type.toLowerCase();

      const matchesCategory = category === 'all' || service.category?.name === category;

      return matchesSearch && matchesType && matchesCategory;
    });

    if (priceFilter === 'menor') {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (priceFilter === 'maior') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  });

  public deleteProfessionalService(service: any): void {
    if (!confirm('Tem certeza de que deseja eliminar este serviço?')) {
      return;
    }

    const professionalId = service.professionalId ?? service.professional?.id;
    const serviceId = service.id;

    if (!professionalId) {
      this.services.update((items) => items.filter((item) => item.id !== serviceId));
      return;
    }

    this.servicesService.deleteProfessionalService(professionalId, serviceId).subscribe({
      next: () => {
        this.services.update((items) => items.filter((item) => item.id !== serviceId));
      },
      error: (err) => console.error(err),
    });
  }

  openDetails(service: ProfessionalService) {
    this.selectedService.set(service);
  }

  closeDetails() {
    this.selectedService.set(null);
  }

  readonly categories = computed(() => {
    const list = this.services();
    const unique = Array.from(new Set(list.map((s) => s.category?.name).filter(Boolean)));
    return ['all', ...unique];
  });

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  reloadServices(): void {
    this.loadServices();
  }

  public onCardClick(service: ProfessionalService): void {
    this.selectedService.set(service);
  }

  public onEdit(serviceId: number): void {}

  public onDelete(serviceId: number): void {
    this.serviceToDelete.set(serviceId);
    this.isConfirmOpen.set(true);
  }

  public cancelDelete(): void {
    if (!this.isDeleting()) {
      this.isConfirmOpen.set(false);
      this.serviceToDelete.set(null);
    }
  }

  public confirmDelete(): void {
    const serviceId = this.serviceToDelete();
    if (!serviceId) return;

    this.isDeleting.set(true);

    this.servicesService.deleteService(serviceId).subscribe({
      next: () => {
        this.services.update((items) => items.filter((item) => item.id !== serviceId));
        toast.success('Serviço removido com sucesso');
        this.isDeleting.set(false);
        this.isConfirmOpen.set(false);
        this.serviceToDelete.set(null);
        if (this.selectedService()?.id === serviceId) {
          this.selectedService.set(null);
        }
      },
      error: (err) => {
        console.error(err);
        toast.error('Erro ao remover o serviço');
        this.isDeleting.set(false);
      },
    });
  }

  closeDrawer(): void {
    this.selectedService.set(null);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { serviceId: null },
      queryParamsHandling: 'merge',
    });
  }
}
