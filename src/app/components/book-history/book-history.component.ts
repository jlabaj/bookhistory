import { Component, OnInit } from '@angular/core';
import { BookHistory } from './book-history.models';
import { BookHistoryService } from './book-history.service';

@Component({
  selector: 'app-book-history',
  templateUrl: './book-history.component.html',
  styleUrls: ['./book-history.component.scss'],
})
export class BookHistoryComponent implements OnInit {
  booksHistory!: BookHistory[];

  first = 0;

  rows = 10;

  constructor(private bookHistoryService: BookHistoryService) {}

  ngOnInit() {
    // this.bookHistoryService
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.booksHistory
      ? this.first === this.booksHistory.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.booksHistory ? this.first === 0 : true;
  }
}
