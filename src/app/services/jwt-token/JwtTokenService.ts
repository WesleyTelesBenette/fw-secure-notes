import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({providedIn: 'root'})
export default class JwtTokenService
{
	constructor(@Inject(PLATFORM_ID) private platformId: any) {}

	public getToken(): string
	{
		let token: string | null = null;
		const name = 'token=';

		if (isPlatformBrowser(this.platformId))
		{
			const cookieList = document.cookie.split(';');

			for (let c = 0; c < cookieList.length; c++)
			{
				let thisCookie = cookieList[c].trim();
				if (thisCookie.startsWith(name))
				{
					token = thisCookie.substring(name.length);
					break;
				}
			}
		}

		return token ?? "";
	}

	public setToken(token: string): void
	{
		if (isPlatformBrowser(this.platformId))
		{
			const days = 1;
			const date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

			document.cookie = `token=${token ?? ""}; expires=${date.toUTCString()}; path=/`;
		}
	}
}
