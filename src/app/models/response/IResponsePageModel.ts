
export default interface IResponsePageModel
{
	message: string | null;
	statusCode: number;
	content: { title: string, pin: string } | null;
}

export class ResponsePageModel implements IResponsePageModel
{
	public constructor
	(
		public message: string | null,
		public statusCode: number,
		public content: { title: string, pin: string } | null
	) {}
}
