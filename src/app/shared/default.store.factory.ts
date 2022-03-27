// import { Injectable } from "@angular/core";
// import { EntityBase } from "./base-entities.model";
// import { DefaultStore } from "./default.store";

// @Injectable()
// export class DefaultStoreFactory {

//   public constructor(private httpClient: HttpClient, private errorHandling: ErrorHandling) {}

//   public create<T extends EntityBase>(
//   ): DefaultStore<T> {
//     const baseSearchDataService = new BaseSearchDataService<T>(
//                 new HttpRequestManipulation(this.httpClient, this.errorHandling)
//               );
//     return new DefaultSearchStore<T>(baseSearchDataService);
//   }
// }
