import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookHistoryComponent } from './components/book-history/book-history.component';
import { BookListComponent } from './components/book-list/book-list.component';
const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: BookListComponent },
  { path: 'history', component: BookHistoryComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
