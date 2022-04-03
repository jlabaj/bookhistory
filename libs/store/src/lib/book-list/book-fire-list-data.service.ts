import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { Book } from '@bookhistory/models';
import { getClassName } from '@bookhistory/tools';
import { FireListBaseDataService } from "../fire-list-base-data.service";

@Injectable()
export class BookFireListDataService<
  Book
> extends FireListBaseDataService<Book> {
  public constructor(db: AngularFireDatabase, httpClient: HttpClient) {
    super(getClassName(Book), db, httpClient);
  }
}