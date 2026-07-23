import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { tap } from 'rxjs';

import { API_CONFIG } from '../../../config/api.config';
import { STORAGE_KEYS } from '../../../constants/storage.constants';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { Admin } from '../../administrators/models/admin.model';
import { StorageService } from '../../storage/services/storage.service';
import { AdminService } from '../../administrators/services/admin.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);
  private readonly adminService = inject(AdminService);

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${API_CONFIG.baseUrl}/admin/login`, data).pipe(
      tap((response) => {
        this.storage.setString(STORAGE_KEYS.TOKEN, response.access_token);
        this.storage.set(STORAGE_KEYS.ADMIN, response.user);

        this.adminService.setAdmin(response.user);
      }),
    );
  }

  restoreSession(): void {
    if (!this.isAuthenticated) {
      return;
    }

    const admin = this.storage.get<Admin>(STORAGE_KEYS.ADMIN);

    if (!admin) {
      this.logout();
      return;
    }

    this.adminService.getById(admin.id).subscribe({
      error: () => this.logout(),
    });
  }

  logout(): void {
    this.storage.remove(STORAGE_KEYS.TOKEN);
    this.storage.remove(STORAGE_KEYS.ADMIN);

    this.adminService.clear();

    this.router.navigate(['/login']);
  }

  get token(): string | null {
    return this.storage.getString(STORAGE_KEYS.TOKEN);
  }

  get admin(): Admin | null {
    return this.storage.get<Admin>(STORAGE_KEYS.ADMIN);
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }
}
