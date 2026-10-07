import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ReferenceRecord } from './reference-api';

export interface TitleRecord {
  id: number;
  name: string;
  year: number;
  synopsis: string;
  category: string;
  director: ReferenceRecord;
  rentalClass: ReferenceRecord & { price: number; days: number };
  actors: ReferenceRecord[];
}

export interface TitleInput {
  name: string;
  year: number;
  synopsis: string;
  category: string;
  directorId: number;
  classId: number;
  actorIds: number[];
}

export type ItemType = 'FITA' | 'DVD' | 'BLU_RAY';
export const itemTypes: { value: ItemType; label: string }[] = [
  { value: 'FITA', label: 'Fita' }, { value: 'DVD', label: 'DVD' }, { value: 'BLU_RAY', label: 'Blu-ray' },
];
export interface ItemInput {
  serialNumber: string;
  titleId: number;
  acquisitionDate: string;
  type: ItemType;
}
export interface ItemRecord extends ItemInput { id: number; titleName: string }

@Injectable({ providedIn: 'root' })
export class StockApi {
  private readonly http = inject(HttpClient);

  listTitles(filters: { name?: string; category?: string; actorId?: number } = {}) {
    let params = new HttpParams();
    if (filters.name?.trim()) params = params.set('name', filters.name.trim());
    if (filters.category?.trim()) params = params.set('category', filters.category.trim());
    if (filters.actorId) params = params.set('actorId', filters.actorId);
    return this.http.get<TitleRecord[]>('/api/titulos', { params });
  }

  getTitle(id: number) { return this.http.get<TitleRecord>(`/api/titulos/${id}`); }
  createTitle(input: TitleInput) { return this.http.post<TitleRecord>('/api/titulos', input); }
  updateTitle(id: number, input: TitleInput) { return this.http.put<TitleRecord>(`/api/titulos/${id}`, input); }
  deleteTitle(id: number) { return this.http.delete<void>(`/api/titulos/${id}`); }

  listItems(filters: { titleId?: number; type?: ItemType; serialNumber?: string } = {}) {
    let params = new HttpParams();
    if (filters.titleId) params = params.set('titleId', filters.titleId);
    if (filters.type) params = params.set('type', filters.type);
    if (filters.serialNumber?.trim()) params = params.set('serialNumber', filters.serialNumber.trim());
    return this.http.get<ItemRecord[]>('/api/itens', { params });
  }

  getItem(id: number) { return this.http.get<ItemRecord>(`/api/itens/${id}`); }
  createItem(input: ItemInput) { return this.http.post<ItemRecord>('/api/itens', input); }
  updateItem(id: number, input: ItemInput) { return this.http.put<ItemRecord>(`/api/itens/${id}`, input); }
  deleteItem(id: number) { return this.http.delete<void>(`/api/itens/${id}`); }
}
