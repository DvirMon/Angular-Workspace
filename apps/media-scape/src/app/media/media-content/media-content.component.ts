import {
  NgClass,
  NgTemplateOutlet,
  TitleCasePipe
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
  computed,
  inject,
} from '@angular/core';
import { PluralizePipe } from '../../shared/pipes/pluralize.pipe copy';
import { MediaItem, MediaResult, MediaType } from '../../shared/types';
import { AppStore } from '../../store/store';
import { MediaLayoutService } from '../layout.service';
import { MediaCardComponent } from '../media-card/media-card.component';

@Component({
  selector: 'ms-media-content',
  standalone: true,
  imports: [
    NgClass,
    NgTemplateOutlet,
    TitleCasePipe,
    PluralizePipe,
    MediaCardComponent,
  ],
  templateUrl: './media-content.component.html',
  styleUrl: './media-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaContentComponent implements OnInit {
  #store = inject(AppStore);
  #layoutService = inject(MediaLayoutService);

  media: Signal<MediaItem[]>;
  mediaItem: Signal<MediaItem>;
  mediaType: Signal<MediaType>;
  hasFilterType: Signal<boolean>;
  isList: Signal<boolean>;

  constructor() {
    this.media = this.#store.media;

    this.mediaType = this.#store.type;

    this.hasFilterType = computed(() => !!this.mediaType());

    this.mediaItem = computed(
      () =>
        this.#store
          .media()
          .find((item) => item.type === this.mediaType()) as MediaItem
    );

    this.isList = this.#layoutService.getIsList();
  }

  ngOnInit(): void {
    this.#store.loadMedia();
  }

  onValueChanged(event: MediaResult) {
    this.#store.updateMedia(event);
  }
}
