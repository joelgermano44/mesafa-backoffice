import { Component, inject } from '@angular/core';
import { TitleHeader } from '../../components/title-header/title-header';
import { AdminService } from '../../../../core/features/administrators/services/admin.service';
import { ProfessionalsTable } from "./components/professionals-table/professionals-table";

@Component({
  selector: 'app-professionals-users',
  imports: [TitleHeader, ProfessionalsTable],
  templateUrl: './professionals-users.html',
  styleUrl: './professionals-users.css',
})
export class ProfessionalsUsers {
  private readonly adminService = inject(AdminService);

  readonly admin = this.adminService.admin;
}
