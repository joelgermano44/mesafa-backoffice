import { Component, ElementRef, inject, input, output, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate } from 'motion';
import { Admin } from '../../../../../../core/features/administrators/models/admin.model';
import { AdminService } from '../../../../../../core/features/administrators/services/admin.service';
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog-component/confirm-dialog-component';

@Component({
  selector: 'app-admin-details-drawer',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  templateUrl: './admin-details-drawer-component.html',
})
export class AdminDetailsDrawerComponent implements AfterViewInit {
  private readonly adminService = inject(AdminService);
  private readonly elementRef = inject(ElementRef);

  admin = input<Admin | null>(null);
  closeDrawer = output<void>();
  adminDeleted = output<number>();

  isConfirmOpen = signal(false);
  isDeleting = signal(false);

  ngAfterViewInit(): void {
    const backdrop = this.elementRef.nativeElement.querySelector('.fixed.inset-0');
    const drawer = this.elementRef.nativeElement.querySelector('.fixed.top-0.right-0');

    if (backdrop) {
      animate(backdrop, { opacity: [0, 1] }, { duration: 0.3, ease: 'easeOut' });
    }

    if (drawer) {
      animate(
        drawer,
        { transform: ['translateX(100%)', 'translateX(0%)'] },
        { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      );
    }
  }

  openDeleteModal(): void {
    this.isConfirmOpen.set(true);
  }

  closeDeleteModal(): void {
    if (!this.isDeleting()) {
      this.isConfirmOpen.set(false);
    }
  }

  confirmDeleteAdmin(): void {
    const user = this.admin();
    if (!user) return;

    this.isDeleting.set(true);

    this.adminService.delete(user.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.isConfirmOpen.set(false);
        this.adminDeleted.emit(user.id);
        this.onClose();
      },
      error: (err) => {
        console.error('Erro ao eliminar:', err);
        this.isDeleting.set(false);
      },
    });
  }

  /*  deleteAdmin(id: number): void {
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
 */

  onClose(): void {
    const backdrop = this.elementRef.nativeElement.querySelector('.fixed.inset-0');
    const drawer = this.elementRef.nativeElement.querySelector('.fixed.top-0.right-0');

    if (drawer && backdrop) {
      Promise.all([
        animate(
          drawer,
          { transform: ['translateX(0%)', 'translateX(100%)'] },
          { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        ).finished,
        animate(backdrop, { opacity: [1, 0] }, { duration: 0.25, ease: 'easeIn' }).finished,
      ]).then(() => {
        this.closeDrawer.emit();
      });
    } else {
      this.closeDrawer.emit();
    }
  }
}
