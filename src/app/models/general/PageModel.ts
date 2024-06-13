import { IFileModel } from "./IFileModel";

export default class PageModel
{
	public pageOn: boolean = false;

	public pageTitle: string = '';
	public titleSlug: string = '';
	public pinSlug: string = '';

	public pageHasPassword: boolean = true;

	public fileUpdateOn: boolean = true;
	public fileList: IFileModel[] = [];
	public currentFile: IFileModel | null = null;

	public setTitleSlug(slug: string): boolean
	{
		if ((slug !== "") && (slug.length <= 25))
		{
			this.titleSlug = slug;
			return true;
		}

		return false;
	}

	public setPinSlug(slug: string): boolean
	{
		const gerex = /^[a-zA-Z0-9\-]+$/;
		if ((gerex.test(slug)) && (slug.length == 3))
		{
			this.pinSlug = slug;
			return true;
		}

		return false;
	}
}
