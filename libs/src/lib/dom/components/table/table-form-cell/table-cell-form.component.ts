import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'dom-table-form-cell',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
],
  templateUrl: './table-cell-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableFormCellComponent {
  // public readonly group = input.required<FormGroup>();
  // public readonly columnDef = input.required<string>();
  // public readonly type = input.required<string>();
}
