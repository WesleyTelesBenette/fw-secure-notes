import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { firstValueFrom } from "rxjs/internal/firstValueFrom";
import { catchError } from "rxjs/internal/operators/catchError";

import DatabaseProperties from "./DatabaseProperties";
import JwtTokenService from "../jwt-token/JwtTokenService";
import IResponseBoolModel, { ResponseBoolModel } from "../../models/response/IResponseBoolModel";
import IResponseStringModel, { ResponseStringModel } from "../../models/response/IResponseStringModel";

@Injectable({providedIn: 'root'})
export default class RequestAuthorizationService
{
	private readonly _slugService: string = 'authentication/';
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

	public async getPageHasPassword(title: string, pin: string): Promise<IResponseBoolModel>
	{
		try
		{
			const url = `${this._urlService}${title}/${pin}/password/`;
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

	public async checkValidToken(title: string, pin: string): Promise<IResponseBoolModel>
	{
		try
		{
			const url = `${this._urlService}${title}/${pin}/validate/`;
			const headers = new HttpHeaders().set('Authorization', this._token.getToken());
			const response = firstValueFrom(
				this._http.get<IResponseBoolModel>(url, { headers: headers }).pipe(
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

	public async createToken(title: string, pin: string, password: string): Promise<IResponseStringModel>
	{
		try
		{
			const url = `${this._urlService}${title}/${pin}/`;
			const body = { Password: password };

			const response = await firstValueFrom(
				this._http.post<IResponseStringModel>(url, body).pipe(
					catchError(error =>
					{
						this.statusCode = error.status;
						throw Error;
					})
				)
			);

			if ((response.content != null) && (response.content != undefined))
			{
				this._token.setToken(response.content ?? '');
				console.log("Token criado: ", response.content); //##########################################################
			}

			return response;
		}
		catch(error)
		{
			let errorObjet: IResponseStringModel = new ResponseStringModel('Error', this.statusCode, null);
			return errorObjet;
		}
	}
}
