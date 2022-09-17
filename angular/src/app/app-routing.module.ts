import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ImprintComponent } from './imprint/imprint.component';
import { LoginComponent } from './pages/login/login.component';
import { PolicyComponent } from './policy/policy.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'policy',
    component: PolicyComponent
  },
  {
    path: 'imprint',
    component: ImprintComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
