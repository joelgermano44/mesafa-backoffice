import { Component, inject } from '@angular/core';
import { TitleHeader } from '../../components/title-header/title-header';
import { Dashcard } from './components/dashcard/dashcard';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-home',
  imports: [TitleHeader, Dashcard],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class Home {
  private readonly adminService = inject(AdminService);

  readonly admin = this.adminService.admin;

  dashItems = [
    {
      title: 'Faturamento',
      text: 'Faturamento gerado na plataforma.',
      stats: 3567654.8,
      money: true,
      link: '',
    },
    {
      title: 'Pedidos BO',
      text: 'Pedidos de serviço dos clientes.',
      stats: 3547,
      money: false,
      link: '',
    },
    {
      title: 'Serviços',
      text: 'Serviços prestados por profissionais.',
      stats: 3547,
      money: false,
      link: '',
    },
    {
      title: 'Usuários App',
      text: 'Total de usuários do app.',
      stats: 3547,
      money: false,
      link: '',
    },
    {
      title: 'Usuários Profissionais',
      text: 'Total de profissionais cadastrados.',
      stats: 3547,
      money: false,
      link: '',
    },
  ];
}
