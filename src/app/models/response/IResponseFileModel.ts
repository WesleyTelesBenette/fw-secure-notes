import { IFileModel } from "../general/IFileModel";

export interface IResponseFileModel
{
	message: string | null;
	statusCode: number;
	content: IFileModel | null;
}

export class ResponseFileModel implements IResponseFileModel
{
	public constructor(
		public message: string | null,
		public statusCode: number,
		public content: IFileModel | null
	) {}
}
