import { Component, computed, inject, signal } from '@angular/core';
import { TitleHeader } from '../../components/title-header/title-header';
import { AdminService } from '../../../../core/features/administrators/services/admin.service';
import { HiredServiceService } from '../../../../core/features/hired/services/hired.service';

@Component({
  selector: 'app-hired',
  imports: [TitleHeader],
  standalone: true,
  templateUrl: './hired.html',
  styleUrl: './hired.css',
})
export class Hired {
  private readonly adminService = inject(AdminService);

  readonly admin = this.adminService.admin;

  private service = inject(HiredServiceService);

  searchTerm = signal<string>('');
  selectedStatus = signal<string>('Tudo');
  selectedPriceRange = signal<string>('Tudo');

  filteredServices = computed(() => {
    const query = this.searchTerm().toLowerCase().trim();
    const status = this.selectedStatus();
    const priceRange = this.selectedPriceRange();

    return this.service.contractedServices().filter((item) => {
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.providerName.toLowerCase().includes(query);

      const matchesStatus = status === 'Tudo' || item.status === status;

      let matchesPrice = true;
      if (priceRange === 'Ate100k') {
        matchesPrice = item.price <= 100000;
      } else if (priceRange === 'Mais100k') {
        matchesPrice = item.price > 100000;
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

  acceptService(id: string): void {
    this.service.updateStatus(id, 'Aceito');
  }

  rejectService(id: string): void {
    this.service.updateStatus(id, 'Rejeitado');
  }
}
