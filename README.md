# Cache Manager

Extensão para Google Chrome que agiliza a limpeza de cache em ambientes **Arker** (`*.arker.com.br`). Desenvolvida para uso interno, quando a tela não reflete alterações recentes por cache da aplicação, do navegador ou de requisições antigas.

---

## Para que serve

Durante desenvolvimento, homologação ou suporte, é comum a aplicação exibir conteúdo desatualizado. Esta extensão automatiza o fluxo de limpeza em **uma única aba**: passa pelo admin da Arker, executa a ação escolhida e **retorna para a página em que você estava**.

---

## Funcionalidades

| Botão | Descrição | O que faz |
|---|---|---|
| **Servidor** | Cache da aplicação | Limpa o cache da aplicação no servidor via `/admin/application.aspx` e redireciona para a URL original. |
| **Reload** | Cache do navegador | Limpa o cache do servidor e do navegador, retorna para a URL original e executa um hard reload (com bypass de cache). |
| **Bypass** | Atualizar versão | Força a atualização da versão limpando o cache do servidor e recarregando a página com o parâmetro `?nocache=timestamp`. |
| **Limpeza Completa** | Aplicação, navegador e bypass | Executa a limpeza em sequência: cache do servidor, bypass de versão e reload do navegador. |

### Fluxo comum (todos os botões)

1. Salva a URL da aba ativa
2. Navega para `https://{ambiente}.arker.com.br/admin/application.aspx`
3. Aguarda o carregamento da página
4. Retorna para a URL original (com ou sem `?nocache`, conforme o botão)
5. Aplica reload, quando aplicável

O ambiente (`app`, `homolog`, etc.) é detectado automaticamente pelo subdomínio da aba ativa.

---

## Requisitos

### Navegador

A extensão foi desenvolvida para **Google Chrome** e funciona sem alterações em navegadores **baseados em Chromium**, como:

- Google Chrome
- Microsoft Edge
- Brave
- Opera

### Demais requisitos

- Estar com uma aba aberta em `*.arker.com.br` ao usar a extensão
- Acesso ao admin da Arker no ambiente correspondente

---

## Página de documentação

Após ativar o GitHub Pages, a documentação fica disponível em:

**https://williamtechqa.github.io/myapp-cache-manager/**

Para ativar: no repositório, vá em **Settings → Pages → Source: Deploy from branch → main → /docs**.

---

## Instalação

### 1. Baixar o projeto

Clone o repositório ou baixe o ZIP:

```bash
git clone https://github.com/WilliamTechQa/myapp-cache-manager.git
```

### 2. Carregar no Chrome

1. Abra `chrome://extensions`
2. Ative **Modo do desenvolvedor** (canto superior direito)
3. Clique em **Carregar sem compactação**
4. Selecione a pasta do projeto (`myapp-cache-manager`)
5. A extensão **Cache Manager** aparecerá na barra de ferramentas

### 3. Fixar na barra (opcional)

Clique no ícone de quebra-cabeça na barra do Chrome e fixe o **Cache Manager** para acesso rápido.

---

## Como usar

1. Abra a página da Arker que deseja testar
2. Clique no ícone da extensão na barra do Chrome
3. Escolha a ação no menu:

| Situação | Botão recomendado |
|---|---|
| Deploy feito e a tela ainda mostra versão antiga da aplicação | **Servidor** |
| Arquivos estáticos (CSS/JS) parecem em cache local | **Reload** |
| Quer forçar uma nova requisição sem alterar a lógica da página | **Bypass** |
| Não tem certeza ou quer garantir tudo | **Limpeza Completa** |

> **Dica:** O popup pode fechar durante a execução. As ações continuam na aba em segundo plano.

---

## Estrutura do projeto

```
myapp-cache-manager/
├── manifest.json    # Configuração da extensão (Manifest V3)
├── popup.html       # Interface do menu
├── popup.js         # Lógica de limpeza de cache
├── style.css        # Estilos do popup
├── icon-16.png      # Ícones da extensão
├── icon-32.png
├── icon-48.png
└── icon-128.png
```

---

## Permissões

| Permissão | Motivo |
|---|---|
| `tabs` | Ler a aba ativa, navegar e recarregar com bypass de cache |

---

## FAQ

### A extensão funciona fora da Arker?

Não. Ela foi feita exclusivamente para domínios `*.arker.com.br` e depende da página admin `/admin/application.aspx` de cada ambiente.

### Cliquei no botão e nada pareceu acontecer

Verifique se a aba ativa está em um domínio Arker válido. O popup fecha após o clique, mas a aba deve navegar para o admin e voltar automaticamente.

### Ainda vejo conteúdo antigo depois da limpeza

Tente **Limpeza Completa**. Se persistir, pode ser cache de CDN, sessão do usuário ou outro fator fora do escopo desta extensão.

### Preciso estar logado no admin?

Sim, em geral é necessário ter acesso ao ambiente e permissão para acessar `/admin/application.aspx`.

---

## Tecnologias

- Chrome Extension Manifest V3
- HTML, CSS e JavaScript (vanilla)
- Chrome Tabs API

---

## Licença

Uso interno — Arker.
