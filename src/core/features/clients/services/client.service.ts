import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client } from '../models/client.model';
import { API_CONFIG } from '../../../config/api.config';

export interface CreateClientRequest {
  name: string;
  email: string;
  bi: string;
  phone: string;
  birthdate: string;
  password: string;
  address_id: number;
}

export interface UpdateClientRequest {
  username?: string;
  image?: string | null;
  name?: string;
  email?: string;
  bi?: string;
  phone?: string;
  birthdate?: string;
  address_id?: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${API_CONFIG.baseUrl}/clients`;

  readonly clients = signal<Client[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly selectedClient = signal<Client | null>(null);

  readonly searchQuery = signal<string>('');
  readonly filterServiceRequest = signal<string>('ALL');
  readonly filterTeam = signal<string>('ALL');
  readonly filterRegime = signal<string>('ALL');

  readonly filters = signal({
    searchTerm: '',
   
  });

  readonly currentPage = signal<number>(1);
  readonly itemsPerPage = signal<number>(5);

  readonly filteredClients = computed(() => {
    const list = this.clients();
    const { searchTerm } = this.filters();

    return list.filter((client) => {
      const matchesSearch =
        !searchTerm ||
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm) ||
        client.bi?.toLowerCase().includes(searchTerm.toLowerCase());

     
      return matchesSearch
    });
  });

  readonly totalPages = computed(() => {
    const totalItems = this.filteredClients().length;
    return Math.ceil(totalItems / this.itemsPerPage()) || 1;
  });

  readonly paginatedClients = computed(() => {
    const page = this.currentPage();
    const limit = this.itemsPerPage();
    const startIndex = (page - 1) * limit;

    return this.filteredClients().slice(startIndex, startIndex + limit);
  });

  setSearchTerm(term: string) {
    this.filters.update((prev) => ({ ...prev, searchTerm: term }));
    this.resetPage();
  }

  setFilter(field: keyof Omit<string, 'searchTerm'>, value: string) {
    this.filters.update((prev) => ({ ...prev, [field]: value }));
    this.resetPage();
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }

  private resetPage() {
    this.currentPage.set(1);
  }

  loadClients(): void {
    this.isLoading.set(true);
    this.http.get<Client[]>(this.endpoint).subscribe({
      next: (data) => {
        this.clients.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  updateSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  updateFilter(filterKey: 'serviceRequest' | 'team' | 'regime', value: string): void {
    if (filterKey === 'serviceRequest') this.filterServiceRequest.set(value);
    if (filterKey === 'team') this.filterTeam.set(value);
    if (filterKey === 'regime') this.filterRegime.set(value);
  }

  selectClient(client: Client): void {
    this.selectedClient.set(client);
  }

  clearSelection(): void {
    this.selectedClient.set(null);
  }

  deleteClient(id: string): void {
    this.http.delete<void>(`${this.endpoint}/${id}`).subscribe(() => {
      this.clients.update((prev) => prev.filter((c) => c.id !== id));
      if (this.selectedClient()?.id === id) {
        this.clearSelection();
      }
    });
  }
}
