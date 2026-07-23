import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Collaborator } from '../../../../../../core/features/collaborators/models/collaborator.model';
import { CollaboratorService } from '../../../../../../core/features/collaborators/services/collaborator.service';
@Component({
  selector: 'app-professionals-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './professionals-table.html',
  styleUrl: './professionals-table.css',
})
export class ProfessionalsTable implements OnInit {
  private readonly collaboratorService = inject(CollaboratorService);

  collaborators = signal<Collaborator[]>([]);
  isLoading = signal<boolean>(true);

  searchQuery = signal<string>('');
  selectedProfession = signal<string>('Tudo');
  selectedProvince = signal<string>('Tudo');

  currentPage = signal<number>(1);
  pageSize = signal<number>(7);

  ngOnInit(): void {
    this.loadCollaborators();
  }

  loadCollaborators(): void {
    this.isLoading.set(true);
    this.collaboratorService.getAll().subscribe({
      next: (data) => {
        this.collaborators.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar profissionais:', err);
        this.isLoading.set(false);
      },
    });
  }

  availableProvinces = computed(() => {
    const list: string[] = [];
    this.collaborators().forEach((item) => {
      if (item.address?.province && !list.includes(item.address.province)) {
        list.push(item.address.province);
      }
    });
    return ['Tudo', ...list.sort()];
  });

  filteredCollaborators = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const prof = this.selectedProfession();
    const prov = this.selectedProvince();

    return this.collaborators().filter((item) => {
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

  editCollaborator(collaborator: Collaborator): void {
    console.log('Editar profissional:', collaborator);
  }

  deleteCollaborator(id: number): void {
    if (confirm('Tem certeza que deseja eliminar este profissional?')) {
      this.collaboratorService.delete(id).subscribe({
        next: () => {
          this.collaborators.update((list) => list.filter((item) => item.id !== id));
        },
        error: (err) => console.error('Erro ao eliminar:', err),
      });
    }
  }
}
