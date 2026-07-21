import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { Admin } from '../models/admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);

  private readonly _admin = signal<Admin | null>(null);

  readonly admin = this._admin.asReadonly();

  getById(id: number) {
    return this.http
      .get<Admin>(`${API_CONFIG.baseUrl}/admin/${id}`)
      .pipe(tap((user) => this._admin.set(user)));
  }

  setAdmin(admin: Admin): void {
    this._admin.set(admin);
  }

  clear(): void {
    this._admin.set(null);
  }
}
