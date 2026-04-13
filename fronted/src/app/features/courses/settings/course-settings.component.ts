import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { COLORS, Course, Teacher } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-course-settings',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-7 max-w-2xl">

      <div class="bg-[var(--surface)] border border-[var(--border)] rounded-app p-6 shadow-app mb-4">
        <div class="text-sm font-bold mb-4">Información del curso</div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <mat-form-field appearance="outline">
            <mat-label>Nombre del curso</mat-label>
            <input matInput [(ngModel)]="form.name">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Código</mat-label>
            <input matInput [(ngModel)]="form.code">
          </mat-form-field>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-4">
          <mat-form-field appearance="outline">
            <mat-label>Sección</mat-label>
            <input matInput [(ngModel)]="form.sec">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Semestre</mat-label>
            <mat-select [(ngModel)]="form.sem">
              <mat-option value="2025-I">2025-I</mat-option>
              <mat-option value="2025-II">2025-II</mat-option>
              <mat-option value="2024-II">2024-II</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Créditos</mat-label>
            <input matInput type="number" [(ngModel)]="form.credits">
          </mat-form-field>
        </div>

        <!-- Min att slider -->
        <div class="mb-4">
          <div class="form-label">% mínimo de asistencia</div>
          <div class="flex items-center gap-4">
            <input type="range" min="50" max="90" step="5" [(ngModel)]="form.minatt"
                   class="flex-1 accent-[var(--accent)]">
            <span class="text-sm font-bold text-[var(--accent)] font-mono min-w-[40px]">{{ form.minatt }}%</span>
          </div>
        </div>

        <!-- Color -->
        <div class="mb-4">
          <div class="form-label">Color del curso</div>
          <div class="flex gap-2">
            @for (c of colors; track $index) {
              <button type="button" class="w-7 h-7 rounded-full border-2 transition-all"
                      [style.background]="c.s"
                      [class.border-black]="selectedColor() === $index"
                      [class.scale-110]="selectedColor() === $index"
                      [class.border-transparent]="selectedColor() !== $index"
                      (click)="selectedColor.set($index)">
              </button>
            }
          </div>
        </div>

        <div class="flex justify-end">
          <button mat-flat-button color="primary" (click)="save()">Guardar cambios</button>
        </div>
      </div>

      <!-- Danger zone -->
      <div class="bg-[var(--red-bg)] border border-red-200 rounded-app p-5">
        <div class="text-sm font-bold text-[var(--red)] mb-1">Zona de peligro</div>
        <p class="text-xs text-[var(--red)] mb-3">Eliminar el curso borrará todas las sesiones y registros permanentemente.</p>
        <button mat-stroked-button color="warn" (click)="deleteCourse()">
          <mat-icon>delete_forever</mat-icon>
          Eliminar curso
        </button>
      </div>

    </div>
  `
})
export class CourseSettingsComponent implements OnInit {
  @Input({ required: true }) course!: Course;

  readonly colors = COLORS;
  readonly selectedColor = signal(0);

  form = { name: '', code: '', sec: '', sem: '', credits: 3, minatt: 70 };

  constructor(
    private auth: AuthService,
    private data: DataService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const c = this.course;
    this.form = { name: c.name, code: c.code, sec: c.sec, sem: c.sem, credits: c.credits, minatt: c.minatt };
    this.selectedColor.set(c.color);
  }

  save(): void {
    const u = this.auth.currentUser() as Teacher;
    this.data.updateCourse(u, this.course.id, {
      ...this.form,
      color: this.selectedColor(),
    });
    this.auth.refreshUser();
    this.snack.open('Cambios guardados', '', { duration: 2000 });
  }

  deleteCourse(): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar curso', message: `¿Eliminar "${this.course.name}"? Esta acción no se puede deshacer.`, confirmLabel: 'Eliminar', danger: true }
    }).afterClosed().subscribe(ok => {
      if (!ok) return;
      const u = this.auth.currentUser() as Teacher;
      this.data.deleteCourse(u, this.course.id);
      this.auth.refreshUser();
      this.snack.open('Curso eliminado', '', { duration: 2000 });
      this.router.navigate(['/courses']);
    });
  }
}