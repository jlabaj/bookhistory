import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DefaultStore, FireListBaseDataService } from '@bookhistory/shared';
import { getClassName } from '@bookhistory/shared/tools';
import { map, Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { BookHistoryStore } from '../book-history/book-history.component';
import { BookHistory } from '../book-history/book-history.models';
import { Book } from './book-list.models';
import { ConfirmationDialog } from './confirmation-dialog.component';
import { NewBookDialog } from './new-book-dialog.component';


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
export class BookListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['select', 'key', 'isbn', 'title', 'genre', 'description', 'publishedDate', 'authors'];
  selection = new SelectionModel<Book>(true, []);
  dataSource: MatTableDataSource<Book> = new MatTableDataSource<Book>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  bookDialog!: boolean;

  canEdit = false;

  newEditCaption = 'New';

  submitted!: boolean;

  private subs = new SubSink();

  public booksAsMatTableDataSource$!: Observable<MatTableDataSource<Book>>;

  constructor(
    public bookStore: BookStore<Book>,
    public bookHistoryStore: BookHistoryStore<BookHistory>,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
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

  toggleSelection(row:any)
  {
    this.selection.toggle(row);
    if (this.selection.selected.length == 1) this.newEditCaption = 'Edit';
    else this.newEditCaption = 'New';
  }

  openNew() {

        const dialogRef = this.dialog.open(NewBookDialog, {
          width: '300px',
          disableClose:false,
          data: {
            dataKey: {
              book:this.selection.selected[0],
              header: this.newEditCaption + ' Book'
            }
          }
        });
    
        dialogRef.afterClosed().subscribe(
          (book:Book) => {
            if(book)
            {
              this.saveBook(book);
            }
          }
        );
      }

  

  saveBook(book:Book) {
    this.submitted = true;

      if (book.key) {
        this.updateBook(book);
      } else {
        this.createBook(book);
      }

      this.bookDialog = false;
  }

  updateBook(book: Book, fieldName: string = '') {
    if (book.key) {
        this.subs.unsubscribe();
        this.subs.sink = this.bookStore.update(book.key, book).subscribe(() => {
          this.bookHistoryStore.add({
            bookId: book.key,
            isbn: book.isbn,
            timeOfChange: new Date().toLocaleString(),
            change: `${fieldName} was changed to ${(book as any)[fieldName]}`,
          });
          this._snackBar.open('Successful: Book Updated', 'success', {politeness: 'polite'});
        });
    }
  }

  createBook(book: Book) {
    this.subs.unsubscribe();
    book.publishedDate = this.formatDate(book.publishedDate);
    this.subs.sink = this.bookStore.add(book).subscribe(() => {
      this._snackBar.open('Successful: Book Created', 'success', {politeness: 'polite'});
    });
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
    
        return `${day}.${month}.${date.getFullYear()}`;
      }

  // clear(table: Table) {
  //   table.clear();
  //   this.publishedDateSearch = '';
  //   this.descriptionSearch = '';
  //   this.genreSearch = '';
  //   this.titleSearch = '';
  //   this.isbnSearch = '';
  // }

  deleteSelectedBooks() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      // width: '250px',
      disableClose:false,
      data: {
        dataKey: {
          message: 'Are you sure you want to delete the selected books?',
          books:this.selection.selected,
          header: 'Delete Row(s)'
        }
      }
    });
    

    dialogRef.afterClosed().subscribe(
      (data:any) => {
        if(data === 'yes')
        {
          this.subs.unsubscribe();
          this.subs.sink = this.bookStore
            .deleteMultiple(this.selection.selected.map((b) => b.key ?? ''))
            .subscribe(() => {
              this._snackBar.open('Successful: Books Deleted', 'success', {politeness: 'polite'});

              this.submitted = true;
            });
          }
      }
    );
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
