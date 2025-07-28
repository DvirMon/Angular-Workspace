import {
  KeyValuePipe,
  NgOptimizedImage,
  TitleCasePipe
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  input,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardImage
} from '@angular/material/card';
import { Router } from '@angular/router';
import { FormatDatePipe } from '../../shared/pipes/formatDate.pipe';
import { MediaResult } from '../../shared/types';
import { AppStore } from '../../store/store';

@Component({
  selector: 'ms-media-info-card',
  standalone: true,
  imports: [
    NgOptimizedImage,
    KeyValuePipe,
    TitleCasePipe,
    FormatDatePipe,
    MatCard,
    MatCardImage,
    MatCardContent,
    MatButton,
  ],
  templateUrl: './media-info-card.component.html',
  styleUrl: './media-info-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaInfoCardComponent {
  #injector = inject(Injector);
  #store = inject(AppStore);

  imdbID = input.required<string>();

  media: WritableSignal<MediaResult> = signal({} as MediaResult);

  content: Signal<Partial<MediaResult>>;

  showImg = signal(true);

  constructor() {
    effect(
      () => {
        this.media.update(() => ({
          ...this.#store.entityMap()[this.imdbID()],
        }));
      },
      { allowSignalWrites: true }
    );

    this.content = computed(() => ({
      Title: this.media().Title,
      Year: this.media().Year,
      Type: this.media().Type,
    }));
  }

  onError() {
    this.showImg.update((value) => !value);
  }

  onReturn() {
    runInInjectionContext(this.#injector, () =>
      inject(Router).navigateByUrl('/')
    );
  }
}
