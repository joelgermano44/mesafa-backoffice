import { Injectable, signal } from '@angular/core';
import { HiredService, HiredStatus } from '../models/hired.model';

@Injectable({
  providedIn: 'root',
})
export class HiredServiceService {
  // Lista centralizada mantida via Signals
  private contractedServicesSignal = signal<HiredService[]>([
    {
      id: '1',
      title: 'Hub de Desenvolvimento',
      providerName: 'MeSafa',
      price: 100000,
      currency: 'AOA',
      imageUrl:
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
      status: 'Pendente',
    },
    {
      id: '2',
      title: 'Hub de Desenvolvimento',
      providerName: 'MeSafa',
      price: 100000,
      currency: 'AOA',
      imageUrl:
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
      status: 'Pendente',
    },
    {
      id: '3',
      title: 'Hub de Desenvolvimento',
      providerName: 'MeSafa',
      price: 100000,
      currency: 'AOA',
      imageUrl:
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
      status: 'Pendente',
    },
    {
      id: '4',
      title: 'Hub de Desenvolvimento',
      providerName: 'MeSafa',
      price: 100000,
      currency: 'AOA',
      imageUrl:
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
      status: 'Pendente',
    },
    {
      id: '5',
      title: 'Hub de Desenvolvimento',
      providerName: 'MeSafa',
      price: 100000,
      currency: 'AOA',
      imageUrl:
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
      status: 'Pendente',
    },
    {
      id: '6',
      title: 'Hub de Desenvolvimento',
      providerName: 'MeSafa',
      price: 100000,
      currency: 'AOA',
      imageUrl:
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
      status: 'Pendente',
    },
  ]);

  readonly contractedServices = this.contractedServicesSignal.asReadonly();

  updateStatus(id: string, newStatus: HiredStatus): void {
    this.contractedServicesSignal.update((list) =>
      list.map((item) => (item.id === id ? { ...item, status: newStatus } : item)),
    );
  }
}
