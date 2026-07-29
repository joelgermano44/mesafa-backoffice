import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Collaborator } from '../../../../../../core/features/collaborators/models/collaborator.model';
import { CollaboratorService } from '../../../../../../core/features/collaborators/services/collaborator.service';
import { OrdersService } from '../../../../../../core/features/orders/services/orders.service';
import { Order } from '../../../../../../core/features/orders/models/orders.model';
import {
  Portfolio,
  PortfolioImage,
} from '../../../../../../core/features/portfolio/models/portfolio.model';
import { PortfolioService } from '../../../../../../core/features/portfolio/services/portfolio.service';
import { API_CONFIG } from '../../../../../../core/config/api.config';
import { animate, stagger } from 'motion';
import { ServicesService } from '../../../../../../core/features/services/services/services.service';
import { ProfessionalService } from '../../../../../../core/features/services/models/professional-with-services.model';
import { toast } from 'ngx-sonner';

export type TabType = 'estatisticas' | 'servicos' | 'portfolio' | 'habilitacoes';

@Component({
  selector: 'app-professionals-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './professionals-table.html',
  styleUrl: './professionals-table.css',
})
export class ProfessionalsTable implements OnInit, AfterViewInit {
  protected readonly serviceServices = inject(ServicesService);
  protected readonly collaboratorService = inject(CollaboratorService);
  protected readonly ordersService = inject(OrdersService);
  protected readonly portfolioService = inject(PortfolioService);
  protected readonly apiUrl = API_CONFIG.baseUrl;
  protected readonly elementRef = inject(ElementRef);

  public services = signal<ProfessionalService[]>([]);

  isLoading = signal<boolean>(true);
  isOrdersLoading = signal<boolean>(false);
  isPortfolioLoading = signal<boolean>(false);

  isDrawerOpen = signal<boolean>(false);
  activeTab = signal<TabType>('estatisticas');

  portfolios = signal<Portfolio[]>([]);
  selectedAlbum = signal<Portfolio | null>(null);
  selectedModalImage = signal<PortfolioImage | null>(null);

  drawerStatusFilter = signal<string>('Tudo');
  drawerDateFilter = signal<string>('Tudo');

  availableOrderStatuses = computed(() => {
    const statuses = new Set(
      this.collaboratorOrders()
        .map((order) => order.status)
        .filter(Boolean),
    );

    return ['Tudo', ...Array.from(statuses)];
  });

  availableYears = computed(() => {
    const years = new Set(
      this.collaboratorOrders()
        .map((order) => {
          const date = order.created_at || order.created_at;

          if (!date) return null;

          return new Date(date).getFullYear().toString();
        })
        .filter(Boolean),
    );

    return ['Tudo', ...Array.from(years).sort().reverse()];
  });

