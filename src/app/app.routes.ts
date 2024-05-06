import { NgModule } from '@angular/core';
import { Routes, RouterModule  } from '@angular/router';

import { AppComponent } from './app-component/app.component';

export const routes: Routes =
[
	{path: '', component: AppComponent}
];


@NgModule
({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})


export class AppRoutingModule {}
