import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import ModalInfoComponent from "../../../components/modal-info/modal-info.component";

import JwtTokenService from '../../../../services/jwt-token/JwtTokenService';
import RequestFileService from '../../../../services/database/RequestFileService';
import PageModel from '../../../../models/general/PageModel';
import RequestPageService from '../../../../services/database/RequestPageService';

@Component
({
    selector: 'app-header-note-page',
    standalone: true,
    templateUrl: './header-note-page.component.html',
    styleUrl: './header-note-page.component.scss',
    imports: [CommonModule, ModalInfoComponent]
})
export default class HeaderNotePageComponent implements OnInit
{
	@Input() currentPage!: PageModel;
	@Output() throwError: EventEmitter<any> = new EventEmitter<any>();
	@Output() loadFile: EventEmitter<any> = new EventEmitter<any>();

	public filesPageOn: boolean = false;
	public themePageOn: boolean = false;
	public infoPageOn: boolean = false;
	public linkCopyOn: boolean = false;

	public constructor
	(
		private _token: JwtTokenService,
		private _router: Router,
		private _page: RequestPageService,
		private _file: RequestFileService
	) {}

	public async ngOnInit()
	{
		await this.getFileList();
		this.currentPage.currentFile = this.currentPage.fileList[0];
		this.loadFile.emit();
	}

	public selectFile(id: number)
	{
		this.currentPage.fileUpdateContentOn = true;
		this.currentPage.currentFile.id = id;
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

	public async logOut()
	{
		this._token.setToken('');
		this._router.navigate(['']);
	}

	public togglePageShowMode(mode: 'edit' | 'view')
		{ this.currentPage.pageShowMode = mode; }

	public toggleFilesPageOn()
		{ this.filesPageOn = !this.filesPageOn; }

	public toggleThemePageOn()
		{ this.themePageOn = !this.themePageOn; }

	public toggleInfoPageOn()
		{ this.infoPageOn = !this.infoPageOn; }

	public toggleCopyLink()
		{ this.linkCopyOn = !this.linkCopyOn; }
}

