/*
 * This RemoteEntryModule is imported here to allow TS to find the Module during
 * compilation, allowing it to be included in the built bundle. This is required
 * for the Module Federation Plugin to expose the Module correctly.
 * */
import { loadRemoteModule } from '@angular-architects/module-federation';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BookHistoryModule } from './book-history/book-history.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,

    RouterModule.forChild([
      {
        path: '',
        loadChildren: () =>
          loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:4202/remoteEntry.js',
            exposedModule: './Module',
          }).then((m: any) => m.BookHistoryModule),
      },
    ]),
    // RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    // BookHistoryModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
