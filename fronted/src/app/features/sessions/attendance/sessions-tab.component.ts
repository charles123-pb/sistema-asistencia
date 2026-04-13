<<<<<<< HEAD
import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
=======
import { Component, Input, signal, computed } from '@angular/core';
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
<<<<<<< HEAD
import { DataService } from '../../../core/services/data.service';
import { DataServiceBackend } from '../../../core/services/data-backend.service';
import { Course, Session, AttendanceValue } from '../../../core/models';
import { attKey } from '../../../core/utils/attendance-keys';
=======
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { Course, Session, AttendanceValue, Teacher } from '../../../core/models';
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { JustifyDialogComponent } from '../new-session/justify-dialog.component';
import { SessionDialogComponent } from '../new-session/session-dialog.component';

@Component({
  selector: 'app-sessions-tab',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule, MatInputModule, MatSelectModule],
  template: `
    <div class="p-7">

      <!-- Header -->
      <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div class="flex items-center gap-2">
          <!-- Teoria / Practica toggle -->
          <div class="flex rounded-app-sm overflow-hidden border border-[var(--border)]">
            <button class="px-3 py-1.5 text-xs font-semibold transition-colors"
                    [class.bg-accent-bg]="comp() === 't'"
                    [class.text-accent-DEFAULT]="comp() === 't'"
                    [class.text-text-3]="comp() !== 't'"
                    (click)="comp.set('t')">📘 Teoría</button>
            <button class="px-3 py-1.5 text-xs font-semibold transition-colors border-l border-[var(--border)]"
                    [class.bg-green-50]="comp() === 'p'"
                    [class.text-green-600]="comp() === 'p'"
                    [class.text-text-3]="comp() !== 'p'"
                    (click)="comp.set('p')">🔬 Práctica</button>
          </div>
          <span class="text-xs text-[var(--text3)]">{{ filteredSessions().length }} grupo(s) de {{ comp() === 't' ? 'teoría' : 'práctica' }}</span>
        </div>
        <button mat-flat-button color="primary" class="!text-xs" (click)="newSession()">
          <mat-icon class="!text-sm">add</mat-icon>
          Nuevo grupo
        </button>
      </div>

      <!-- Sessions accordion -->
      @if (filteredSessions().length === 0) {
        <div class="empty-state">
          <mat-icon>event_note</mat-icon>
          <p>Sin grupos de {{ comp() === 't' ? 'teoría' : 'práctica' }}</p>
          <small>Crea el primer grupo para comenzar</small>
        </div>
      } @else {
        <div class="flex flex-col gap-2">
          @for (s of filteredSessions(); track s.id; let i = $index) {
            <div class="bg-[var(--surface)] border border-[var(--border)] rounded-app overflow-hidden">

              <!-- Session row (clickable) -->
              <div class="flex items-center gap-3 p-4 cursor-pointer hover:bg-[var(--surface2)] transition-colors"
                   (click)="toggleSession(s.id)">
                <div class="w-8 h-8 rounded-lg bg-[var(--accent-bg)] text-[var(--accent)]
                            flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {{ i + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-sm">{{ s.name }}</div>
                  <div class="text-xs text-[var(--text2)] mt-0.5">
                    {{ data.fmtDate(s.date) }} · {{ s.time }} · {{ s.type }}
                  </div>
                </div>
                <!-- Summary pills -->
                <div class="hidden sm:flex items-center gap-1.5">
                  <span class="att-badge-p">● {{ countAtt(s, 'p') }} pres.</span>
                  <span class="att-badge-t">● {{ countAtt(s, 't') }} tard.</span>
                  <span class="att-badge-a">● {{ countAtt(s, 'a') }} aus.</span>
                </div>
                <!-- Edit/Delete -->
                <div class="flex gap-1" (click)="$event.stopPropagation()">
                  <button mat-icon-button class="!w-7 !h-7" (click)="editSession(s)">
                    <mat-icon class="!text-sm">edit</mat-icon>
                  </button>
                  <button mat-icon-button class="!w-7 !h-7 text-[var(--red)]" (click)="deleteSession(s)">
                    <mat-icon class="!text-sm">delete</mat-icon>
                  </button>
                </div>
                <mat-icon class="!text-base text-[var(--text3)] transition-transform"
                          [class.rotate-180]="openSessionId() === s.id">
                  expand_more
                </mat-icon>
              </div>

              <!-- Expanded attendance -->
              @if (openSessionId() === s.id) {
                <div class="border-t border-[var(--border)] p-4">

                  @if (course.students.length === 0) {
                    <div class="text-sm text-[var(--text3)] text-center py-4">No hay estudiantes en este curso</div>
                  } @else {
                    <div class="flex flex-col gap-2">
                      @for (st of course.students; track st.id; let si = $index) {
                        <div class="flex items-center gap-3 p-3 rounded-app-sm border border-[var(--border)]
                                    transition-colors"
                             [class.border-danger-DEFAULT]="isAtRisk(st.id)"
                             [class.bg-danger-bg]="isAtRisk(st.id)">

                          <!-- Avatar -->
                          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                               [style.background]="avColor(si).bg" [style.color]="avColor(si).c">
                            {{ initials(st.name) }}
                          </div>

                          <!-- Name -->
                          <div class="flex-1 min-w-0">
                            <div class="text-sm font-semibold">
                              {{ st.name }}
                              @if (isAtRisk(st.id)) { <span class="risk-badge">⚠ {{ stuPct(st.id) }}%</span> }
                            </div>
                            <div class="text-xs text-[var(--text2)]">
                              {{ st.code }}
                              @if (hasJust(s.id, st.id)) {
                                <span class="text-[var(--accent)] font-bold ml-1">· Justificado</span>
                              }
                            </div>
                          </div>

                          <!-- Attendance buttons -->
                          <div class="flex items-center gap-1.5 flex-wrap justify-end">
                            @for (btn of attBtns; track btn.v) {
                              @if (btn.v !== 'j' || getAtt(s.id, st.id) === 'a') {
                                <button
                                  class="px-2.5 py-1 rounded text-xs font-semibold border transition-all"
                                  [ngClass]="getAtt(s.id, st.id) === btn.v
                                    ? btn.selectedClass
                                    : 'border-[var(--border)] text-[var(--text3)] hover:' + btn.hoverClass"
                                  (click)="setAtt(s.id, st.id, btn.v)">
                                  {{ btn.label }}
                                </button>
                              }
                            }
                            <!-- % badge -->
                            <span class="text-xs font-bold font-mono ml-1"
                                  [style.color]="data.attColor(stuPct(st.id), course.minatt)">
                              {{ stuPct(st.id) }}%
                            </span>
                          </div>

                        </div>
                      }
                    </div>
                  }

                </div>
              }

            </div>
          }
        </div>
      }

    </div>
  `,
  styles: [`
    .rotate-180 { transform: rotate(180deg); }
  `]
})
export class SessionsTabComponent {
  @Input({ required: true }) course!: Course;
<<<<<<< HEAD
  @Output() courseChanged = new EventEmitter<void>();
=======
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598

