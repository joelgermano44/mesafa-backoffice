import { Component, inject, signal, ViewChild } from '@angular/core';
import { TitleHeader } from '../../components/title-header/title-header';
import { AdminService } from '../../../../core/features/administrators/services/admin.service';
import { AdministratorsTable } from './components/administrators-table/administrators-table';
import { RegisterAdminModalComponent } from './components/register-admin-modal-component/register-admin-modal-component';

@Component({
  selector: 'app-administrators',
  imports: [TitleHeader, AdministratorsTable, RegisterAdminModalComponent],
  templateUrl: './administrators.html',
  styleUrl: './administrators.css',
})
export class Administrators {
  private readonly adminService = inject(AdminService);

  readonly admin = this.adminService.admin;

  @ViewChild(AdministratorsTable) tableComponent!: AdministratorsTable;

  isRegisterModalOpen = signal<boolean>(false);

  openRegisterModal(): void {
    this.isRegisterModalOpen.set(true);
  }

  closeRegisterModal(): void {
    this.isRegisterModalOpen.set(false);
  }

  onAdminRegistered(): void {
    if (this.tableComponent) {
      this.tableComponent.loadAdmins();
    }
  }
}
