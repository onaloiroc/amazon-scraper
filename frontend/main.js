document.getElementById("scrape").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "Carregando...";

  try {
    const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await res.json();

    if (data.error) {
      resultsDiv.innerHTML = `Erro: ${data.error}`;
      return;
    }

    resultsDiv.innerHTML = data
      .map((p) => `
        <div>
          <img src="${p.image}" width="100" />
          <h3>${p.title}</h3>
          <p>⭐ ${p.rating} — ${p.reviews}</p>
        </div>
      `).join("");
  } catch (err) {
    resultsDiv.innerHTML = `Erro ao buscar: ${err.message}`;
  }
});