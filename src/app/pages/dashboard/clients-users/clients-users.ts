import { Component, inject } from '@angular/core';
import { TitleHeader } from '../../components/title-header/title-header';
import { AdminService } from '../../../../core/features/administrators/services/admin.service';

@Component({
  selector: 'app-clients-users',
  imports: [TitleHeader],
  templateUrl: './clients-users.html',
  styleUrl: './clients-users.css',
})
export class ClientsUsers {
  private readonly adminService = inject(AdminService);

  readonly admin = this.adminService.admin;
}
