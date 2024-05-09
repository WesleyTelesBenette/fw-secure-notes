import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from '../../components/footer/footer.component';

/** Componente da página principal da aplicação.
 *
 * Usado como a pagina padrão da rota raiz do site.
 */
@Component
({
	selector: 'app-home-page',
	standalone: true,
	imports: [FooterComponent, FormsModule],
	templateUrl: './home-page.component.html',
	styleUrl: './home-page.component.scss'
})
export class HomePageComponent
{
	/** Atributo que representa o conteúdo do ***input*** principal.
	 *
	 * Ele é (e deve ser) sincronizado pelo [(ngModel)].
	 *
	 * @type string
	 */
	pageName: string = '';

	/** Método que delimita os caracteres que podem ser utilizados para o nome de uma página.
	 *
	 * Ele filtra e altera diretamente o valor do conteúdo do ***input***.
	 *
	 * @returns void
	 */
	public limitPageName(): void
	{
		let newPageName: string = this.pageName;

		//Todas as letras, números e o hífen -> /[^a-zA-Z0-9-]
		newPageName = newPageName.replace(/[^a-zA-Z0-9-]/g, '-');

		this.pageName = newPageName;
	}

	/**
	 *
	 */
	public createNote(): void
	{
		const inputContent: string | undefined | null = document.getElementById('input')?.textContent;

		if (inputContent) alert(inputContent);

		return;
	}

	/**
	 *
	 */
	public searchNote(): void
	{
		const inputContent: string | undefined | null = document.getElementById('input')?.textContent;

		if (inputContent) alert(inputContent);

		return;
	}
}
