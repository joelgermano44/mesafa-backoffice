import { Component, inject, computed, signal } from '@angular/core';
import { TitleHeader } from '../../components/title-header/title-header';
import { Client } from '../../../../core/features/clients/models/client.model';
import { ClientService } from '../../../../core/features/clients/services/client.service';
import { OrdersService } from '../../../../core/features/orders/services/orders.service';
import { toast } from 'ngx-sonner';
import { ConfirmDialogComponent } from '../../components/confirm-dialog-component/confirm-dialog-component';

@Component({
  selector: 'app-clients-users',
  imports: [TitleHeader, ConfirmDialogComponent],
  templateUrl: './clients-users.html',
  styleUrl: './clients-users.css',
  standalone: true,
})
export class ClientsUsers {
  readonly clientService = inject(ClientService);
  readonly ordersService = inject(OrdersService);

  readonly admin = signal<{ name: string } | null>({ name: 'Admin' });

  readonly selectedServiceType = signal<string>('ALL');
  readonly selectedStatusFilter = signal<string>('ALL');
  readonly selectedProvinceFilter = signal<string>('ALL');

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
    confirmText: 'Eliminar',
    action: () => {},
  });

  constructor() {
    this.clientService.loadClients();
    this.ordersService.getOrders().subscribe();
  }

  readonly availableProvinces = computed(() => {
    const clients = this.clientService.clients();
    const provinces = clients
      .map((c) => c.address?.province)
      .filter((p): p is string => Boolean(p));
    return Array.from(new Set(provinces));
  });

  readonly clientsWithOrders = computed(() => {
    const clients = this.clientService.paginatedClients();
    const orders = this.ordersService.orders();

    const selectedType = this.selectedServiceType();
    const selectedStatus = this.selectedStatusFilter();
    const selectedProvince = this.selectedProvinceFilter();

    return clients
      .map((client) => {
        const clientOrders = orders.filter((o) => String(o.client_id) === String(client.id));

        const filteredOrders = clientOrders.filter((o) => {
          if (selectedType === 'ALL') return true;
          return o.service?.name?.toUpperCase().includes(selectedType);
        });

        const requestedServicesCount = filteredOrders.length;
        const pendingRequestsCount = filteredOrders.filter(
          (o) => o.status === 'IN_PROGRESS' || o.status === 'REQUESTED',
        ).length;

        return {
          ...client,
          requestedServicesCount,
          pendingRequestsCount,
        };
      })
      .filter((client) => {
        if (selectedProvince !== 'ALL' && client.address?.province !== selectedProvince) {
          return false;
        }

        if (selectedStatus === 'WITH_PENDING' && (client.pendingRequestsCount || 0) === 0) {
          return false;
        }
        if (selectedStatus === 'NO_PENDING' && (client.pendingRequestsCount || 0) > 0) {
          return false;
        }
        if (selectedStatus === 'WITH_SERVICES' && (client.requestedServicesCount || 0) === 0) {
          return false;
        }

        if (selectedType !== 'ALL' && client.requestedServicesCount === 0) {
          return false;
        }

        return true;
      });
  });

  onServiceTypeFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedServiceType.set(value);
  }

  onStatusFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedStatusFilter.set(value);
  }

  onProvinceFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedProvinceFilter.set(value);
  }

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.clientService.setSearchTerm(value);
  }

  onSelectRow(client: Client) {
    this.clientService.selectClient(client);
  }

  onCloseDrawer() {
    this.clientService.selectClient(null as unknown as Client);
  }

  private executeDelete(id: string): void {
    this.isLoading.set(true);

    this.clientService.deleteClient(id);
    toast.success('Cliente eliminado com sucesso');
    this.isLoading.set(false);
    this.isConfirmOpen.set(false);
    this.onCloseDrawer();
  }

  onDelete(id: string, event?: Event): void {
    event?.stopPropagation();

    this.confirmConfig.set({
      title: 'Eliminar Cliente',
      message: 'Tem a certeza de que deseja eliminar este cliente? Esta ação é irreversível.',
      confirmText: 'Eliminar',
      action: () => this.executeDelete(id),
    });

    this.isConfirmOpen.set(true);
  }

  onConfirmModal(): void {
    this.confirmConfig().action();
  }

  onCancelModal(): void {
    if (!this.isLoading()) {
      this.isConfirmOpen.set(false);
    }
  }

  onEdit(client: Client, event: Event) {
    event.stopPropagation();
  }

  onNextPage() {
    this.clientService.nextPage();
  }

  onPreviousPage() {
    this.clientService.previousPage();
  }
}
