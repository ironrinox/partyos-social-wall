const container = document.getElementById("pending");

// Polling ogni 2 secondi
async function loadPending() {
  try {
    const res = await fetch("/pending");
    const photos = await res.json();

    container.innerHTML = "";
    if (photos.length === 0) {
      container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#aaa;">Nessuna foto in attesa ✨</p>`;
      return;
    }

    photos.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.padding = "16px";
      card.innerHTML = `
        <img src="${p.image}">
        <p style="margin:10px 0; font-size:14px; color:#ccc;">${p.text || "<i>Nessun messaggio</i>"}</p>
        <button onclick="approve(${p.id})">Approva</button>
      `;
      container.appendChild(card);
    });
  } catch (e) {
    console.error("Errore nel caricamento foto pending:", e);
  }
}

function approve(id) {
  fetch("/approve/" + id, { method: "POST" });
}

// Inizializza polling
setInterval(loadPending, 2000);
loadPending();
