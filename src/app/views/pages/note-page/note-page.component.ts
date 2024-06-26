import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { TextFieldModule } from '@angular/cdk/text-field';

import PageModel from '../../../models/general/PageModel';
import RequestAuthorizationService from '../../../services/database/RequestAuthorizationService';
import JwtTokenService from '../../../services/jwt-token/JwtTokenService';

import FooterComponent from '../../components/footer/footer.component';
import ModalInfoComponent from '../../components/modal-info/modal-info.component';
import InputPasswordComponent from '../../components/input-password/input-password.component';
import HeaderNotePageComponent from './header-note-page/header-note-page.component';
import RequestFileService from '../../../services/database/RequestFileService';
import { LoadingContentPageComponent } from '../../components/loading-content-page/loading-content-page.component';
import { FileModel } from '../../../models/general/IFileModel';
import MapIntString from '../../../models/general/MapIntString';
import { MarkdownShowComponent } from '../../components/markdown-show/markdown-show.component';

export type TypeErrorPage =
	'400 - Bad Request'
	| '401 - Unauthorized'
	| '404 - Not Found'
	| '500 - Internal Server Error';

@Component
({
	selector: 'app-note-page',
	standalone: true,
	imports:
	[
		CommonModule, FormsModule, TextFieldModule,
		FooterComponent, ModalInfoComponent,
		InputPasswordComponent, HeaderNotePageComponent,
		LoadingContentPageComponent, MarkdownShowComponent
	],
	styleUrls: ['./note-page.component.scss', '../../components/markdown-show/markdown-show.component.scss'],
	templateUrl: './note-page.component.html',
})
export class NotePageComponent implements OnInit
{
	private pageSubject = new BehaviorSubject<PageModel>(new PageModel());
	private page$ = this.pageSubject.asObservable();
	public currentPage!: PageModel;

	@ViewChild('contentFile') contentFile!: ElementRef<HTMLTextAreaElement>;
	@ViewChild('titleInput') titleInput!: ElementRef<HTMLTextAreaElement>;
	public titleInputOn: boolean = false;

	public pagePasswordOn: boolean = false;
	public inputPasswordModal: string = '';
	private archivedUpdateTitle: [boolean, string] = [false, ''];
	private archivedUpdateContent: [boolean, string] = [false, ''];

	public pageErrorOn: boolean = false;
	public pageErrorTitle: string = '';
	public pageErrorContent: string = '';

	constructor(
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _file: RequestFileService,
		private _authorizarion: RequestAuthorizationService,
		private _token: JwtTokenService,
		private _render: Renderer2
	) { }


	//##############################
	// * SETUP *
	//##############################
	public async ngOnInit(): Promise<void>
	{
		this.page$.subscribe(page =>
		{
			this.currentPage = page;
		});

		const titleSlug = this._activatedRoute.snapshot.paramMap.get('titleSlug') ?? '';
		const pinSlug = this._activatedRoute.snapshot.paramMap.get('pinSlug') ?? '';

		if (!(await this.loadPageConfig(titleSlug, pinSlug)))
			return;

		if ((!this.currentPage.pageHasPassword) || (await this.callTokenValide()))
		{
			this.initPage();
			return;
		}

		this.callInputPassword();
	}

