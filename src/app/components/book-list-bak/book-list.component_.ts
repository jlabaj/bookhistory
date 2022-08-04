// import { HttpClient } from '@angular/common/http';
// import {
//   AfterViewChecked,
//   ChangeDetectorRef,
//   Component,
//   Injectable,
//   OnInit,
//   ViewChild,
// } from '@angular/core';
// import { AngularFireDatabase } from '@angular/fire/compat/database';
// import { DefaultStore, FireListBaseDataService } from '@bookhistory/shared';
// import { getClassName } from '@bookhistory/shared/tools';
// import {
//   ConfirmationService,
//   MessageService,
//   PrimeNGConfig,
// } from 'primeng/api';
// import { Table } from 'primeng/table';
// import { Subscription } from 'rxjs';
// import { SubSink } from 'subsink';
// import { BookHistoryStore } from '../book-history/book-history.component';
// import { BookHistory } from '../book-history/book-history.models';
// import { Book } from './book-list.models';

// @Injectable()
// export class BookStore<Book> extends DefaultStore<Book> {
//   public constructor(
//     protected _baseDataService: BookFireListDataService<Book>
//   ) {
//     super(_baseDataService);
//   }
// }

// @Injectable()
// export class BookFireListDataService<
//   Book
// > extends FireListBaseDataService<Book> {
//   public constructor(db: AngularFireDatabase, httpClient: HttpClient) {
//     super(getClassName(Book), db, httpClient);
//   }
// }

// @Component({
//   selector: 'app-book-list',
//   templateUrl: './book-list.component.html',
//   styleUrls: ['./book-list.component.scss'],
//   // changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class BookListComponent implements OnInit, AfterViewChecked {
//   @ViewChild('dt') dt!: Table;

//   public groupTemplateOn: boolean = false;

//   bookDialog!: boolean;

//   book!: Book;

//   submitted!: boolean;

//   selectedBooks!: Book[];

//   loading: boolean = true;

//   displayPtable: boolean = true;

//   private subs = new SubSink();

//   bookEditInit!: Book;

//   getSnapshotChangesSubscription?: Subscription;

//   publishedDateSearch: string = '';
//   descriptionSearch: string = '';
//   genreSearch: string = '';
//   titleSearch: string = '';
//   isbnSearch: string = '';

//   _genreGroupingChecked: boolean = false;
//   public get genreGroupingChecked(): boolean {
//     return this._genreGroupingChecked;
//   }

//   //hack to switch table display mode from list to grouping in primeng
//   public set genreGroupingChecked(value: boolean) {
//     this._genreGroupingChecked = value;
//     this.groupTemplateOn = value;
//     this.displayPtable = false;
//     setTimeout(() => {
//       this.displayPtable = true;
//     }, 0);
//   }

//   constructor(
//     public bookStore: BookStore<Book>,
//     public bookHistoryStore: BookHistoryStore<BookHistory>,
//     private primengConfig: PrimeNGConfig,
//     private messageService: MessageService,
//     private confirmationService: ConfirmationService,
//     private cdRef: ChangeDetectorRef
//   ) {}

//   public ngOnDestroy(): void {
//     this.subs.unsubscribe();
//   }

//   ngAfterViewChecked(): void {
//     if (this.dt && this.dt.expandedRowTemplate && !this.groupTemplateOn) {
//       (this.dt as any).expandedRowTemplate = null;
//       this.displayPtable = false;
//       setTimeout(() => {
//         this.displayPtable = true;
//       }, 0);
//       this.cdRef.detectChanges();
//     }
//   }

//   ngOnInit() {
//     this.getSnapshotChangesSubscription
//       ? this.getSnapshotChangesSubscription.unsubscribe
//       : null;
//     this.getSnapshotChangesSubscription = this.bookStore
//       .getSnapshotChanges()
//       .subscribe(() => (this.loading = false));

//     this.primengConfig.ripple = true;
//   }

//   onDateSelect(value: any) {
//     this.dt.filter(this.formatDate(value), 'publishedDate', 'equals');
//   }

//   openNew() {
//     this.book = {};
//     this.submitted = false;
//     this.bookDialog = true;
//   }

//   hideDialog() {
//     this.bookDialog = false;
//     this.submitted = false;
//   }

//   saveBook() {
//     this.submitted = true;

//     if (this.book.title?.trim()) {
//       if (this.book.key) {
//         this.updateBook(this.book);
//       } else {
//         this.createBook(this.book);
//       }

//       this.bookDialog = false;
//       this.book = {};
//     }
//   }

//   updateBook(book: Book, fieldName: string = '') {
//     if (book.key) {
//       const valueChanged =
//         (this.bookEditInit as any)[fieldName] !== (book as any)[fieldName];
//       if (valueChanged) {
//         this.subs.unsubscribe();
//         this.subs.sink = this.bookStore.update(book.key, book).subscribe(() => {
//           this.bookHistoryStore.add({
//             bookId: book.key,
//             isbn: book.isbn,
//             timeOfChange: new Date().toLocaleString(),
//             change: `${fieldName} was changed to ${(book as any)[fieldName]}`,
//           });
//           this.messageService.add({
//             severity: 'success',
//             summary: 'Successful',
//             detail: 'Book Updated',
//             life: 3000,
//           });
//           this.submitted = true;
//         });
//       }
//     }
//   }

//   createBook(book: Book) {
//     this.subs.unsubscribe();
//     this.book.publishedDate = this.formatDate(book.publishedDate);
//     this.subs.sink = this.bookStore.add(book).subscribe(() => {
//       this.messageService.add({
//         severity: 'success',
//         summary: 'Successful',
//         detail: 'Book Created',
//         life: 3000,
//       });
//       this.submitted = true;
//     });
//   }

//   onEditComplete(book: {
//     field: unknown;
//     data: Book;
//     originalEvent: unknown;
//     index: unknown;
//   }): void {
//     this.updateBook(book.data, book.field as string);
//   }

//   onEditInit(book: { data: Book }): void {
//     this.bookEditInit = JSON.parse(JSON.stringify(book.data));
//   }

//   formatDate(date: any) {
//     let month = date.getMonth() + 1;
//     let day = date.getDate();

//     if (month < 10) {
//       month = '0' + month;
//     }

//     if (day < 10) {
//       day = '0' + day;
//     }

//     return `${day}.${month}.${date.getFullYear()}`;
//   }

//   clear(table: Table) {
//     table.clear();
//     this.publishedDateSearch = '';
//     this.descriptionSearch = '';
//     this.genreSearch = '';
//     this.titleSearch = '';
//     this.isbnSearch = '';
//   }

//   calculateBooksTotal(genre: string) {
//     return this.bookStore.getStore().filter((b: Book) => b.genre === genre)
//       .length;
//   }

//   deleteSelectedBooks() {
//     this.confirmationService.confirm({
//       message: 'Are you sure you want to delete the selected books?',
//       header: 'Confirm',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
//         this.subs.unsubscribe();
//         this.subs.sink = this.bookStore
//           .deleteMultiple(this.selectedBooks.map((b) => b.key ?? ''))
//           .subscribe(() => {
//             this.messageService.add({
//               severity: 'success',
//               summary: 'Successful',
//               detail: 'Books Deleted',
//               life: 3000,
//             });
//             this.submitted = true;
//           });
//         this.selectedBooks = [];
//       },
//     });
//   }
// }
