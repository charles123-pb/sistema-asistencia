import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  readonly isDark = signal<boolean>(
    localStorage.getItem('uni_theme') === 'dark' ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  constructor() {
    effect(() => {
      const dark = this.isDark();
      document.body.classList.toggle('dark-mode', dark);
      localStorage.setItem('uni_theme', dark ? 'dark' : 'light');
    });
    // Apply immediately
    document.body.classList.toggle('dark-mode', this.isDark());
  }

  toggle(): void {
    this.isDark.update(v => !v);
  }
}
