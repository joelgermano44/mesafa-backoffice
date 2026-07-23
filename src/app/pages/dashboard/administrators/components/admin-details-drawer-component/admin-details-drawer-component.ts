import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Admin } from '../../../../../../core/features/administrators/models/admin.model';
import { AdminService } from '../../../../../../core/features/administrators/services/admin.service';

@Component({
  selector: 'app-admin-details-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-details-drawer-component.html',
})
export class AdminDetailsDrawerComponent {
  private readonly adminService = inject(AdminService);

  admin = input<Admin | null>(null);
  closeDrawer = output<void>();
  adminDeleted = output<number>();

  deleteAdmin(id: number): void {
    if (confirm('Tem certeza que deseja eliminar este administrador?')) {
      this.adminService.delete(id).subscribe({
        next: () => {
          this.adminDeleted.emit(id);
          this.onClose();
        },
        error: (err) => console.error('Erro ao eliminar:', err),
      });
    }
  }

  onClose(): void {
    this.closeDrawer.emit();
  }
}
