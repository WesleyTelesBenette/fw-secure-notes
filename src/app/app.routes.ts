import { NgModule } from '@angular/core';
import { Routes, RouterModule  } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotePageComponent } from './pages/note-page/note-page.component';

export const routes: Routes =
[
	{ path: '', component: HomePageComponent },
	{ path:'page/:pageName', component: NotePageComponent }
];


@NgModule
({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})


export class AppRoutingModule {}
