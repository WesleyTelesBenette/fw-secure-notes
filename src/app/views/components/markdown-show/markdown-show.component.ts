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
export class MarkdownShowComponent implements AfterViewInit
{
	@ViewChild('markdownLine') line!: ElementRef<HTMLDivElement>;
	private lineTypes: string[] = ['- ', '-- ', '--- ','---- ', '# ', '## ', '### ', '---'];
	public finalContent: string = '';
	public ngContent: string = '';

	public constructor(private cdr: ChangeDetectorRef) {}

	public ngAfterViewInit(): void
	{
		if (this.finalContent === '')
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
			case(this.lineTypes[0]): { contentText = `<li>${contentNext}</li>`; break; }
			case(this.lineTypes[1]): { contentText = `<li class="sub1">${contentNext}</li>`; break; }
			case(this.lineTypes[2]): { contentText = `<li class="sub2">${contentNext}</li>`; break; }
			case(this.lineTypes[3]): { contentText = `<li class="sub3">${contentNext}</li>`; break; }
			case(this.lineTypes[4]): { contentText = `<h2>${contentNext}</h2>`; break; }
			case(this.lineTypes[5]): { contentText = `<h3>${contentNext}</h3>`; break; }
			case(this.lineTypes[6]): { contentText = `<h4>${contentNext}</h4>`; break; }
			case(this.lineTypes[7]): { contentText = `<hr/>`; break; }
			default: { contentText = (content !== '') ? `<p>${content}</p>` : '<br/>'; }
		}

		return contentText;
	}

	private setLineStyles(content: string): string
	{
		return content
			.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
			.replace(/\*\*\*\b(.*?)\b\*\*\*/g,  '<i><b>$1</b></i>')
			.replace(/\*\*\b(.*?)\b\*\*/g,      '<b>$1</b>')
			.replace(/\*\b(.*?)\b\*/g,      '<i>$1</i>')
			.replace(/\~(.*?)\~/g,          '<s>$1</s>')
			.replace(/\_(.*?)\_/g,          '<u>$1</u>');
	}

	public contentHandled(): void
	{
		let content = this.line?.nativeElement.textContent?.trim();

		if (content !== undefined)
		{
			let contentLines = content.split('\n');

			for (let line of contentLines)
			{
				line = this.sanitizeText(line);
				line = this.setLineType(line);
				line = this.setLineStyles(line);

				this.finalContent += line;
			}
		}
	}
}
