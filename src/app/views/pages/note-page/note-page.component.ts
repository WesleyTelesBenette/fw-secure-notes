import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import PageModel from '../../../models/general/PageModel';

import RequestPageService from '../../../services/database/RequestPageService';
import RequestAuthorizationService from '../../../services/database/RequestAuthorizationService';
import JwtTokenService from '../../../services/jwt-token/JwtTokenService';

import { FooterComponent } from '../../components/footer/footer.component';
import { ModalInfoComponent } from '../../components/modal-info/modal-info.component';
import { InputPasswordComponent } from '../../components/input-password/input-password.component';

@Component
({
	selector: 'app-note-page',
	standalone: true,
	imports: [CommonModule, FormsModule, FooterComponent, ModalInfoComponent, InputPasswordComponent],
	templateUrl: './note-page.component.html',
	styleUrl: './note-page.component.scss'
})
export class NotePageComponent implements OnInit
{
	private pageSubject = new BehaviorSubject<PageModel>(new PageModel());
	private page$ = this.pageSubject.asObservable();
	public currentPage!: PageModel;

	public inputPasswordModal: string = '';

	constructor(
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _pageRequest: RequestPageService,
		private _authorizarion: RequestAuthorizationService,
		private _token: JwtTokenService
	) { }

	public async ngOnInit(): Promise<void>
	{
		this.page$.subscribe(page =>
		{
			this.currentPage = page;
		});

		const pageSlug = this._activatedRoute.snapshot.paramMap.get('pageSlug') ?? '';
		const pinSlug = this._activatedRoute.snapshot.paramMap.get('pinSlug') ?? '';

		if (!(await this.loadPageConfig(pageSlug, pinSlug)))
			return;

		if ((!this.currentPage.pageHasPassword) || (await this.callTokenValide()))
		{
			this.initPage();
			return;
		}

		this.callInputPassword();
	}

	private async loadPageConfig(pageSlug: string, pinSlug: string): Promise<boolean>
	{
		const isPageSlugValide = this.currentPage.setPageSlug(pageSlug);
		const isPinSlugValide = this.currentPage.setPinSlug(pinSlug);

		//Correct format?
		if ((isPageSlugValide) && (isPinSlugValide))
		{
			try
			{
				const response = await this._authorizarion
					.getPageHasPassword(this.currentPage.pageSlug, this.currentPage.pinSlug);

				//Exist page
				if (response.statusCode == 200)
				{
					this.currentPage.pageTitle = `${pageSlug}-${pinSlug}`;
					this.currentPage.pageHasPassword = (response.content != null)
						? response.content : false;

					return true; //Good Ending
				}

				if (response.statusCode == 404)
				{
					this.errorPage('404 - Not Found', 'Essa página não existe...');
					return false;
				}

				throw Error;
			}
			catch
			{
				this.errorPage('500 - Internal Server Error', 'Ocorreu um erro com o servido...\nSinto muito pelo incômodo :(');
				return false;
			}
		}

		this.errorPage('400 - Bad Request', 'A URL não está no formato de uma página de anotações.');
		return false;
	}

	private async callTokenValide(): Promise<boolean>
	{
		if (this._token.getToken() === "")
			return false;

		try
		{
			const result = await this._authorizarion.checkValidToken(this.currentPage.pageSlug, this.currentPage.pinSlug);

			if (result.statusCode == 200)
				return true;

			throw Error;
		}
		catch
		{
			return false;
		}
	}

	private callInputPassword()
	{
		this.currentPage.pageOn = false;
		this.currentPage.pagePasswordOn = true;
		this.updatePage();
	}

	public async callInputPasswordAction()
	{
		this.currentPage.pagePasswordOn = false;

		try
		{
			const response = await this._authorizarion
				.createToken(this.currentPage.pageSlug, this.currentPage.pinSlug, this.inputPasswordModal);

			if ((response.statusCode == 201) && (response.content != null))
			{
				this._token.setToken(response.content);
				this.initPage();
				return;
			}

			if (response.statusCode == 404)
			{
				this.errorPage('404 - Not Found', 'Essa página não existe...');
				return;
			}

			if (response.statusCode == 401)
			{
				this.errorPage('401 - Unauthorized', 'Senha incorreta!\nTente novamente mais tarde...');
				return;
			}

			throw Error;
		}
		catch
		{
			this.errorPage('500 - Internal Server Error', 'Ocorreu um erro com o servido...\nSinto muito pelo incômodo :(');
			return;
		}
	}


	private initPage(): void
	{
		this.currentPage.pageOn = true;
		this.updatePage();
	}

	public updatePage(): void
	{
		this.pageSubject.next(this.currentPage);
	}


	private errorPage(error: TypeErrorPage, message: string): void
	{
		console.error('Erro: ' + error + '.\n' + 'Descrição: ' + message);

		this.currentPage.pageOn = false;
		this.currentPage.pageErrorOn = true;
		this.currentPage.pageErrorTitle = error;
		this.currentPage.pageErrorContent = message;
		console.log(this.currentPage.pageErrorOn);
		this.updatePage();
	}

	public errorPageAction()
	{
		this._router.navigate(['']);
	}
}

type TypeErrorPage =
	'400 - Bad Request'
	| '401 - Unauthorized'
	| '404 - Not Found'
	| '500 - Internal Server Error';
