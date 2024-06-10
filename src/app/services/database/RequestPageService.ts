import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { catchError } from 'rxjs/internal/operators/catchError';

import DatabaseProperties from './DatabaseProperties';
import JwtTokenService from '../jwt-token/JwtTokenService';
import IResponseBoolModel, { ResponseBoolModel } from '../../models/response/IResponseBoolModel';
import IResponseMapIntStringModel, { ResponseMapIntStringModel } from '../../models/response/IResponseMapIntStringModel';

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

	public async getIsPageExist(title: string, pin: string): Promise<IResponseBoolModel>
	{
		try
		{
			const url = `${this._urlService}${title}/${pin}/exist/`;
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

	// public getPageFileList(): ResponseObject | null
	// {

	// }

	// public createPage(): ResponseObject | null
	// {

	// }

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
