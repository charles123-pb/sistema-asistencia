import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-att-ring',
  standalone: true,
  template: `
    <div class="relative" [style.width.px]="size" [style.height.px]="size">
      <svg [attr.viewBox]="viewBox"
           [style.width.px]="size" [style.height.px]="size"
           style="transform:rotate(-90deg);display:block">
        <circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="r"
                stroke="var(--border)" [attr.stroke-width]="sw" fill="none"/>
        <circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="r"
                [attr.stroke]="color" [attr.stroke-width]="sw" fill="none"
                stroke-linecap="round"
                [attr.stroke-dasharray]="circ"
                [attr.stroke-dashoffset]="offset"/>
      </svg>
      <div class="absolute inset-0 flex items-center justify-center font-mono font-bold"
           [style.font-size.px]="size * 0.18"
           [style.color]="color">
        {{ pct }}%
      </div>
    </div>
  `
})
export class AttRingComponent implements OnChanges {
  @Input() pct = 0;
  @Input() color = '#2F9E44';
  @Input() size = 44;

  r = 15; sw = 3.5;
  cx = 0; cy = 0;
  circ = 0; offset = 0;
  viewBox = '';

  ngOnChanges(): void {
    this.r  = this.size * 0.35;
    this.sw = this.size * 0.09;
    this.cx = this.size / 2;
    this.cy = this.size / 2;
    this.circ  = 2 * Math.PI * this.r;
    this.offset = this.circ * (1 - this.pct / 100);
    this.viewBox = `0 0 ${this.size} ${this.size}`;
  }
}
