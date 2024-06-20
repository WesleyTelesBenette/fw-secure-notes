import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { catchError } from 'rxjs/internal/operators/catchError';

import DatabaseProperties from './DatabaseProperties';
import JwtTokenService from '../jwt-token/JwtTokenService';
import IResponseBoolModel, { ResponseBoolModel } from '../../models/response/IResponseBoolModel';
import IResponseMapIntStringModel, { ResponseMapIntStringModel } from '../../models/response/IResponseMapIntStringModel';
import { IResponseFileArrayModel, ResponseFileArrayModel } from '../../models/response/IResponseFileArrayModel';
import IResponsePageModel, { ResponsePageModel } from '../../models/response/IResponsePageModel';

@Injectable({providedIn: 'root'})
export default class RequestPageService
{
	private readonly _slugService: string = 'page/';
	private readonly _headers: HttpHeaders = new HttpHeaders();
	private readonly _urlService: string;
	private statusCode: number = 0;

	public constructor(
		private _http: HttpClient,
		private _dataProps: DatabaseProperties,
		private _token: JwtTokenService)
	{
		this._urlService = `${this._dataProps.apiUrl}/${this._slugService}`;
	}

	public async createPage(title: string, password: string): Promise<IResponsePageModel>
	{
		try
		{
			const url = this._urlService;
			const body = { title, password }
			const response = firstValueFrom(
				this._http.post<IResponsePageModel>(url, body).pipe(
					catchError(error =>
					{
						this.statusCode = error.status;
						throw Error;
					})
				)
			);

			return await response;
		}
		catch
		{
			let errorObjet: IResponsePageModel = new ResponsePageModel('Error', this.statusCode, null);
			return errorObjet;
		}
	}

	public async getIsPageExist(title: string, pin: string): Promise<IResponseBoolModel>
	{
		try
		{
			const url = `${this._urlService}${title}/${pin}/exist/`;
			const body = {}
			const response = firstValueFrom(
				this._http.get<IResponseBoolModel>(url).pipe(
					catchError(error =>
					{
						this.statusCode = error.status;
						throw Error;
					})
				)
			);

			return await response;
		}
		catch
		{
			let errorObjet: IResponseBoolModel = new ResponseBoolModel('Error', this.statusCode, null);
			return errorObjet;
		}
	}


	public async getThemeList(): Promise<IResponseMapIntStringModel>
	{
		try
		{
			const url = `${this._urlService}themes/`;
			const headers = new HttpHeaders().set('Authorization', this._token.getToken());
			const response = firstValueFrom(
				this._http.get<IResponseMapIntStringModel>(url, { headers: headers }).pipe(
					catchError(error =>
					{
						this.statusCode = error.status;
						throw Error;
					})
				)
			);

			return await response;
		}
		catch
		{
			let errorObjet: IResponseMapIntStringModel = new ResponseMapIntStringModel('Error', this.statusCode, []);
			return errorObjet;
		}
	}



	// public getPageTheme(): ResponseObject | null
	// {

	// }

	public async getFileList(title: string, pin: string): Promise<IResponseFileArrayModel>
	{
		try
		{
			const url = `${this._urlService}${title}/${pin}/files/`;
			const headers = new HttpHeaders().set('Authorization', this._token.getToken());
			const response = firstValueFrom(
				this._http.get<IResponseFileArrayModel>(url, { headers: headers }).pipe(
					catchError(error =>
					{
						this.statusCode = error.status;
						throw Error;
					})
				)
			);

			return await response;
		}
		catch
		{
			let errorObjet: IResponseFileArrayModel = new ResponseFileArrayModel('Error', this.statusCode, null);
			return errorObjet;
		}
	}


	// public setPageTheme(): ResponseObject | null
	// {

	// }

	// public setPagePassword(): ResponseObject | null
	// {

	// }

	// public deletePage(): ResponseObject | null
	// {

	// }
}
