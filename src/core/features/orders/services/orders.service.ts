import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Order, CreateOrderPayload, DeleteResponse } from '../models/orders.model';
import { API_CONFIG } from '../../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);
  private readonly apiUrl = API_CONFIG.baseUrl;

  orders = signal<Order[]>([]);
  selectedOrder = signal<Order | null>(null);
  loading = signal<boolean>(false);

  getOrders(): Observable<Order[]> {
    this.loading.set(true);
    return this.http.get<Order[]>(`${this.apiUrl}/orders`).pipe(
      tap({
        next: (data) => {
          this.orders.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      }),
    );
  }

  getOrdersByProfessional(professionalId: number | string) {
    return this.getOrders().pipe(
      map((orders) =>
        orders.filter((order) =>
          order.service?.professionals?.some((professional) => professional.id == professionalId),
        ),
      ),
    );
  }

  getOrdersByClient(clientId: string): Observable<Order[]> {
    this.loading.set(true);
    return this.http.get<Order[]>(`${this.apiUrl}/orders/by-client/${clientId}`).pipe(
      tap({
        next: (data) => {
          this.orders.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      }),
    );
  }

  getOrderById(id: number): Observable<Order> {
    this.loading.set(true);
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`).pipe(
      tap({
        next: (data) => {
          this.selectedOrder.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      }),
    );
  }

  createOrder(payload: CreateOrderPayload): Observable<Order> {
    this.loading.set(true);

    let body: any = payload;

    if (payload.images && payload.images.length > 0) {
      const formData = new FormData();
      formData.append('service_id', payload.service_id.toString());
      formData.append('address_id', payload.address_id.toString());
      formData.append('description', payload.description);

      if (payload.client_id) {
        formData.append('client_id', payload.client_id);
      }
      if (payload.professional_id) {
        formData.append('professional_id', payload.professional_id.toString());
      }

      payload.images.forEach((file) => formData.append('images', file));
      body = formData;
    }

    return this.http.post<Order>(`${this.apiUrl}/orders`, body).pipe(
      tap({
        next: (newOrder) => {
          this.orders.update((current) => [newOrder, ...current]);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      }),
    );
  }

  acceptOrder(orderId: number): Observable<Order> {
    this.loading.set(true);
    return this.http.patch<Order>(`${this.apiUrl}/orders/${orderId}/accept`, {}).pipe(
      tap({
        next: (updatedOrder) => {
          this.updateLocalOrder(updatedOrder);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      }),
    );
  }

  cancelOrder(orderId: number): Observable<Order> {
    this.loading.set(true);
    return this.http.patch<Order>(`${this.apiUrl}/orders/${orderId}/cancel`, {}).pipe(
      tap({
        next: (updatedOrder) => {
          this.updateLocalOrder(updatedOrder);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      }),
    );
  }

  rejectOrder(orderId: number): Observable<Order> {
    this.loading.set(true);
    return this.http.patch<Order>(`${this.apiUrl}/orders/${orderId}/reject`, {}).pipe(
      tap({
        next: (updatedOrder) => {
          this.updateLocalOrder(updatedOrder);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      }),
    );
  }

  deleteOrder(id: number): Observable<DeleteResponse> {
    this.loading.set(true);
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/orders/${id}`).pipe(
      tap({
        next: (res) => {
          if (res.affected > 0) {
            this.orders.update((current) => current.filter((o) => o.id !== id));
            if (this.selectedOrder()?.id === id) {
              this.selectedOrder.set(null);
            }
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      }),
    );
  }

  private updateLocalOrder(updatedOrder: Order): void {
    this.orders.update((current) =>
      current.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
    );
    if (this.selectedOrder()?.id === updatedOrder.id) {
      this.selectedOrder.set(updatedOrder);
    }
  }
}
