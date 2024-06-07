import { Component, Input } from '@angular/core';

@Component
({
	selector: 'app-info-page',
	standalone: true,
	imports: [],
	templateUrl: './modal-info.component.html',
	styleUrl: './modal-info.component.scss'
})
export class ModalInfoComponent
{
	@Input() title: string = '';
}
