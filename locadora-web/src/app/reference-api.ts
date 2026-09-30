import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type ReferenceKind = 'atores' | 'diretores' | 'classes';
export interface ReferenceRecord { id: number; name: string; price?: number; days?: number }
export interface ReferenceInput { name: string; price?: number; days?: number }
export interface ApiError { message?: string; fields?: Record<string, string> }

@Injectable({ providedIn: 'root' })
export class ReferenceApi {
  private readonly http = inject(HttpClient);

  list(kind: ReferenceKind): Observable<ReferenceRecord[]> {
    return this.http.get<ReferenceRecord[]>(`/api/${kind}`);
  }

  get(kind: ReferenceKind, id: number): Observable<ReferenceRecord> {
    return this.http.get<ReferenceRecord>(`/api/${kind}/${id}`);
  }

  create(kind: ReferenceKind, input: ReferenceInput): Observable<ReferenceRecord> {
    return this.http.post<ReferenceRecord>(`/api/${kind}`, input);
  }

  update(kind: ReferenceKind, id: number, input: ReferenceInput): Observable<ReferenceRecord> {
    return this.http.put<ReferenceRecord>(`/api/${kind}/${id}`, input);
  }

  delete(kind: ReferenceKind, id: number): Observable<void> {
    return this.http.delete<void>(`/api/${kind}/${id}`);
  }
}
