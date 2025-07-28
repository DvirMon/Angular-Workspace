import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'to-edit-places-form',
  standalone: true,
  imports: [],
  templateUrl: './edit_places_form.component.html',
  styleUrl: './edit_places_form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPlacesFormComponent {}
