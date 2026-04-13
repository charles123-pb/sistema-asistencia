import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Session } from '../../../core/models';

export interface SessionDialogData {
  comp: 't' | 'p';
  mode: 'create' | 'edit';
  session?: Session;
}

@Component({
  selector: 'app-session-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatInputModule, MatSelectModule],
  template: `
    <div class="p-6 min-w-[360px]">
      <h2 class="text-base font-bold mb-4">
        {{ data.mode === 'create' ? 'Nuevo grupo' : 'Editar grupo' }}
      </h2>

      <mat-form-field appearance="outline" class="w-full mb-2">
        <mat-label>Nombre / tema *</mat-label>
        <input matInput [(ngModel)]="form.name" placeholder="Ej: Introducción a punteros">
      </mat-form-field>

      <div class="grid grid-cols-2 gap-3 mb-2">
        <mat-form-field appearance="outline">
          <mat-label>Fecha</mat-label>
          <input matInput type="date" [(ngModel)]="form.date">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Hora</mat-label>
          <input matInput type="time" [(ngModel)]="form.time">
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="w-full mb-4">
        <mat-label>Tipo</mat-label>
        <mat-select [(ngModel)]="form.type">
          <mat-option value="Clase teórica">Clase teórica</mat-option>
          <mat-option value="Práctica de laboratorio">Práctica de laboratorio</mat-option>
          <mat-option value="Evaluación">Evaluación</mat-option>
          <mat-option value="Taller">Taller</mat-option>
          <mat-option value="Exposición">Exposición</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="flex gap-2 justify-end">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="primary" (click)="save()">
          {{ data.mode === 'create' ? 'Crear grupo' : 'Guardar cambios' }}
        </button>
      </div>
    </div>
  `
})
export class SessionDialogComponent {
  form = {
    name: '',
    date: new Date().toISOString().slice(0, 10),
    time: '08:00',
    type: 'Clase teórica',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: SessionDialogData,
    private ref: MatDialogRef<SessionDialogComponent>
  ) {
    this.form = {
      name: this.data.session?.name ?? '',
      date: this.data.session?.date ?? new Date().toISOString().slice(0, 10),
      time: this.data.session?.time ?? '08:00',
      type: this.data.session?.type ?? 'Clase teórica',
    };
  }

  save(): void {
    if (!this.form.name.trim()) return;
    this.ref.close({ ...this.form, comp: this.data.comp });
  }
}
