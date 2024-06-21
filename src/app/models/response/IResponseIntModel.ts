
export default interface IResponseNumberModel
{
	message: string | null;
	statusCode: number;
	content: number | null;
}

export class ResponseNumberModel implements IResponseNumberModel
{
	public constructor(
		public message: string | null,
		public statusCode: number,
		public content: number | null
	) {}
}
