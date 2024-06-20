import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ContentChild, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component
({
	selector: 'app-markdown-show',
	standalone: true,
	imports: [CommonModule],
	styleUrl: './markdown-show.component.scss',
	templateUrl: './markdown-show.component.html',
})
export class MarkdownShowComponent implements OnInit, AfterViewInit
{
	@ViewChild('markdownLine') line!: ElementRef<HTMLDivElement>;
	//@ContentChild('projectedContent', { static: true }) content!: ElementRef<HTMLDivElement>;
	private lineTypes: string[] = ['---', '- ', '# ', '## ', '### '];
	public lineFinalContent: string = '';
	public ngContent: string = '';

	public constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) {}

	public ngOnInit(): void
	{

	}

	public ngAfterViewInit(): void
	{
		if (this.lineFinalContent === '')
		{
			this.contentHandled();
			this.cdr.detectChanges();
		}
	}

	private sanitizeText(text: string): string
	{
		return text
			.replace(/&/g,  '&amp;')
			.replace(/</g,  '&lt;')
			.replace(/>/g,  '&gt;')
			.replace(/"/g,  '&quot;')
			.replace(/'/g,  '&#x27;')
			.replace(/\//g, '&#x2F;');
	}

	private setLineType(content: string): string
	{
		let contentInit = '';
		let contentNext = '';
		let contentText = '';

		if (content.length > 0)
		{
			for (let c = 0; c < this.lineTypes.length ; c++)
			{
				if (this.lineTypes[c] == content.slice(0, this.lineTypes[c].length))
				{
					contentInit = this.lineTypes[c];
					contentNext = content.slice(this.lineTypes[c].length, content.length);
					break;
				}
			}
		}

		switch (contentInit)
		{
			case(this.lineTypes[0]): { contentText = `<hr/>`; break; }
			case(this.lineTypes[1]): { contentText = `<li>${contentNext}</li>`; break; }
			case(this.lineTypes[2]): { contentText = `<h2>${contentNext}</h2>`; break; }
			case(this.lineTypes[3]): { contentText = `<h3>${contentNext}</h3>`; break; }
			case(this.lineTypes[4]): { contentText = `<h4>${contentNext}</h4>`; break; }
			default: { if (content === '') contentText = `<br/>`; else contentText = content;  }
		}

		return contentText;
	}

	private setLineStyles(content: string): string
	{
		return content
			.replace(/\*\*\*(.*?)\*\*\*/g, '<i><b>$1</b></i>')
			.replace(/\*\*(.*?)\*\*/g,     '<b>$1</b>')
			.replace(/\*(.*?)\*/g,         '<i>$1</i>')
			.replace(/\$\$(.*?)\$\$/g,      '<mark>$1</mark>')
			.replace(/\~(.*?)\~/g,         '<s>$1</s>');
	}

	public contentHandled(): void
	{
		let content = this.line?.nativeElement.textContent?.trim();

		if (content !== undefined)
		{
			content = this.sanitizeText(content);
			content = this.setLineType(content);
			content = this.setLineStyles(content);

			this.lineFinalContent = content;
			console.log(this.lineFinalContent)
		}
	}
}
