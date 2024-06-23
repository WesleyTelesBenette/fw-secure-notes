
export interface IFileModel
{
	id: number;
	title: string;
	content: string;
}

export class FileModel implements IFileModel
{
	public constructor(
		public id: number,
		public title: string,
		public content: string)
	{}
}
