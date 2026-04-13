import { Component, computed, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { AuthServiceBackend } from '../../../core/services/auth-backend.service';
import { DataServiceBackend } from '../../../core/services/data-backend.service';
<<<<<<< HEAD
import { DataService } from '../../../core/services/data.service';
=======
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
import { AttRingComponent } from '../../../shared/components/att-ring/att-ring.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { COLORS, ICONS, Course } from '../../../core/models';

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, AttRingComponent],
  template: `
    <div class="p-7 pb-10 fade-in">

      <!-- Page header -->
      <div class="page-header">
        <div>
          <h1>Mis cursos</h1>
          <p>Semestre 2025-I · {{ courses().length }} curso{{ courses().length !== 1 ? 's' : '' }} activo{{ courses().length !== 1 ? 's' : '' }}</p>
        </div>
        <div class="flex gap-2">
          <button mat-flat-button color="primary"
                  class="!rounded-app-sm !text-sm !font-medium flex items-center gap-1.5"
                  (click)="router.navigate(['/courses/new'])">
            <mat-icon class="!text-base">add</mat-icon>
            Nuevo curso
          </button>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">

        @for (c of courses(); track c.id) {
          <div class="bg-[var(--surface)] rounded-app border border-[var(--border)] shadow-app
                      overflow-hidden cursor-pointer group transition-all duration-200
                      hover:-translate-y-0.5 hover:border-[var(--border2)] hover:shadow-app-md"
               (click)="openCourse(c.id)">

            <!-- Color stripe -->
            <div class="h-1.5" [style.background]="color(c).s"></div>

            <div class="p-[18px]">
              <!-- Header row -->
              <div class="flex items-start justify-between mb-3.5">
                <div class="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center text-xl"
                     [style.background]="color(c).bg" [style.color]="color(c).ic">
                  {{ icon(c) }}
                </div>
                <!-- Actions (show on hover) -->
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button mat-icon-button class="!w-7 !h-7"
                          (click)="$event.stopPropagation(); editCourse(c.id)"
                          matTooltip="Editar curso">
                    <mat-icon class="!text-sm">edit</mat-icon>
                  </button>
                  <button mat-icon-button class="!w-7 !h-7 text-[var(--red)]"
                          (click)="$event.stopPropagation(); deleteCourse(c)"
                          matTooltip="Eliminar curso">
                    <mat-icon class="!text-sm">delete</mat-icon>
                  </button>
                </div>
              </div>

              <div class="text-[15px] font-semibold tracking-tight mb-0.5">{{ c.name }}</div>
              <div class="text-[11px] text-[var(--text3)] font-mono">{{ c.code }}</div>

              <!-- Attendance ring -->
              <div class="flex items-center gap-3 mt-4 pt-3.5 border-t border-[var(--border)]">
                <app-att-ring [pct]="avg(c)" [color]="attColor(c)" [size]="44" />
                <div class="flex-1 min-w-0">
                  <div class="text-lg font-semibold tracking-tight leading-none"
                       [style.color]="attColor(c)">{{ avg(c) }}%</div>
                  <div class="text-[11px] text-[var(--text3)] mt-0.5">asistencia promedio</div>
                  <div class="flex gap-3 mt-2">
                    <span class="text-[11px] text-[var(--text2)] flex items-center gap-1">
                      <mat-icon class="!text-[11px] text-[var(--text3)]">person</mat-icon>
                      {{ c.students.length || 0 }} est.
                    </span>
                    <span class="text-[11px] text-[var(--text2)] flex items-center gap-1">
                      <mat-icon class="!text-[11px] text-[var(--text3)]">bar_chart</mat-icon>
                      {{ c.sessions.length || 0 }} ses.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        }

        <!-- Add card -->
        <div class="bg-[var(--surface)] rounded-app border-2 border-dashed border-[var(--border2)]
                    flex flex-col items-center justify-center gap-2.5 p-10 cursor-pointer min-h-[190px]
                    hover:bg-[var(--accent-bg)] hover:border-[var(--accent)] transition-all"
             (click)="router.navigate(['/courses/new'])">
          <div class="w-11 h-11 rounded-full border-2 border-dashed border-[var(--border2)]
                      flex items-center justify-center bg-[var(--surface)]
                      group-hover:border-[var(--accent)] transition-colors">
            <mat-icon class="text-[var(--accent)]">add</mat-icon>
          </div>
          <b class="text-[13px] font-semibold text-[var(--accent)]">Crear nuevo curso</b>
          <small class="text-xs text-[var(--text3)]">Agrega un curso al semestre</small>
        </div>

      </div>
    </div>
  `
})
export class CoursesListComponent {

  private auth = inject(AuthServiceBackend);
  private data = inject(DataServiceBackend);
<<<<<<< HEAD
  private dataUtil = inject(DataService);
=======
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598

  private courses$ = toObservable(this.auth.currentUser).pipe(
    switchMap(() => this.data.getCourses())
  );
  courses = signal<Course[]>([]);

  constructor(
    readonly router: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {
    this.courses$.subscribe(courses => this.courses.set(courses));
  }

  color(c: Course) { return COLORS[c.color ?? 0] ?? COLORS[0]; }
  icon(c: Course)  { return ICONS[c.icon ?? 0] ?? '📚'; }
<<<<<<< HEAD
  avg(c: Course)   { return this.dataUtil.calcAvg(c); }
  attColor(c: Course) { return this.dataUtil.attColor(this.avg(c), c.minatt); }
=======
  avg(c: Course)   { return 0; }
  attColor(c: Course) { return '#22c55e'; }
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598

  openCourse(id: number): void {
    this.router.navigate(['/courses', id]);
  }

  editCourse(id: number): void {
    this.router.navigate(['/courses', id], { queryParams: { tab: 'settings' } });
  }

  deleteCourse(c: Course): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar curso',
        message: `¿Eliminar "${c.name}"? Se borrarán todas sus sesiones y registros.`,
        confirmLabel: 'Eliminar',
        danger: true
      }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.data.deleteCourse(c.id).subscribe({
        next: () => {
          this.courses.set(this.courses().filter(course => course.id !== c.id));
          this.snack.open('Curso eliminado', '', { duration: 2500 });
        }
      });
    });
  }
}
