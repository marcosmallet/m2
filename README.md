# M2 Soluções com IA

Landing page estática para divulgação de serviços de criação de sites, bots, automações, integrações e sistemas com inteligência artificial.

## Como rodar localmente

Você pode abrir o arquivo `index.html` diretamente no navegador.

Se preferir testar com servidor local, rode a partir da pasta do projeto:

```powershell
python -m http.server 4173
```

Depois acesse:

```text
http://localhost:4173
```

## Onde editar contatos e links

Os dados principais ficam no topo de `script.js`:

```js
const SITE_CONFIG = {
  WHATSAPP_NUMBER: "+5521997224987",
  EMAIL: "contato@m2solucoes.online",
  NOME_EMPRESA: "M2 Soluções com IA",
  WHATSAPP_MESSAGE: "Olá! Quero uma solução com IA para meu negócio.",
};
```

Altere esses valores para trocar telefone, e-mail, nome da empresa e mensagem inicial do WhatsApp.

## Onde editar textos

O conteúdo da landing fica em `index.html`, organizado por seções:

- Header
- Hero
- Serviços
- Benefícios
- Como funciona
- Exemplos de soluções
- CTA
- FAQ
- Footer

## Onde editar imagens e marca

Os assets ficam em:

- `assets/brand/logo-horizontal.svg`
- `assets/brand/logo-horizontal.png`
- `assets/brand/logo-square.svg`
- `assets/brand/logo-square.png`
- `assets/brand/favicon.svg`
- `assets/brand/favicon.png`
- `assets/brand/whatsapp-icon.svg`
- `assets/brand/whatsapp-icon.png`
- `assets/images/hero-ai-automation.png`

Os arquivos SVG são a fonte principal dos logos. Os PNGs são versões exportadas para uso em redes sociais, favicon e compatibilidade.

## Estrutura

```text
.
├── index.html
├── styles.css
├── script.js
├── README.md
├── assets/
│   ├── brand/
│   └── images/
└── tools/
    └── export-assets.js
```

## Reexportar PNGs da marca

O projeto final não precisa de build. O script abaixo é apenas utilitário para gerar PNGs a partir dos SVGs, caso você altere a marca.

Ele requer o pacote `sharp` disponível no ambiente Node. Se necessário:

```powershell
npm install --save-dev sharp
```

Depois rode:

```powershell
node tools/export-assets.js
```
