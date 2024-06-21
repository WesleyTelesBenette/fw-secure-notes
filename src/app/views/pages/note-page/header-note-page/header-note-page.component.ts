import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import ModalInfoComponent from "../../../components/modal-info/modal-info.component";

import JwtTokenService from '../../../../services/jwt-token/JwtTokenService';
import RequestFileService from '../../../../services/database/RequestFileService';
import PageModel from '../../../../models/general/PageModel';
import RequestPageService from '../../../../services/database/RequestPageService';
import { FormsModule } from '@angular/forms';
import { LoadingContentPageComponent } from '../../../components/loading-content-page/loading-content-page.component';

@Component
({
    selector: 'app-header-note-page',
    standalone: true,
    templateUrl: './header-note-page.component.html',
    styleUrl: './header-note-page.component.scss',
    imports: [CommonModule, ModalInfoComponent, FormsModule, LoadingContentPageComponent]
})
export default class HeaderNotePageComponent implements OnInit
{
	@Input() currentPage!: PageModel;
	@Output() throwError: EventEmitter<any> = new EventEmitter<any>();
	@Output() loadFile: EventEmitter<any> = new EventEmitter<any>();

	public themeColors: [string,string][] =
	[
		['', '#2c2c2c'],
		['red', '#530000'],
		['blue', '#110a69'],
		['purple', '#2c0e6b'],
		['green', '#257951'],
		['gold', '#c08600'],
		['brown', '#504020'],
		['coffe', '#292118'],
	];
	public oldPasswordInput: string = '';
	public newPasswordInput: string = '';

	public filesPageOn: boolean = false;
	public configPageOn: boolean = false;
	public updatePasswordOn: boolean = false;
	public infoPageOn: boolean = false;
	public linkCopyOn: boolean = false;
	public deletePageOn: boolean = false;

	public constructor
	(
		private _token: JwtTokenService,
		private _router: Router,
		private _page: RequestPageService,
		private _file: RequestFileService,
		private _render: Renderer2
	) {}

	public async ngOnInit()
	{
		await this.getFileList();
		this.currentPage.currentFile = this.currentPage.fileList[0];
		this.setTheme(await this.getTheme());
		this.loadFile.emit();
	}

	public selectFile(id: number)
	{
		this.currentPage.fileUpdateContentOn = true;
		this.currentPage.currentFile.id = id;
		this.currentPage.pageShowMode = 'view';
		this.loadFile.emit();
	}

	private getIndexForId(id: number): number
	{
		const file = this.currentPage.fileList.find(f => f.id === id);
		return this.currentPage.fileList.indexOf(file!);
	}

	public async getFileList()
	{
		try
		{
			this.currentPage.fileUpdateContentOn = true;

			const files = await this._page
				.getFileList(this.currentPage.titleSlug, this.currentPage.pinSlug);

			this.currentPage.fileList = files.content ?? [];
		}
		catch { this.throwError.emit(); }
	}

	public async createFile()
	{
		try
		{
			this.currentPage.fileUpdateContentOn = true;
			this.toggleFilesPageOn();

			const response = await this._file
				.createFile(this.currentPage.titleSlug, this.currentPage.pinSlug, '');

			if (response.statusCode == 201)
			{
				this.currentPage.fileList[this.currentPage.fileList.length-1] = response.content;
				this.selectFile(response.content.id);
				this.getFileList();
			}
		}
		catch { this.throwError.emit(); }
	}

	public async deleteFile(id: number)
	{
		try
		{
			const fileDeleteIndex = this.getIndexForId(id);
			this.currentPage.fileList.splice(fileDeleteIndex, 1);

			if (this.currentPage.currentFile?.id === id)
			{
				const newSelectIndex = (fileDeleteIndex > 0) ? fileDeleteIndex - 1 : 0;
				const newFileSelectId = this.currentPage.fileList[newSelectIndex].id;

				this.selectFile(newFileSelectId);
			}

			await this._file.deleteFileIndex(this.currentPage.titleSlug, this.currentPage.pinSlug, id);
		}
		catch { this.throwError.emit(); }
	}

	public copyLink()
	{
		const linkPage = window.location.href;
		navigator.clipboard.writeText(linkPage).then().catch((e) => console.error(e));
		this.toggleCopyLink();
	}

	private async getTheme(): Promise<number>
	{
		try
		{
			const response = await this._page.getPageTheme(this.currentPage.titleSlug, this.currentPage.pinSlug);

			if (response.statusCode === 200)
			{
				return response.content ?? 0;
			}

			return 0;
		}
		catch { this.throwError.emit(); return 0; }
	}

	public async setAndSaveTheme(index: number)
	{
		const updateTheme = this.setTheme(index);

		if (updateTheme)
		{
			this.currentPage.pageUpdateTheme = true;

			try
			{
				const response = await this._page.setPageTheme(this.currentPage.titleSlug, this.currentPage.pinSlug, index);

				if (response.statusCode === 200)
				{
					this.currentPage.pageUpdateTheme = false;
					return;
				}

				throw Error;
			}
			catch { this.throwError.emit(); }
		}
	}

	public setTheme(index: number): boolean
	{
		const elementBody = document.querySelector('body') as HTMLBodyElement;
		const elementHtml = document.querySelector('html') as HTMLElement;

		if ((elementBody) && (elementHtml))
		{
			if (((index === 0) && (elementBody.classList.length > 0)) || (this.themeColors[index][0] != elementBody.classList[0]))
			{
				while (elementBody.classList.length > 0)
					this._render.removeClass(elementBody, elementBody.classList[0]);

				this._render.removeClass(elementHtml, elementHtml.classList[0]);

				if (index !== 0)
				{
					this._render.addClass(elementBody, this.themeColors[index][0]);
					this._render.addClass(elementHtml, this.themeColors[index][0]);
				}

				this.currentPage.currentTheme = index;

				return true;
			}
		}

		return false;
	}

	public async updatePassword()
	{
		try
		{
			this.currentPage.pageUpdatePassword = true;
			const response = await this._page.setPagePassword(this.currentPage.titleSlug, this.currentPage.pinSlug, this.oldPasswordInput, this.newPasswordInput);

			if (response.statusCode === 200)
			{
				this.currentPage.pageUpdatePassword = false;
				this.toggleUpdatePasswordOn();
				return;
			}

			throw Error;
		}
		catch { this.throwError.emit(); }
	}

	public logOut()
	{
		this._token.setToken('');
		this._router.navigate(['']);
	}

	public async deletePage()
	{
		this.currentPage.pageOn = false;

		try
		{
			this.currentPage.pageUpdatePassword = true;
			const response = await this._page.deletePage(this.currentPage.titleSlug, this.currentPage.pinSlug);

			if (response.statusCode === 200)
			{
				this.logOut();
				return;
			}

			throw Error;
		}
		catch { this.throwError.emit(); }
	}

	public togglePageShowMode(mode: 'edit' | 'view')
		{ this.currentPage.pageShowMode = mode; }

	public toggleFilesPageOn()
		{ this.filesPageOn = !this.filesPageOn; }

	public toggleConfigPageOn()
		{ this.configPageOn = !this.configPageOn; }

	public toggleUpdatePasswordOn()
		{ this.updatePasswordOn = !this.updatePasswordOn; this.toggleConfigPageOn(); }

	public toggleInfoPageOn()
		{ this.infoPageOn = !this.infoPageOn; }

	public toggleCopyLink()
		{ this.linkCopyOn = !this.linkCopyOn; }

	public toggleDeletePageOn()
		{ this.deletePageOn = !this.deletePageOn; this.toggleConfigPageOn(); }
}
