import { Component, input } from '@angular/core';

import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';

import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'ms-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [
    TitleCasePipe,
    MatToolbar,
    MatSidenav,
    MatSidenavContent,
    MatSidenavContainer,
  ],
})
export class LayoutComponent {
  showNavigation = input<boolean>(false);
  showShopping = input<boolean>(true);

  protected readonly title: string = 'the media scape';
}
