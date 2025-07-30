
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Book } from '../../books/books';

@Component({
  selector: 'books-scape-bookshelf-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatCardImage,
    MatIconButton,
    MatIcon
],
  templateUrl: './bookshelf-card.component.html',
  styleUrl: './bookshelf-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookshelfCardComponent {
  book = input.required<Book>();

  clearFromShelf = output<Book>();

  onClear() {
    this.clearFromShelf.emit(this.book());
  }
}
