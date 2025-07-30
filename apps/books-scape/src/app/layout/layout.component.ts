import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
  input,
} from '@angular/core';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { AppStore } from '../store/store';

@Component({
  selector: 'books-scape-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    TitleCasePipe,
    UpperCasePipe,
    MatToolbarModule,
    MatButton,
    MatSidenav,
    MatNavList,
    MatListItem,
    MatSidenavContent,
    MatSidenavContainer,
    MatIconModule,
    MatIconButton,
    MatBadgeModule
],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
  
export class LayoutComponent {
  #store = inject(AppStore);

  showNavigation = input<boolean>(true);
  showShopping = input<boolean>(true);
  showBookshelf = input<boolean>(false);

  public readonly routes: string[] = ['filters', 'table'];

  public readonly title : string  = 'the books scape';

  public readonly shelfSize: Signal<string> = this.#store.shelfSize;
}
