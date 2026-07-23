import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Admin } from '../../../../../../core/features/administrators/models/admin.model';
import { AdminService } from '../../../../../../core/features/administrators/services/admin.service';
import { AdminDetailsDrawerComponent } from '../admin-details-drawer-component/admin-details-drawer-component';

@Component({
  selector: 'app-administrators-table',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminDetailsDrawerComponent],
  templateUrl: './administrators-table.html',
  styleUrl: './administrators-table.css',
})
export class AdministratorsTable implements OnInit {
  private readonly adminService = inject(AdminService);

  admins = signal<Admin[]>([]);
  isLoading = signal<boolean>(true);

  selectedAdmin = signal<Admin | null>(null);

  searchQuery = signal<string>('');
  selectedYear = signal<string>('Tudo');
  sortBy = signal<string>('recentes');

  currentPage = signal<number>(1);
  pageSize = signal<number>(7);

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.isLoading.set(true);
    this.adminService.getAll().subscribe({
      next: (data) => {
        this.admins.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar administradores:', err);
        this.isLoading.set(false);
      },
    });
  }

  selectAdmin(admin: Admin): void {
    this.selectedAdmin.set(admin);
  }

  closeDrawer(): void {
    this.selectedAdmin.set(null);
  }

  onAdminDeletedFromDrawer(deletedId: number): void {
    this.admins.update((list) => list.filter((item) => item.id !== deletedId));
  }

  availableYears = computed(() => {
    const years = this.admins()
      .map((admin) => new Date(admin.created_at).getFullYear().toString())
      .filter((year, index, self) => !isNaN(Number(year)) && self.indexOf(year) === index);

    return ['Tudo', ...years.sort((a, b) => Number(b) - Number(a))];
  });

  filteredAdmins = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const year = this.selectedYear();
    const sort = this.sortBy();

    let result = this.admins().filter((admin) => {
      const matchesSearch =
        !query ||
        admin.name.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query) ||
        admin.username?.toLowerCase().includes(query) ||
        admin.bi?.toLowerCase().includes(query);

      const adminYear = new Date(admin.created_at).getFullYear().toString();
      const matchesYear = year === 'Tudo' || adminYear === year;

      return matchesSearch && matchesYear;
    });

    return result.sort((a, b) => {
      if (sort === 'recentes') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sort === 'antigos') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sort === 'nome-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sort === 'nome-desc') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
  });

  totalPages = computed(() => {
    const total = Math.ceil(this.filteredAdmins().length / this.pageSize());
    return total > 0 ? total : 1;
  });

  paginatedAdmins = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredAdmins().slice(start, end);
  });

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

  editAdmin(admin: Admin): void {
    console.log('Editar:', admin);
  }

  deleteAdmin(id: number): void {
    if (confirm('Tem certeza que deseja eliminar este administrador?')) {
      this.adminService.delete(id).subscribe({
        next: () => {
          this.admins.update((list) => list.filter((item) => item.id !== id));
        },
        error: (err) => console.error('Erro ao eliminar:', err),
      });
    }
  }
}
