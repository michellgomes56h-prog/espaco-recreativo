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
assets/logo.png         logo (desenho aprovado pela cliente)
assets/astronauta-hero.png  mascote do hero (desenho aprovado pela cliente)
assets/img/             versões AVIF/WebP geradas (não editar à mão)
assets/galeria/01..12.webp  fotos placeholder da galeria
assets/src/*.svg        fontes vetoriais do mascote e do logo
tools/otimizar-imagens.py   gera AVIF/WebP 1x/2x/3x
```

## Pendências
Nenhuma da cliente. Logo e astronauta (desenhos feitos para o site) foram aprovados.

Publicado em https://www.espaço-recreativo.online (técnico: www.xn--espao-recreativo-fpb.online), via Vercel.
Domínio na Hostinger, vence em 06/11/2027, SEM renovação automática (há um lembrete agendado para 06/10/2027).

Opcional: depoimentos reais (o carrossel continua no JS, pronto para voltar) e mais fotos
(`assets/galeria/06.webp`... e um novo `<figure class="ph">` no index.html).

## Arquivos de publicação (já prontos)
- `404.html` página de erro no estilo do site (configure no servidor/hospedagem como página 404)
- `favicon.ico`, `assets/img/favicon-32.png`, `apple-touch-icon.png`, `icon-192/512.png` e `site.webmanifest`
- `assets/img/og-image.jpg` (1200×630) imagem que aparece ao compartilhar o link no WhatsApp/Facebook
- `robots.txt` e `sitemap.xml`
- SEO local: dados estruturados `ChildCare` (endereço, telefone, horários, Instagram) no `<head>`


## Qualidade verificada
- Auditoria axe-core (WCAG 2.1 AA + boas práticas): 0 violações no desktop e no celular
- Sem erros de JavaScript e sem arquivos faltando; sem rolagem horizontal de 390px a 2560px
