
export default interface IResponseStringModel
{
	message: string | null;
	statusCode: number;
	content: string | null;
}

export class ResponseStringModel implements IResponseStringModel
{
	public constructor(
		public message: string | null,
		public statusCode: number,
		public content: string | null
	) {}
}
