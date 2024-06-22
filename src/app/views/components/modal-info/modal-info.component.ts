import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component
({
	selector: 'app-info-page',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './modal-info.component.html',
	styleUrl: './modal-info.component.scss'
})
export default class ModalInfoComponent implements AfterViewInit
{
	@ViewChild('modalHomePage', { static: true }) modalElement!: ElementRef;
	@Output() buttonClick = new EventEmitter<void>();

	@Input() smallSize: boolean = false;
	@Input() largeSize: boolean = false;

	@Input() hasTitle: boolean = true;
	@Input() hasContent: boolean = true;
	@Input() hasButton: boolean = true;

	@Input() closeEnter: boolean = false;
	@Input() closeSpace: boolean = false;
	@Input() closeClick: boolean = false;
	public clickAction: boolean = false;

	@Input() title: string = '';
	@Input() buttonName: string = 'Fechar';

	private _show: boolean = false;
	private keyupListener!: () => void;

	@Input()
	set show(value: boolean)
	{
		this._show = value;

		if (value)
		{
			const modal = this.modalElement.nativeElement;
			modal.classList.remove('hiden-modal');
		}
	}
	get show()
	{
		return this._show;
	}

	public constructor(private renderer: Renderer2) {}

	public ngAfterViewInit(): void
	{
		const modal = this.modalElement.nativeElement;

		modal.addEventListener('animationend',() =>
		{
			if (!this._show)
			{
				this.clickAction = false;
				modal.classList.add('hiden-modal');
			}
			else modal.classList.remove('hiden-modal');
		});

		if (this.closeEnter)
		{
			this.keyupListener = this.renderer.listen('document', 'keyup', (event: KeyboardEvent) =>
			{
				if ((event.key === 'Enter') && (this.show))
					this.clickOn();
			});
		}

		if (this.closeSpace)
		{
			this.keyupListener = this.renderer.listen('document', 'keyup', (event: KeyboardEvent) =>
			{
				if ((event.key === ' ') && (this.show))
					this.clickOn();
			});
		}

		if (this.closeClick)
		{
			this.keyupListener = this.renderer.listen('document', 'mouseup', () =>
			{
				if (this.show)
					this.clickOn();
			});
		}

		if (!this._show)
		{
			const modal = this.modalElement.nativeElement;
			modal.classList.add('hiden-modal');
		}
	}

	public clickOn()
	{
		if (this.clickAction === false)
		{
			this.clickAction = true;
			this.buttonClick.emit();
		}
	}
}
