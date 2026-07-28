import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Portfolio } from '../models/portfolio.model';
import { API_CONFIG } from '../../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.baseUrl;

  getProfessionalPortfolio(professionalId: number | string): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${this.baseUrl}/professionals/${professionalId}/portfolio`);
  }

  getPortfolioById(
    professionalId: number | string,
    portfolioId: number | string,
  ): Observable<Portfolio> {
    return this.http.get<Portfolio>(
      `${this.baseUrl}/professionals/${professionalId}/portfolio/${portfolioId}`,
    );
  }
}
