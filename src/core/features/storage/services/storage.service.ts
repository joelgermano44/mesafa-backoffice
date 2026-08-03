import { inject, Injectable } from '@angular/core';
import { AencriptJdecriptDToken } from '../../../config/encriptation/aencript-jdecript-dtoken';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private secureStorage = inject(AencriptJdecriptDToken);

  set(key: string, value: unknown): void {
    this.secureStorage.guardarDadosSegurosNoStorage(key, value);
  }

  get<T>(key: string): T | null {
    return this.secureStorage.buscarDadosSegurosDoStorage<T>(key);
  }

  getObject<T>(key: string): T | null {
    return this.get<T>(key);
  }

  setString(key: string, value: string): void {
    this.secureStorage.setSecureItem(key, value);
  }

  getString(key: string): string | null {
    return this.secureStorage.getSecureItem(key);
  }

  remove(key: string): void {
    this.secureStorage.removeSecureItem(key);
  }

  clear(): void {
    this.secureStorage.clearSession();
  }
}