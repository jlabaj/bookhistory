import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { Book } from './book-list.models';
@Injectable({
  providedIn: 'root',
})
export class BookService {
  private dbPath = '/books';
  booksRef: AngularFireList<Book>;
  constructor(private db: AngularFireDatabase, private http: HttpClient) {
    this.booksRef = db.list(this.dbPath);
  }
  getAll(): AngularFireList<Book> {
    return this.booksRef;
  }
  create(book: Book): any {
    return this.booksRef.push(book);
  }
  update(key: string, value: any): Promise<void> {
    return this.booksRef.update(key, value);
  }
  delete(key: string): Promise<void> {
    return this.booksRef.remove(key);
  }
  deleteAll(): Promise<void> {
    return this.booksRef.remove();
  }

  getBooksStatic() {
    return this.http
      .get<any>('assets/books.json')
      .toPromise()
      .then((res) => <Book[]>res.data)
      .then((data) => {
        return data;
      });
  }
}
