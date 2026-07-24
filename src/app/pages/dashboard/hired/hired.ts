import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TitleHeader } from '../../components/title-header/title-header';
import { AdminService } from '../../../../core/features/administrators/services/admin.service';
import { Order, OrderStatus } from '../../../../core/features/orders/models/orders.model';
import { OrdersService } from '../../../../core/features/orders/services/orders.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-hired',
  imports: [TitleHeader],
  standalone: true,
  templateUrl: './hired.html',
  styleUrl: './hired.css',
})
export class Hired implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly admin = this.adminService.admin;

  private ordersService = inject(OrdersService);

  searchTerm = signal<string>('');
  selectedStatus = signal<string>('Tudo');
  selectedPriceRange = signal<string>('Tudo');

  selectedOrderId = signal<number | null>(null);

  selectedService = computed(() => {
    const id = this.selectedOrderId();
    if (!id) return null;
    return this.ordersService.orders().find((o) => o.id === id) || null;
  });

  ngOnInit(): void {
    this.ordersService.getOrders().subscribe();
  }

  private mapStatusToPortuguese(status: OrderStatus): string {
    switch (status) {
      case 'PENDING':
      case 'REQUESTED':
        return 'Pendente';
      case 'COMPLETED':
        return 'Aceito';
      case 'REJECTED':
      case 'CANCELED':
        return 'Rejeitado';
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
    this.selectedOrderId.set(null);
  }

  acceptService(id: number, event?: Event): void {
    event?.stopPropagation();
    this.ordersService.acceptOrder(id).subscribe({
      next: () => {
        toast.success('Contrato aceite com sucesso');
      },
    });
  }

  rejectService(id: number, event?: Event): void {
    event?.stopPropagation();
    this.ordersService.rejectOrder(id).subscribe({
      next: () => {
        toast.error('Contrato rejeitado');
      },
    });
  }

  getStatusLabel(status: OrderStatus): string {
    return this.mapStatusToPortuguese(status);
  }
}
