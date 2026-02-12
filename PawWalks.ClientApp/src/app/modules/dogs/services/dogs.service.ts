import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LOCALHOST_CONFIG } from '../../../../config/localhost.config';
import {
  DogCreateRequest,
  DogUpdateRequest,
  DogListItemDto,
  DogDetailDto,
} from '../models/dogs.model';
import { PagedResult } from '../../../shared/models/pagination';

@Injectable({
  providedIn: 'root',
})
export class DogsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${LOCALHOST_CONFIG.API_URL}/Dogs`;

  getDogs(
    pageNumber: number = 1,
    pageSize: number = 10,
    clientId?: string,
  ): Observable<PagedResult<DogListItemDto>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (clientId) {
      params = params.set('clientId', clientId);
    }

    return this.http.get<PagedResult<DogListItemDto>>(this.apiUrl, { params });
  }

  getDogById(id: string): Observable<DogDetailDto> {
    return this.http.get<DogDetailDto>(`${this.apiUrl}/${id}`);
  }

  createDog(request: DogCreateRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.apiUrl, request);
  }

  updateDog(id: string, request: DogUpdateRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request);
  }

  deleteDog(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