  readonly comp = signal<'t' | 'p'>('t');
  readonly openSessionId = signal<number | null>(null);

  readonly filteredSessions = computed(() =>
    this.course.sessions.filter(s => (s.comp || 't') === this.comp())
  );

  readonly attBtns = [
    { v: 'p' as AttendanceValue, label: 'Presente', selectedClass: 'bg-success-bg border-success-DEFAULT text-success-DEFAULT', hoverClass: 'border-success-DEFAULT' },
    { v: 't' as AttendanceValue, label: 'Tardanza', selectedClass: 'bg-warning-bg border-warning-DEFAULT text-warning-DEFAULT', hoverClass: 'border-warning-DEFAULT' },
    { v: 'a' as AttendanceValue, label: 'Ausente',  selectedClass: 'bg-danger-bg border-danger-DEFAULT text-danger-DEFAULT',   hoverClass: 'border-danger-DEFAULT' },
    { v: 'j' as AttendanceValue, label: 'Justif.',  selectedClass: 'bg-accent-bg border-accent-DEFAULT text-accent-DEFAULT',   hoverClass: 'border-accent-DEFAULT' },
  ];

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

  toggleSession(id: number): void {
    this.openSessionId.update(cur => cur === id ? null : id);
  }

  getAtt(sessId: number, stuId: number): AttendanceValue {
<<<<<<< HEAD
    const k = attKey(stuId, sessId);
    return (this.course.att[k] ?? 'p') as AttendanceValue;
  }

  hasJust(sessId: number, stuId: number): boolean {
    return !!this.course.justifications[attKey(stuId, sessId)];
  }

