import { ResolveFn } from '@angular/router';
import { WalksService } from '../services/walks.service';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../shared/models/pagination';
import { WalkListItemDto } from '../models/walks.model';

export const walksResolver: ResolveFn<
  Observable<PagedResult<WalkListItemDto>>
> = (route, state) => {
  const walksService = inject(WalksService);
  return walksService.getWalks();
};