  ngAfterViewInit() {
    const root = this.elementRef.nativeElement;

    animate(
      root.querySelector('.filter-bar'),
      {
        opacity: [0, 1],
        y: [-12, 0],
      },
      {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    );

    animate(
      root.querySelectorAll('tbody tr'),
      {
        opacity: [0, 1],
        y: [12, 0],
      },
      {
        delay: stagger(0.05),
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      },
    );

    animate(
      '.tab-content',
      {
        opacity: [0, 1],
        y: [8, 0],
      },
      {
        duration: 0.25,
      },
    );
  }

  searchQuery = signal<string>('');
  selectedProfession = signal<string>('Tudo');
  selectedProvince = signal<string>('Tudo');

  currentPage = signal<number>(1);
  pageSize = signal<number>(7);

  collaboratorOrders = signal<Order[]>([]);

  filteredDrawerOrders = computed(() => {
    let orders = [...this.collaboratorOrders()];

    if (this.drawerStatusFilter() !== 'Tudo') {
      orders = orders.filter((order) => order.status === this.drawerStatusFilter());
    }

    if (this.drawerDateFilter() !== 'Tudo') {
      orders = orders.filter((order) => {
        const date = order.created_at || order.created_at;

        if (!date) return false;

        return new Date(date).getFullYear().toString() === this.drawerDateFilter();
      });
    }

    return orders;
  });

  completedOrders = computed(() =>
    this.collaboratorOrders().filter(
      (order) => order.status === 'ACCEPTED' || order.status === 'REQUESTED',
    ),
  );

  clientsServed = computed(() => {
    const ids = new Set(
      this.completedOrders()
        .map((order) => order.client?.id)
        .filter(Boolean),
    );

    return ids.size;
  });

  experienceYears = computed(() => {
    const collaborator = this.collaboratorService.current();

    if (!collaborator?.created_at) return 0;

    const created = new Date(collaborator.created_at);

    return new Date().getFullYear() - created.getFullYear();
  });

  totalRevenue = computed(() => {
    return this.completedOrders().reduce((sum, order) => {
      const first = Number(order.first_payment?.amount || 0);
      const second = Number(order.second_payment?.amount || 0);

      return sum + first + second;
    }, 0);
  });

  totalReviews = computed(() => {
    return this.completedOrders().length;
  });

  formattedProfessions = computed(() => {
    const collaborator = this.collaboratorService.current();

    const names = collaborator?.professions
      ?.map((p) => p.name)
      .filter((name): name is string => Boolean(name));

    if (!names || names.length === 0) return 'N/A';

    const formatter = new Intl.ListFormat('pt', { style: 'long', type: 'conjunction' });
    return formatter.format(names);
  });

  selectCollaborator(collaborator: Collaborator): void {
    this.collaboratorService.setCurrent(collaborator);
    this.isDrawerOpen.set(true);
    this.loadCollaboratorOrders(collaborator.id);
    this.loadCollaboratorPortfolio(collaborator.id);
    this.loadCollaboratorServices(collaborator.id);
  }

  loadCollaboratorServices(professionalId: number | string): void {
    this.serviceServices.getByProfessional(Number(professionalId)).subscribe({
      next: (services) => {
        this.services.set(services);
      },
      error: (err) => {
        console.error('Erro ao carregar serviços do colaborador:', err);
        this.services.set([]);
      },
    });
  }

  loadCollaboratorPortfolio(professionalId: number | string): void {
    this.isPortfolioLoading.set(true);
    this.portfolioService.getProfessionalPortfolio(professionalId).subscribe({
      next: (data) => {
        this.portfolios.set(data || []);
        this.isPortfolioLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar portfólio do profissional:', err);
        this.portfolios.set([]);
        this.isPortfolioLoading.set(false);
      },
    });
  }

  getImageUrl(path?: string): string {
    if (!path) return '';

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    const base = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${base}${cleanPath}`;
  }

  openAlbumModal(album: Portfolio): void {
    this.selectedAlbum.set(album);
    if (album.images && album.images.length > 0) {
      this.selectedModalImage.set(album.images[0]);
    } else if (album.cover) {
      this.selectedModalImage.set(album.cover);
    }
  }

  closeAlbumModal(): void {
    this.selectedAlbum.set(null);
    this.selectedModalImage.set(null);
  }

  loadCollaboratorOrders(collaboratorId: number | string): void {
    this.isOrdersLoading.set(true);

    this.ordersService.getOrdersByProfessional(collaboratorId).subscribe({
      next: (orders) => {
        this.collaboratorOrders.set(orders);

        this.isOrdersLoading.set(false);
      },

      error: (err) => {
        console.error(err);

        this.collaboratorOrders.set([]);

        this.isOrdersLoading.set(false);
      },
    });
  }

  ngOnInit(): void {
    this.loadCollaborators();
  }

  loadCollaborators(): void {
    this.isLoading.set(true);
    this.collaboratorService.getAll().subscribe({
      next: () => this.isLoading.set(false),
      error: (err) => {
        console.error('Erro ao carregar profissionais:', err);
        this.isLoading.set(false);
      },
    });
  }

  availableProvinces = computed(() => {
    const list: string[] = [];
    this.collaboratorService.collaborators().forEach((item) => {
      if (item.address?.province && !list.includes(item.address.province)) {
        list.push(item.address.province);
      }
    });
    return ['Tudo', ...list.sort()];
  });

  filteredCollaborators = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const prov = this.selectedProvince();

    return this.collaboratorService.collaborators().filter((item) => {
      const matchesSearch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.username?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.bi?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query);

      const matchesProv = prov === 'Tudo' || item.address?.province === prov;

      return matchesSearch && matchesProv;
    });
  });

  totalPages = computed(() => {
    const total = Math.ceil(this.filteredCollaborators().length / this.pageSize());
    return total > 0 ? total : 1;
  });

  paginatedCollaborators = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredCollaborators().slice(start, end);
  });

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  setTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  toggleVerifyUser(collaborator: Collaborator): void {
    console.log('Alternar verificação para:', collaborator.id);
  }

  downloadReport(): void {
    console.log('Baixando relatório do usuário:', this.collaboratorService.current()?.id);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  onFilterChange(): void {
    this.currentPage.set(1);
  }

  onDrawerFilterChange(): void {}

  editCollaborator(collaborator: Collaborator, event?: Event): void {
    event?.stopPropagation();
    console.log('Editar profissional:', collaborator);
  }

  deleteCollaborator(id: number, event?: Event): void {
    event?.stopPropagation();
    if (confirm('Tem certeza que deseja eliminar este profissional?')) {
      this.collaboratorService.delete(id).subscribe({
        next: () => {
          if (this.collaboratorService.current()?.id === id) {
            this.closeDrawer();
          }
        },
        error: (err) => console.error('Erro ao eliminar:', err),
      });
    }
  }

  public onDelete(service: any): void {
    if (!confirm('Tem certeza de que deseja eliminar este serviço?')) {
      return;
    }

    const serviceId = service.id;
    const currentCollaborator = this.collaboratorService.current();
    const professionalId =
      service.professionalId ?? service.professional?.id ?? currentCollaborator?.id;

    if (!professionalId || !serviceId) {
      toast.error('Não foi possível identificar o profissional ou o serviço.');
      return;
    }

    this.serviceServices
      .deleteProfessionalService(Number(professionalId), Number(serviceId))
      .subscribe({
        next: () => {
          this.services.update((items) => items.filter((item) => item.id !== serviceId));

          this.loadCollaborators();

          toast.success('Serviço removido com sucesso.');
        },
        error: (err) => {
          console.error('Erro ao eliminar serviço na API:', err);
          toast.error('Erro ao eliminar o serviço. Tente novamente.');
        },
      });
  }
}
