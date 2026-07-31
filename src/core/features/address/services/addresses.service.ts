import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_CONFIG } from '../../../config/api.config';
import { Address, CreateAddressPayload } from '../models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private http = inject(HttpClient);
  private readonly apiUrl = API_CONFIG.baseUrl;

  addresses = signal<Address[]>([]);
  selectedAddress = signal<Address | null>(null);
  loading = signal<boolean>(false);

  /**
   * Procura/Lista todos os endereços existentes.
   */
  getAddresses(): Observable<Address[]> {
    this.loading.set(true);
    return this.http.get<Address[]>(`${this.apiUrl}/addresses`).pipe(
      tap({
        next: (data) => {
          this.addresses.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      }),
    );
  }

  /**
   * Obtém os detalhes de um endereço específico por ID.
   */
  getAddressById(id: number): Observable<Address> {
    this.loading.set(true);
    return this.http.get<Address>(`${this.apiUrl}/addresses/${id}`).pipe(
      tap({
        next: (data) => {
          this.selectedAddress.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      }),
    );
  }

  /**
   * Regista um novo endereço na plataforma.
   */
  createAddress(payload: CreateAddressPayload): Observable<Address> {
    this.loading.set(true);
    return this.http.post<Address>(`${this.apiUrl}/addresses`, payload).pipe(
      tap({
        next: (newAddress) => {
          this.addresses.update((current) => [newAddress, ...current]);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      }),
    );
  }
}