import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LaunchComponent } from './launch/launch.component';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'launch', component: LaunchComponent },
    { path: 'test', component: TestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
