import { Component, computed, inject, signal } from '@angular/core';
import { TitleHeader } from '../../components/title-header/title-header';
import { AdminService } from '../../../../core/features/administrators/services/admin.service';
import { BannerCardComponent } from './components/banner-card/banner-card';

interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
  background: string;
  type: 'free' | 'premium';
  price: number;
  clicks: number;
}

@Component({
  selector: 'app-advertisements',
  imports: [TitleHeader, BannerCardComponent],
  templateUrl: './advertisements.html',
  styleUrl: './advertisements.css',
})
export class Advertisements {
  private readonly adminService = inject(AdminService);

  readonly admin = this.adminService.admin;

  protected readonly search = signal('');
  protected readonly selectedType = signal('all');
  protected readonly selectedPrice = signal('all');

  protected readonly banners = signal<Banner[]>([
    {
      id: 1,
      title: 'BANNER PUBLI',
      description: 'Lorem Ipsum is simply dummy text of the printing Ipsum has been.',
      image: 'https://placehold.co/250x200',
      background: '#2952F3',
      type: 'free',
      price: 0,
      clicks: 0,
    },
    {
      id: 2,
      title: 'BANNER PUBLI',
      description: 'Lorem Ipsum is simply dummy text of the printing Ipsum has been.',
      image: 'https://placehold.co/250x200',
      background: '#FF5757',
      type: 'premium',
      price: 15000,
      clicks: 12,
    },
    {
      id: 3,
      title: 'BANNER PUBLI',
      description: 'Lorem Ipsum is simply dummy text of the printing Ipsum has been.',
      image: 'https://placehold.co/250x200',
      background: '#37C78E',
      type: 'premium',
      price: 30000,
      clicks: 30,
    },
  ]);

  protected readonly filteredBanners = computed(() => {
    let banners = this.banners();

    const search = this.search().trim().toLowerCase();
    const type = this.selectedType();
    const price = this.selectedPrice();

    if (search) {
      banners = banners.filter(
        (banner) =>
          banner.title.toLowerCase().includes(search) ||
          banner.description.toLowerCase().includes(search),
      );
    }

    if (type !== 'all') {
      banners = banners.filter((banner) => banner.type === type);
    }

    switch (price) {
      case 'free':
        banners = banners.filter((banner) => banner.price === 0);
        break;

      case 'paid':
        banners = banners.filter((banner) => banner.price > 0);
        break;
    }

    return banners;
  });

  protected onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.search.set(input.value);
  }

  protected onTypeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedType.set(select.value);
  }

  protected onPriceChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedPrice.set(select.value);
  }
}
