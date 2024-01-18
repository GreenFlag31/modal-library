import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'ngx-modal-ease' },
  { path: 'ngx-modal-ease', component: AppComponent },
];
