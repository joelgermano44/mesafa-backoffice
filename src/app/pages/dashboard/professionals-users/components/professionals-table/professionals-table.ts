import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Collaborator } from '../../../../../../core/features/collaborators/models/collaborator.model';
import { CollaboratorService } from '../../../../../../core/features/collaborators/services/collaborator.service';
import { OrdersService } from '../../../../../../core/features/orders/services/orders.service';
import { Order } from '../../../../../../core/features/orders/models/orders.model';

export type TabType = 'estatisticas' | 'servicos' | 'portfolio' | 'habilitacoes';

@Component({
  selector: 'app-professionals-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './professionals-table.html',
  styleUrl: './professionals-table.css',
})
export class ProfessionalsTable implements OnInit {
  protected readonly collaboratorService = inject(CollaboratorService);

  protected readonly ordersService = inject(OrdersService);

  isLoading = signal<boolean>(true);
  isOrdersLoading = signal<boolean>(false);
  isDrawerOpen = signal<boolean>(false);
  activeTab = signal<TabType>('estatisticas');

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
      (order) => order.status === 'COMPLETED' || order.status === 'REQUESTED',
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

  selectCollaborator(collaborator: Collaborator): void {
    this.collaboratorService.setCurrent(collaborator);
    this.loadCollaboratorOrders(collaborator.id);
    this.activeTab.set('estatisticas');
    this.isDrawerOpen.set(true);
  }

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
}
