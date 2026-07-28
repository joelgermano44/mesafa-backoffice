import { Component, inject, computed, OnInit, signal, ElementRef, AfterViewInit } from '@angular/core';
import { animate, stagger } from 'motion';
import { TitleHeader } from '../../components/title-header/title-header';
import { Dashcard } from './components/dashcard/dashcard';
import { AdminService } from '../../../../core/features/administrators/services/admin.service';

import { OrdersService } from '../../../../core/features/orders/services/orders.service';
import { ClientService } from '../../../../core/features/clients/services/client.service';
import { CollaboratorService } from '../../../../core/features/collaborators/services/collaborator.service';
import { ServicesService } from '../../../../core/features/services/services/services.service';
import { ChartOrdersComponent } from './components/chart-orders/chart-orders';

@Component({
  selector: 'app-home',
  imports: [TitleHeader, Dashcard, ChartOrdersComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class Home implements OnInit, AfterViewInit {
  private readonly el = inject(ElementRef);
  private readonly adminService = inject(AdminService);
  private readonly ordersService = inject(OrdersService);
  private readonly servicesService = inject(ServicesService);
  private readonly clientService = inject(ClientService);
  private readonly collaboratorService = inject(CollaboratorService);

  readonly admin = this.adminService.admin;

  private readonly totalServicesCount = computed(() => this.servicesServiceList().length);
  private readonly servicesServiceList = signal<any[]>([]);

  readonly totalFaturamento = computed(() => {
    return this.ordersService.orders().reduce((acc, order) => {
      return acc + ((order.first_payment?.amount ?? 0) + (order.second_payment?.amount ?? 0));
    }, 0);
  });

  readonly dashItems = computed(() => [
    {
      title: 'Faturamento',
      text: 'Faturamento gerado na plataforma.',
      stats: this.totalFaturamento(),
      money: true,
      link: '',
    },
    {
      title: 'Pedidos',
      text: 'Pedidos de serviço dos clientes.',
      stats: this.ordersService.orders().length,
      money: false,
      link: '/dashboard/hired',
    },
    {
      title: 'Serviços',
      text: 'Serviços prestados por profissionais.',
      stats: this.servicesServiceList().length,
      money: false,
      link: '/dashboard/services',
    },
    {
      title: 'Clientes',
      text: 'Total de usuários do app.',
      stats: this.clientService.clients().length,
      money: false,
      link: '/dashboard/clients-users',
    },
    {
      title: 'Profissionais',
      text: 'Total de profissionais cadastrados.',
      stats: this.collaboratorService.collaborators().length,
      money: false,
      link: '/dashboard/professionals-users',
    },
  ]);

  ngOnInit(): void {
    this.ordersService.getOrders().subscribe();
    this.clientService.loadClients();
    this.collaboratorService.getAll().subscribe();

    this.servicesService.getAll().subscribe({
      next: (services) => this.servicesServiceList.set(services),
    });
  }

  ngAfterViewInit(): void {
    const nativeEl = this.el.nativeElement as HTMLElement;

    const header = nativeEl.querySelector('app-title-header');
    if (header) {
      animate(
        header,
        { opacity: [0, 1], y: [-15, 0] },
        { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      );
    }

    const cards = nativeEl.querySelectorAll('ul > li');
    if (cards.length > 0) {
      animate(
        cards,
        { opacity: [0, 1], y: [20, 0], scale: [0.96, 1] },
        {
          duration: 0.5,
          delay: stagger(0.08),
          ease: [0.16, 1, 0.3, 1],
        }
      );
    }

    const chart = nativeEl.querySelector('app-chart-orders');
    if (chart) {
      animate(
        chart,
        { opacity: [0, 1], y: [25, 0] },
        { duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }
      );
    }
  }
}