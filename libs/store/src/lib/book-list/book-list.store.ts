import { Injectable } from "@angular/core";
import { DefaultStore } from "../default.store";
import { BookFireListDataService } from "./book-fire-list-data.service";

@Injectable()
export class BookStore<Book> extends DefaultStore<Book> {
  public constructor(
    protected _baseDataService: BookFireListDataService<Book>
  ) {
    super(_baseDataService);
  }
}

