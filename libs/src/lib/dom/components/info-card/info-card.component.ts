import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'dom-info-card',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <section class="info-card-wrapper">
      <mat-icon color="primary">{{ icon }}</mat-icon>
      <span class="info-card-text">{{ text }}</span>
    </section>
  `,

  styles: ``,
})
export class InfoCardComponent {
  @Input() text!: string;
  @Input() icon = 'attach_email'; // Default icon value if not provided
}
