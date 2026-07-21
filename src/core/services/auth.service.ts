import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { tap } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${API_CONFIG.baseUrl}/admin/login`, data).pipe(
      tap((response) => {
        this.storage.setString(STORAGE_KEYS.TOKEN, response.access_token);

        this.storage.set(STORAGE_KEYS.USER, response.user);
      }),
    );
  }

  logout() {
    this.storage.remove(STORAGE_KEYS.TOKEN);
    this.storage.remove(STORAGE_KEYS.USER);

    this.router.navigate(['/login']);
  }

  get token(): string | null {
    return this.storage.getString(STORAGE_KEYS.TOKEN);
  }

  get user(): User | null {
    return this.storage.get<User>(STORAGE_KEYS.USER);
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }
}
