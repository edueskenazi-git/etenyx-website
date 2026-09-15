# Site institucional Etenyx (PT / EN / ES)

## Overview
Landing page institucional de uma página para a Etenyx (consultoria em transformação digital e IA aplicada), com seções: Hero, Problema/Gap, Vozes de líderes, Nossa Abordagem, Soluções de IA, Serviços, Nosso DNA e Contato. Três idiomas (Português, Inglês, Espanhol) com seletor de idioma no cabeçalho.

Este é o **site real, pronto para publicar** — HTML/CSS/JS puros, sem build step e sem dependências de servidor.

## Estrutura de arquivos
```
index.html          → redireciona para /pt/, /en/ ou /es/ conforme o idioma do navegador
pt/index.html        → versão em Português (idioma principal)
en/index.html        → versão em Inglês
es/index.html        → versão em Espanhol
css/style.css         → estilos compartilhados (reset + modal de contato)
js/main.js            → hover states, abrir/fechar modal, envio do formulário
assets/               → logo, marca e imagem "DNA Digital"
```
As três páginas de idioma usam estilos inline (fiéis ao design original) para o conteúdo das seções, e `css/style.css` + `js/main.js` só para o que precisa de comportamento real: hover e o formulário de contato.

## Como publicar
Como é um site 100% estático, qualquer host estático funciona sem configuração adicional:
- **Netlify**: arraste a pasta do projeto em [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel**: `vercel --prod` na raiz do projeto.
- **GitHub Pages**: suba os arquivos para um repositório e ative Pages na branch principal.
- Qualquer outro host (S3 + CloudFront, cPanel, etc.) também serve — basta copiar os arquivos.

Não é necessário nenhum passo de build.

## Formulário de contato — configuração obrigatória (uma vez só)
Os botões **"Falar com a Etenyx"** (cabeçalho) e **"Agende um diagnóstico"** (hero e seção de contato) abrem um modal com formulário (Nome, Empresa, E-mail, Telefone opcional, Observações). O envio é feito via [FormSubmit.co](https://formsubmit.co/), um serviço gratuito que recebe o POST do formulário estático e encaminha por e-mail — não exige conta nem backend próprio.

**Passo único de ativação**: na primeira vez que alguém enviar o formulário depois do site publicado, o FormSubmit manda um e-mail de confirmação para `contato@etenyx.com`. É preciso abrir esse e-mail e clicar no link de confirmação — a partir daí, todos os envios seguintes chegam automaticamente na caixa de entrada, sem nenhuma ação extra.

Detalhes técnicos já configurados em cada `index.html`:
- `action="https://formsubmit.co/ajax/contato@etenyx.com"` — envio via `fetch` (AJAX), sem redirecionar a página.
- `_captcha=false` — desativa a tela de captcha do FormSubmit para manter a UX do modal; em troca, há um campo honeypot (`_honey`, oculto) para reduzir spam automatizado.
- `_template=table` — formata o e-mail recebido em tabela, mais fácil de ler.
- `_subject` — identifica de qual idioma da página veio o contato.

Se preferir trocar para outro provedor (Formspree, um backend próprio, etc.), basta editar o atributo `action` do `<form>` em cada um dos três `index.html` — a lógica de envio em `js/main.js` já funciona com qualquer endpoint que aceite POST JSON e responda com JSON.

**Importante — teste sempre via servidor, nunca abrindo o arquivo direto**: o FormSubmit rejeita silenciosamente qualquer envio feito a partir de uma página aberta como arquivo local (`file:///...`, ex. duplo-clique no `index.html`). Ele responde HTTP 200 com `{"success":"false", "message":"Make sure you open this page through a web server..."}` — como o `js/main.js` verifica esse campo `success` da resposta (não só o status HTTP), o modal vai mostrar corretamente a mensagem de erro nesse caso, em vez de uma falsa mensagem de sucesso. Para testar de verdade, sirva os arquivos por um servidor local (`python3 -m http.server`, extensão "Live Server" do VS Code, etc.) ou publique o site — qualquer URL `http://` ou `https://` funciona.

**Importante — a ativação do FormSubmit é por domínio, não só por e-mail**: depois de ativado para um domínio (ex.: durante testes locais em `http://localhost:8000`), o FormSubmit continua pedindo ativação para qualquer domínio novo que envie para o mesmo e-mail — inclusive o domínio real de produção. Ou seja: **na primeira vez que alguém enviar o formulário a partir do domínio publicado definitivo, vai chegar um novo e-mail de ativação em `contato@etenyx.com`, mesmo que testes anteriores em outros domínios/localhost já tenham sido ativados.** Isso é esperado — é só clicar em "Activate Form" mais uma vez, e a partir daí todos os envios daquele domínio passam a ser entregues automaticamente.

## Interações
- Scroll suave (`scroll-behavior: smooth`) para os links de âncora do nav.
- Hover states via atributo `style-hover` + `js/main.js` (aplica o hover real no mouseenter/mouseleave).
- Modal de contato: abre com `data-open-modal`, fecha com `data-close-modal`, clique fora, ou tecla Esc.
- Responsivo: grids usam `repeat(auto-fit, minmax(...))` e colapsam para 1 coluna em telas estreitas; tipografia usa `clamp()`.

## Design Tokens

**Cores**
- Grafite (fundo escuro / texto principal): `#10161A`
- Teal primário (marca/CTA): `#0EA89C`
- Teal escuro (hover): `#0B8C82`
- Base clara (seções alternadas): `#F3F6F5`
- Branco: `#FFFFFF`
- Bordas claras: `#E7EDEB`, `#E1E8E6`, `#D8E0DE`
- Texto secundário sobre claro: `#4A5754`, `#64726F`, `#8A9895`
- Texto secundário sobre escuro: `#C8D3D0`, `#AEBDB9`, `#9FB0AC`
- Cards em fundo escuro: `#161D22`, borda `#2A343A`

**Tipografia**
- Display/headings: Poppins 600
- Corpo/UI: Manrope 400/500/600/700
- Escala: eyebrow 11.5–12.5px (uppercase, letter-spacing 0.14–0.18em) · H1 `clamp(38px,5vw,62px)` · H2 `clamp(28px,3.4vw,42px)` · H3 19–23px · corpo 14.5–17px

**Outros**
- Header fixo (`position: fixed; top:0`) com espaçador de `72px` logo abaixo para compensar a altura.
- Radius: pills `999px`; cards `14–28px`.
- Shadows suaves, ex. `0 24px 44px -34px rgba(14,168,156,0.55)` em hover de cards.

## Assets
- `assets/etenyx-mark.png` — símbolo/ícone da marca (também usado como favicon).
- `assets/etenyx-logo-light.png` — logotipo completo em fundo claro (disponível para uso futuro).
- `assets/etenyx-dna-digital.png` — imagem conceitual "DNA Digital" usada na seção "Nosso DNA".

## Pendências conhecidas
- O domínio `www.etenyx.com` já aparece referenciado no rodapé/contato; ao publicar em um domínio definitivo, adicione tags `<link rel="canonical">` e `hreflang` entre os três idiomas para SEO.
- Em telas muito estreitas o menu pode quebrar em duas linhas — se isso acontecer, ajuste o espaçador de `72px` logo abaixo do `<header>` em cada `index.html`.

## Revisão de segurança (security-by-design)

Revisão manual cobrindo o código atual (o skill `/security-review` do Claude Code exige um repositório git com um remote `origin` configurado para comparar `git diff`, o que não se aplica a este projeto recém-inicializado sem remote).

### O que já está correto
- **Sem XSS de DOM**: nenhum uso de `innerHTML`, `eval` ou `document.write` em `js/main.js`. Toda escrita dinâmica no DOM usa `textContent` (mensagens de sucesso/erro do formulário), e o conteúdo vem de atributos `data-*` que nós mesmos escrevemos no HTML — nunca de entrada do usuário refletida de volta na página.
- **Sem segredos no client**: não há chave de API nem token algum no código. O FormSubmit funciona só com o e-mail de destino na URL (`contato@etenyx.com`), que já é público (aparece como link `mailto:` na própria página) — não há nada de sensível para vazar.
- **Honeypot bem implementado**: o campo `_honey` é oculto (`display:none`), fica fora da ordem de tab (`tabindex="-1"`) e tem `autocomplete="off"` — evita que o autofill do navegador o preencha e gere falso-positivo de spam.
- **Sem scripts de terceiros**: Google Fonts é carregado só como `<link>` de CSS (não executa JS na página) e o FormSubmit é chamado via `fetch` (POST de dados), nunca via `<script src="...">` — ou seja, nenhum código de terceiro roda com privilégio total na página, só os nossos próprios `js/main.js` e `js/redirect.js`.
- **HTTPS de ponta a ponta**: Google Fonts e FormSubmit são chamados só via `https://`.

### O que foi corrigido nesta revisão
- **Script inline removido do `index.html` raiz** ([js/redirect.js](js/redirect.js)): antes o redirecionamento por idioma estava num `<script>` inline dentro do `<head>`. Isso obrigaria a CSP a incluir `'unsafe-inline'` em `script-src` (o que anula boa parte da proteção contra XSS que a CSP oferece). Agora é um arquivo externo, permitindo `script-src 'self'` sem exceções.

### Trade-offs conscientes (não são bugs, mas vale registrar o motivo)
- **`_captcha=false`** no formulário: desativa a tela de captcha do FormSubmit para manter o modal fluido. Compensado pelo honeypot, mas é uma defesa mais fraca contra automação — se o formulário começar a receber spam, o primeiro ajuste é remover essa flag (volta o captcha) antes de trocar de provedor.
- **`style-src 'unsafe-inline'` necessário na CSP abaixo**: o site inteiro usa `style="..."` inline (para fidelidade pixel a pixel ao design), então uma CSP 100% estrita sem `unsafe-inline` em `style-src` exigiria reescrever todo o CSS para classes — fora do escopo desta tarefa. O risco prático é baixo (injeção de CSS é bem menos perigosa que injeção de JS, e não há entrada de usuário refletida em nenhum `style`), mas fica registrado como a única concessão da política abaixo.
- **Validação é só client-side (`required`, `type="email"`)**: a validação real de formato/abuso de conteúdo do lado do "servidor" é feita pelo FormSubmit, um terceiro fora do nosso controle. Isso é inerente a usar um backend de formulário de terceiros sem servidor próprio — se no futuro o volume de spam/abuso justificar, a solução é adicionar uma função serverless própria (Netlify Functions / Vercel Functions) com validação e rate-limiting antes de encaminhar o e-mail.

### Headers de segurança para o processo de publicação
Já criei os arquivos prontos no projeto, com uma Content-Security-Policy restritiva (`default-src 'self'`, permitindo só Google Fonts, FormSubmit e os próprios arquivos do site) mais os headers padrão de hardening (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`):

- **[`_headers`](_headers)** — aplicado automaticamente pelo **Netlify** (não precisa de configuração extra, o arquivo já é reconhecido na raiz do site).
- **[`vercel.json`](vercel.json)** — aplicado automaticamente pela **Vercel** (idem, sem passo manual).
- **GitHub Pages**: **não suporta headers HTTP customizados** — não há como aplicar CSP/HSTS/etc. diretamente lá. Se a publicação final for em GitHub Pages, considere colocar o Cloudflare (plano gratuito) na frente do domínio para adicionar esses headers via "Transform Rules", ou usar Netlify/Vercel em vez do GitHub Pages puro.
- Ao trocar o provedor do formulário (ver seção acima) ou adicionar qualquer novo recurso externo (analytics, chat, etc.), **lembre de atualizar a CSP** nos dois arquivos — ela é restritiva de propósito e vai bloquear silenciosamente qualquer domínio novo não listado em `connect-src`/`script-src`/`style-src`/`font-src`.
