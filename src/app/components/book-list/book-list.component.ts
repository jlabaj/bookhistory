import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DefaultStore, FireListBaseDataService } from '@bookhistory/shared';
import { getClassName } from '@bookhistory/shared/tools';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig
} from 'primeng/api';
import { map, Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { BookHistoryStore } from '../book-history/book-history.component';
import { BookHistory } from '../book-history/book-history.models';
import { Book } from './book-list.models';
import { ConfirmationDialog } from './confirmation-dialog.component';


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
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['select', 'key', 'isbn', 'title', 'genre', 'description', 'publishedDate', 'authors'];
  selection = new SelectionModel<Book>(true, []);
  dataSource: MatTableDataSource<Book> = new MatTableDataSource<Book>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  bookDialog!: boolean;

  book!: Book;

  submitted!: boolean;

  selectedBooks!: Book[];

  private subs = new SubSink();

  public booksAsMatTableDataSource$!: Observable<MatTableDataSource<Book>>;

  constructor(
    public bookStore: BookStore<Book>,
    public bookHistoryStore: BookHistoryStore<BookHistory>,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
  ) {
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit() {

    this.booksAsMatTableDataSource$ =
    this.bookStore
      .getSnapshotChanges().pipe(
      map(books => {
        const dataSource = this.dataSource;
        dataSource.data = books;
        return dataSource;
    }));
  }  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openNew() {
        this.book = {};
        this.submitted = false;
        this.bookDialog = true;
      }

  openDialog(): void {
    this.dialog.open(ConfirmationDialog, {
      width: '250px',
    } as MatDialogConfig);
  }
    
  // hideDialog() {
  //   this.bookDialog = false;
  //   this.submitted = false;
  // }

  // saveBook() {
  //   this.submitted = true;

  //   if (this.book.title?.trim()) {
  //     if (this.book.key) {
  //       this.updateBook(this.book);
  //     } else {
  //       this.createBook(this.book);
  //     }

  //     this.bookDialog = false;
  //     this.book = {};
  //   }
  // }

  // updateBook(book: Book, fieldName: string = '') {
  //   if (book.key) {
  //     const valueChanged =
  //       (this.bookEditInit as any)[fieldName] !== (book as any)[fieldName];
  //     if (valueChanged) {
  //       this.subs.unsubscribe();
  //       this.subs.sink = this.bookStore.update(book.key, book).subscribe(() => {
  //         this.bookHistoryStore.add({
  //           bookId: book.key,
  //           isbn: book.isbn,
  //           timeOfChange: new Date().toLocaleString(),
  //           change: `${fieldName} was changed to ${(book as any)[fieldName]}`,
  //         });
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Successful',
  //           detail: 'Book Updated',
  //           life: 3000,
  //         });
  //         this.submitted = true;
  //       });
  //     }
  //   }
  // }

  // createBook(book: Book) {
  //   this.subs.unsubscribe();
  //   this.book.publishedDate = this.formatDate(book.publishedDate);
  //   this.subs.sink = this.bookStore.add(book).subscribe(() => {
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Successful',
  //       detail: 'Book Created',
  //       life: 3000,
  //     });
  //     this.submitted = true;
  //   });
  // }

  // onEditComplete(book: {
  //   field: unknown;
  //   data: Book;
  //   originalEvent: unknown;
  //   index: unknown;
  // }): void {
  //   this.updateBook(book.data, book.field as string);
  // }

  // onEditInit(book: { data: Book }): void {
  //   this.bookEditInit = JSON.parse(JSON.stringify(book.data));
  // }

  // formatDate(date: any) {
  //   let month = date.getMonth() + 1;
  //   let day = date.getDate();

  //   if (month < 10) {
  //     month = '0' + month;
  //   }

  //   if (day < 10) {
  //     day = '0' + day;
  //   }

  //   return `${day}.${month}.${date.getFullYear()}`;
  // }

  // clear(table: Table) {
  //   table.clear();
  //   this.publishedDateSearch = '';
  //   this.descriptionSearch = '';
  //   this.genreSearch = '';
  //   this.titleSearch = '';
  //   this.isbnSearch = '';
  // }

  // calculateBooksTotal(genre: string) {
  //   return this.bookStore.getStore().filter((b: Book) => b.genre === genre)
  //     .length;
  // }

  deleteSelectedBooks() {
    this.openDialog();
    // this.confirmationService.confirm({
    //   message: 'Are you sure you want to delete the selected books?',
    //   header: 'Confirm',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.subs.unsubscribe();
    //     this.subs.sink = this.bookStore
    //       .deleteMultiple(this.selectedBooks.map((b) => b.key ?? ''))
    //       .subscribe(() => {
    //         this.messageService.add({
    //           severity: 'success',
    //           summary: 'Successful',
    //           detail: 'Books Deleted',
    //           life: 3000,
    //         });
    //         this.submitted = true;
    //       });
    //     this.selectedBooks = [];
    //   },
    // });
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
    
}
