import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  let id = inject(PLATFORM_ID);
  if (isPlatformBrowser(id)) {
    const myToken = localStorage.getItem('token');

    if (myToken) {
      req = req.clone({
        setHeaders: {
          token: myToken,
        },
      });
    }
  }

  return next(req);
};
