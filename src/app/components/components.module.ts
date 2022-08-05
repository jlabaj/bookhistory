import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import {
  BookHistoryComponent,
  BookHistoryFireListDataService,
  BookHistoryStore
} from './book-history';
import {
  BookFireListDataService,
  BookListComponent,
  BookStore
} from './book-list';
import { ConfirmationDialog } from './book-list/confirmation-dialog.component';
import { NewBookDialog } from './book-list/new-book-dialog.component';
import { NavigationTopComponent } from './navigation-top/navigation-top.component';

@NgModule({
  declarations: [
    BookListComponent,
    BookHistoryComponent,
    NavigationTopComponent,
    ConfirmationDialog,
    NewBookDialog
  ],
  imports: [SharedModule.forRoot()],
  exports: [NavigationTopComponent],
  providers: [
    BookStore,
    BookFireListDataService,
    BookHistoryStore,
    BookHistoryFireListDataService,
  ],
})
export class ComponentsModule {}
