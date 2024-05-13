import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component
({
	selector: 'app-note-page',
	standalone: true,
	imports: [FooterComponent],
	templateUrl: './note-page.component.html',
	styleUrl: './note-page.component.scss'
})
export class NotePageComponent implements OnInit
{
	//Objeto DTO de Página
	public slug: string = '';

	constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

	public ngOnInit(): void
	{
		this.slug = this.activatedRoute.snapshot.paramMap.get('pageUrlSlug') ?? '';

		if (this.isValidUrlSlug())
			if (this.isPageExist())
				if (!this.isPasswordExist()) this.initPage();
	}

	private isValidUrlSlug(): boolean
	{
		if ((this.slug === '') || (this.slug.length < 7) || (this.slug[this.slug.length-6] !== '-'))
		{
			this.errorPage('400 - Bad Request', 'A URL não está no formato de uma página de anotações.');
			return false;
		}

		return true;
	}

	private isPageExist(): boolean
	{
		const namePage = this.slug.slice(0,this.slug.length-6);
		const pin      = this.slug.slice(this.slug.length-5,this.slug.length);

		//Consulta para o banco de dados...
		const requestPageId: number = -1; //namePage e pin

		if (!requestPageId)
		{
			this.errorPage('404 - Not Found', 'A página que você procura, não existe...');
			return false;
		}

		//this.objPage.id = requestPageId;
		return true;
	}

	private isPasswordExist(): boolean
	{
		//Consulta ao banco de dados
		const requestPassword: string | null = null; //Pegar a senha

		if (requestPassword)
		{
			//Digitar senha
			//Ativar Modal de Coleta de Senha
			return true;
		}

		return false;
	}

	public checkPassword(): void
	{
		//Método chamado pelo modal para checar se a senha está correr
		//Caso verdadeiro -> this.initPage();
		//Caso falso      -> this.errorPage('401 - Unauthorized', 'Senha incorreta!');
	}

	private initPage(): void
	{
		//Pegar todos os dados da página no Banco de Dados
		//Tornar a página visivel
	}

	private errorPage(error: string, message: string): void
	{
		alert
		(
			'Erro: ' + error + '.\n' +
			'Descrição: ' + message
		);

		this.router.navigate(['']);
	}
}
