import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../config/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Agregar token si existe
    const token = localStorage.getItem('auth_token');
    if (token && !req.url.includes('/auth/login') && !req.url.includes('/api/users')) {
      req = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    // Agregar timeout a la solicitud
    return next.handle(req).pipe(
      timeout(environment.apiTimeout),
      catchError((error: any) => {
        // Manejo de errores de timeout
        if (error.name === 'TimeoutError') {
          console.error('Solicitud agotó el tiempo de espera');
          return throwError(() => ({
            message: 'Tiempo de conexión agotado. Intenta nuevamente.',
            status: 408,
            error,
          }));
        }

        // Manejo de errores HTTP
        if (error instanceof HttpErrorResponse) {
          const errorMessage = this._getErrorMessage(error);
          console.error('Error HTTP:', error.status, errorMessage);

          // Redirigir a login si es 401 (no autorizado)
          if (error.status === 401) {
            // AuthService.logout() - implementar según necesites
            console.warn('Sesión expirada, redirigiendo a login');
          }

          return throwError(() => ({
            message: errorMessage,
            status: error.status,
            error: error.error,
          }));
        }

        return throwError(
          () =>
            ({
              message: 'Ocurrió un error inesperado',
              error,
            }) as any
        );
      })
    );
  }

  private _getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Error del navegador
      return error.error.message || 'Error de conexión';
    }

    // Error del servidor
    switch (error.status) {
      case 400:
        return 'Solicitud inválida';
      case 401:
        return 'No autorizado';
      case 403:
        return 'Acceso denegado';
      case 404:
        return 'Recurso no encontrado';
      case 409:
        return 'Conflicto en los datos';
      case 500:
        return 'Error del servidor';
      case 503:
        return 'Servicio no disponible';
      default:
        return error.error?.message || `Error ${error.status}`;
    }
  }
}
