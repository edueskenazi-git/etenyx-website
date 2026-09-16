# Site institucional Etenyx (PT / EN / ES)

## Overview
Landing page institucional de uma página para a Etenyx (consultoria em transformação digital e IA aplicada), com seções: Hero, Problema/Gap, Vozes de líderes, Nossa Abordagem, Soluções de IA, Serviços, Nosso DNA e Contato. Três idiomas (Português, Inglês, Espanhol) com seletor de idioma no cabeçalho.

Site 100% estático — HTML/CSS/JS puros, sem build step, sem backend próprio. **Está publicado e no ar.**

## Status de publicação (produção)

| Item | Estado |
|---|---|
| Repositório GitHub | [github.com/edueskenazi-git/etenyx-website](https://github.com/edueskenazi-git/etenyx-website), branch `main` |
| Hospedagem | GitHub Pages (Settings → Pages → Deploy from branch `main` / root) |
| Domínio principal | `www.etenyx.com` — ✅ ativo, HTTPS válido |
| `etenyx.com` (sem www) | ✅ redireciona (301) para `www.etenyx.com` automaticamente pelo GitHub Pages |
| `etenyx.ai` / `www.etenyx.ai` | ✅ redirecionam (301) para `https://www.etenyx.com` via Cloudflare Redirect Rule |
| `etenyx.com.br` / `www.etenyx.com.br` | ✅ redirecionam (301) para `https://www.etenyx.com` via Cloudflare Redirect Rule (DNS migrado do registro.br para o Cloudflare) |
| Formulário de contato | ✅ ativado e testado, entrega em `contato@etenyx.com` via FormSubmit.co |
| Headers de segurança (CSP, HSTS, etc.) | ✅ ativos via Cloudflare (proxy + Transform Rule) na frente de `www.etenyx.com` |

## Como fazer alterações e publicar

Não há build step. Para qualquer alteração de conteúdo/estilo:

1. Edite os arquivos localmente (`pt/index.html`, `en/index.html`, `es/index.html`, `css/style.css`, `js/main.js`, etc.)
2. Commit e push para `main`:
   ```bash
   git add -A
   git commit -m "descrição da mudança"
   git push
   ```
3. O GitHub Pages redeploy automaticamente em ~1 minuto após o push — não precisa fazer mais nada.

Como as três páginas de idioma são arquivos HTML independentes (sem template/build compartilhado), uma alteração de conteúdo que se aplique aos três idiomas precisa ser replicada manualmente nos três arquivos.

## Estrutura de arquivos
```
index.html            → redireciona para /pt/, /en/ ou /es/ conforme o idioma do navegador
CNAME                  → domínio customizado do GitHub Pages (contém "www.etenyx.com")
pt/index.html          → versão em Português (idioma principal)
en/index.html          → versão em Inglês
es/index.html          → versão em Espanhol
css/style.css          → estilos compartilhados (reset + modal de contato)
js/main.js             → hover states, abrir/fechar modal, envio do formulário
js/redirect.js         → lógica de redirecionamento por idioma do index.html raiz
assets/                → logo, marca e imagem "DNA Digital"
_headers                → referência dos headers de segurança para Netlify (hoje replicados manualmente via Cloudflare Transform Rule — ver seção de Segurança)
vercel.json             → referência dos headers de segurança para Vercel (idem)
```
As três páginas de idioma usam estilos inline (fiéis ao design original) para o conteúdo das seções, e `css/style.css` + `js/main.js` só para o que precisa de comportamento real: hover e o formulário de contato.

## Formulário de contato — configuração obrigatória (uma vez só por domínio)
Os botões **"Falar com a Etenyx"** (cabeçalho) e **"Agende um diagnóstico"** (hero e seção de contato) abrem um modal com formulário (Nome, Empresa, E-mail, Telefone opcional, Observações). O envio é feito via [FormSubmit.co](https://formsubmit.co/), um serviço gratuito que recebe o POST do formulário estático e encaminha por e-mail — não exige conta nem backend próprio. **Já ativado e testado em produção** em `www.etenyx.com`.

Detalhes técnicos configurados em cada `index.html`:
- `action="https://formsubmit.co/ajax/contato@etenyx.com"` — envio via `fetch` (AJAX), sem redirecionar a página.
- `_captcha=false` — desativa a tela de captcha do FormSubmit para manter a UX do modal; em troca, há um campo honeypot (`_honey`, oculto) para reduzir spam automatizado.
- `_template=table` — formata o e-mail recebido em tabela, mais fácil de ler.
- `_subject` — identifica de qual idioma da página veio o contato.

Se preferir trocar para outro provedor (Formspree, um backend próprio, etc.), basta editar o atributo `action` do `<form>` em cada um dos três `index.html` — a lógica de envio em `js/main.js` já funciona com qualquer endpoint que aceite POST JSON e responda com JSON.

**Gotcha #1 — nunca teste abrindo o arquivo direto**: o FormSubmit rejeita silenciosamente qualquer envio feito a partir de uma página aberta como arquivo local (`file:///...`). Responde HTTP 200 com `{"success":"false", ...}` — como `js/main.js` verifica o campo `success` da resposta (não só o status HTTP), o modal mostra a mensagem de erro corretamente nesse caso. Para testar, sirva por um servidor (`python3 -m http.server`) ou use a URL publicada.

**Gotcha #2 — ativação é por domínio, não só por e-mail**: cada domínio novo que envia para o mesmo e-mail de destino precisa da própria confirmação por e-mail na primeira vez (ex.: testar em `localhost` ativa só para `localhost`; o domínio de produção precisou de ativação própria, já feita). Se um dia adicionar outro domínio que use esse mesmo formulário, espere um novo e-mail de ativação em `contato@etenyx.com` no primeiro envio de lá.

## DNS e domínios

Três domínios apontam (ou vão apontar) para este mesmo site: `etenyx.com`, `etenyx.ai` e `etenyx.com.br`. O GitHub Pages só aceita **um** domínio customizado por site (é uma limitação da plataforma) — por isso `www.etenyx.com` é o domínio canônico onde o conteúdo realmente é servido, e os outros dois **redirecionam (301)** para ele via Cloudflare.

⚠️ **Cuidado sempre que mexer em DNS**: nunca alterar/remover registros `MX`, `TXT` (SPF/DKIM/DMARC) — é o que mantém o e-mail `contato@etenyx.com` (hoje no Zoho Mail) funcionando. Mexer só nos registros `A`/`CNAME`/regras de redirect descritos abaixo.

### `etenyx.com` / `www.etenyx.com` (domínio canônico)
- DNS gerenciado no **Cloudflare** (nameservers `georgia.ns.cloudflare.com` / `vicky.ns.cloudflare.com`), com estes registros em modo **DNS only** (nuvem cinza — precisa ficar assim para o GitHub emitir/renovar o certificado):
  - `CNAME www → edueskenazi-git.github.io`
  - `A @ → 185.199.108.153`
  - `A @ → 185.199.109.153`
  - `A @ → 185.199.110.153`
  - `A @ → 185.199.111.153`
- No GitHub: repositório → **Settings → Pages** → Custom domain = `www.etenyx.com`, **Enforce HTTPS** ativado.
- O arquivo `CNAME` na raiz do repositório precisa conter exatamente `www.etenyx.com` (já está commitado).
- ⚠️ **Não criar nenhuma Redirect Rule na zona Cloudflare deste domínio.** É o domínio canônico de verdade — uma regra de redirect aqui ficaria "adormecida" enquanto os registros forem DNS only, mas criaria um loop de redirecionamento (derrubando o site) no dia em que o proxy (nuvem laranja) for ativado, por exemplo para aplicar os headers de segurança pendentes (ver seção de Segurança).

### `etenyx.ai` / `www.etenyx.ai` (redirect — ✅ ativo)
- DNS no Cloudflare, registros em modo **Proxied** (nuvem laranja — precisa ficar assim para a regra de redirect funcionar):
  - `A @ → 192.0.2.1` (IP placeholder, nunca usado de verdade — só existe para o domínio "existir" no DNS e passar pelo proxy da Cloudflare)
  - `A www → 192.0.2.1`
- Regra em **Rules → Redirect Rules**:
  - **If incoming requests match**: `All incoming requests` (não usar "Wildcard pattern" contra a Request URL — dá muito mais margem para erro de sintaxe; foi a causa de um erro 522 durante a configuração)
  - **Then**: Redirect to target URL → **Type: Static** → `https://www.etenyx.com`
  - **Status code**: 301
  - Preserve query string: opcional (marcado)

### `etenyx.com.br` / `www.etenyx.com.br` (redirect — ✅ ativo)
Migrado do registro.br para o Cloudflare com a mesma configuração do `etenyx.ai` acima (`A @` e `A www` → `192.0.2.1`, proxied; Redirect Rule "All incoming requests" → Static → `https://www.etenyx.com`, 301).

**Por que migrar em vez de usar o redirecionamento nativo do registro.br**: o registro.br tem um recurso de redirect de domínio pronto, mas o certificado TLS do serviço deles é emitido para `r.registro.br`, não para o domínio do cliente — isso faz o navegador mostrar aviso de "site não seguro" em toda visita por HTTPS (que é o padrão dos navegadores modernos). Migrar o DNS para o Cloudflare resolve isso, porque a Cloudflare emite certificado válido automaticamente para qualquer domínio na sua rede.

**Registro MX preservado**: o scan de importação do Cloudflare encontrou um registro MX do tipo **"Null MX"** (`priority 0`, servidor `.`) — é a declaração técnica padrão de "este domínio não recebe e-mail", não um serviço real. Confirmado que o único e-mail da empresa é `contato@etenyx.com` (Zoho, em outro domínio) — nada foi perdido.

**Pegadinhas encontradas durante essa migração específica** (documentadas para não repetir o troubleshooting):
1. A troca de nameservers no registro.br não é instantânea — eles seguram a mudança por um período de segurança (nesse caso ~1h42) antes de liberar, mesmo depois de o painel já mostrar os nameservers novos. É preciso esperar esse prazo passar.
2. O registro **A** que o Cloudflare importou automaticamente ao conectar o domínio ainda apontava para o IP do serviço de redirect **antigo** do registro.br (`200.160.2.95`), só com o proxy (nuvem laranja) ativado por cima. Isso fazia o site funcionar (Cloudflare terminava o TLS com certificado válido) mas o redirecionamento em si ainda vinha do registro.br por trás (por isso aparecia como **302**, não 301). Foi preciso editar o registro A manualmente e trocar o IP para o placeholder `192.0.2.1`, como nos outros domínios.
3. Uma regra de redirect **errada** (com condição `Wildcard pattern` para `https://*.etenyx.ai` — sobra de um teste feito na zona errada) acabou criada dentro da zona `etenyx.com.br`. Uma regra malformada/de outro domínio na mesma zona pode quebrar a avaliação de **todas** as regras daquela zona, fazendo a Cloudflare devolver 404 vazio para tudo. Ao encontrar um comportamento inexplicável numa Redirect Rule, sempre confira se não há outra regra (ativa ou não) na mesma zona atrapalhando.

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

## Revisão de segurança (security-by-design)

### O que já está correto
- **Sem XSS de DOM**: nenhum uso de `innerHTML`, `eval` ou `document.write` em `js/main.js`. Toda escrita dinâmica no DOM usa `textContent`, e o conteúdo vem de atributos `data-*` que nós mesmos escrevemos no HTML — nunca de entrada do usuário refletida de volta na página.
- **Sem segredos no client**: não há chave de API nem token algum no código. O e-mail de destino do FormSubmit já é público (aparece como link `mailto:` na própria página).
- **Honeypot bem implementado**: campo `_honey` oculto, fora da ordem de tab, `autocomplete="off"`.
- **Sem scripts de terceiros**: Google Fonts é só `<link>` de CSS; FormSubmit é chamado via `fetch`, nunca via `<script src>`. Nenhum código de terceiro roda com privilégio total na página.
- **HTTPS de ponta a ponta**: Google Fonts, FormSubmit e o próprio site (via GitHub Pages) só respondem em `https://`.
- **Script inline eliminado**: o redirecionamento de idioma do `index.html` raiz está em `js/redirect.js` (arquivo externo), não inline — permite `script-src 'self'` sem `'unsafe-inline'` numa futura CSP.

### Trade-offs conscientes
- **`_captcha=false`** no formulário: UX mais fluida, defesa anti-bot mais fraca (compensada pelo honeypot). Se começar a chegar spam, primeiro ajuste é reativar o captcha.
- **CSP precisaria de `style-src 'unsafe-inline'`**: o site usa `style="..."` inline extensivamente (fidelidade pixel a pixel ao design). Risco baixo (injeção de CSS é bem menos perigosa que JS, sem entrada de usuário refletida em nenhum `style`), mas é a concessão da política em `_headers`/`vercel.json`.
- **Validação só client-side** (`required`, `type="email"`): a validação "de servidor" é responsabilidade do FormSubmit (terceiro). Se o volume de abuso justificar no futuro, a solução é uma function serverless própria com validação e rate-limiting.

### ✅ Headers de segurança — ativos em produção via Cloudflare
O GitHub Pages não suporta headers HTTP customizados nativamente, então os arquivos `_headers`/`vercel.json` do repositório (mantidos como referência/documentação da política) não são lidos por ele. Os headers estão ativos de verdade através do Cloudflare, que fica na frente de `www.etenyx.com`:

1. **Proxy da Cloudflare ativado** (nuvem laranja) nos registros `A`/`CNAME` de `www.etenyx.com` — modo SSL/TLS em **Full** (verificado antes da troca que o certificado do GitHub Pages já estava emitido e válido, para não interromper o site).
2. **Transform Rule** em **Rules → Transform Rules → HTTP Response Header Modification** (⚠️ não confundir com "HTTP **Request** Header Modification", que modifica o que a Cloudflare envia para a origem, não o que ela devolve ao visitante — foi o erro na primeira tentativa), regra "Security headers", condição `All incoming requests`, com os 6 headers abaixo (`Set static`):
   - `Content-Security-Policy`
   - `X-Content-Type-Options`
   - `X-Frame-Options`
   - `Referrer-Policy`
   - `Permissions-Policy`
   - `Strict-Transport-Security`

   Valores exatos: os mesmos definidos em [`_headers`](_headers)/[`vercel.json`](vercel.json) — se a política precisar mudar (novo domínio externo, novo script, etc.), atualize os **três lugares** (a Transform Rule no Cloudflare É a fonte da verdade em produção; os arquivos no repo documentam a mesma política para quem usar Netlify/Vercel no futuro).

Confirmado via `curl -I https://www.etenyx.com` — todos os 6 headers presentes na resposta.

⚠️ **Atenção para não quebrar isso no futuro**: como o proxy da Cloudflare agora está ativo em `www.etenyx.com`, **nunca crie uma Redirect Rule "All incoming requests" nessa zona** — ela entraria em loop com o próprio domínio (isso só não era um risco antes porque o registro ficava em "DNS only").

## Pendências conhecidas
1. **SEO**: adicionar `<link rel="canonical">` e tags `hreflang` entre os três idiomas agora que o domínio definitivo (`www.etenyx.com`) está confirmado.
2. **Header responsivo**: em telas muito estreitas o menu pode quebrar em duas linhas — se isso acontecer na prática, ajuste o espaçador de `72px` logo abaixo do `<header>` em cada `index.html`.

Os 3 domínios (`etenyx.com`, `etenyx.ai`, `etenyx.com.br`), o formulário de contato e os headers de segurança estão publicados e funcionando — sem pendências de infraestrutura além dos itens acima.
