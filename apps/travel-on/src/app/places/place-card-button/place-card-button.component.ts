import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  input,
  output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Observable, delay, map, merge, skip } from 'rxjs';

export interface ButtonSelectionChangedEvent {
  /** The source button of the event. */
  source: PlaceCardButtonComponent;
  /** The new `selected` value of the button. */
  selected: boolean;
}

export enum SelectState {
  DEFAULT = 'default',
  CHANGED = 'changeState',
  SELECTED = 'selected',
}

@Component({
  selector: 'to-place-card-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './place-card-button.component.html',
  styleUrls: ['./place-card-button.component.scss'],
  animations: [
    trigger('iconAnimation', [
      state(
        'default',
        style({
          transform: 'scale(1)',
          color: '#707070',
        })
      ),
      state(
        'changeState',
        style({
          transform: 'scale(1.2)',
          color: '#707070',
        })
      ),
      state(
        'selected',
        style({
          transform: 'scale(1)',
          color: '#f73282',
        })
      ),
      transition('default <=> changeState', animate('0.1s ease')),
      transition('selected <=> changeState', animate('0.1s ease')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceCardButtonComponent {
  #clickEvent: BehaviorSubject<SelectState>;
  protected readonly isSelected: Signal<SelectState>;
  protected readonly iconState: Signal<SelectState | undefined>;

  selected = input.required<boolean>();

  readonly changed = output<ButtonSelectionChangedEvent>();

  constructor() {
    this.isSelected = computed(() => {
      return this.selected() ? SelectState.SELECTED : SelectState.DEFAULT;
    });

    this.#clickEvent = new BehaviorSubject<SelectState>(SelectState.DEFAULT);

    this.iconState = toSignal(this.#getIconState$());
  }

  #getIconState$(): Observable<SelectState> {
    return merge(this.#getChangeState$(), this.#getSelectedState$());
  }

  #getChangeState$(): Observable<SelectState> {
    return this.#clickEvent.asObservable().pipe(
      skip(1),
      map(() => SelectState.CHANGED)
    );
  }

  #getSelectedState$(): Observable<SelectState> {
    return this.#clickEvent.asObservable().pipe(
      skip(1),
      delay(300),
      map((state: SelectState) => state === SelectState.SELECTED),
      map((selected: boolean) =>
        selected ? SelectState.DEFAULT : SelectState.SELECTED
      )
    );
  }

  public onButtonClick(currentState: SelectState | undefined): void {
    if (currentState === undefined) {
      currentState = this.isSelected();
    }

    if (currentState === SelectState.CHANGED) {
      return;
    }

    this.#clickEvent.next(currentState);

    const newState = this.#calculateNewState(currentState);
    this.#handleChangeEvent(newState);
  }

  #calculateNewState(currentState: string): SelectState {
    return currentState === SelectState.DEFAULT
      ? SelectState.SELECTED
      : SelectState.DEFAULT;
  }

  #handleChangeEvent(newState: SelectState): void {
    const event = this.#createChangeEvent(newState);
    this.#emitChangeEvent(event);
  }

  #emitChangeEvent(event: ButtonSelectionChangedEvent): void {
    this.changed.emit(event);
  }

  #createChangeEvent(newState: SelectState): ButtonSelectionChangedEvent {
    const event: ButtonSelectionChangedEvent = {
      source: this,
      selected: newState !== SelectState.DEFAULT,
    };
    return event;
  }
}
