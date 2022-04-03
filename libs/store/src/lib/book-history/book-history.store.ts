import { Injectable } from "@angular/core";
import { DefaultStore } from "../default.store";
import { BookHistoryFireListDataService } from "./book-history-fire-list-data.service";

@Injectable()
export class BookHistoryStore<BookHistory> extends DefaultStore<BookHistory> {
  public constructor(
    protected _baseDataService: BookHistoryFireListDataService<BookHistory>
  ) {
    super(_baseDataService);
  }
}

