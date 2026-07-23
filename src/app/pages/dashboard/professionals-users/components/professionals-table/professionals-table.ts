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
  protected readonly collaboratorService = inject(CollaboratorService);

  isLoading = signal<boolean>(true);
  isDrawerOpen = signal<boolean>(false);
  activeTab = signal<'estatisticas' | 'servicos' | 'portfolio' | 'habilidades'>('estatisticas');

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
    this.isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
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
