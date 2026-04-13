import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { DataServiceBackend } from '../../../core/services/data-backend.service';
import { Course, COLORS, ICONS } from '../../../core/models';
import { SessionsTabComponent } from '../../sessions/attendance/sessions-tab.component';
import { StudentsTabComponent } from '../../students/list/students-tab.component';
import { HistoryTabComponent } from '../../sessions/attendance/history-tab.component';
import { CourseSettingsComponent } from '../settings/course-settings.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    MatTabsModule, MatIconModule, MatButtonModule,
    SessionsTabComponent, StudentsTabComponent, HistoryTabComponent, CourseSettingsComponent
  ],
  template: `
    @if (course()) {
      <div class="fade-in">

        <!-- Course Banner -->
        <div class="bg-[var(--surface)] border-b border-[var(--border)] px-7 py-5 shadow-sm">

          <!-- Breadcrumb -->
          <div class="flex items-center gap-1.5 text-xs text-[var(--text3)] mb-4">
            <span class="text-[var(--accent)] font-medium cursor-pointer hover:underline"
                  (click)="router.navigate(['/courses'])">Inicio</span>
            <mat-icon class="!text-xs">chevron_right</mat-icon>
            <span>{{ course()!.name }}</span>
          </div>

          <div class="flex items-start gap-4 flex-wrap">

            <!-- Icon -->
            <div class="w-[50px] h-[50px] rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                 [style.background]="color().bg" [style.color]="color().ic">
              {{ icon() }}
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <h2 class="text-xl font-bold tracking-tight">{{ course()!.name }}</h2>
              <p class="text-sm text-[var(--text2)] mt-0.5">
                {{ course()!.code }} · Sección {{ course()!.sec }} · {{ course()!.sem }} · {{ course()!.credits }} créd.
              </p>

<!-- Attendance bar -->
              <div class="flex items-center gap-2 mt-3 max-w-xs">
                <div class="flex-1 h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                  <div class="h-full rounded-full transition-all"
                       [style.width.%]="avg()" [style.background]="attColor()"></div>
                </div>
                <span class="text-sm font-bold font-mono" [style.color]="attColor()">{{ avg() }}%</span>
                <span class="text-xs text-[var(--text3)]">asist. · mín. {{ course()!.minatt }}%</span>
              </div>
            </div>

            <!-- Stats -->
            <div class="flex gap-4 flex-shrink-0">
              <div class="text-center">
                <div class="text-xl font-bold">{{ course()!.students.length }}</div>
                <div class="text-xs text-[var(--text3)]">Estudiantes</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold">{{ course()!.sessions.length }}</div>
                <div class="text-xs text-[var(--text3)]">Grupos</div>
              </div>
            </div>

          </div>
        </div>

        <!-- Tabs -->
        <mat-tab-group [(selectedIndex)]="selectedTabIndex"
                       class="course-tabs"
                       animationDuration="150ms">
          <mat-tab label="Sesiones">
            <app-sessions-tab [course]="course()!" (courseChanged)="reloadCourse()" />
          </mat-tab>
          <mat-tab label="Estudiantes">
            <app-students-tab [course]="course()!" (courseChanged)="reloadCourse()" />
          </mat-tab>
          <mat-tab label="Historial">
            <app-history-tab [course]="course()!" />
          </mat-tab>
          <mat-tab label="Configuración">
            <app-course-settings [course]="course()!" (courseChanged)="reloadCourse()" />
          </mat-tab>
        </mat-tab-group>

      </div>
    } @else if (loadError()) {
      <div class="p-7 text-[var(--text3)]">{{ loadError() }}</div>
    } @else {
      <div class="p-7 text-[var(--text3)]">Cargando…</div>
    }
  `,
  styles: [`
    ::ng-deep .course-tabs .mat-mdc-tab-header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 0 28px;
    }
    ::ng-deep .course-tabs .mat-mdc-tab-body-wrapper {
      background: var(--bg);
    }
  `]
})
export class CourseDetailComponent implements OnInit, OnDestroy {

  readonly course = signal<Course | undefined>(undefined);
  readonly loadError = signal<string | null>(null);

  selectedTabIndex = 0;

  private courseId = 0;
  private sub = new Subscription();

  constructor(
    readonly router: Router,
    private route: ActivatedRoute,
    readonly data: DataService,
    private dataBackend: DataServiceBackend,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.route.paramMap.subscribe(params => {
        this.courseId = Number(params.get('id'));
        this.applyTabQuery();
        this.loadCourse();
      })
    );
    this.sub.add(
      this.route.queryParamMap.subscribe(() => this.applyTabQuery())
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private applyTabQuery(): void {
    const tab = this.route.snapshot.queryParamMap.get('tab');
    if (tab === 'settings') {
      this.selectedTabIndex = 3;
    }
  }

  reloadCourse(): void {
    if (!this.courseId || Number.isNaN(this.courseId)) return;
    this.dataBackend.getCourse(this.courseId).subscribe({
      next: (c) => {
        this.course.set(this.normalizeCourse(c));
        this.loadError.set(null);
      },
      error: (err) => {
        const msg = err?.message || 'No se pudo actualizar el curso';
        this.snack.open(msg, '', { duration: 3000 });
      }
    });
  }

  private loadCourse(): void {
    if (!this.courseId || Number.isNaN(this.courseId)) {
      this.course.set(undefined);
      this.loadError.set('Curso no encontrado');
      return;
    }
    this.loadError.set(null);
    this.course.set(undefined);
    this.dataBackend.getCourse(this.courseId).subscribe({
      next: (c) => {
        this.course.set(this.normalizeCourse(c));
        this.loadError.set(null);
      },
      error: (err) => {
        const msg = err?.message === 'Recurso no encontrado' || err?.status === 404
          ? 'Curso no encontrado'
          : (err?.message || 'No se pudo cargar el curso');
        this.loadError.set(msg);
        this.course.set(undefined);
        if (err?.status !== 404) {
          this.snack.open(msg, '', { duration: 3000 });
        }
      }
    });
  }

  private normalizeCourse(c: Course): Course {
    return {
      ...c,
      students: c.students ?? [],
      sessions: c.sessions ?? [],
      att: c.att ?? {},
      justifications: c.justifications ?? {}
    };
  }

  color()  { const c = this.course(); return c ? (COLORS[c.color] ?? COLORS[0]) : COLORS[0]; }
  icon()   { const c = this.course(); return c ? (ICONS[c.icon] ?? '📚') : '📚'; }
  avg()    { const c = this.course(); return c ? this.data.calcAvg(c) : 0; }

  attColor() { const c = this.course(); return c ? this.data.attColor(this.avg(), c.minatt) : '#2F9E44'; }
}
