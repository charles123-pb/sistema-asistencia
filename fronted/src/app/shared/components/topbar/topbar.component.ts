import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthServiceBackend } from '../../../core/services/auth-backend.service';
import { DataService } from '../../../core/services/data.service';
import { ThemeService } from '../../../core/services/theme.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule, MatTooltipModule, NgClass],
  template: `
    <header class="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-7
                   bg-[var(--surface)] border-b border-[var(--border)] shadow-sm">

      <!-- Brand -->
      <div class="flex items-center gap-2.5 cursor-pointer" (click)="goHome()">
        <div class="w-8 h-8 rounded-[9px] bg-[var(--accent)] flex items-center justify-center">
          <mat-icon class="text-white !text-base !w-4 !h-4">grid_view</mat-icon>
        </div>
        <span class="text-[15px] font-semibold tracking-tight">
          Uni<span class="text-[var(--accent)]">Asistencia</span>
        </span>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-2 relative">

        <!-- Dark mode toggle -->
        <button mat-icon-button (click)="theme.toggle()"
                class="!w-[34px] !h-[34px] !rounded-lg border border-[var(--border)]"
                [matTooltip]="theme.isDark() ? 'Modo claro' : 'Modo oscuro'">
          <mat-icon class="!text-base text-[var(--text2)]">
            {{ theme.isDark() ? 'light_mode' : 'dark_mode' }}
          </mat-icon>
        </button>

        <!-- Notifications (teacher only) -->
        @if (!auth.isAdmin()) {
          <button mat-icon-button
                  [matMenuTriggerFor]="notifMenu"
                  class="!w-[34px] !h-[34px] !rounded-lg border border-[var(--border)]"
                  [matBadge]="alerts().length > 0 ? alerts().length : null"
                  matBadgeColor="warn"
                  matBadgeSize="small">
            <mat-icon class="!text-base text-[var(--text2)]">notifications</mat-icon>
          </button>

          <mat-menu #notifMenu="matMenu" class="notif-menu-panel">
            <div class="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between min-w-[300px]">
              <span class="text-sm font-semibold">Alertas de asistencia</span>
            </div>
            @if (alerts().length === 0) {
              <div class="px-4 py-8 text-center text-sm text-[var(--text3)]">
                Sin alertas de asistencia 🎉
              </div>
            } @else {
              @for (a of alerts(); track a.student) {
                <button mat-menu-item (click)="goToCourse(a.courseId)"
                        class="!py-3 !h-auto border-b border-[var(--border)]">
                  <div class="text-left">
                    <div class="text-xs font-bold text-[var(--red)]">⚠ Asistencia baja — {{ a.course }}</div>
                    <div class="text-xs text-[var(--text2)] mt-0.5">{{ a.student }}: {{ a.pct }}% (mínimo {{ a.min }}%)</div>
                  </div>
                </button>
              }
            }
          </mat-menu>
        }

        <!-- User pill -->
        <button mat-button [matMenuTriggerFor]="userMenu"
                class="!rounded-full !border !border-[var(--border)] !px-3 !py-1 !h-auto flex items-center gap-2">
          <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
               [class.bg-[var(--amber)]]="auth.isAdmin()"
               [class.bg-[var(--accent)]]="!auth.isAdmin()"
               [ngClass]="auth.isAdmin() ? 'bg-amber-500' : 'bg-[var(--accent)]'">
            {{ initials() }}
          </div>
          <span class="text-[12.5px] font-medium">{{ auth.currentUser()?.name }}</span>
          @if (auth.isAdmin()) {
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full
                         bg-[var(--amber-bg)] text-[var(--amber)] border border-[var(--amber)]">
              ADMIN
            </span>
          }
        </button>

        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Cerrar sesión</span>
          </button>
        </mat-menu>

      </div>
    </header>
  `,
  styles: [`
    :host { display: block; }
    ::ng-deep .notif-menu-panel .mat-mdc-menu-content { padding: 0 !important; }
  `]
})
export class TopbarComponent {
  readonly auth = inject(AuthServiceBackend);
  private readonly data = inject(DataService);
  readonly theme = inject(ThemeService);
  private router = inject(Router);
  
  readonly alerts = computed(() => {
    const user = this.auth.currentUser();
    return user ? this.data.buildAlerts(user) : [];
  });

  readonly initials = computed(() => {
    const u = this.auth.currentUser();
    return u ? this.data.getInitials(u.name) : '';
  });

  goHome(): void {
    if (this.auth.isAdmin()) this.router.navigate(['/admin']);
    else this.router.navigate(['/courses']);
  }

  goToCourse(id: number): void {
    this.router.navigate(['/courses', id]);
  }

  logout(): void {
    this.auth.logout();
  }
}
