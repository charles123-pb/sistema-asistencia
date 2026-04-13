import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../config/environment';

/**
 * Servicio centralizado para todas las llamadas HTTP
 * Gestiona la construcción de URLs y parámetros
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Realizar solicitud GET
   */
  get<T>(endpoint: string, params?: Record<string, any>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] != null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { params: httpParams });
  }

  /**
   * Realizar solicitud POST
   */
  post<T>(endpoint: string, data?: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data || {});
  }

  /**
   * Realizar solicitud PUT
   */
  put<T>(endpoint: string, data?: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data || {});
  }

  /**
   * Realizar solicitud PATCH
   */
  patch<T>(endpoint: string, data?: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}${endpoint}`, data || {});
  }

  /**
   * Realizar solicitud DELETE
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`);
  }
}
