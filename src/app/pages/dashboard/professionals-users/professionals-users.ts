import { Component, inject, ElementRef, AfterViewInit } from '@angular/core';
import { animate } from 'motion';
import { TitleHeader } from '../../components/title-header/title-header';
import { AdminService } from '../../../../core/features/administrators/services/admin.service';
import { ProfessionalsTable } from "./components/professionals-table/professionals-table";

@Component({
  selector: 'app-professionals-users',
  imports: [TitleHeader, ProfessionalsTable],
  templateUrl: './professionals-users.html',
  styleUrl: './professionals-users.css',
})
export class ProfessionalsUsers implements AfterViewInit {
  private readonly adminService = inject(AdminService);
  private readonly elementRef = inject(ElementRef);

  readonly admin = this.adminService.admin;

  ngAfterViewInit(): void {
    const root = this.elementRef.nativeElement;

    if (root) {
      animate(
        root,
        { opacity: [0, 1], y: [15, 0] },
        { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      );
    }
  }
}