import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro inesperado no servidor.';

      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Sem conexão com o servidor. Verifique a sua internet.';
      }

      toast.error('Erro na Operação', { description: errorMessage });
      return throwError(() => error);
    }),
  );
};
