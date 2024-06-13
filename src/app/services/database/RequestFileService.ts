import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { catchError } from 'rxjs/internal/operators/catchError';

import DatabaseProperties from "./DatabaseProperties";
import JwtTokenService from "../jwt-token/JwtTokenService";
import { IResponseFileModel, ResponseFileModel } from "../../models/response/IResponseFileModel";
import IResponseBoolModel, { ResponseBoolModel } from "../../models/response/IResponseBoolModel";

@Injectable({providedIn: 'root'})
export default class RequestFileService
{
	private readonly _slugService: string = 'file/';
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

	public async getFileId(title: string, pin: string, id: number): Promise<IResponseFileModel>
	{
		try
		{
			const url = `${this._urlService}${title}/${pin}/${id}/`;
			const headers = new HttpHeaders().set('Authorization', this._token.getToken());
			const response = firstValueFrom(
				this._http.get<IResponseFileModel>(url, { headers: headers }).pipe(
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
			let errorObjet: IResponseFileModel = new ResponseFileModel('Error', this.statusCode, null);
			return errorObjet;
		}
	}

	public async createFile(title: string, pin: string, titlePage: string): Promise<IResponseFileModel>
	{
		try
		{
			const url = `${this._urlService}${title}/${pin}/`;
			const headers = new HttpHeaders().set('Authorization', this._token.getToken());
			const body = { title: titlePage }
			const response = firstValueFrom(
				this._http.post<IResponseFileModel>(url, body, { headers: headers }).pipe(
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
			let errorObjet: IResponseFileModel = new ResponseFileModel('Error', this.statusCode, null);
			return errorObjet;
		}
	}

	public async updateFileTitle(title: string, pin: string, id: number, newTitle: string): Promise<IResponseBoolModel>
	{
		try
		{
			const url = `${this._urlService}${title}/${pin}/${id}/title/`;
			const headers = new HttpHeaders().set('Authorization', this._token.getToken());
			const body = { title: newTitle }
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

	public async deleteFileIndex(title: string, pin: string, id: number): Promise<IResponseBoolModel>
	{
		try
		{
			const url = `${this._urlService}${title}/${pin}/${id}/`;
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
