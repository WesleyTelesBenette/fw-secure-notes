import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import FooterComponent from '../../components/footer/footer.component';
import ModalInfoComponent from '../../components/modal-info/modal-info.component';
import { CommonModule } from '@angular/common';
import RequestPageService from '../../../services/database/RequestPageService';
import { LoadingContentPageComponent } from '../../components/loading-content-page/loading-content-page.component';

/** Componente da página principal da aplicação.
 *
 * Usado como a pagina padrão da rota raiz do site.
 */
@Component
({
	selector: 'app-home-page',
	standalone: true,
	imports: [CommonModule, FooterComponent, FormsModule, ModalInfoComponent, LoadingContentPageComponent],
	templateUrl: './home-page.component.html',
	styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit
{
	@ViewChild('inputTitleId') inputTitleId!: ElementRef<HTMLInputElement>;
	@ViewChild('inputAddId') inputAddId!: ElementRef<HTMLInputElement>;
	public loadCreatePage: boolean = false;
	public inputTitle: string = '';
	public inputAdd: string = '';
	public infoModalOn: boolean = false;

	public constructor
	(
		private _page: RequestPageService,
		private _router: Router,
		private _render: Renderer2
	) {}

	public ngOnInit()
	{
		const elementBody = document.querySelector('body') as HTMLBodyElement;

		while (elementBody.classList.length > 0)
			this._render.removeClass(elementBody, elementBody.classList[0]);
	}

	public toggleInfoModalOn(): void
		{ this.infoModalOn = !this.infoModalOn; }

	public toggleLoadCreatePage(): void
		{ this.loadCreatePage = true; }

	public limitedInputTitle(): void
		{ this.inputTitle = this.inputTitle.replace(/[^a-zA-Z0-9-]/g, '-'); }

	public async createNote(): Promise<void>
	{
		const pageName = this.inputTitleId.nativeElement.value;
		const pagePassword = this.inputAddId.nativeElement.value ?? '';

		if (((pageName.replace(/[^a-zA-Z0-9-]/g, '-')) !== ''))
		{
			console.log('Criando...')
			const newPage = await this._page.createPage(pageName, pagePassword);

			if (newPage.content != null)
			{
				this._router.navigate([`page/${newPage.content.title}/${newPage.content.pin}`]);
			}
			else
			{
				this._router.navigate(['page/erro/err']);
			}
		}

		return;
	}

	public async searchNote(): Promise<void>
	{
		const pageName = this.inputTitleId.nativeElement.value;
		const pagePin = this.inputAddId.nativeElement.value;

		this._router.navigate([`page/${pageName}/${pagePin}`]);

		return;
	}
}
