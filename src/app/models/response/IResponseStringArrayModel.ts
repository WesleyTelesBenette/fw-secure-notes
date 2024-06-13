
export interface IResponseStringArrayModel
{
	message: string | null;
	statusCode: number;
	content: string[] | null;
}

export class ResponseStringArrayModel implements IResponseStringArrayModel
{
	public constructor(
		public message: string | null,
		public statusCode: number,
		public content: string[] | null
	) {}
}
