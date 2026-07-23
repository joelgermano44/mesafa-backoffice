import { Component, inject, Inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../../core/features/auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private readonly authservice = inject(AuthService);

  navItems = [
    {
      title: 'Gestão Geral',
      items: [
        {
          label: 'Dashboard',
          route: '/dashboard',
          icon: '/images/icons/dashboard/sidebar/dashboard.svg',
          activeIcon: '/images/icons/dashboard/sidebar/active/dashboard.svg',
        },
        {
          label: 'Admnistradores',
          route: '/dashboard/administrators',
          icon: '/images/icons/dashboard/sidebar/colaboradores.svg',
          activeIcon: '/images/icons/dashboard/sidebar/active/colaboradores.svg',
        },
        {
          label: 'Serviços',
          route: '/dashboard/services',
          icon: '/images/icons/dashboard/sidebar/servicos.svg',
          activeIcon: '/images/icons/dashboard/sidebar/active/servicos.svg',
        },
        {
          label: 'Contratados',
          route: '/dashboard/hired',
          icon: '/images/icons/dashboard/sidebar/contratados.svg',
          activeIcon: '/images/icons/dashboard/sidebar/active/contratados.svg',
        },
      ],
    },
    {
      title: 'Gestão App',
      items: [
        {
          label: 'Publicidades',
          route: '/dashboard/advertisements',
          icon: '/images/icons/dashboard/sidebar/publicidades.svg',
          activeIcon: '/images/icons/dashboard/sidebar/active/publicidades.svg',
        },
        {
          label: 'Usuários Clientes',
          route: '/dashboard/clients-users',
          icon: '/images/icons/dashboard/sidebar/clients-users.svg',
          activeIcon: '/images/icons/dashboard/sidebar/active/clients-users.svg',
        },
        {
          label: 'Usuários Profissionais',
          route: '/dashboard/professionals-users',
          icon: '/images/icons/dashboard/sidebar/professionals-users.svg',
          activeIcon: '/images/icons/dashboard/sidebar/active/professionals-users.svg',
        },
      ],
    },
  ];

  logout(): void {
    this.authservice.logout();
  }
}
