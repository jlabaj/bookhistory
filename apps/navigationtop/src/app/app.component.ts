import { Component } from '@angular/core';

@Component({
  selector: 'bookhistory-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'navigationtop';
}

// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-navigation-top',
//   templateUrl: './navigation-top.component.html',
//   styleUrls: ['./navigation-top.component.scss']
// })
// export class NavigationTopComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

// const routes: Route[] = [
//   {
//     path: 'admin-panel',
//     loadChildren: () =>
//       loadRemoteModule({
//         remoteEntry: 'http://localhost:4201/remoteEntry.js',
//         remoteName: 'admin',
//         exposedModule: './Module',
//       }).then((m) => m.AdminPanelModule),
//   },
// ];

