import {
  Component,
  computed,
  inject,
  signal,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { animate, stagger } from 'motion';
import { TitleHeader } from '../../components/title-header/title-header';
import { AdminService } from '../../../../core/features/administrators/services/admin.service';
import { BannerCardComponent } from './components/banner-card/banner-card';
import { AddAdvertisementModalComponent } from './components/add-advertisement-modal/add-advertisement-modal';

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
  imports: [TitleHeader, BannerCardComponent, AddAdvertisementModalComponent],
  templateUrl: './advertisements.html',
  styleUrl: './advertisements.css',
})
export class Advertisements implements AfterViewInit {
  private readonly adminService = inject(AdminService);
  private readonly elementRef = inject(ElementRef);

  readonly admin = this.adminService.admin;

  protected readonly isModalOpen = signal(false);

  protected readonly search = signal('');
  protected readonly selectedType = signal('all');
  protected readonly selectedPrice = signal('all');

  protected readonly banners = signal<Banner[]>([
    {
      id: 1,
      title: 'BANNER PUBLI',
      description:
        'Lorem Ipsum is simply dummy text of the printing Ipsum has been.',
      image: '/images/dashboard/banner-1.png',
      background: '#2A85FF',
      type: 'free',
      price: 0,
      clicks: 1240,
    },
    {
      id: 2,
      title: 'BANNER PUBLI',
      description:
        'Lorem Ipsum is simply dummy text of the printing Ipsum has been.',
      image: '/images/dashboard/banner-2.png',
      background: '#8E59FF',
      type: 'premium',
      price: 15000,
      clicks: 3450,
    },
    {
      id: 3,
      title: 'BANNER PUBLI',
      description:
        'Lorem Ipsum is simply dummy text of the printing Ipsum has been.',
      image: '/images/dashboard/banner-3.png',
      background: '#FF6A55',
      type: 'premium',
      price: 25000,
      clicks: 890,
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
          banner.description.toLowerCase().includes(search)
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

  ngAfterViewInit(): void {
    const nativeEl = this.elementRef.nativeElement as HTMLElement;

    const header = nativeEl.querySelector('.flex.justify-between');
    const filterBar = nativeEl.querySelector('.filter-bar');
    const cards = nativeEl.querySelectorAll('app-banner-card');

    if (header) {
      animate(
        header,
        { opacity: [0, 1], y: [-20, 0] },
        { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      );
    }

    if (filterBar) {
      animate(
        filterBar,
        { opacity: [0, 1], y: [-10, 0] },
        { duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }
      );
    }

    if (cards.length) {
      animate(
        cards,
        { opacity: [0, 1], y: [20, 0], scale: [0.95, 1] },
        { duration: 0.4, delay: stagger(0.08), ease: [0.16, 1, 0.3, 1] }
      );
    }
  }

  protected openModal(): void {
    this.isModalOpen.set(true);
  }

  protected closeModal(): void {
    this.isModalOpen.set(false);
  }

  protected handleSaveBanner(data: { link: string; image: File | null }): void {
    console.log('Novo banner salvo:', data);
    this.closeModal();
  }

  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.search.set(input.value);
  }

  protected onTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedType.set(select.value);
  }

  protected onPriceChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedPrice.set(select.value);
  }
}