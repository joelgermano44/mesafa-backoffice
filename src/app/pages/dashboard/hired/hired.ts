import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  AfterViewInit,
  ElementRef,
  effect,
} from '@angular/core';
import { TitleHeader } from '../../components/title-header/title-header';
import { AdminService } from '../../../../core/features/administrators/services/admin.service';
import { Order, OrderStatus } from '../../../../core/features/orders/models/orders.model';
import { OrdersService } from '../../../../core/features/orders/services/orders.service';
import { toast } from 'ngx-sonner';
import { animate, stagger } from 'motion';
import { ConfirmDialogComponent } from '../../components/confirm-dialog-component/confirm-dialog-component';
import { API_CONFIG } from '../../../../core/config/api.config';

@Component({
  selector: 'app-hired',
  imports: [TitleHeader, ConfirmDialogComponent],
  standalone: true,
  templateUrl: './hired.html',
  styleUrl: './hired.css',
})
export class Hired implements OnInit, AfterViewInit {
  private readonly adminService = inject(AdminService);
  private readonly el = inject(ElementRef);
  readonly admin = this.adminService.admin;

  private ordersService = inject(OrdersService);
  apiUrl = API_CONFIG.baseUrl

  isConfirmOpen = signal(false);
  isLoading = signal(false);
  confirmConfig = signal<{
    title: string;
    message: string;
    confirmText: string;
    action: () => void;
  }>({
    title: '',
    message: '',
    confirmText: 'Confirmar',
    action: () => {},
  });

  searchTerm = signal<string>('');
  selectedStatus = signal<string>('Tudo');
  selectedPriceRange = signal<string>('Tudo');

  selectedOrderId = signal<number | null>(null);

  selectedService = computed(() => {
    const id = this.selectedOrderId();
    if (!id) return null;
    return this.ordersService.orders().find((o) => o.id === id) || null;
  });

  constructor() {
    effect(() => {
      if (this.selectedService()) {
        setTimeout(() => this.animateDrawer(), 10);
      }
    });

    effect(() => {
      this.filteredServices();
      setTimeout(() => this.animateCards(), 10);
    });
  }

  ngOnInit(): void {
    this.ordersService.getOrders().subscribe();
  }

  ngAfterViewInit(): void {
    this.animateHeaderAndFilters();
  }

