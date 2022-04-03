import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { NavigationTopComponent } from './navigation-top.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationTopComponent,
  },
];

@NgModule({
  declarations: [NavigationTopComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MatToolbarModule],
  exports: [RouterModule],
})
export class NavigationTopModule {}
