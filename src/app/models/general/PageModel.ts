import { FileModel, IFileModel } from "./IFileModel";

export default class PageModel
{
	public pageOn: boolean = false;
	public pageShowMode: 'edit' | 'view' = 'view';

	public pageTitle: string = '';
	public titleSlug: string = '';
	public pinSlug: string = '';

	public pageHasPassword: boolean = true;
	public currentTheme: number = 0;

	public pageUpdateTheme: boolean = false;
	public pageUpdatePassword: boolean = false;
	public fileUpdateTitleOn: boolean = false;
	public fileUpdateContentOn: boolean = true;
	public fileUpdateContentInputOn: boolean = false;

	public fileList: IFileModel[] = [];
	public currentFile: IFileModel = new FileModel(0, '', '');
	public currentFileData: string = '';
	public currentFileDataCopy: string = '';

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
