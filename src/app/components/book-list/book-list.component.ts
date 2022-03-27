import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { DefaultStore, FireListBaseDataService } from '@bookhistory/shared';
import { getClassName } from '@bookhistory/shared/tools';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { tap } from 'rxjs';
import { BookHistoryStore } from '../book-history/book-history.component';
import { BookHistory } from '../book-history/book-history.models';
import { Book } from './book-list.models';

@Injectable()
export class BookStore<Book> extends DefaultStore<Book> {
  public constructor(
    protected _baseDataService: BookFireListDataService<Book>
  ) {
    super(_baseDataService);
  }
}

@Injectable()
export class BookFireListDataService<
  Book
> extends FireListBaseDataService<Book> {
  public constructor(db: AngularFireDatabase, httpClient: HttpClient) {
    super(getClassName(Book), db, httpClient);
  }
}

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit {
  bookDialog!: boolean;

  book!: Book;

  submitted!: boolean;

  selectedBooks!: Book[];

  loading: boolean = true;

  @ViewChild('dt') table!: Table;

  constructor(
    public bookStore: BookStore<Book>,
    public bookHistoryStore: BookHistoryStore<BookHistory>,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.bookStore
      .getSnapshotChanges()
      .pipe(tap(() => (this.loading = false)))
      .subscribe();

    this.primengConfig.ripple = true;
  }

  onDateSelect(value: any) {
    this.table.filter(this.formatDate(value), 'date', 'equals');
  }

  openNew() {
    this.book = {};
    this.submitted = false;
    this.bookDialog = true;
  }

  hideDialog() {
    this.bookDialog = false;
    this.submitted = false;
  }

  saveBook() {
    this.submitted = true;

    if (this.book.title?.trim()) {
      if (this.book.key) {
        this.updateBook(this.book);
      } else {
        this.createBook(this.book);
      }

      this.bookDialog = false;
      this.book = {};
    }
  }

  updateBook(book: Book) {
    if (book.key) {
      this.bookStore.update(book.key, book).subscribe(() => {
        this.bookHistoryStore.add({
          bookId: book.key,
          timeOfChange: new Date().toLocaleString(),
          change: book.title,
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Book Updated',
          life: 3000,
        });
        this.submitted = true;
      });
    }
  }

  createBook(book: Book) {
    this.book.publishedDate = this.formatDate(book.publishedDate);
    this.bookStore.add(book).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Book Created',
        life: 3000,
      });
      this.submitted = true;
    });
  }

  onEditComplete(book: {
    field: unknown;
    data: Book;
    originalEvent: unknown;
    index: unknown;
  }): void {
    this.updateBook(book.data);
  }

  formatDate(date: any) {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
      month = '0' + month;
    }

    if (day < 10) {
      day = '0' + day;
    }

    return date.getFullYear() + '-' + month + '-' + day;
  }

  clear(table: Table) {
    table.clear();
  }
}