	private async loadPageConfig(titleSlug: string, pinSlug: string): Promise<boolean>
	{
		const isTitleSlugValide = this.currentPage.setTitleSlug(titleSlug);
		const isPinSlugValide = this.currentPage.setPinSlug(pinSlug);

		//Correct format?
		if ((isTitleSlugValide) && (isPinSlugValide))
		{
			try
			{
				const response = await this._authorizarion
					.getPageHasPassword(this.currentPage.titleSlug, this.currentPage.pinSlug);

				//Exist page
				if (response.statusCode == 200)
				{
					this.currentPage.pageTitle = `${titleSlug}-${pinSlug}`;
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
				this.errorPage('500 - Internal Server Error', 'Ocorreu um erro com o servidor...\nSinto muito pelo incômodo :(');
				return false;
			}
		}

		this.errorPage('400 - Bad Request', 'A URL não está no formato de uma página de anotações.');
		return false;
	}

	private async initPage(): Promise<void>
	{
		this.currentPage.pageOn = true;
		this.updatePage();
	}


	//##############################
	// * SECURITY *
	//##############################
	private async callTokenValide(): Promise<boolean>
	{
		if (this._token.getToken() === "")
			return false;

		try
		{
			const result = await this._authorizarion
				.checkValidToken(this.currentPage.titleSlug, this.currentPage.pinSlug);

			if (result.statusCode == 200)
				return true;

			throw Error;
		}
		catch
		{
			return false;
		}
	}

	public callInputPasswordError()
	{
		const elementBody = document.querySelector('body') as HTMLBodyElement;

		if (elementBody)
		{
			while (elementBody.classList.length > 0)
				this._render.removeClass(elementBody, elementBody.classList[0]);
		}

		this.currentPage.pageShowMode = 'view';

		this.callInputPassword();
	}

	private callInputPassword()
	{
		this.currentPage.pageOn = false;
		this.pagePasswordOn = true;
		this.updatePage();
	}

	public async callInputPasswordAction()
	{
		this.pagePasswordOn = false;

		try
		{
			const response = await this._authorizarion
				.createToken(this.currentPage.titleSlug, this.currentPage.pinSlug, this.inputPasswordModal);

			if ((response.statusCode == 201) && (response.content != null))
			{
				this._token.setToken(response.content);
				this.inputPasswordModal = '';

				const updateArchivedTitle = (this.archivedUpdateTitle[0]) ? (this.updateFileTitle(this.archivedUpdateTitle[1])) : true;
				const updateArchivedContent = (this.archivedUpdateContent[0]) ? (this.updateFileContent(this.archivedUpdateContent[1])) : true;

				if ((updateArchivedTitle) && (updateArchivedContent))
				{
					this.initPage();
					return;
				}
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


	//##############################
	// * PAGE *
	//##############################
	public updatePage(newData: PageModel | null | any = null): void
	{
		if (newData)
			this.currentPage = newData;

		this.pageSubject.next(this.currentPage);
	}


	//##############################
	// * FILES *
	//##############################
	public async updateFileTitle(title: string | any = undefined): Promise<boolean | any>
	{
		this.currentPage.fileUpdateTitleOn = true;
		const inputValue = (title) ? title : this.titleInput.nativeElement.value;
		const oldFileIndex = this.currentPage.fileList.indexOf
		(
			this.currentPage.fileList.find(f => f.id == this.currentPage.currentFile.id)
			?? new FileModel(-1, '', '')
		);

		if ((oldFileIndex === -1) || (this.currentPage.fileList[oldFileIndex].title == inputValue))
		{
			await new Promise(resolve => setTimeout(resolve, 1));
			this.currentPage.fileUpdateTitleOn = false;
			return;
		}

		try
		{
			const response = await this._file
				.updateFileTitle
				(
					this.currentPage.titleSlug,
					this.currentPage.pinSlug,
					this.currentPage.currentFile.id,
					inputValue
				);

			if (response.statusCode === 200)
			{
				this.currentPage.fileList[oldFileIndex].title = inputValue;
				this.currentPage.fileList = this.currentPage.fileList.sort((a, b) =>
				{
					if (a.title < b.title)
						return -1;
					return 1;
				});
				this.currentPage.currentFile.title = inputValue;
				this.currentPage.fileUpdateTitleOn = false;
				return true;
			}

			if (response.statusCode === 401)
			{
				this.archivedUpdateTitle = [true, inputValue];
				this.callInputPasswordError();
				this.currentPage.fileUpdateTitleOn = false;
				return;
			}

			throw Error;
		}
		catch
		{
			this.errorPage('500 - Internal Server Error', 'Ocorreu um erro com o servidor...\nSinto muito pelo incômodo :(');
			return false;
		}
	}

	public setTitleEvents()
	{
		const inputTitle = this.titleInput.nativeElement;

		const inputTitleEvent = () =>
		{
			this.currentPage.currentFile.title = inputTitle.value;
			this.updatePage();
			this.updateFileTitle();
			inputTitle.removeEventListener('focusout', inputTitleEvent)
		};

		const clickTitleEvent = (event: KeyboardEvent) =>
		{
			if (event.key === 'Enter')
			{
				inputTitle.value = inputTitle.value.slice(0, inputTitle.value.length-1);
				inputTitle.blur();
				inputTitle.removeEventListener('keyup', clickTitleEvent);
			}
		}

		inputTitle.addEventListener('focusout', inputTitleEvent);
		inputTitle.addEventListener('keyup', clickTitleEvent);
	}

	public async loadFileData()
	{
		try
		{
			const response = await this._file
				.getFileId(this.currentPage.titleSlug, this.currentPage.pinSlug, this.currentPage.currentFile.id);

			if (response.statusCode === 200)
			{
				this.currentPage.currentFile = new FileModel(response.content.id, response.content.title, '');
				this.currentPage.currentFileData = response.content.content;
				this.currentPage.currentFileDataCopy = this.currentPage.currentFileData;


				this.currentPage.fileUpdateContentOn = false;
				this.updatePage();
				return;
			}

			if (response.statusCode === 401)
			{
				this.callInputPasswordError();
				this.currentPage.fileUpdateContentOn = false;
				return;
			}

			throw Error;
		}
		catch
		{
			this.errorPage('500 - Internal Server Error', 'Ocorreu um erro com o servidor...\nSinto muito pelo incômodo :(');
		}
	}


	//##############################
	// * LINES *
	//##############################
	public callUpdateFileContent()
	{
		const content = this.contentFile.nativeElement;

		if (content)
		{
			this.updateFileContent(content.value);
		}
	}

	private async updateFileContent(content: string)
	{
		this.currentPage.fileUpdateContentInputOn = true;

		if ((content === this.currentPage.currentFileDataCopy))
		{
			await new Promise(resolve => setTimeout(resolve, 1));
			this.currentPage.fileUpdateContentInputOn = false;
			return;
		}

		this.currentPage.currentFileData = content;
		this.currentPage.currentFileDataCopy = this.currentPage.currentFileData;
		this.updatePage();

		try
		{
			var resonse = await this._file.updateFileContent
			(
				this.currentPage.titleSlug,
				this.currentPage.pinSlug,
				this.currentPage.currentFile.id,
				content
			);

			if (resonse.statusCode === 200)
			{
				this.currentPage.fileUpdateContentInputOn = false;
				return;
			}

			if (resonse.statusCode === 401)
			{
				this.archivedUpdateContent = [true, content];
				this.callInputPasswordError();
				this.currentPage.fileUpdateContentInputOn = false;
				return;
			}

			throw Error;
		}
		catch
		{
			this.errorPage('500 - Internal Server Error', 'Ocorreu um erro com o servidor...\nSinto muito pelo incômodo :(');
		}

	}


	//##############################
	// * ERROR *
	//##############################
	public errorPage(
		error: TypeErrorPage = '500 - Internal Server Error',
		message: string = 'Ocorreu um erro com o servidor...\nSinto muito pelo incômodo :('): void
	{
		this.currentPage.pageOn = false;
		this.pageErrorOn = true;
		this.pageErrorTitle = error;
		this.pageErrorContent = message;
		this.updatePage();
	}

	public errorPageAction()
	{
		this._router.navigate(['']);
	}
}
