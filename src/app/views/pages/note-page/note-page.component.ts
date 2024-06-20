import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import PageModel from '../../../models/general/PageModel';
import RequestPageService from '../../../services/database/RequestPageService';
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
		CommonModule, FormsModule,
		FooterComponent, ModalInfoComponent,
		InputPasswordComponent, HeaderNotePageComponent,
		LoadingContentPageComponent, MarkdownShowComponent
	],
	styleUrls: ['./note-page.component.scss', '../../components/markdown-show/markdown-show.component.scss'],
	templateUrl: './note-page.component.html',
})
export class NotePageComponent implements OnInit, AfterViewChecked
{
	private pageSubject = new BehaviorSubject<PageModel>(new PageModel());
	private page$ = this.pageSubject.asObservable();
	public currentPage!: PageModel;

	@ViewChild('contentFile') content!: ElementRef<HTMLDivElement>;
	@ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
	public titleInputOn: boolean = false;

	public pagePasswordOn: boolean = false;
	public inputPasswordModal: string = '';

	public pageErrorOn: boolean = false;
	public pageErrorTitle: string = '';
	public pageErrorContent: string = '';

	constructor(
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _page: RequestPageService,
		private _file: RequestFileService,
		private _authorizarion: RequestAuthorizationService,
		private _token: JwtTokenService
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
	public async updateFileTitle()
	{
		const inputValue = this.titleInput.nativeElement.value;
		const oldFileIndex = this.currentPage.fileList.indexOf
		(
			this.currentPage.fileList.find(f => f.id == this.currentPage.currentFile.id)
			?? new FileModel(-1, '', [])
		);

		if ((oldFileIndex === -1) || (this.currentPage.fileList[oldFileIndex].title == inputValue))
			return;

		this.currentPage.fileUpdateTitleOn = true;

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
				return;
			}

			throw Error;
		}
		catch
		{
			this.errorPage('500 - Internal Server Error', 'Ocorreu um erro com o servidor...\nSinto muito pelo incômodo :(');
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

			if (response.statusCode == 200)
			{
				const data = response.content;
				let fileData: MapIntString[] = [];

				for (let c = 0; c < data.content.length; c++)
					fileData.push(new MapIntString(c, data.content[c]));

				this.currentPage.currentFileIndex = fileData.length - 1;
				this.currentPage.currentFile = new FileModel(data.id, data.title, []);
				this.currentPage.currentFileData  = fileData;
				this.currentPage.currentFileDataCopy = this.currentPage.currentFileData;

				this.currentPage.fileUpdateContentOn = false;
				this.updatePage();
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
	public lineEventUpdateWithFocus(event: Event, indexShow: number, indexFile: number)
	{
		const elementInput = event.target as HTMLInputElement;
		const oldDataLine = this.currentPage.currentFileDataCopy.find(f => f.index === indexFile);

		if ((oldDataLine) && (oldDataLine.line != elementInput.value))
		{
			this.updateFileLineContent(indexShow, indexFile, elementInput.value);
		}
	};

	public lineEventChangeWithClick(event: KeyboardEvent, indexShow: number, indexFile: number)
	{
		const elementInput = event.target as HTMLInputElement;

		if (elementInput === document.activeElement)
		{
			const dataLine = this.currentPage.currentFileDataCopy.find(f => f.index === indexFile);

			if (dataLine)
			{
				if (event.key === 'Enter')
				{
					elementInput.blur();
					this.updateFileAddLine(indexShow+1);
					return;
				}

				if((event.key === 'Backspace') && (elementInput.value === '') && (this.currentPage.currentFileData.length > 1))
				{
					this.updateFileRemoveLine(indexShow, indexFile);
					return;
				}
			}
		}
	}

	public ngAfterViewChecked(): void
	{
		if ((this.currentPage.currentSelectFiles.length > 0) && (this.content !== undefined))
		{
			const divInputs = this.content.nativeElement as HTMLDivElement;

			if (divInputs)
			{
				const lineDivs = divInputs.querySelectorAll('.line');

				const firstLineFocus = this.currentPage.currentFileData
					.find(f => f.index === this.currentPage.currentSelectFiles[0]);

				console.log('Update view');
				console.log('len: ', this.currentPage.currentSelectFiles.length);

				if (firstLineFocus)
				{
					const firstLineFocusIndex = this.currentPage.currentFileData.indexOf(firstLineFocus);

					if ((firstLineFocusIndex != -1) && (lineDivs.length >= firstLineFocusIndex))
					{
						const inputDiv = lineDivs[firstLineFocusIndex] as HTMLDivElement;

						if (inputDiv)
						{
							const input = inputDiv.querySelector('.line-content') as HTMLInputElement;

							if (input)
							{
								input.blur();
								input.focus();
								this.currentPage.currentSelectFiles.splice(0, 1);
								this.updatePage();
								return;
							}
						}
					}
				}
			}
		}
	}

	public selectInput(input: HTMLInputElement, index: number)
	{
		input.focus();
		this.currentPage.currentSelectFiles.splice(index, 1);
	}

	private async updateFileAddLine(indexShow: number)
	{
		const currentFileIndex = ++this.currentPage.currentFileIndex;
		this.currentPage.currentFileData.splice(indexShow, 0, new MapIntString(currentFileIndex, ""));
		this.currentPage.currentFileDataCopy = this.currentPage.currentFileData;
		this.currentPage.currentUpdateFileLines.push(currentFileIndex);
		this.updatePage();

		try
		{
			var resonse = await this._file.updateFileAddLine
			(
				this.currentPage.titleSlug,
				this.currentPage.pinSlug,
				this.currentPage.currentFile.id,
				indexShow
			);

			if (resonse.statusCode == 200)
			{
				const lineUpdateIndex = this.currentPage.currentUpdateFileLines.indexOf(currentFileIndex);

				if (lineUpdateIndex != -1)
				{
					this.currentPage.currentUpdateFileLines.splice(lineUpdateIndex, 1);
					this.currentPage.currentSelectFiles.push(currentFileIndex);
					this.updatePage();
					return;
				}
			}

			throw Error;
		}
		catch
		{
			this.errorPage('500 - Internal Server Error', 'Ocorreu um erro com o servidor...\nSinto muito pelo incômodo :(');
		}
	}

	private async updateFileLineContent(indexShow: number, indexFile: number, content: string)
	{
		const fileLine = this.currentPage.currentFileData.find(f => f.index === indexFile);
		const fileUpdate = this.currentPage.currentUpdateFileLines.indexOf(indexFile);

		if ((fileLine === undefined) || (fileUpdate !== -1))
			return;

		const fileLineIndex = this.currentPage.currentFileData.indexOf(fileLine);
		this.currentPage.currentFileData[fileLineIndex].line = content;
		this.currentPage.currentFileDataCopy = this.currentPage.currentFileData;
		this.currentPage.currentUpdateFileLines.push(indexFile);
		this.updatePage();

		try
		{
			var resonse = await this._file.updateFileLineContent
			(
				this.currentPage.titleSlug,
				this.currentPage.pinSlug,
				this.currentPage.currentFile.id,
				indexShow,
				content
			);

			if (resonse.statusCode == 200)
			{
				const lineUpdateIndex = this.currentPage.currentUpdateFileLines.indexOf(indexFile);

				if (lineUpdateIndex != -1)
				{
					this.currentPage.currentUpdateFileLines.splice(lineUpdateIndex, 1);
					return;
				}
			}

			throw Error;
		}
		catch
		{
			this.errorPage('500 - Internal Server Error', 'Ocorreu um erro com o servidor...\nSinto muito pelo incômodo :(');
		}
	}

	public async updateFileRemoveLine(indexShow: number, indexFile: number)
	{
		this.currentPage.currentUpdateFileLines.push(indexFile);
		this.updatePage();

		const lineIndexFileFocus = this.currentPage
			.currentFileData[(indexShow > 0) ? indexShow-1 : 0].index;

		console.log('indexShow: ', indexShow);
		console.log('IndexFocus: ', lineIndexFileFocus);

		try
		{
			var response = await this._file.updateFileRemoveLine
			(
				this.currentPage.titleSlug,
				this.currentPage.pinSlug,
				this.currentPage.currentFile.id,
				indexShow
			);

			if (response.statusCode == 200)
			{
				const lineUpdateIndex = this.currentPage.currentUpdateFileLines.indexOf(indexFile);

				if (lineUpdateIndex != -1)
				{
					this.currentPage.currentUpdateFileLines.splice(lineUpdateIndex, 1);
					this.currentPage.currentFileData.splice(indexShow, 1);
					this.currentPage.currentFileDataCopy = this.currentPage.currentFileData;
					this.currentPage.currentSelectFiles.push(lineIndexFileFocus);
					this.updatePage();
					return;
				}
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
		console.error('Erro: ' + error + '.\n' + 'Descrição: ' + message);

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
