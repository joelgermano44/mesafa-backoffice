import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { Admin, CreateAdminDto, DeleteAdminResponse, UpdateAdminDto } from '../models/admin.model';
import { API_CONFIG } from '../../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);

  private readonly _admin = signal<Admin | null>(null);
  readonly admin = this._admin.asReadonly();

  register(data: CreateAdminDto) {
    return this.http.post<Admin>(`${API_CONFIG.baseUrl}/admin/register`, data);
  }

  getAll() {
    return this.http.get<Admin[]>(`${API_CONFIG.baseUrl}/admin`);
  }

  getById(id: number) {
    return this.http
      .get<Admin>(`${API_CONFIG.baseUrl}/admin/${id}`)
      .pipe(tap((user) => this._admin.set(user)));
  }

  update(id: number, data: UpdateAdminDto) {
    return this.http.patch<Admin>(`${API_CONFIG.baseUrl}/admin/${id}`, data).pipe(
      tap((updatedAdmin) => {
        if (this._admin()?.id === id) {
          this._admin.set(updatedAdmin);
        }
      }),
    );
  }

  delete(id: number) {
    return this.http.delete<DeleteAdminResponse>(`${API_CONFIG.baseUrl}/admin/${id}`).pipe(
      tap((res) => {
        if (res.affected > 0 && this._admin()?.id === id) {
          this.clear();
        }
      }),
    );
  }

  setAdmin(admin: Admin): void {
    this._admin.set(admin);
  }

  clear(): void {
    this._admin.set(null);
  }
}
