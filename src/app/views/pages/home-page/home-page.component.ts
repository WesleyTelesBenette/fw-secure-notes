import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from '../../components/footer/footer.component';
import { ModalInfoComponent } from '../../components/modal-info/modal-info.component';

/** Componente da página principal da aplicação.
 *
 * Usado como a pagina padrão da rota raiz do site.
 */
@Component
({
	selector: 'app-home-page',
	standalone: true,
	imports: [FooterComponent, FormsModule, ModalInfoComponent],
	templateUrl: './home-page.component.html',
	styleUrl: './home-page.component.scss'
})
export class HomePageComponent
{
	public constructor()
	{

	}

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
	public limitedPageName(): void
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
		const inputContent: string = (document.getElementById('input') as HTMLInputElement)?.value;

		if (((inputContent.replace(/[^a-zA-Z0-9-]/g, '-')) !== ''))
		{
			try
			{

			}
			catch(error)
			{

			}
		}

		return;
	}

	/**
	 *
	 */
	public searchNote(): void
	{
		const inputContent: string = (document.getElementById('input') as HTMLInputElement)?.value;
		if (inputContent !== '') alert("Search: " + inputContent);

		return;
	}
}
