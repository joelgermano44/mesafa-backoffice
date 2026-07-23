import { Component, inject } from '@angular/core';
import { TitleHeader } from '../../components/title-header/title-header';
import { AdminService } from '../../../../core/features/administrators/services/admin.service';

@Component({
  selector: 'app-advertisements',
  imports: [TitleHeader],
  templateUrl: './advertisements.html',
  styleUrl: './advertisements.css',
})
export class Advertisements {
  private readonly adminService = inject(AdminService);

  readonly admin = this.adminService.admin;
}
