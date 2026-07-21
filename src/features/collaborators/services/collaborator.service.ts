import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api.config';
import { Collaborator } from '../models/collaborator.model';
import { CreateCollaboratorDto } from '../models/create-collaborator.dto';
import { UpdateCollaboratorDto } from '../models/update-collaborator.dto';
import { DeleteResponse } from '../models/delete-collaborator.response.model';

@Injectable({
  providedIn: 'root',
})
export class CollaboratorService {
  private readonly http = inject(HttpClient);

  private readonly _collaborators = signal<Collaborator[]>([]);
  readonly collaborators = this._collaborators.asReadonly();

  private readonly _current = signal<Collaborator | null>(null);
  readonly current = this._current.asReadonly();

  getAll() {
    return this.http
      .get<Collaborator[]>(`${API_CONFIG.baseUrl}/professionals`)
      .pipe(tap((collaborators) => this._collaborators.set(collaborators)));
  }

  getById(id: number) {
    return this.http
      .get<Collaborator>(`${API_CONFIG.baseUrl}/professionals/${id}`)
      .pipe(tap((collaborator) => this._current.set(collaborator)));
  }

  setCurrent(collaborator: Collaborator) {
    this._current.set(collaborator);
  }

  clearCurrent() {
    this._current.set(null);
  }

  clearList() {
    this._collaborators.set([]);
  }

  create(data: CreateCollaboratorDto) {
    return this.http.post<Collaborator>(`${API_CONFIG.baseUrl}/professionals/register`, data).pipe(
      tap((collaborator) => {
        this._collaborators.update((collaborators) => [...collaborators, collaborator]);
      }),
    );
  }

  update(id: number, data: UpdateCollaboratorDto) {
    return this.http.patch<Collaborator>(`${API_CONFIG.baseUrl}/professionals/${id}`, data).pipe(
      tap((updated) => {
        this._current.set(updated);

        this._collaborators.update((collaborators) =>
          collaborators.map((collaborator) =>
            collaborator.id === updated.id ? updated : collaborator,
          ),
        );
      }),
    );
  }

  delete(id: number) {
    return this.http.delete<DeleteResponse>(`${API_CONFIG.baseUrl}/professionals/${id}`).pipe(
      tap((response) => {
        if (response.affected > 0) {
          this._collaborators.update((collaborators) =>
            collaborators.filter((collaborator) => collaborator.id !== id),
          );

          if (this._current()?.id === id) {
            this._current.set(null);
          }
        }
      }),
    );
  }
}
