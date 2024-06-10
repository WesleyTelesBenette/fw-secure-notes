import { NgModule } from '@angular/core';
import { Routes, RouterModule  } from '@angular/router';

import { HomePageComponent } from './views/pages/home-page/home-page.component';
import { NotePageComponent } from './views/pages/note-page/note-page.component';

export const routes: Routes =
[
	{ path: '', component: HomePageComponent },
	{ path:'page/:pageSlug/:pinSlug', component: NotePageComponent },
	{ path: '**', component: HomePageComponent }
];

@NgModule
({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})

export class AppRoutingModule {}
