import express from "express";
import cors from "cors";
import axios from "axios";
import { JSDOM } from "jsdom";

const app = express();
const PORT = 3000;

// Habilita CORS para permitir chamadas do frontend (ex: localhost:5173)
app.use(cors());

app.get("/api/scrape", async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }

  try {
    const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    const products = [];

    const items = document.querySelectorAll("[data-component-type='s-search-result']");

    items.forEach((item) => {
const title = item.querySelector("h2 a")?.getAttribute("aria-label")?.trim()
  || item.querySelector("h2 a span")?.textContent?.trim()
  || "N/A";
  const rating = item.querySelector("span.a-icon-alt")?.textContent?.trim() || "N/A";
  const reviews = item.querySelector("span.a-size-base.s-underline-text")?.textContent?.trim() || "N/A";
  const image = item.querySelector("img")?.src || "N/A";

  products.push({ title, rating, reviews, image });
});


    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados da Amazon", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
