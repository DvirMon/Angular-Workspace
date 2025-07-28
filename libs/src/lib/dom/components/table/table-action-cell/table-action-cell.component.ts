import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
  computed,
  input,
  output
} from '@angular/core';


import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// export interface ButtonActionState {
//   editState?: ActionState;
//   deleteState?: ActionState;
// }

@Component({
  selector: 'dom-table-actions-cell',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatSlideToggleModule
],
  templateUrl: './table-action-cell.component.html',
  styleUrls: ['./table-action-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableActionCellComponent implements OnInit {
  icon = input<string>('');
  tooltip = input<string>('');
  text = input<string>('');

  isDisabled = input<boolean>(false);

  isIconButton!: Signal<boolean>;

  actionClicked = output<void>();

  ngOnInit(): void {
    this.isIconButton = computed(() => !!this.icon());
  }

  onActionButtonClick(): void {
    this.actionClicked.emit();
  }
}
