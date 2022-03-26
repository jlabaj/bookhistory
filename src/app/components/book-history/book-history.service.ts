import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { BookHistory } from './book-history.models';
@Injectable({
  providedIn: 'root',
})
export class BookHistoryService {
  private dbPath = '/booksHistory';
  booksRef: AngularFireList<BookHistory>;
  constructor(private db: AngularFireDatabase, private http: HttpClient) {
    this.booksRef = db.list(this.dbPath);
  }
  getAll(): AngularFireList<BookHistory> {
    return this.booksRef;
  }
  create(book: BookHistory): any {
    return this.booksRef.push(book);
  }
  // update(key: string, value: any): Promise<void> {
  //   return this.booksRef.update(key, value);
  // }
  // delete(key: string): Promise<void> {
  //   return this.booksRef.remove(key);
  // }
  // deleteAll(): Promise<void> {
  //   return this.booksRef.remove();
  // }

  getBooksHistoryStatic() {
    return this.http
      .get<any>('assets/books.json')
      .toPromise()
      .then((res) => <BookHistory[]>res.data)
      .then((data) => {
        return data;
      });
  }
}
