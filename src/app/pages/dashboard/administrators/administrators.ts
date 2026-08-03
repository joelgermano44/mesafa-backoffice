import {
  AfterViewInit,
  Component,
  ElementRef,
  effect,
  inject,
  signal,
  ViewChild,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { animate } from 'motion';
import { TitleHeader } from '../../components/title-header/title-header';
import { AdminService } from '../../../../core/features/administrators/services/admin.service';
import { AdministratorsTable } from './components/administrators-table/administrators-table';
import { RegisterAdminModalComponent } from './components/register-admin-modal-component/register-admin-modal-component';
import { Admin } from '../../../../core/features/administrators/models/admin.model';

@Component({
  selector: 'app-administrators',
  imports: [TitleHeader, AdministratorsTable, RegisterAdminModalComponent],
  templateUrl: './administrators.html',
  styleUrl: './administrators.css',
})
export class Administrators implements AfterViewInit {
  private readonly adminService = inject(AdminService);
  private readonly elementRef = inject(ElementRef);

  readonly admin = this.adminService.admin;

  admins = signal<Admin[]>([]);
  totalAdmins = computed(() => this.admins().length);

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.adminService.getAll().subscribe({
      next: (data) => {
        this.admins.set(data);
      },
      error: (err) => {
        console.error('Erro ao carregar administradores:', err);
      },
    });
  }

  @ViewChild(AdministratorsTable) tableComponent!: AdministratorsTable;

  isRegisterModalOpen = signal<boolean>(false);

  ngAfterViewInit(): void {
    const header = this.elementRef.nativeElement.querySelector('.w-full.flex.justify-between');
    const tableContainer = this.elementRef.nativeElement.querySelector('.mt-7\\.25');

    if (header) {
      animate(header, { opacity: [0, 1], y: [-15, 0] }, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    }

    if (tableContainer) {
      animate(
        tableContainer,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
      );
    }
  }

  openRegisterModal(): void {
    this.isRegisterModalOpen.set(true);
  }

  closeRegisterModal(): void {
    this.isRegisterModalOpen.set(false);
  }

  onAdminRegistered(): void {
    this.loadAdmins();
    if (this.tableComponent) {
      this.tableComponent.loadAdmins();
    }
  }
}
