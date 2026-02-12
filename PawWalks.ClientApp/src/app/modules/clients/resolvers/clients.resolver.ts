import { ResolveFn } from '@angular/router';
import { ClientsService } from '../services/clients.service';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../shared/models/pagination';
import { ClientDetailDto } from '../models/clients.model';

export const clientsResolver: ResolveFn<
  Observable<PagedResult<ClientDetailDto>>
> = (route, state) => {
  const clientsService = inject(ClientsService);
  return clientsService.getClients();
};
