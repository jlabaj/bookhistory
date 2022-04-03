import { Component, OnInit } from '@angular/core';
import { BookHistory } from '@bookhistory/models';
import { BookHistoryStore } from '@bookhistory/store';
import { tap } from 'rxjs';
import { SubSink } from 'subsink';


@Component({
  selector: 'app-book-history',
  templateUrl: './book-history.component.html',
  styleUrls: ['./book-history.component.scss'],
})
export class BookHistoryComponent implements OnInit {
  first = 0;

  rows = 10;

  loading: boolean = true;

  private subs = new SubSink();

  constructor(public bookHistoryStore: BookHistoryStore<BookHistory>) {}

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.subs.sink = this.bookHistoryStore
      .getSnapshotChanges()
      .pipe(tap(() => (this.loading = false)))
      .subscribe();
  }

  isFirstPage(): boolean {
    return this.bookHistoryStore.getStore() ? this.first === 0 : true;
  }
}
