import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component
({
	selector: 'app-info-page',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './modal-info.component.html',
	styleUrl: './modal-info.component.scss'
})
export class ModalInfoComponent implements AfterViewInit, OnInit
{

	@ViewChild('modalHomePage', { static: true }) modalElement!: ElementRef;
	@Input() title: string = '';
	@Input() buttonName: string = 'Fechar';
	@Output() buttonClick = new EventEmitter<void>();
	private _show: boolean = false;

	@Input()
	set show(value: boolean)
	{
		this._show = value;

		if(value)
		{
			const modal = this.modalElement.nativeElement;
			modal.classList.remove('hiden-modal');
		}
	}

	get show()
	{
		return this._show;
	}

	public ngOnInit(): void
	{
		if (!this._show)
		{
			const modal = this.modalElement.nativeElement;
			modal.classList.add('hiden-modal');
		}
	}

	public ngAfterViewInit(): void
	{
		document.addEventListener('keyup', (key) =>
		{
			if ((key.key === 'Enter') && (this._show))
				this.clickOn();
		});

		const modal = this.modalElement.nativeElement;

		modal.addEventListener('transitionend',() =>
		{
			if (getComputedStyle(modal).opacity === '0')
			{
				modal.classList.add('hiden-modal');
			}
		});
	}

	public clickOn()
	{
		this.buttonClick.emit();
	}
}
