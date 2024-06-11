import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component
({
	selector: 'app-header-note-page',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './header-note-page.component.html',
	styleUrl: './header-note-page.component.scss'
})
export class HeaderNotePageComponent
{
	@Input() title: string = 'default';
	public headerMode: headerModes = 'edit';

	public toggleHeaderMode(mode: headerModes)
	{
		this.headerMode = mode;
	}


}

type headerModes = 'edit' | 'view';
