import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { DefaultStore, FireListBaseDataService } from '@bookhistory/shared';
import { getClassName } from '@bookhistory/shared/tools';
import { BookHistory } from './book-history.models';

@Injectable()
export class BookHistoryStore<BookHistory> extends DefaultStore<BookHistory> {
  public constructor(
    protected _baseDataService: BookHistoryFireListDataService<BookHistory>
  ) {
    super(_baseDataService);
  }
}

@Injectable()
export class BookHistoryFireListDataService<
  Book
> extends FireListBaseDataService<Book> {
  public constructor(db: AngularFireDatabase, httpClient: HttpClient) {
    super(getClassName(BookHistory), db, httpClient);
  }
}

@Component({
  selector: 'app-book-history',
  templateUrl: './book-history.component.html',
  styleUrls: ['./book-history.component.scss'],
})
export class BookHistoryComponent implements OnInit {
  booksHistory!: BookHistory[];

  first = 0;

  rows = 10;

  constructor(public bookHistoryStore: BookHistoryStore<BookHistory>) {}

  ngOnInit() {
    this.bookHistoryStore.getAll();
    // .pipe(tap(() => (this.loading = false)))
    // .subscribe();
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
