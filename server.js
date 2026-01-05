const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Multer setup temporaneo (salva il file in una cartella temporanea, poi lo spostiamo)
const tempDir = path.join(__dirname, "temp_uploads");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Serve static files
app.use(express.static("public"));
app.use("/uploads", express.static(UPLOAD_DIR));

/* ================== STATE ================== */
let pendingPhotos = [];
let wallState = {
  mode: "slideshow",
  overlay: "Mario & Giulia",
  bpm: 120,
  locked: false,
  activePhoto: null
};

/* ================== FUNZIONI ================== */

// Legge tutte le cartelle in uploads e restituisce foto con testo
function getWallPhotos() {
  const dirs = fs.readdirSync(UPLOAD_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
  const photos = dirs.map(dir => {
    const folderPath = path.join(UPLOAD_DIR, dir.name);
    const files = fs.readdirSync(folderPath);
    const imageFile = files.find(f => f.match(/\.(jpg|jpeg|png)$/i));
    const jsonFile = files.find(f => f.endsWith(".json"));
    let text = "";
    if (jsonFile) {
      try {
        text = JSON.parse(fs.readFileSync(path.join(folderPath, jsonFile))).text || "";
      } catch (err) {
        text = "";
      }
    }
    return {
      id: dir.name,
      image: imageFile ? `/uploads/${dir.name}/${imageFile}` : "",
      text
    };
  }).filter(p => p.image); // solo se c'è immagine
  return photos;
}

// Funzione per creare una nuova cartella per la foto
function savePhotoFolder(filePath, text) {
  const id = Date.now().toString();
  const newFolder = path.join(UPLOAD_DIR, id);
  fs.mkdirSync(newFolder);

  const ext = path.extname(filePath);
  const newImagePath = path.join(newFolder, "photo" + ext);
  fs.renameSync(filePath, newImagePath);

  fs.writeFileSync(path.join(newFolder, "text.json"), JSON.stringify({ text }));

  return { id, image: `/uploads/${id}/photo${ext}`, text };
}

/* ================== API ================== */

// Caricamento foto da utenti
app.post("/upload", upload.single("photo"), (req, res) => {
  if (wallState.locked) return res.sendStatus(403);

  const text = req.body.text || "";
  const photo = savePhotoFolder(req.file.path, text);
  pendingPhotos.push(photo);
  io.emit("pending-update", pendingPhotos);
  res.sendStatus(200);
});

// Caricamento foto admin direttamente sul wall
app.post("/admin/upload", upload.single("photo"), (req, res) => {
  const text = req.body.text || "";
  savePhotoFolder(req.file.path, text);
  io.emit("wall-update", { wallPhotos: getWallPhotos(), wallState });
  res.sendStatus(200);
});

// Approva una foto
app.post("/approve/:id", (req, res) => {
  const id = req.params.id;
  const i = pendingPhotos.findIndex(p => p.id === id);
  if (i !== -1) pendingPhotos.splice(i, 1);
  io.emit("pending-update", pendingPhotos);
  io.emit("wall-update", { wallPhotos: getWallPhotos(), wallState });
  res.sendStatus(200);
});

// Cancella foto
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const folderPath = path.join(UPLOAD_DIR, id);
  if (fs.existsSync(folderPath)) fs.rmSync(folderPath, { recursive: true, force: true });
  io.emit("wall-update", { wallPhotos: getWallPhotos(), wallState });
  res.sendStatus(200);
});

// Modifica stato wall
app.post("/state", express.json(), (req, res) => {
  wallState = { ...wallState, ...req.body };
  io.emit("wall-update", { wallPhotos: getWallPhotos(), wallState });
  res.sendStatus(200);
});

// Endpoint per polling admin
app.get("/pending", (req, res) => res.json(pendingPhotos));

/* ================== SOCKET.IO ================== */
io.on("connection", socket => {
  socket.emit("init", { wallPhotos: getWallPhotos(), wallState, pendingPhotos });
});

/* ================== POLLING AUTOMATICO ================== */
setInterval(() => {
  io.emit("wall-update", { wallPhotos: getWallPhotos(), wallState });
}, 3000);

/* ================== START SERVER ================== */
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🔥 PartyOS PRO attivo su http://localhost:${PORT}`);
});
