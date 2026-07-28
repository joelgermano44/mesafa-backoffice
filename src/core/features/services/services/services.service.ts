import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfessionalService } from '../models/service.model';
import { SubscribeServicesRequest } from '../models/subscribe-services.request';
import { API_CONFIG } from '../../../config/api.config';
import { ProfessionalWithServices } from '../models/professional-with-services.model';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ProfessionalService[]> {
    return this.http.get<ProfessionalService[]>(`${API_CONFIG.baseUrl}/services`);
  }

  getNearby(userUuid: string): Observable<ProfessionalService[]> {
    return this.http.get<ProfessionalService[]>(`${API_CONFIG.baseUrl}/services/nearby`, {
      params: {
        user_uuid: userUuid,
      },
    });
  }

  getRecommended(userUuid: string): Observable<ProfessionalService[]> {
    return this.http.get<ProfessionalService[]>(`${API_CONFIG.baseUrl}/services/recommendeds`, {
      params: {
        user_uuid: userUuid,
      },
    });
  }

  getByProfessional(professionalId: number): Observable<ProfessionalService[]> {
    return this.http.get<ProfessionalService[]>(
      `${API_CONFIG.baseUrl}/professionals/${professionalId}/service`,
    );
  }

  getProfessionalService(
    professionalId: number,
    serviceId: number,
  ): Observable<ProfessionalService | null> {
    return this.http.get<ProfessionalService | null>(
      `${API_CONFIG.baseUrl}/professionals/${professionalId}/service/${serviceId}`,
    );
  }

  createService(data: FormData): Observable<ProfessionalService> {
    return this.http.post<ProfessionalService>(`${API_CONFIG.baseUrl}/admin/services`, data);
  }

  createProfessionalService(
    professionalId: number,
    data: FormData,
  ): Observable<ProfessionalService> {
    return this.http.post<ProfessionalService>(
      `${API_CONFIG.baseUrl}/professionals/${professionalId}/service`,
      data,
    );
  }

  subscribeProfessionalService(
    professionalId: number,
    data: SubscribeServicesRequest,
  ): Observable<ProfessionalWithServices> {
    return this.http.post<ProfessionalWithServices>(
      `${API_CONFIG.baseUrl}/professionals/${professionalId}/subscribeServices`,
      data,
    );
  }

  updateProfessionalService(
    professionalId: number,
    serviceId: number,
    data: FormData,
  ): Observable<ProfessionalService> {
    return this.http.patch<ProfessionalService>(
      `${API_CONFIG.baseUrl}/professionals/${professionalId}/service/${serviceId}`,
      data,
    );
  }

  deleteProfessionalService(professionalId: number, serviceId: number): Observable<void> {
    return this.http.delete<void>(
      `${API_CONFIG.baseUrl}/professionals/${professionalId}/service/${serviceId}`,
    );
  }
}