  private animateHeaderAndFilters(): void {
    const header = this.el.nativeElement.querySelector('app-title-header');
    const filterBar = this.el.nativeElement.querySelector('.filter-bar');

    if (header) {
      animate(header, { opacity: [0, 1], y: [-20, 0] }, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    }

    if (filterBar) {
      animate(
        filterBar,
        { opacity: [0, 1], y: [-10, 0] },
        { duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
      );
    }
  }

  private animateCards(): void {
    const cards = this.el.nativeElement.querySelectorAll('.table-container .flex-wrap > div');
    if (cards && cards.length > 0) {
      animate(
        cards,
        { opacity: [0, 1], y: [20, 0], scale: [0.95, 1] },
        {
          duration: 0.35,
          delay: stagger(0.05),
          ease: [0.16, 1, 0.3, 1],
        },
      );
    }
  }

  rejectService(id: number, event?: Event): void {
    event?.stopPropagation();
    this.confirmConfig.set({
      title: 'Rejeitar Contrato',
      message: 'Tem certeza de que deseja rejeitar este contrato? Esta ação não pode ser desfeita.',
      confirmText: 'Rejeitar',
      action: () => this.executeReject(id),
    });
    this.isConfirmOpen.set(true);
  }

  private executeReject(id: number): void {
    this.isLoading.set(true);
    this.ordersService.rejectOrder(id).subscribe({
      next: () => {
        toast.error('Contrato rejeitado');
        this.isLoading.set(false);
        this.isConfirmOpen.set(false);
      },
      error: (err) => {
        console.error(err);
        toast.error('Erro ao rejeitar o contrato');
        this.isLoading.set(false);
      },
    });
  }

  cancelService(id: number, event?: Event): void {
    event?.stopPropagation();
    this.confirmConfig.set({
      title: 'Cancelar Pedido',
      message: 'Tem certeza de que deseja cancelar este pedido de serviço?',
      confirmText: 'Cancelar Pedido',
      action: () => this.executeCancel(id),
    });
    this.isConfirmOpen.set(true);
  }

  private animateDrawer(): void {
    const backdrop = this.el.nativeElement.querySelector('.fixed.inset-0 .absolute.inset-0');
    const drawerPanel = this.el.nativeElement.querySelector('.fixed.inset-0 .relative.h-screen');

    if (backdrop) {
      animate(backdrop, { opacity: [0, 1] }, { duration: 0.3 });
    }

    if (drawerPanel) {
      animate(
        drawerPanel,
        { x: ['100%', '0%'], opacity: [0.8, 1] },
        { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      );
    }
  }

  private mapStatusToPortuguese(status: OrderStatus): string {
    switch (status) {
      case 'ACCEPTED':
        return 'Aceito';
      case 'REJECTED':
        return 'Rejeitado';
      case 'CANCELED':
        return 'Cancelado';
      case 'IN_PROGRESS':
      case 'REQUESTED':
      default:
        return 'Pendente';
    }
  }

  filteredServices = computed(() => {
    const query = this.searchTerm().toLowerCase().trim();
    const statusFilter = this.selectedStatus();
    const priceRange = this.selectedPriceRange();
    const orders = this.ordersService.orders();

    return orders.filter((item) => {
      const title = item.service?.name || '';
      const clientName = item.client?.name || '';
      const itemStatusPT = this.mapStatusToPortuguese(item.status);
      const price = item.service?.price || 0;

      const matchesQuery =
        !query || title.toLowerCase().includes(query) || clientName.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'Tudo' || itemStatusPT === statusFilter;

      let matchesPrice = true;
      if (priceRange === 'Ate100k') {
        matchesPrice = price <= 100000;
      } else if (priceRange === 'Mais100k') {
        matchesPrice = price > 100000;
      }

      return matchesQuery && matchesStatus && matchesPrice;
    });
  });

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedStatus.set(value);
  }

  onPriceChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedPriceRange.set(value);
  }

  openDrawer(item: Order): void {
    this.selectedOrderId.set(item.id);
  }

  closeDrawer(): void {
    const drawerPanel = this.el.nativeElement.querySelector('.fixed.inset-0 .relative.h-screen');
    const backdrop = this.el.nativeElement.querySelector('.fixed.inset-0 .absolute.inset-0');

    if (drawerPanel && backdrop) {
      Promise.all([
        animate(drawerPanel, { x: ['0%', '100%'] }, { duration: 0.25, ease: [0.16, 1, 0.3, 1] })
          .finished,
        animate(backdrop, { opacity: [1, 0] }, { duration: 0.25 }).finished,
      ]).then(() => {
        this.selectedOrderId.set(null);
      });
    } else {
      this.selectedOrderId.set(null);
    }
  }

  acceptService(id: number, event?: Event): void {
    event?.stopPropagation();
    this.ordersService.acceptOrder(id).subscribe({
      next: () => {
        toast.success('Contrato aceite com sucesso');
      },
    });
  }

  completeService(id: number, event?: Event): void {
    event?.stopPropagation();
    toast.success('Serviço marcado como concluído com sucesso');
  }

  getStatusLabel(status: OrderStatus): string {
    return this.mapStatusToPortuguese(status);
  }

  onConfirmModal(): void {
    this.confirmConfig().action();
  }

  onCancelModal(): void {
    if (!this.isLoading()) {
      this.isConfirmOpen.set(false);
    }
  }

  private executeCancel(id: number): void {
    this.isLoading.set(true);
    this.ordersService.cancelOrder?.(id)?.subscribe({
      next: () => {
        toast.success('Pedido cancelado com sucesso');
        this.isLoading.set(false);
        this.isConfirmOpen.set(false);
        this.closeDrawer();
      },
      error: (err) => {
        console.error(err);
        toast.error('Erro ao cancelar o pedido');
        this.isLoading.set(false);
      },
    }) ??
      (() => {
        this.isLoading.set(false);
        this.isConfirmOpen.set(false);
      })();
  }
}
