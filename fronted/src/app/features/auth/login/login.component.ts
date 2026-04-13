import { Component, computed, signal, effect, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthServiceBackend, normalizeAppUserRole } from '../../../core/services/auth-backend.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AppUser } from '../../../core/models';
import { NgClass } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, NgClass],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 py-6">
      <div class="relative w-full max-w-sm bg-[var(--surface)] border border-[var(--border)]
                  rounded-[18px] shadow-app-md p-10">

        <!-- Dark toggle -->
        <button (click)="theme.toggle()"
                class="absolute top-4 right-4 w-[34px] h-[34px] rounded-lg border border-[var(--border)]
                       bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--surface2)] transition-colors">
          <mat-icon class="!text-base text-[var(--text2)]">
            {{ theme.isDark() ? 'light_mode' : 'dark_mode' }}
          </mat-icon>
        </button>

        <!-- Logo -->
        <div class="flex flex-col items-center gap-2.5 mb-8">
          <div class="w-[52px] h-[52px] rounded-[14px] bg-[var(--accent)] flex items-center justify-center">
            <mat-icon class="!text-2xl text-white">grid_view</mat-icon>
          </div>
          <h1 class="text-xl font-bold tracking-tight">
            Uni<span class="text-[var(--accent)]">Asistencia</span>
          </h1>
          <p class="text-[12.5px] text-[var(--text3)]">Selecciona tu usuario e ingresa tu PIN</p>
        </div>

        <!-- Step 1: User selection -->
        @if (step() === 1) {
          @if (loadUsersError()) {
            <div class="text-[var(--red)] text-sm text-center mb-3 px-2">{{ loadUsersError() }}</div>
          }
          <div class="grid grid-cols-2 gap-2.5 mb-4">
            @for (u of allUsers(); track u.id) {
              <button
                (click)="selectUser(u)"
                class="flex flex-col items-center gap-2 p-4 rounded-app border-2 border-[var(--border)]
                       bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--accent-bg)]
                       transition-all cursor-pointer"
                [ngClass]="isAdminUser(u)
                  ? 'hover:!border-[var(--amber)] hover:!bg-[var(--amber-bg)]'
                  : ''">
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold"
                     [style.background]="isAdminUser(u) ? 'var(--amber)' : 'var(--accent)'">
                  {{ initials(u.name) }}
                </div>
                <div class="text-[12px] font-semibold text-center leading-tight">{{ u.name }}</div>
                <div class="text-[10px] text-[var(--text3)]">
                  {{ isAdminUser(u) ? 'Administrador' : 'Docente' }}
                </div>
              </button>
            }
          </div>
          <p class="text-[11px] text-[var(--text3)] text-center">Toca tu nombre para continuar</p>
        }

        <!-- Step 2: PIN -->
        @if (step() === 2) {
          <div>
            <!-- Back + user info -->
            <div class="flex items-center gap-2.5 mb-5">
              <button (click)="backToStep1()"
                      class="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface2)] transition-colors">
                <mat-icon class="!text-base text-[var(--text2)]">arrow_back_ios_new</mat-icon>
              </button>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                     [style.background]="selectedUser() && isAdminUser(selectedUser()!) ? 'var(--amber)' : 'var(--accent)'">
                  {{ initials(selectedUser()?.name ?? '') }}
                </div>
                <div>
                  <div class="text-[13px] font-bold">{{ selectedUser()?.name }}</div>
                  <div class="text-[11px] text-[var(--text3)]">
                    {{ selectedUser() && isAdminUser(selectedUser()!) ? 'Administrador' : 'Docente' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- PIN dots -->
            <div class="text-[13px] font-semibold text-[var(--text2)] mb-2.5">
              Ingresa tu PIN de 4 dígitos
            </div>
            <div class="flex justify-center gap-2.5 mb-5">
              @for (i of [0,1,2,3]; track i) {
                <div class="w-3.5 h-3.5 rounded-full border-2 transition-all"
                     [ngClass]="{
                       'bg-[var(--accent)] border-[var(--accent)]': !pinError() && pin().length > i,
                       'bg-[var(--surface2)] border-[var(--border2)]': !pinError() && pin().length <= i,
                       'bg-[var(--red)] border-[var(--red)]': pinError()
                     }">
                </div>
              }
            </div>

            <!-- PIN pad -->
            <div class="grid grid-cols-3 gap-2.5 mb-4">
              @for (k of ['1','2','3','4','5','6','7','8','9','','0','del']; track k) {
                @if (k === '') {
                  <div></div>
                } @else if (k === 'del') {
                  <button (click)="pinDel()"
                          class="py-3.5 rounded-app-sm border border-[var(--border)] bg-[var(--surface)]
                                 text-sm text-[var(--text3)] cursor-pointer text-center
                                 hover:text-[var(--red)] hover:border-[var(--red)] hover:bg-[var(--red-bg)]
                                 transition-all active:scale-95">⌫</button>
                } @else {
                  <button (click)="pinKey(k)"
                          class="py-3.5 rounded-app-sm border border-[var(--border)] bg-[var(--surface)]
                                 text-lg font-semibold cursor-pointer text-center
                                 hover:bg-[var(--accent-bg)] hover:border-[var(--accent)] hover:text-[var(--accent)]
                                 transition-all active:scale-95">{{ k }}</button>
                }
              }
            </div>

            <!-- Error -->
            <div class="text-[var(--red)] text-xs text-center min-h-[18px]">
              {{ errorMsg() }}
            </div>
          </div>
        }

      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  readonly step = signal<1 | 2>(1);
  readonly selectedUser = signal<AppUser | null>(null);
  readonly pin = signal('');
  readonly pinError = signal(false);
  readonly errorMsg = signal('');
  readonly allUsers = signal<AppUser[]>([]);
  readonly loadUsersError = signal('');

  private api = inject(ApiService);

  constructor(
    readonly auth: AuthServiceBackend,
    readonly theme: ThemeService
  ) {}

  isAdminUser(u: AppUser): boolean {
    return normalizeAppUserRole(u.role) === 'admin';
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadUsersError.set('');
    this.api.get<AppUser[]>('/users').subscribe({
      next: (users) => {
        const sorted = [...users].sort((a, b) => {
          if (normalizeAppUserRole(a.role) === 'admin') return -1;
          if (normalizeAppUserRole(b.role) === 'admin') return 1;
          return a.name.localeCompare(b.name);
        });
        this.allUsers.set(sorted);
        if (sorted.length === 0) {
          this.loadUsersError.set('No hay usuarios activos. Arranca el backend (puerto 3001) y recarga.');
        }
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.allUsers.set([]);
        this.loadUsersError.set(
          'No se pudo conectar con el API en http://localhost:3001. Arranca Spring Boot (IntelliJ) y comprueba el puerto en la consola.'
        );
      }
    });
  }

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map(x => x[0]).join('');
  }

  selectUser(u: AppUser): void {
    this.selectedUser.set(u);
    this.pin.set('');
    this.pinError.set(false);
    this.errorMsg.set('');
    this.step.set(2);
  }

  backToStep1(): void {
    this.step.set(1);
    this.pin.set('');
    this.pinError.set(false);
    this.errorMsg.set('');
  }

  pinKey(k: string): void {
    if (this.pin().length >= 4) return;
    this.pin.update(p => p + k);
    if (this.pin().length === 4) {
      setTimeout(() => this.attemptLogin(), 80);
    }
  }

  pinDel(): void {
    this.pin.update(p => p.slice(0, -1));
    this.errorMsg.set('');
    this.pinError.set(false);
  }

  attemptLogin(): void {
    const u = this.selectedUser();
    if (!u) return;
    this.auth.login(Number(u.id), this.pin()).subscribe({
      next: () => {
        // Login exitoso - el servicio ya maneja la redirección
      },
      error: (err: any) => {
        this.pinError.set(true);
        const serverBody = err?.error;
        const fromApi =
          typeof serverBody?.error === 'string'
            ? serverBody.error
            : typeof err?.message === 'string' && err.message !== 'No autorizado'
              ? err.message
              : '';
        this.errorMsg.set(fromApi || 'Credenciales incorrectas');
        setTimeout(() => {
          this.pin.set('');
          this.pinError.set(false);
          this.errorMsg.set('');
        }, 1200);
      }
    });
  }
}
