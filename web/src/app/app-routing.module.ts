import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { JobsViewComponent } from './jobs-view/jobs-view.component';
import { JobDetailsViewComponent } from './job-details-view/job-details-view.component';

const routes: Routes = [

  { path: '', redirectTo: '/jobs', pathMatch: 'full' },

  { path: 'jobs', component: JobsViewComponent },
  { path: 'jobs/:id', component: JobDetailsViewComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
