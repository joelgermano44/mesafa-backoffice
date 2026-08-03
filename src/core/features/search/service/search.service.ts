import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QueryType, SearchResponse } from '../model/search.model';
import { API_CONFIG } from '../../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = API_CONFIG.baseUrl + '/search';

  search(query: string, queryType: QueryType = 'tudo'): Observable<SearchResponse> {
    const params = new HttpParams().set('query', query).set('query_type', queryType);

    return this.http.get<SearchResponse>(this.apiUrl, { params });
  }

  getServices(query: string = ''): Observable<SearchResponse> {
    return this.search(query, 'services');
  }
}
