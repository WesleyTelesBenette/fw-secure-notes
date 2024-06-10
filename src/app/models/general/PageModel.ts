
export default class PageModel
{
	public pageOn: boolean = false;

	public pageTitle: string = '';
	public pageSlug: string = '';
	public pinSlug: string = '';

	public pageHasPassword: boolean = true;
	public pagePasswordOn: boolean = false;

	public titleCurrentFile: string = '';
	public contentCurrentFile: string[] = [];

	public pageErrorOn: boolean = false;
	public pageErrorTitle: string = '';
	public pageErrorContent: string = '';

	public setPageSlug(slug: string): boolean
	{
		if ((slug !== "") && (slug.length <= 25))
		{
			this.pageSlug = slug;
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
