<<<<<<< HEAD
import { Component, Input, computed } from '@angular/core';
=======
import { Component, Input, signal, computed } from '@angular/core';
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../core/services/data.service';
<<<<<<< HEAD
import { Course, AttendanceValue } from '../../../core/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { attKey } from '../../../core/utils/attendance-keys';
=======
import { AuthService } from '../../../core/services/auth.service';
import { Course, AttendanceValue, Teacher } from '../../../core/models';
import { MatSnackBar } from '@angular/material/snack-bar';
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598

interface HistoryRow {
  session: string;
  date: string;
  student: string;
  studentCode: string;
  v: AttendanceValue;
  justReason?: string;
}

@Component({
  selector: 'app-history-tab',
  standalone: true,
  imports: [FormsModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-7">

      <!-- Filters + Export -->
      <div class="flex items-center gap-3 mb-5 flex-wrap justify-between">
        <div class="flex items-center gap-3 flex-wrap">
          <mat-form-field appearance="outline" class="!w-48 !text-sm">
            <mat-label>Estudiante</mat-label>
            <mat-select [(ngModel)]="filterStu" (ngModelChange)="filterStu = $event">
              <mat-option value="">Todos</mat-option>
              @for (s of course.students; track s.id) {
                <mat-option [value]="s.id">{{ s.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="!w-40 !text-sm">
            <mat-label>Estado</mat-label>
            <mat-select [(ngModel)]="filterStatus">
              <mat-option value="">Todos</mat-option>
              <mat-option value="p">Presente</mat-option>
              <mat-option value="t">Tardanza</mat-option>
              <mat-option value="a">Ausente</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="flex gap-2">
          <button mat-stroked-button class="!text-xs !h-9" (click)="exportCSV()">
            <mat-icon class="!text-sm">download</mat-icon>
            CSV
          </button>
          <button mat-stroked-button class="!text-xs !h-9" (click)="exportPDF()">
            <mat-icon class="!text-sm">print</mat-icon>
            PDF
          </button>
        </div>
      </div>

      <!-- Table -->
      @if (rows().length === 0) {
        <div class="empty-state">
          <mat-icon>history</mat-icon>
          <p>Sin registros</p>
          <small>Registra asistencia para ver el historial</small>
        </div>
      } @else {
        <div class="bg-[var(--surface)] border border-[var(--border)] rounded-app overflow-hidden shadow-app">
          <!-- Header -->
          <div class="grid grid-cols-[2fr_2fr_1.5fr_1fr] gap-3 px-4 py-2.5
                      bg-[var(--surface2)] border-b border-[var(--border)]
                      text-[11px] font-bold text-[var(--text3)] uppercase tracking-wide">
            <div>Estudiante</div>
            <div>Grupo</div>
            <div>Fecha</div>
            <div>Estado</div>
          </div>
<<<<<<< HEAD
          @for (r of rows(); track r.session + r.student + r.date) {
=======
          @for (r of rows(); track r.session + r.student) {
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
            <div class="grid grid-cols-[2fr_2fr_1.5fr_1fr] gap-3 px-4 py-3
                        border-b border-[var(--border)] last:border-0
                        hover:bg-[var(--surface2)] transition-colors text-sm">
              <div class="font-semibold">{{ r.student }}</div>
              <div class="text-[var(--text2)] text-xs">{{ r.session }}</div>
              <div class="text-[var(--text3)] text-xs font-mono">{{ data.fmtDate(r.date) }}</div>
              <div class="flex items-center gap-1.5">
                <span [class]="badgeClass(r.v)">{{ label(r.v) }}</span>
                @if (r.justReason) {
                  <span class="att-badge-j text-[9px]">Justif.</span>
                }
              </div>
            </div>
          }
        </div>
      }

    </div>
  `
})
export class HistoryTabComponent {
  @Input({ required: true }) course!: Course;

  filterStu: number | '' = '';
  filterStatus: AttendanceValue | '' = '';

  readonly rows = computed<HistoryRow[]>(() => {
    const rows: HistoryRow[] = [];
    this.course.sessions.forEach(s =>
      this.course.students.forEach(st => {
        if (this.filterStu !== '' && st.id !== this.filterStu) return;
<<<<<<< HEAD
        const key = attKey(st.id, s.id);
=======
        const key = `${s.id}::${st.id}`;
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
        const v = (this.course.att[key] ?? 'p') as AttendanceValue;
        if (this.filterStatus && v !== this.filterStatus) return;
        const just = this.course.justifications[key];
        rows.push({ session: s.name, date: s.date, student: st.name, studentCode: st.code, v, justReason: just?.reason });
      })
    );
    return rows.sort((a, b) => b.date.localeCompare(a.date));
  });

  constructor(
    readonly data: DataService,
<<<<<<< HEAD
=======
    private auth: AuthService,
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
    private snack: MatSnackBar
  ) {}

  badgeClass(v: AttendanceValue): string {
<<<<<<< HEAD
    return v === 'p' ? 'att-badge-p' : v === 't' ? 'att-badge-t' : v === 'a' ? 'att-badge-a' : 'att-badge-j';
  }
  label(v: AttendanceValue): string {
    return v === 'p' ? 'Presente' : v === 't' ? 'Tardanza' : v === 'a' ? 'Ausente' : 'Justificado';
=======
    return v === 'p' ? 'att-badge-p' : v === 't' ? 'att-badge-t' : 'att-badge-a';
  }
  label(v: AttendanceValue): string {
    return v === 'p' ? 'Presente' : v === 't' ? 'Tardanza' : 'Ausente';
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
  }

  exportCSV(): void {
    const c = this.course;
    const headers = ['Estudiante', 'Código', 'Sesión', 'Fecha', 'Estado', 'Justificado', 'Motivo', '% Asistencia'];
    const dataRows: string[][] = [];
    c.sessions.forEach(s => c.students.forEach(st => {
      if (this.filterStu !== '' && st.id !== Number(this.filterStu)) return;
<<<<<<< HEAD
      const key = attKey(st.id, s.id);
=======
      const key = `${s.id}::${st.id}`;
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
      const v = (c.att[key] ?? 'p') as AttendanceValue;
      if (this.filterStatus && v !== this.filterStatus) return;
      const just = c.justifications[key];
      dataRows.push([
        st.name, st.code, s.name, s.date,
        { p: 'Presente', t: 'Tardanza', a: 'Ausente', j: 'Justificado' }[v],
        just ? 'Sí' : 'No',
        just ? just.reason : '',
        this.data.calcStuPctFor(c, st.id) + '%'
      ]);
    }));

    const csv = [headers, ...dataRows]
      .map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `asistencia_${c.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    this.snack.open('CSV exportado', '', { duration: 2000 });
  }

  exportPDF(): void {
    window.print();
    this.snack.open('Enviado a imprimir', '', { duration: 2000 });
  }
}
