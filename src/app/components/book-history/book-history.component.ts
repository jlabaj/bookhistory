import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DefaultStore, FireListBaseDataService } from '@bookhistory/shared';
import { getClassName } from '@bookhistory/shared/tools';
import { map, Observable } from 'rxjs';
import { SubSink } from 'subsink';
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
export class BookHistoryComponent implements OnInit, AfterViewInit {
  
  displayedColumns: string[] = ['key', 'bookId', 'isbn', 'timeOfChange', 'change'];
  dataSource: MatTableDataSource<BookHistory> = new MatTableDataSource<BookHistory>();
  public booksAsMatTableDataSource$!: Observable<MatTableDataSource<BookHistory>>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  first = 0;

  rows = 10;

  loading: boolean = true;

  private subs = new SubSink();

  constructor(public bookHistoryStore: BookHistoryStore<BookHistory>) {}

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit() {
      this.booksAsMatTableDataSource$ =
    this.bookHistoryStore
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
}
