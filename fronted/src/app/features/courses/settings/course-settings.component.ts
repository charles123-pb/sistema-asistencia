import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataServiceBackend } from '../../../core/services/data-backend.service';
import { COLORS, Course } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-course-settings',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule, MatIconModule],
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
            <input matInput [(ngModel)]="form.sem" placeholder="2026-I">
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
export class CourseSettingsComponent implements OnInit, OnChanges {
  @Input({ required: true }) course!: Course;
  @Output() courseChanged = new EventEmitter<void>();

  readonly colors = COLORS;
  readonly selectedColor = signal(0);

  form = { name: '', code: '', sec: '', sem: '', credits: 3, minatt: 70 };

  constructor(
    private api: DataServiceBackend,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.syncFromCourse();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course'] && this.course) {
      this.syncFromCourse();
    }
  }

  private syncFromCourse(): void {
    const c = this.course;
    this.form = { name: c.name, code: c.code, sec: c.sec, sem: c.sem, credits: c.credits, minatt: c.minatt };
    this.selectedColor.set(c.color);
  }

  save(): void {
    this.api.updateCourse(this.course.id, {
      ...this.form,
      color: this.selectedColor(),
    }).subscribe({
      next: () => {
        this.courseChanged.emit();
        this.snack.open('Cambios guardados', '', { duration: 2000 });
      },
      error: (e) => this.snack.open(e?.message || 'Error al guardar', '', { duration: 3000 })
    });
  }

  deleteCourse(): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar curso', message: `¿Eliminar "${this.course.name}"? Esta acción no se puede deshacer.`, confirmLabel: 'Eliminar', danger: true }
    }).afterClosed().subscribe(ok => {
      if (!ok) return;
      this.api.deleteCourse(this.course.id).subscribe({
        next: () => {
          this.snack.open('Curso eliminado', '', { duration: 2000 });
          this.router.navigate(['/courses']);
        },
        error: (e) => this.snack.open(e?.message || 'Error al eliminar', '', { duration: 3000 })
      });
    });
  }
}
