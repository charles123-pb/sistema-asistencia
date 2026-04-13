import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AppUser } from '../models';
import { environment } from '../config/environment';

/** El API puede enviar el rol en distinto casing; Spring usa enum en minúsculas (admin, teacher). */
export function normalizeAppUserRole(role: string | undefined | null): 'admin' | 'teacher' {
  const r = String(role ?? '').toLowerCase();
  return r === 'admin' ? 'admin' : 'teacher';
}

function mapUserFromApi(raw: AppUser): AppUser {
  return { ...raw, role: normalizeAppUserRole(raw.role) } as AppUser;
}

interface LoginCredentials {
  userId: number;
  pin: string;
}

interface LoginResponse {
  token: string;
  user: AppUser;
}

@Injectable({ providedIn: 'root' })
export class AuthServiceBackend {
  private api = inject(ApiService);
  private router = inject(Router);

  private _currentUser = signal<AppUser | null>(null);
  private _token = signal<string | null>(localStorage.getItem('auth_token'));

  readonly currentUser = this._currentUser.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => normalizeAppUserRole(this._currentUser()?.role) === 'admin');

  /**
   * Inicializar sesión al cargar la aplicación (si existe token guardado)
   */
  initializeAuth(): Observable<AppUser | null> {
    const token = this._token();
    if (!token) return new Observable((obs) => {
      obs.next(null);
      obs.complete();
    });

    return this.api.get<AppUser>(`${environment.endpoints.auth}/me`).pipe(
      tap((user) => {
        this._currentUser.set(mapUserFromApi(user));
      }),
      catchError(() => {
        this._token.set(null);
        localStorage.removeItem('auth_token');
        return throwError(() => new Error('Sesión expirada'));
      })
    );
  }

  /**
   * Login con usuario y PIN
   */
  login(userId: number, pin: string): Observable<LoginResponse> {
    const credentials: LoginCredentials = { userId, pin };
    return this.api.post<LoginResponse>(`${environment.endpoints.auth}/login`, credentials).pipe(
      tap((response) => {
        const user = mapUserFromApi(response.user);
        this._token.set(response.token);
        this._currentUser.set(user);
        localStorage.setItem('auth_token', response.token);

        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/courses']);
        }
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout
   */
  logout(): void {
    this._token.set(null);
    this._currentUser.set(null);
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  /**
   * Obtener usuario actual desde el servidor
   */
  refreshUser(): Observable<AppUser> {
    return this.api.get<AppUser>(`${environment.endpoints.auth}/me`).pipe(
      tap((user) => {
        this._currentUser.set(mapUserFromApi(user));
      })
    );
  }

  /**
   * Verificar si el usuario tiene un token válido
   */
  hasValidToken(): boolean {
    return this._token() !== null && this._currentUser() !== null;
  }

  /**
   * Obtener el token actual (para usar en headers si es necesario)
   */
  getToken(): string | null {
    return this._token();
  }
}
