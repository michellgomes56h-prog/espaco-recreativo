# Espaço Recreativo · site

Site estático (HTML + CSS + JS puro, sem build). Para ver localmente:

```bash
cd espaco-recreativo && python3 -m http.server 8000
```
e abra http://localhost:8000

## Estrutura
```
index.html              todas as seções
assets/css/style.css    design system (tokens no :root) + seções
assets/js/main.js       navbar, gaveta, parallax, galeria/lightbox, carrossel, FAQ
assets/logo.png         logo (PROVISÓRIO: trocar pelo oficial)
assets/astronauta-hero.png  mascote do hero (PROVISÓRIO: trocar pela arte oficial, PNG transparente ≥ 2400px)
assets/img/             versões AVIF/WebP geradas (não editar à mão)
assets/galeria/01..12.webp  fotos placeholder da galeria
assets/src/*.svg        fontes vetoriais do mascote e logo provisórios
tools/otimizar-imagens.py   gera AVIF/WebP 1x/2x/3x
```

## Antes de publicar
1. **Logo e astronauta**: substitua `assets/logo.png` e `assets/astronauta-hero.png` e rode
   `python3 tools/otimizar-imagens.py` (senão o navegador continua mostrando as versões provisórias de `assets/img/`).
2. **Fotos da galeria**: coloque as fotos reais em `assets/galeria/originais/` e rode o mesmo script;
   depois ajuste `width/height`, `data-cat` (espaco | oficinas | rotina), `alt` e legenda de cada `<figure class="ph">`.
3. **Depoimentos**: procure `SUBSTITUIR POR DEPOIMENTOS REAIS DO CLIENTE` no index.html.
4. **Confirmações**: procure `CONFIRMAR` no index.html (horários dos meios turnos, itens inclusos,
   faixa etária, refeições, leva/busca, domínio). Esses trechos aparecem em amarelo listrado no site de propósito.

## Arquivos de publicação (já prontos)
- `404.html` página de erro no estilo do site (configure no servidor/hospedagem como página 404)
- `favicon.ico`, `assets/img/favicon-32.png`, `apple-touch-icon.png`, `icon-192/512.png` e `site.webmanifest`
- `assets/img/og-image.jpg` (1200×630) imagem que aparece ao compartilhar o link no WhatsApp/Facebook
- `robots.txt` e `sitemap.xml`
- SEO local: dados estruturados `ChildCare` (endereço, telefone, horários, Instagram) no `<head>`

**Domínio:** o site usa `https://www.espacorecreativo.com.br/` como provisório. Troque em `index.html`
(canonical, og:url, og:image, JSON-LD), `robots.txt` e `sitemap.xml` (busque `espacorecreativo.com.br`).
Ao trocar o logo/astronauta oficiais, regenere também os favicons e a og-image (ou peça para eu refazer).

## Qualidade verificada
- Auditoria axe-core (WCAG 2.1 AA + boas práticas): 0 violações no desktop e no celular
- Sem erros de JavaScript e sem arquivos faltando; sem rolagem horizontal de 390px a 2560px
