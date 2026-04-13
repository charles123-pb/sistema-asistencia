<<<<<<< HEAD
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
=======
import { Component, Input, signal } from '@angular/core';
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
<<<<<<< HEAD
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../../core/services/data.service';
import { DataServiceBackend } from '../../../core/services/data-backend.service';
import { Course, Student } from '../../../core/models';
=======
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { Course, Student, Teacher } from '../../../core/models';
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AttRingComponent } from '../../../shared/components/att-ring/att-ring.component';
import { ImportDialogComponent } from '../import/import-dialog.component';

@Component({
  selector: 'app-students-tab',
  standalone: true,
<<<<<<< HEAD
  imports: [FormsModule, MatInputModule, MatButtonModule, MatIconModule, AttRingComponent],
=======
  imports: [FormsModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, AttRingComponent],
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
  template: `
    <div class="p-7">

      <!-- Header -->
      <div class="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <mat-form-field appearance="outline" class="!w-64 !text-sm">
            <mat-label>Buscar estudiante</mat-label>
            <mat-icon matPrefix class="!text-base">search</mat-icon>
            <input matInput [(ngModel)]="search" placeholder="Nombre o código...">
          </mat-form-field>
        </div>
        <div class="flex gap-2">
          <button mat-stroked-button class="!text-xs !h-9" (click)="importCSV()">
            <mat-icon class="!text-sm">upload_file</mat-icon>
            Importar CSV
          </button>
          <button mat-flat-button color="primary" class="!text-xs !h-9" (click)="showAddForm.set(true)">
            <mat-icon class="!text-sm">add</mat-icon>
            Agregar
          </button>
        </div>
      </div>

      <!-- Add/Edit form -->
      @if (showAddForm()) {
        <div class="bg-[var(--surface)] border border-[var(--amber)] rounded-app p-5 mb-4
                    shadow-[0_0_0_3px_rgba(230,119,0,.08)]">
          <div class="flex items-center justify-between mb-3">
            <div class="text-sm font-bold">{{ editingId() ? 'Editar estudiante' : 'Agregar estudiante' }}</div>
            <button mat-icon-button class="!w-7 !h-7" (click)="cancelForm()">
              <mat-icon class="!text-sm">close</mat-icon>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <mat-form-field appearance="outline">
              <mat-label>Nombres *</mat-label>
              <input matInput [(ngModel)]="stuForm.first" placeholder="Ana María">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Apellidos *</mat-label>
              <input matInput [(ngModel)]="stuForm.last" placeholder="Torres Quispe">
            </mat-form-field>
          </div>
          <div class="grid grid-cols-3 gap-3 mb-4">
            <mat-form-field appearance="outline">
              <mat-label>Código</mat-label>
              <input matInput [(ngModel)]="stuForm.code" placeholder="2024-001">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Semestre</mat-label>
<<<<<<< HEAD
              <input matInput [(ngModel)]="stuForm.sem" placeholder="2026-I">
=======
              <mat-select [(ngModel)]="stuForm.sem">
                @for (s of sems; track s) { <mat-option [value]="s">{{ s }}</mat-option> }
              </mat-select>
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="stuForm.email" placeholder="est@uni.edu.pe">
            </mat-form-field>
          </div>
          <div class="flex gap-2 justify-end">
            <button mat-button (click)="cancelForm()">Cancelar</button>
            <button mat-flat-button color="accent" (click)="saveStudent()">
              {{ editingId() ? 'Guardar cambios' : 'Agregar estudiante' }}
            </button>
          </div>
        </div>
      }

      <!-- Student list -->
      @if (filteredStudents().length === 0) {
        <div class="empty-state">
          <mat-icon>group</mat-icon>
          <p>Sin estudiantes</p>
          <small>Agrega o importa estudiantes al curso</small>
        </div>
      } @else {
        <div class="flex flex-col gap-2">
          @for (s of filteredStudents(); track s.id; let i = $index) {
            <div class="bg-[var(--surface)] border rounded-app p-4 flex items-center gap-3 transition-colors"
                 [class.border-danger-DEFAULT]="isAtRisk(s.id)"
                 [class.bg-danger-bg]="isAtRisk(s.id)"
                 [class.border-border]="!isAtRisk(s.id)">

              <!-- Avatar -->
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                   [style.background]="avColor(i).bg" [style.color]="avColor(i).c">
                {{ initials(s.name) }}
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold">
                  {{ s.name }}
                  @if (isAtRisk(s.id)) { <span class="risk-badge">⚠ {{ stuPct(s.id) }}%</span> }
                </div>
                <div class="text-xs text-[var(--text2)]">
                  {{ s.code }} · Sem. {{ s.sem }}{{ s.email ? ' · ' + s.email : '' }}
                </div>
              </div>

              <!-- Ring -->
              <div class="flex items-center gap-2 flex-shrink-0">
                <app-att-ring [pct]="stuPct(s.id)"
                              [color]="data.attColor(stuPct(s.id), course.minatt)"
                              [size]="36" />
                <div>
                  <div class="text-sm font-bold font-mono"
                       [style.color]="data.attColor(stuPct(s.id), course.minatt)">{{ stuPct(s.id) }}%</div>
                  <div class="text-[10px]"
                       [class.text-success-DEFAULT]="!isAtRisk(s.id)"
                       [class.text-danger-DEFAULT]="isAtRisk(s.id)">
                    {{ isAtRisk(s.id) ? '⚠ Bajo mínimo' : '✓ Cumple' }}
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-1 flex-shrink-0">
                <button mat-icon-button class="!w-7 !h-7" (click)="editStudent(s)">
                  <mat-icon class="!text-sm">edit</mat-icon>
                </button>
                <button mat-icon-button class="!w-7 !h-7 text-[var(--red)]" (click)="deleteStudent(s)">
                  <mat-icon class="!text-sm">delete</mat-icon>
                </button>
              </div>

            </div>
          }
        </div>
      }

    </div>
  `
})
export class StudentsTabComponent {
  @Input({ required: true }) course!: Course;
<<<<<<< HEAD
  @Output() courseChanged = new EventEmitter<void>();
=======
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598

