import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { catchError } from 'rxjs/internal/operators/catchError';

import DatabaseProperties from './DatabaseProperties';
import JwtTokenService from '../jwt-token/JwtTokenService';
import IResponseBoolModel, { ResponseBoolModel } from '../../models/response/IResponseBoolModel';
import { IResponseFileArrayModel, ResponseFileArrayModel } from '../../models/response/IResponseFileArrayModel';
import IResponsePageModel, { ResponsePageModel } from '../../models/response/IResponsePageModel';
import IResponseNumberModel, { ResponseNumberModel } from '../../models/response/IResponseIntModel';

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


	//Gets
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

	public async getPageTheme(title: string, pin: string): Promise<IResponseNumberModel>
	{
		try
		{
			const url = `${this._urlService}${title}/${pin}/theme/`;
			const headers = new HttpHeaders().set('Authorization', this._token.getToken());
			const response = firstValueFrom(
				this._http.get<IResponseNumberModel>(url, { headers: headers }).pipe(
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
			let errorObjet: IResponseNumberModel = new ResponseNumberModel('Error', this.statusCode, null);
			return errorObjet;
		}
	}

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


	//Posts
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


	//Puts
	public async setPageTheme(title: string, pin: string, theme: number): Promise<IResponseBoolModel>
	{
		try
		{
			const url = `${this._urlService}${title}/${pin}/theme/`;
			const headers = new HttpHeaders().set('Authorization', this._token.getToken());
			const body = { theme };
			const response = firstValueFrom(
				this._http.put<IResponseBoolModel>(url, body, { headers: headers }).pipe(
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

	public async setPagePassword(title: string, pin: string, oldPassword: string, newPassword: string): Promise<IResponseBoolModel>
	{
		try
		{
			const url = `${this._urlService}${title}/${pin}/password/`;
			const headers = new HttpHeaders().set('Authorization', this._token.getToken());
			const body = { oldPassword, newPassword };
			const response = firstValueFrom(
				this._http.put<IResponseBoolModel>(url, body, { headers: headers }).pipe(
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


	//Deletes
	public async deletePage(title: string, pin: string): Promise<IResponseBoolModel>
	{
		try
		{
			const url = `${this._urlService}${title}/${pin}/`;
			const headers = new HttpHeaders().set('Authorization', this._token.getToken());
			const response = firstValueFrom(
				this._http.delete<IResponseBoolModel>(url, { headers: headers }).pipe(
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
}
