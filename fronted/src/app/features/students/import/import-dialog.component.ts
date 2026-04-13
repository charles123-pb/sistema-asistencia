import { Component, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Student } from '../../../core/models';

@Component({
  selector: 'app-import-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-6 min-w-[460px]">
      <h2 class="text-base font-bold mb-1">Importar estudiantes</h2>
      <p class="text-xs text-[var(--text2)] mb-4">Carga un archivo CSV con la lista de estudiantes</p>

      <!-- Drop zone -->
      @if (preview().length === 0) {
        <div class="border-2 border-dashed border-[var(--border2)] rounded-app p-10 text-center cursor-pointer
                    hover:bg-[var(--accent-bg)] hover:border-[var(--accent)] transition-all"
             (click)="fileInput.click()"
             (dragover)="$event.preventDefault()"
             (drop)="onDrop($event)">
          <mat-icon class="!text-4xl text-[var(--text3)]">upload_file</mat-icon>
          <p class="text-sm text-[var(--text2)] mt-2">Arrastra tu CSV aquí o haz clic para seleccionar</p>
          <small class="text-xs text-[var(--text3)]">Formato: nombres, apellidos, codigo, semestre, email — máx. 5 MB</small>
        </div>
        <input #fileInput type="file" accept=".csv" class="hidden" (change)="onFile($event)">

        <!-- Format hint -->
        <div class="mt-4">
          <div class="text-[11px] font-bold text-[var(--text3)] uppercase tracking-wide mb-1.5">Formato esperado</div>
          <div class="bg-[var(--surface2)] border border-[var(--border)] rounded-app-sm p-3 font-mono text-xs text-[var(--text2)] leading-relaxed">
            nombres,apellidos,codigo,semestre,email<br>
            Ana María,Torres Quispe,2024-001,IV,ana@uni.edu.pe
          </div>
        </div>
      }

      <!-- Preview -->
      @if (preview().length > 0) {
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-bold">Vista previa</div>
          <span class="text-xs text-[var(--text3)] bg-[var(--surface2)] border border-[var(--border)] px-2.5 py-1 rounded-full">
            {{ preview().length }} estudiantes
          </span>
        </div>
        <div class="max-h-56 overflow-y-auto flex flex-col gap-1.5 mb-4">
          @for (s of preview(); track s.code) {
            <div class="flex items-center gap-2 py-2 border-b border-[var(--border)] text-sm">
              <mat-icon class="!text-base text-[var(--green)]">check_circle</mat-icon>
              <span class="font-medium">{{ s.name }}</span>
              <span class="text-xs text-[var(--text3)] font-mono ml-auto">{{ s.code }} · Sem. {{ s.sem }}</span>
            </div>
          }
        </div>
        <div class="flex gap-2 justify-end">
          <button mat-button (click)="preview.set([])">Cancelar</button>
          <button mat-flat-button color="primary" (click)="confirm()">
            <mat-icon>download_done</mat-icon>
            Importar {{ preview().length }} estudiantes
          </button>
        </div>
      }

      @if (preview().length === 0) {
        <div class="flex justify-end mt-4">
          <button mat-button mat-dialog-close>Cerrar</button>
        </div>
      }
    </div>
  `
})
export class ImportDialogComponent {

  readonly preview = signal<Omit<Student, 'id'>[]>([]);

  constructor(private ref: MatDialogRef<ImportDialogComponent>) {}

  onFile(ev: Event): void {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (file) this.readFile(file);
  }

  onDrop(ev: DragEvent): void {
    ev.preventDefault();
    const file = ev.dataTransfer?.files[0];
    if (file) this.readFile(file);
  }

  readFile(file: File): void {
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = e => this.parseCSV(e.target?.result as string);
    reader.readAsText(file, 'UTF-8');
  }

  parseCSV(text: string): void {
    const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return;
    const students = lines.slice(1).map(line => {
      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (!cols[0]) return null;
      return {
        name: cols[0] + (cols[1] ? ' ' + cols[1] : ''),
        code: cols[2] || '—',
        sem: cols[3] || 'I',
        email: cols[4] || undefined
      } as Omit<Student, 'id'>;
    }).filter(Boolean) as Omit<Student, 'id'>[];
    this.preview.set(students);
  }

  confirm(): void {
    this.ref.close(this.preview());
  }
}
