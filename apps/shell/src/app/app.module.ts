import { loadRemoteModule } from '@angular-architects/module-federation';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          outlet: 'topbar',
          loadChildren: () =>
            loadRemoteModule({
              type: 'module',
              remoteEntry: 'http://localhost:4203/remoteEntry.js',
              exposedModule: './Module',
            }).then((m: any) => m.NavigationTopModule),
        },
        {
          path: 'books',
          // outlet: 'maincontainer',
          loadChildren: () =>
            loadRemoteModule({
              type: 'module',
              remoteEntry: 'http://localhost:4201/remoteEntry.js',
              exposedModule: './Module',
            }).then((m: any) => m.BookListModule),
        },
        {
          path: 'history',
          loadChildren: () =>
            loadRemoteModule({
              type: 'module',
              remoteEntry: 'http://localhost:4202/remoteEntry.js',
              exposedModule: './Module',
            }).then((m: any) => m.BookHistoryModule),
        },
        // {
        //   path: 'books',
        //   loadChildren: () =>
        //     import('booklist/Module').then((m) => m.RemoteEntryModule),
        // },
        // {
        //   path: 'history',
        //   loadChildren: () =>
        //     import('bookhistory/Module').then((m) => m.RemoteEntryModule),
        // },
        // {
        //   path: '',
        //   outlet: 'topbar',
        //   loadChildren: () =>
        //     import('navigationtop/Module').then((m) => m.RemoteEntryModule),
        // },
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