  readonly showAddForm = signal(false);
  readonly editingId = signal<number | null>(null);
  search = '';
<<<<<<< HEAD
  stuForm = { first: '', last: '', code: '', sem: '2026-I', email: '' };
=======
  sems = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  stuForm = { first: '', last: '', code: '', sem: 'I', email: '' };
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598

  filteredStudents() {
    const q = this.search.toLowerCase();
    return this.course.students.filter(s =>
      !q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
    );
  }

  constructor(
    readonly data: DataService,
<<<<<<< HEAD
    private api: DataServiceBackend,
=======
    private auth: AuthService,
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  stuPct(id: number): number { return this.data.calcStuPctFor(this.course, id); }
  isAtRisk(id: number): boolean { return this.course.sessions.length > 0 && this.stuPct(id) < this.course.minatt; }
  avColor(i: number) { return this.data.getAvatarColors(i); }
  initials(n: string) { return this.data.getInitials(n); }

  editStudent(s: Student): void {
    const parts = s.name.split(' ');
    const half = Math.ceil(parts.length / 2);
    this.stuForm = {
      first: parts.slice(0, half).join(' '),
      last: parts.slice(half).join(' '),
      code: s.code === '—' ? '' : s.code,
      sem: s.sem,
      email: s.email ?? ''
    };
    this.editingId.set(s.id);
    this.showAddForm.set(true);
  }

  cancelForm(): void {
    this.showAddForm.set(false);
    this.editingId.set(null);
<<<<<<< HEAD
    this.stuForm = { first: '', last: '', code: '', sem: '2026-I', email: '' };
=======
    this.stuForm = { first: '', last: '', code: '', sem: 'I', email: '' };
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
  }

  saveStudent(): void {
    if (!this.stuForm.first.trim() || !this.stuForm.last.trim()) {
      this.snack.open('Nombre y apellido requeridos', '', { duration: 2500 });
      return;
    }
<<<<<<< HEAD
=======
    const u = this.auth.currentUser() as Teacher;
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
    const student = {
      name: `${this.stuForm.first.trim()} ${this.stuForm.last.trim()}`,
      code: this.stuForm.code || '—',
      sem: this.stuForm.sem,
      email: this.stuForm.email || undefined
    };
    if (this.editingId()) {
<<<<<<< HEAD
      this.api.updateStudent(this.course.id, this.editingId()!, student).subscribe({
        next: () => {
          this.courseChanged.emit();
          this.snack.open('Estudiante actualizado', '', { duration: 2000 });
          this.cancelForm();
        },
        error: (e) => this.snack.open(e?.message || 'Error al actualizar', '', { duration: 3000 })
      });
    } else {
      this.api.addStudent(this.course.id, student).subscribe({
        next: () => {
          this.courseChanged.emit();
          this.snack.open('Estudiante agregado', '', { duration: 2000 });
          this.cancelForm();
        },
        error: (e) => this.snack.open(e?.message || 'Error al agregar', '', { duration: 3000 })
      });
    }
=======
      this.data.updateStudent(u, this.course.id, this.editingId()!, student);
      this.snack.open('Estudiante actualizado', '', { duration: 2000 });
    } else {
      this.data.addStudent(u, this.course.id, student);
      this.snack.open('Estudiante agregado', '', { duration: 2000 });
    }
    this.auth.refreshUser();
    this.cancelForm();
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
  }

  deleteStudent(s: Student): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar estudiante', message: `¿Eliminar a "${s.name}" del curso?`, confirmLabel: 'Eliminar', danger: true }
    }).afterClosed().subscribe(ok => {
      if (!ok) return;
<<<<<<< HEAD
      this.api.removeStudent(this.course.id, s.id).subscribe({
        next: () => {
          this.courseChanged.emit();
          this.snack.open('Estudiante eliminado', '', { duration: 2000 });
        },
        error: (e) => this.snack.open(e?.message || 'Error al eliminar', '', { duration: 3000 })
      });
=======
      const u = this.auth.currentUser() as Teacher;
      this.data.deleteStudent(u, this.course.id, s.id);
      this.auth.refreshUser();
      this.snack.open('Estudiante eliminado', '', { duration: 2000 });
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
    });
  }

  importCSV(): void {
    this.dialog.open(ImportDialogComponent, { width: '520px' })
<<<<<<< HEAD
      .afterClosed().subscribe((students: Omit<Student, 'id'>[] | undefined) => {
        if (!students?.length) return;
        this.api.importStudents(this.course.id, students).subscribe({
          next: () => {
            this.courseChanged.emit();
            this.snack.open(`${students.length} estudiantes importados`, '', { duration: 2500 });
          },
          error: (e) => this.snack.open(e?.message || 'Error en importación', '', { duration: 3000 })
        });
=======
      .afterClosed().subscribe((students) => {
        if (!students?.length) return;
        const u = this.auth.currentUser() as Teacher;
        this.data.importStudents(u, this.course.id, students);
        this.auth.refreshUser();
        this.snack.open(`${students.length} estudiantes importados`, '', { duration: 2500 });
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
      });
  }
}
