import { IFileModel } from "../general/IFileModel";

export interface IResponseFileArrayModel
{
	message: string | null;
	statusCode: number;
	content: IFileModel[] | null;
}

export class ResponseFileArrayModel implements IResponseFileArrayModel
{
	public constructor(
		public message: string | null,
		public statusCode: number,
		public content: IFileModel[] | null
	) {}
}
