import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component
({
	selector: 'app-loading-content-page',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './loading-content-page.component.html',
	styleUrl: './loading-content-page.component.scss'
})
export class LoadingContentPageComponent
{
	@Input() smallSize: boolean = false;
	@Input() showText: string | null = null;
}
