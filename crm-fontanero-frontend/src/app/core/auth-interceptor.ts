// src/app/core/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, first, switchMap, throwError } from 'rxjs';
import { AuthService } from '../components/auth/services/auth.service';
import { AUTH_API } from '../components/auth/constants/auth-api-const';

let refreshInProgress = false;
const refreshCompleted$ = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Siempre enviar cookies httpOnly al backend
  req = req.clone({
    withCredentials: true,
  });

  const isAuthRoute =
    req.url.includes(`${AUTH_API.LOGIN}`) ||
    req.url.includes(`${AUTH_API.REGISTER}`) ||
    req.url.includes(`${AUTH_API.REFRESH}`) ||
    req.url.includes(`${AUTH_API.LOGOUT}`);

  // Adjuntar access token si no es ruta pública
  if (!isAuthRoute) {
    const token = auth.accessToken;
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
    }
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401 || isAuthRoute) {
        return throwError(() => err);
      }

      if (refreshInProgress) {
        return refreshCompleted$.pipe(
          filter((t) => t !== null),
          first(),
          switchMap((token) => {
            const clone = req.clone({
              setHeaders: { Authorization: `Bearer ${token!}` },
              withCredentials: true,
            });
            return next(clone);
          }),
        );
      }

      refreshInProgress = true;
      refreshCompleted$.next(null);

      return auth.refresh().pipe(
        switchMap((res) => {
          refreshInProgress = false;
          refreshCompleted$.next(res.token);

          const clone = req.clone({
            setHeaders: { Authorization: `Bearer ${res.token}` },
            withCredentials: true,
          });
          return next(clone);
        }),
        catchError((refreshErr) => {
          refreshInProgress = false;
          auth.setToken(null);
          router.navigate(['/login']);
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};
