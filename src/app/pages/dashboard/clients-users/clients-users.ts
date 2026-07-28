import { Component, inject, computed, signal } from '@angular/core';
import { TitleHeader } from '../../components/title-header/title-header';
import { Client } from '../../../../core/features/clients/models/client.model';
import { ClientService } from '../../../../core/features/clients/services/client.service';
import { OrdersService } from '../../../../core/features/orders/services/orders.service';

@Component({
  selector: 'app-clients-users',
  imports: [TitleHeader],
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
          (o) => o.status === 'PENDING' || o.status === 'REQUESTED',
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

  onDelete(id: string | number, event: Event) {
    event.stopPropagation();
    this.clientService.deleteClient(String(id));
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
