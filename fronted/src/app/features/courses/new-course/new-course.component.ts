import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthServiceBackend } from '../../../core/services/auth-backend.service';
import { DataServiceBackend } from '../../../core/services/data-backend.service';
import { COLORS } from '../../../core/models';

@Component({
  selector: 'app-new-course',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-7 pb-10 fade-in max-w-2xl">

      <!-- Breadcrumb -->
      <div class="flex items-center gap-1.5 text-xs text-[var(--text3)] mb-5">
        <span class="text-[var(--accent)] font-medium cursor-pointer hover:underline"
              (click)="router.navigate(['/courses'])">Inicio</span>
        <mat-icon class="!text-xs">chevron_right</mat-icon>
        <span>Nuevo curso</span>
      </div>

      <div class="page-header">
        <div>
          <h1>Crear nuevo curso</h1>
          <p>Completa la información del curso para este semestre</p>
        </div>
      </div>

      <div class="bg-[var(--surface)] border border-[var(--border)] rounded-app p-6 shadow-app">

        <!-- Name + Code -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <mat-form-field appearance="outline">
            <mat-label>Nombre del curso *</mat-label>
            <input matInput [(ngModel)]="form.name" placeholder="Ej: Programación I">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Código</mat-label>
            <input matInput [(ngModel)]="form.code" placeholder="Ej: CS-101">
          </mat-form-field>
        </div>

        <!-- Sec + Sem + Credits -->
        <div class="grid grid-cols-4 gap-4 mb-4">
          <mat-form-field appearance="outline">
            <mat-label>Sección</mat-label>
            <input matInput [(ngModel)]="form.sec" placeholder="A">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Año</mat-label>
            <input matInput [(ngModel)]="form.semYear" placeholder="2026">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Semestre</mat-label>
            <input matInput [(ngModel)]="form.semTerm" placeholder="I, II, Verano...">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Créditos</mat-label>
            <input matInput type="number" [(ngModel)]="form.credits" min="1" max="6" placeholder="3">
          </mat-form-field>
        </div>

        <!-- Min attendance slider -->
        <div class="mb-4">
          <div class="form-label">% mínimo de asistencia</div>
          <div class="flex items-center gap-4">
            <input type="range" min="50" max="90" step="5" [(ngModel)]="form.minatt"
                   class="flex-1 accent-[var(--accent)]">
            <span class="text-sm font-bold text-[var(--accent)] font-mono min-w-[40px]">{{ form.minatt }}%</span>
          </div>
        </div>

        <!-- Color picker -->
        <div class="mb-4">
          <div class="form-label">Color del curso</div>
          <div class="flex gap-2">
            @for (c of colors; track $index) {
              <button type="button"
                      class="w-7 h-7 rounded-full border-2 transition-all"
                      [style.background]="c.s"
                      [class.border-text-1]="selectedColor() === $index"
                      [class.scale-110]="selectedColor() === $index"
                      [class.border-transparent]="selectedColor() !== $index"
                      (click)="selectedColor.set($index)">
              </button>
            }
          </div>
        </div>

        <!-- Description -->
        <mat-form-field appearance="outline" class="mb-2">
          <mat-label>Descripción</mat-label>
          <textarea matInput [(ngModel)]="form.desc" rows="2"
                    placeholder="Descripción breve del curso..."></textarea>
        </mat-form-field>

        <!-- Actions -->
        <div class="flex gap-2 justify-end mt-2">
          <button mat-button (click)="router.navigate(['/courses'])">Cancelar</button>
          <button mat-flat-button color="primary" (click)="save()">
            <mat-icon>add</mat-icon>
            Crear curso
          </button>
        </div>

      </div>
    </div>
  `
})
export class NewCourseComponent {

  readonly colors = COLORS;
  readonly selectedColor = signal(0);

  form = {
    name: '', code: '', sec: 'A', semYear: '2026', semTerm: 'I', credits: 3,
    minatt: 70, desc: ''
  };

  constructor(
    readonly router: Router,
    private auth: AuthServiceBackend,
    private data: DataServiceBackend,
    private snack: MatSnackBar
  ) {}

  save(): void {
    if (!this.form.name.trim()) {
      this.snack.open('El nombre del curso es requerido', '', { duration: 2500 });
      return;
    }
    this.data.createCourse({
      name: this.form.name.trim(),
      code: this.form.code || 'SIN-COD',
      sec: this.form.sec || 'A',
      sem: this.buildSemester(),
      credits: this.form.credits || 3,
      minatt: this.form.minatt,
      color: this.selectedColor(),
      icon: Math.floor(Math.random() * 10),
      desc: this.form.desc,
    }).subscribe({
      next: () => {
        this.snack.open('Curso creado exitosamente', '', { duration: 2500 });
        this.router.navigate(['/courses']);
      },
      error: (error) => {
        const message = error?.message || 'No se pudo crear el curso';
        this.snack.open(message, '', { duration: 3000 });
      }
    });
  }

  private buildSemester(): string {
    const year = (this.form.semYear || '').trim();
    const term = (this.form.semTerm || '').trim();
    if (!year && !term) return '';
    if (!year) return term;
    if (!term) return year;
    return `${year}-${term}`;
  }
}