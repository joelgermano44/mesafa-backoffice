import { Component, ElementRef, inject, signal, viewChild, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../../../core/features/administrators/services/admin.service';
import { animate } from 'motion';
import { AuthService } from '../../../../../core/features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly adminService = inject(AdminService);
  private readonly authservice = inject(AuthService);

  private readonly el = inject(ElementRef);

  readonly admin = this.adminService.admin;
  readonly isDropdownOpen = signal(false);

  readonly dropdownMenu = viewChild<ElementRef<HTMLElement>>('dropdownMenu');
  readonly chevronIcon = viewChild<ElementRef<HTMLElement>>('chevronIcon');

  constructor() {
    effect(() => {
      const isOpen = this.isDropdownOpen();
      const dropdownEl = this.dropdownMenu()?.nativeElement;
      const chevronEl = this.chevronIcon()?.nativeElement;

      if (chevronEl) {
        animate(
          chevronEl,
          { rotate: isOpen ? 180 : 0 },
          { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        );
      }

      if (isOpen && dropdownEl) {
        animate(
          dropdownEl,
          {
            opacity: [0, 1],
            scale: [0.95, 1],
            y: [-8, 0],
          },
          {
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1],
          },
        );
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update((open) => !open);
  }

  logout(): void {
    this.authservice.logout();
  }
}
