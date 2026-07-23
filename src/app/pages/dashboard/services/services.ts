import { Component, computed, inject, signal } from '@angular/core';
import { TitleHeader } from '../../components/title-header/title-header';
import { AdminService } from '../../../../core/features/administrators/services/admin.service';

@Component({
  selector: 'app-services',
  imports: [TitleHeader],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  private readonly adminService = inject(AdminService);

  readonly admin = this.adminService.admin;

  public searchTerm = signal<string>('');
  public selectedType = signal<string>('Tudo');
  public selectedPriceFilter = signal<string>('Tudo');

  public services = signal([
    {
      id: 1,
      title: 'Hub de Desenvolvimento',
      authorImage: '',
      authorName: 'Pedro Franco',
      authorRole: 'Carpinteiro',
      imageUrl: '',
      price: 100000,
      originalPrice: 100000,
      type: 'hub',
      isOwner: false,
    },
    {
      id: 2,
      title: 'Hub de Desenvolvimento',
      authorImage: '',
      authorName: 'MeSafa',
      imageUrl: '',
      price: 100000,
      type: 'hub',
      isOwner: true,
    },
    {
      id: 3,
      title: 'Hub de Desenvolvimento',
      authorImage: '',
      authorName: 'Pedro Franco',
      authorRole: 'Carpinteiro',
      imageUrl: '',
      price: 100000,
      originalPrice: 100000,
      type: 'hub',
      isOwner: false,
    },
    {
      id: 4,
      title: 'Hub de Desenvolvimento',
      authorImage: '',
      authorName: 'MeSafa',
      imageUrl: '',
      price: 100000,
      type: 'hub',
      isOwner: true,
    },
    {
      id: 5,
      title: 'Hub de Desenvolvimento',
      authorImage: '',
      authorName: 'Pedro Franco',
      authorRole: 'Carpinteiro',
      imageUrl: '',
      price: 100000,
      originalPrice: 100000,
      type: 'hub',
      isOwner: false,
    },
    {
      id: 6,
      title: 'Hub de Desenvolvimento',
      authorImage: '',
      authorName: 'Pedro Franco',
      authorRole: 'Carpinteiro',
      imageUrl: '',
      price: 100000,
      originalPrice: 100000,
      type: 'hub',
      isOwner: false,
    },
  ]);

  public filteredServices = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const type = this.selectedType();

    return this.services().filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(search) ||
        service.authorName.toLowerCase().includes(search);
      const matchesType = type === 'Tudo' || service.type === type;

      return matchesSearch && matchesType;
    });
  });

  public onDelete(id: number): void {
    this.services.update((items) => items.filter((item) => item.id !== id));
  }

  public onEdit(id: number): void {
    console.log('Editar item:', id);
  }
}
