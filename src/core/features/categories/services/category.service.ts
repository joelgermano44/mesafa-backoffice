import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Category, CategoryWithServices } from '../models/category.model';

import { CreateCategoryRequest } from '../models/create-category.request';
import { UpdateCategoryRequest } from '../models/update-category.request';
import { API_CONFIG } from '../../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API_CONFIG.baseUrl}/categories`);
  }

  getWithServices(): Observable<CategoryWithServices[]> {
    return this.http.get<CategoryWithServices[]>(`${API_CONFIG.baseUrl}/categories/with-services`);
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${API_CONFIG.baseUrl}/categories/${id}`);
  }

  create(data: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(`${API_CONFIG.baseUrl}/categories`, data);
  }

  update(
    id: number,
    data: UpdateCategoryRequest,
  ): Observable<{ raw: unknown[]; affected: number }> {
    return this.http.patch<{ raw: unknown[]; affected: number }>(
      `${API_CONFIG.baseUrl}/categories/${id}`,
      data,
    );
  }

  delete(id: number): Observable<{ raw: unknown[]; affected: number }> {
    return this.http.delete<{ raw: unknown[]; affected: number }>(
      `${API_CONFIG.baseUrl}/categories/${id}`,
    );
  }
}
