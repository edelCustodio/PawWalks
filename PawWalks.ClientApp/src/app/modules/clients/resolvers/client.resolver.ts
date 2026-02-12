import { ResolveFn } from '@angular/router';
import { ClientsService } from '../services/clients.service';
import { inject } from '@angular/core';
import { ClientDetailDto } from '../models/clients.model';
import { Observable } from 'rxjs';

export const clientResolver: ResolveFn<Observable<ClientDetailDto>> = (
  route,
  state,
) => {
  const clientsService = inject(ClientsService);
  return clientsService.getClientById(route.params['id']);
};
