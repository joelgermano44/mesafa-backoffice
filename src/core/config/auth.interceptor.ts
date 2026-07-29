import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../features/storage/services/storage.service';
import { STORAGE_KEYS } from '../constants/storage.constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(StorageService).getString(STORAGE_KEYS.TOKEN);
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq);
};