  setAtt(sessId: number, stuId: number, v: AttendanceValue): void {
    if (v === 'j') {
      const st = this.course.students.find(s => s.id === stuId)!;
      const sess = this.course.sessions.find(s => s.id === sessId)!;
      const existing = this.course.justifications[attKey(stuId, sessId)];
=======
    return (this.course.att[`${sessId}::${stuId}`] ?? 'p') as AttendanceValue;
  }

  hasJust(sessId: number, stuId: number): boolean {
    return !!this.course.justifications[`${sessId}::${stuId}`];
  }

  setAtt(sessId: number, stuId: number, v: AttendanceValue): void {
    const key = `${sessId}::${stuId}`;
    if (v === 'j') {
      const st = this.course.students.find(s => s.id === stuId)!;
      const sess = this.course.sessions.find(s => s.id === sessId)!;
      const existing = this.course.justifications[key];
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
      this.dialog.open(JustifyDialogComponent, {
        data: { studentName: st.name, sessionName: sess.name, existing }
      }).afterClosed().subscribe(result => {
        if (!result) return;
<<<<<<< HEAD
        this.api.recordAttendance(this.course.id, stuId, sessId, 'j').subscribe({
          next: () => {
            this.api.addJustification(this.course.id, stuId, sessId, result).subscribe({
              next: () => {
                this.courseChanged.emit();
                this.snack.open('Justificación registrada', '', { duration: 2000 });
              },
              error: (e) => this.snack.open(e?.message || 'Error al guardar justificación', '', { duration: 3000 })
            });
          },
          error: (e) => this.snack.open(e?.message || 'Error al registrar asistencia', '', { duration: 3000 })
        });
      });
      return;
    }
    this.api.recordAttendance(this.course.id, stuId, sessId, v).subscribe({
      next: () => {
        this.courseChanged.emit();
      },
      error: (e) => this.snack.open(e?.message || 'No se pudo guardar', '', { duration: 3000 })
    });
=======
        const u = this.auth.currentUser() as Teacher;
        this.data.saveJustification(u, this.course.id, key, result);
        this.auth.refreshUser();
      });
      return;
    }
    const u = this.auth.currentUser() as Teacher;
    this.data.setAttendance(u, this.course.id, key, v);
    this.auth.refreshUser();
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
  }

  stuPct(stuId: number): number {
    return this.data.calcStuPctFor(this.course, stuId);
  }

  isAtRisk(stuId: number): boolean {
    return this.course.sessions.length > 0 && this.stuPct(stuId) < this.course.minatt;
  }

  countAtt(s: Session, v: AttendanceValue): number {
    return this.course.students.filter(st => this.getAtt(s.id, st.id) === v).length;
  }

  avColor(i: number) { return this.data.getAvatarColors(i); }
  initials(n: string) { return this.data.getInitials(n); }

  newSession(): void {
    this.dialog.open(SessionDialogComponent, {
      data: { comp: this.comp(), mode: 'create' }
    }).afterClosed().subscribe(result => {
      if (!result) return;
<<<<<<< HEAD
      this.api.createSession(this.course.id, {
        name: result.name,
        date: result.date,
        time: result.time,
        type: result.type,
        comp: result.comp
      }).subscribe({
        next: () => {
          this.courseChanged.emit();
          this.snack.open('Grupo creado', '', { duration: 2000 });
        },
        error: (e) => this.snack.open(e?.message || 'Error al crear grupo', '', { duration: 3000 })
      });
=======
      const u = this.auth.currentUser() as Teacher;
      this.data.createSession(u, this.course.id, result);
      this.auth.refreshUser();
      this.snack.open('Grupo creado', '', { duration: 2000 });
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
    });
  }

  editSession(s: Session): void {
    this.dialog.open(SessionDialogComponent, {
<<<<<<< HEAD
      data: { comp: (s.comp as 't' | 'p') || 't', mode: 'edit', session: s }
    }).afterClosed().subscribe(result => {
      if (!result) return;
      this.api.updateSession(this.course.id, s.id, {
        name: result.name,
        date: result.date,
        time: result.time,
        type: result.type,
        comp: result.comp
      }).subscribe({
        next: () => {
          this.courseChanged.emit();
          this.snack.open('Grupo actualizado', '', { duration: 2000 });
        },
        error: (e) => this.snack.open(e?.message || 'Error al actualizar', '', { duration: 3000 })
      });
=======
      data: { comp: this.comp(), mode: 'edit', session: s }
    }).afterClosed().subscribe(result => {
      if (!result) return;
      const u = this.auth.currentUser() as Teacher;
      this.data.updateSession(u, this.course.id, s.id, result);
      this.auth.refreshUser();
      this.snack.open('Grupo actualizado', '', { duration: 2000 });
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
    });
  }

  deleteSession(s: Session): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar grupo', message: `¿Eliminar "${s.name}"?`, confirmLabel: 'Eliminar', danger: true }
    }).afterClosed().subscribe(ok => {
      if (!ok) return;
<<<<<<< HEAD
      this.api.deleteSession(this.course.id, s.id).subscribe({
        next: () => {
          this.courseChanged.emit();
          this.snack.open('Grupo eliminado', '', { duration: 2000 });
        },
        error: (e) => this.snack.open(e?.message || 'Error al eliminar', '', { duration: 3000 })
      });
=======
      const u = this.auth.currentUser() as Teacher;
      this.data.deleteSession(u, this.course.id, s.id);
      this.auth.refreshUser();
      this.snack.open('Grupo eliminado', '', { duration: 2000 });
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
    });
  }
}
