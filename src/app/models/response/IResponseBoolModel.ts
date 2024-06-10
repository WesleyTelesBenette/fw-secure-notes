
export default interface IResponseBoolModel
{
	message: string | null;
	statusCode: number;
	content: boolean | null;
}

export class ResponseBoolModel implements IResponseBoolModel
{
	public constructor
	(
		public message: string | null,
		public statusCode: number,
		public content: boolean | null
	) {}

}
