import { Component, inject } from '@angular/core';
import { TitleHeader } from '../../components/title-header/title-header';
import { AdminService } from '../../../../core/features/administrators/services/admin.service';

@Component({
  selector: 'app-hired',
  imports: [TitleHeader],
  templateUrl: './hired.html',
  styleUrl: './hired.css',
})
export class Hired {
  private readonly adminService = inject(AdminService);

  readonly admin = this.adminService.admin;
}
