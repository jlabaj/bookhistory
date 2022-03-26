import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { Book } from './book-list.models';
import { BookService } from './bookservice';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit {
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  bookDialog!: boolean;

  book!: Book;

  submitted!: boolean;

  books!: Book[];

  selectedBooks!: Book[];

  loading: boolean = true;

  @ViewChild('dt') table!: Table;

  constructor(
    private bookService: BookService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // this.bookService.getBooksStatic().then(books => {
    //     this.books = books;
    //     this.loading = false;
    // });

    this.bookService
      .getAll()
      .valueChanges()
      // .pipe(
      //   map((changes) =>
      //     changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
      //   )
      // )
      .subscribe((data) => {
        this.books = data;
        this.loading = false;
      });

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
      if (this.book.id) {
        this.bookService.update(this.book.id, this.book).then(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Book Created',
            life: 3000,
          });
          this.submitted = true;
          this.refreshList.emit();
        });
        // this.books[this.findIndexById(this.book.id)] = this.book;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Book Updated',
          life: 3000,
        });
      } else {
        this.book.id = this.createId();
        this.book.publishedDate = this.formatDate(this.book.publishedDate);
        // this.books.push(this.book);
        this.bookService.create(this.book).then(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Book Created',
            life: 3000,
          });
          this.submitted = true;
          this.refreshList.emit();
        });
      }

      // this.books = [...this.books];
      this.bookDialog = false;
      this.book = {};
    }
  }

  createId(): string {
    let id = '';
    var chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.books.length; i++) {
      if (this.books[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
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
}
