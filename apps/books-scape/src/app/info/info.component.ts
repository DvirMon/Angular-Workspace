import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'books-scape-f',
  standalone: true,
  imports: [],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent {}
