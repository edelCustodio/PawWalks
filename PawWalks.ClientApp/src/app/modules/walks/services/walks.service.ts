import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LOCALHOST_CONFIG } from '../../../../config/localhost.config';
import {
  WalkCreateRequest,
  WalkUpdateRequest,
  WalkDetailDto,
  WalkListItemDto,
  WalkStatus,
} from '../models/walks.model';
import { PagedResult } from '../../../shared/models/pagination';

@Injectable({
  providedIn: 'root',
})
export class WalksService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = `${LOCALHOST_CONFIG.API_URL}/walks`;

  /**
   * Get paginated list of walks with optional filters
   */
  getWalks(
    page: number = 1,
    pageSize: number = 10,
    from?: Date,
    to?: Date,
    clientId?: string,
    dogId?: string,
    status?: WalkStatus,
  ): Observable<PagedResult<WalkListItemDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (from) {
      params = params.set('from', from.toISOString());
    }
    if (to) {
      params = params.set('to', to.toISOString());
    }
    if (clientId) {
      params = params.set('clientId', clientId);
    }
    if (dogId) {
      params = params.set('dogId', dogId);
    }
    if (status !== undefined) {
      params = params.set('status', status.toString());
    }

    return this._http.get<PagedResult<WalkListItemDto>>(this._apiUrl, {
      params,
    });
  }

  /**
   * Get walk by ID
   */
  getWalkById(id: string): Observable<WalkDetailDto> {
    return this._http.get<WalkDetailDto>(`${this._apiUrl}/${id}`);
  }

  /**
   * Create a new walk
   */
  createWalk(request: WalkCreateRequest): Observable<{ id: string }> {
    return this._http.post<{ id: string }>(this._apiUrl, request);
  }

  /**
   * Update an existing walk
   */
  updateWalk(id: string, request: WalkUpdateRequest): Observable<void> {
    return this._http.put<void>(`${this._apiUrl}/${id}`, request);
  }

  /**
   * Delete a walk
   */
  deleteWalk(id: string): Observable<void> {
    return this._http.delete<void>(`${this._apiUrl}/${id}`);
  }
}
