<div align="center">
	<img src="./src/assets/logo.png" width="30%" />
</div>

# FW Secure Notes
Um projeto Open Source de um Web App para criar e compartilhar anotações, que preza por um acesso seguro e um design minimalista.

![](https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/example.png)
<br/><br/>

## ✨ Por que usar a nossa aplicação?
Com o **FW Secure Notes** você é capaz de:
- ✏️ Criar anotações de forma simples e rápida, na estrutura de escrita de um bloco de notas.
- 👁️ Visualizar suas notas de uma forma elegante, utilizando um interpretador similar a Markdown.
- 🎨 Adequar a cor do sistema, com base no seu gosto pessoal.
- 🛜 Acessar suas anotações em qualquer dispositivo que tenha acesso ao Google.
- 🔒 Acessar suas anotações de forma simples, podendo logar e deslogar com facilidade, tornando uma boa opção acessar até mesmo numa máquina que não seja sua.

<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/themes.png" width="80%" />

## ⭐ Aplicação
Acesse a nossa Aplicação (site) gratuitamente por aqui: [FW Secure Notes](https://wesleytelesbenette.github.io/fw-secure-notes).

> [!WARNING]
> Os recursos (servidores) utilizados para o funcionamento da aplicação são gratuitos, então, é comum que nos primeiros acessos, depois de períodos longos de inatividade, o sistema precise de ***alguns segundos para carregar alguns recursos*** (requisições no geral).

### Caso tenha interesse na API do Projeto:
- [Link do Repositório da API](https://github.com/WesleyTelesBenette/fw-secure-notes-api/).
<br/>

## 🛠️ Featurs em Construção
- [ ] Correção de bugs no geral.
<br/><br/>

## 💻 Como executar o Projeto localmente?

### Pré-requisitos
- Tenha o [Node.js](https://nodejs.org/pt) instalado.
- Tenha o Angular CLI instalado globalmente:
```bash
npm install -g @angular/cli
```

### Execução
```bash
# Clone o repositório
git clone https://github.com/WesleyTelesBenette/fw-secure-notes.git
```
```bash
# Acesse a pasta do projeto
cd fw-secure-notes
```
```bash
# Instale as dependências
npm install
```
```bash
# Rode a aplicação
ng serve
```
<br/>

## 📖 Manual do Usuário

### 1. Página Inicial
A página inicial é onde você pode criar uma página ou pesquisar uma que já exista.

<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/main-page.png" width="80%" />

Após preencher o campo de nome, você deve completar o segundo campo de acordo com seu objetivo:
- **✨ Criar**: Caso sua intenção seja criar uma página, insira uma senha do tamanho que quiser (inclusive nenhuma senha).
- **🔍 Pesquisar**: Caso você deseje acessar uma página que já exista, insira o PIN da página.

### 2. Carregamento da Página
Uma visão comum que você vai ter sempre que realizar qualquer uma das duas ações do item **"1."**.

<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/loading-page.png" width="80%" />

### 3. Página de Login
Aqui você deve inserir sua senha, para que você possa efetivamente acessar sua página.

<p>
	<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/password.png" width="80%" />
	<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/password-error.png" width="80%" />
</p>
Apenas insira sua senha (obviamente apenas se sua página tiver uma) e pressione "Enter".

### 4. Página de Anotações

Após o carregamento da sua página, você vai poder ter acesso a todos os recursos do sistema.

<p>
	<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/loading-file.png" width="80%" />
	<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/manual.png" width="80%" />
</p>

#### 4.1 Arquivos

Os arquivos são onde você vai armazenar suas anotações.

<p>
	<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/files-button.png" width="80%" />
	<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/files.png" width="80%" />
</p>

O sistema de arquivos da página funciona da seguinte forma:
1. O botão de "Arquivos" para acessar esse sistema.
2. Botão para criar um arquivo.
3. Clicando no arquivo que você deseja acessar, ele será aberto.
4. Botão para deletar o arquivo que você desejar excluir.

#### 4.2 Título da Página

O Título da Página é composto por: Nome da Página + PIN.

<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/title.png" width="80%" />

1. Nesse exemplo os valores são:
	- Nome: **string**.
 	- PIN: **FYH**.

#### 4.3 Modos de Visualização

Os Modos de Visualização são fundamentais para a manipulação e leitura do conteúdo dos arquivos.

<p>
	<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/mode-edit.png" width="80%" />
	<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/mode-view.png" width="80%" />
</p>

1. Botão para ativar o **Modo de Edição**, onde o conteúdo é editável.
2. Botão para ativar o **Modo de Visualização**, onde o conteúdo é exibido com um sistema similar a Markdown.

#### 4.4 Ajuda

Caso durante o uso da aplicação você precise consultar esse manual, existe um link direto para cá.

<p>
	<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/info-button.png" width="80%" />
	<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/info.png" width="80%" />
</p>

1. Botão para acessar a aba de ajuda.
2. Link para essa documentação. Apenas clique em "Documentação Oficial".

#### 4.5 URL

A URL da sua página é a forma mais eficiente de acessá-la em outro momento.

<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/url.png" width="80%" />

Copiar essa URL é extremamente fácil, basta clicar no botão de copiar link. 
1. Botão de **Copiar**.

#### 4.6 Configurações

Na aba de configurações você pode acessar e alterar aspectos da página.

<p>
	<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/configs-button.png" width="80%" />
	<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/configs.png" width="80%" />
	<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/configs-2.png" width="80%" />
</p>

1. Botão para acessar as configurações.
2. Informações sobre a página.
3. Temas disponíveis para o sistema.
4. Trocar a senha de acesso à Página.
5. Uma forma não convencional de deslogar da sua página.
6. Excluir sua página permanentemente.

#### 4.7 Sair

A forma mais simples e prática de deslogar da sua página.

<img src="https://github.com/WesleyTelesBenette/my-sources-for-docs/blob/main/fw-secure-notes/logout.png" width="80%" />

1. Botão de **Sair**.

#### 4.8 Estilização

Ao criar sua página, ela possui um arquivo que serve como manual para essas funcionalidades básicas, então, vou apenas repeti-lo aqui:

**Formatar texto**

Você pode formatar seus textos com caracteres especiais, deixando o texto em negrito, itálico etc.
- \*Texto em Itálico*
- \*\*Texto em Negrito**
- \*\*\*Texto em Itálico e Negrito***
- \~Texto Tachado~
- \_Texto Sublinhado_

**Adicionar Links**

Você pode criar um link, definindo um título e um endereço.
- \[Receitas de Abobrinha](https://www.terra.com.br/vida-e-estilo/degusta/receitas/5-receitas-com-abobrinha-para-fugir-do-convencional-nas-refeicoes,f9bba1fb767aa0c53ff9626b7ecd83595g4npc2z.html).

**Criar Títulos**

Colocando algumas dessas 3 variações no começo da linha, você conseguir criar um título bem legal 😎

- \# Títulos
- \## de diferentes
- \### tamanhos

**Criar Listas**

Listas de itens, com 3 níveis de subitens.

- \- Listas
- \-- Subitem 1
- \--- Subitem 2
- \---- Subitem 3

**Criar Linhas de Divisão**

Você pode criar uma linha de divisão usando três hifens (---):

\---
