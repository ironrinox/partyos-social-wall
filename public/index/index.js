const form = document.getElementById("form");
const fileInput = form.querySelector("input[type=file]");
const preview = document.getElementById("preview");
const submitBtn = form.querySelector(".submit-btn");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    preview.innerHTML = `<img src="${reader.result}">`;
    preview.style.display = "flex"; // mostra la preview
    submitBtn.disabled = false;      // abilita il bottone
  };
  reader.readAsDataURL(file);
});

form.addEventListener("submit", async e => {
  e.preventDefault();
  const file = fileInput.files[0];
  const text = form.querySelector(".text-input").value;
  if (!file) return alert("Seleziona una foto!");

  const data = new FormData();
  data.append("photo", file);
  data.append("text", text);

  try {
    await fetch("/upload", { method: "POST", body: data });
    alert("✨ Foto inviata! Guarda il maxischermo.");
    form.reset();
    preview.innerHTML = "";
    preview.style.display = "none"; // nasconde la preview dopo invio
    submitBtn.disabled = true;       // disabilita nuovamente il bottone
  } catch (err) {
    alert("Errore nell'invio della foto!");
    console.error(err);
  }
});
