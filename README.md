# amazon-scraper

Busca produtos na Amazon por palavra-chave e devolve título, avaliação, número
de avaliações e imagem. Backend em Node.js com Express, frontend em Vite.

## Uso

```bash
# backend — porta 3000
cd backend && npm install && npm start

# frontend — porta 5173
cd frontend && npm install && npm run dev
```

Abra `http://localhost:5173`, digite a palavra-chave e busque.

## Arquitetura

```
frontend (Vite, :5173)  --fetch-->  backend (Express, :3000)  --axios-->  Amazon
                                           |
                                    JSDOM faz o parse do HTML
```

O scraping fica no backend por dois motivos: o navegador bloquearia a requisição
por CORS, e qualquer evolução futura — proxy, cache, rate limit — não deve ficar
exposta no cliente.

## Detalhes de implementação

**`User-Agent` explícito no axios.** Sem ele a Amazon devolve uma página
diferente, de bloqueio, com status 200. O pedido parece ter dado certo e o parse
volta vazio — o tipo de falha que custa a aparecer.

**Seleção com fallback.** O título é lido de `aria-label` e, se não existir, do
texto do `span`. O HTML da Amazon muda entre layouts de teste e um seletor único
quebra sem aviso.

**Erro tratado nas duas pontas.** Palavra-chave ausente devolve 400; falha de
rede devolve mensagem para a tela, em vez de deixar o front carregando para sempre.

## Limitações conhecidas

Depende da estrutura do HTML da Amazon, que muda sem aviso — natureza de
qualquer scraper. Lê apenas a primeira página de resultados.

## Licença

MIT
