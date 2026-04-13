import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { AppUser } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _currentUser = signal<AppUser | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn  = computed(() => this._currentUser() !== null);
  readonly isAdmin     = computed(() => this._currentUser()?.role === 'admin');

  constructor(private data: DataService, private router: Router) {}

  login(user: AppUser): void {
    this._currentUser.set(user);
    if (user.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/courses']);
    }
  }

  logout(): void {
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  findUser(id: number, role: 'admin' | 'teacher'): AppUser | undefined {
    const d = this.data.data();
    if (role === 'admin') return d.admin;
    return d.teachers.find(t => t.id === id);
  }

  verifyPin(userId: number, role: 'admin' | 'teacher', pin: string): boolean {
    const d = this.data.data();
    if (role === 'admin') return d.admin.pin === pin;
    const teacher = d.teachers.find(t => t.id === userId);
    return teacher?.pin === pin;
  }

  /** Re-fetch current user from store (after updates) */
  refreshUser(): void {
    const cur = this._currentUser();
    if (!cur) return;
    const fresh = this.findUser(cur.id, cur.role);
    if (fresh) this._currentUser.set({ ...fresh });
  }
}
