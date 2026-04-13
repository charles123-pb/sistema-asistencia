import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './shared/components/topbar/topbar.component';
import { AuthServiceBackend } from './core/services/auth-backend.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopbarComponent],
  template: `
    @if (auth.isLoggedIn()) {
      <app-topbar />
    }
    <main [class.has-topbar]="auth.isLoggedIn()">
      <router-outlet />
    </main>
  `,
  styles: [`
    main { min-height: 100vh; background: var(--bg); }
    main.has-topbar { padding-top: 56px; }
  `]
})
export class AppComponent {
  constructor(readonly auth: AuthServiceBackend) {}
}
