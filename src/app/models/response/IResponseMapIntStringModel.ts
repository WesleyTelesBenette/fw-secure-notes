
export default interface IResponseMapIntStringModel
{
	message: string | null;
	statusCode: number;
	content: { [key: number]: string };
}

export class ResponseMapIntStringModel implements IResponseMapIntStringModel
{
	public constructor(
		public message: string | null,
		public statusCode: number,
		public content: { [key: number]: string }
	) {}
}
