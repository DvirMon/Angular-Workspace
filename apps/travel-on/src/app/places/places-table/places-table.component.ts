import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'to-places-table',
  standalone: true,
  imports: [],
  templateUrl: './places-table.component.html',
  styleUrl: './places-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlacesTableComponent {}
