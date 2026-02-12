import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LOCALHOST_CONFIG } from '../../../../config/localhost.config';
import {
  ClientCreateRequest,
  ClientUpdateRequest,
  ClientListItemDto,
  ClientDetailDto,
} from '../models/clients.model';
import { PagedResult } from '../../../shared/models/pagination';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${LOCALHOST_CONFIG.API_URL}/Clients`;

  getClients(
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Observable<PagedResult<ClientListItemDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<ClientListItemDto>>(this.apiUrl, {
      params,
    });
  }

  getClientById(id: string): Observable<ClientDetailDto> {
    return this.http.get<ClientDetailDto>(`${this.apiUrl}/${id}`);
  }

  createClient(request: ClientCreateRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.apiUrl, request);
  }

  updateClient(id: string, request: ClientUpdateRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request);
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
