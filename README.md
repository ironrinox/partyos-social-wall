# PartyOS Social Wall

PartyOS Social Wall is an interactive web application designed for live events. It allows participants to share photos in real-time, which are moderated by an administrator before being displayed on a big screen (projector, TV, etc.). The app enhances audience engagement during events such as birthdays, parties, club nights, and other social gatherings.

---

## **Features**

- **Live Photo Submission:** Users can upload photos directly from their smartphones, along with an optional message.
- **Admin Moderation:** Photos are sent to an admin panel where the administrator approves submissions before they appear on the wall.
- **Dynamic Photo Wall:** Approved photos are displayed in real-time on a large screen. Supports single, slideshow, and grid modes.
- **Responsive Design:** Works on both mobile devices and large screens.
- **Future Expansion:** Planned features include interactive polls, event-specific challenges (e.g., clicks or actions triggering effects), and music voting systems.

---

## **Technologies Used**

- **Frontend:**
  - HTML5 / CSS3 (with responsive layouts)
  - JavaScript (vanilla)
  - Socket.IO for real-time communication

- **Backend:**
  - Node.js
  - Express.js
  - File uploads handled via `multer` (currently storing files in the local `uploads/` folder)

- **Other:**
  - Live updates using WebSockets (Socket.IO)
  - Grid layout for pending photos (admin view)
  - Slideshow with fade transitions for wall display

> **Note:** At the moment, uploaded photos are saved in a local folder (`uploads/`). In the future, this could be replaced with cloud storage (e.g., AWS S3) for scalability.

---

## **Project Structure**

```text
PARTYOS-SOCIAL-WALL/
|
├─ public/
│  ├─ admin/
│  │  ├─ admin.html
│  │  ├─ admin.css
│  │  └─ admin.js
│  ├─ index/
│  │  ├─ index.html
│  │  ├─ index.css
│  │  └─ index.js
│  ├─ wall/
│  │  ├─ wall.html
│  │  ├─ wall.css
│  │  └─ wall.js
│  └─ common/
│     ├─ common.css
│     └─ socket.js
|
├─ uploads/        # Stores user-uploaded photos (local storage)
├─ temp_uploads/   # Temporary files during upload
├─ server.js       # Node.js backend
├─ package.json
└─ package-lock.json
```

---

## **How to Run Locally**

1. Clone the repository:
```bash
git clone https://github.com/ironrinox/partyos-social-wall.git
cd PARTYOS-SOCIAL-WALL
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser:
- **User upload page**: http://localhost:3000/index/index.html
- **Admin panel**: http://localhost:3000/admin/admin.html
- **Wall display**: http://localhost:3000/wall/wall.html


---


# Planned Future Features

- **Interactive Polls**: Admin can create polls in real-time (e.g., vote for the next song).  
- **Event Challenges**: Actions such as clicks, points, or interactions could trigger effects (lights, animations, surprises).  
- **Cloud Storage Integration**: Move from local `uploads/` folder to cloud-based storage for better scalability.  
- **Customizable Wall Themes**: Change colors, layouts, and transitions depending on the event type.  
- **Mobile-first Optimization**: Even smoother experience on phones for uploading, previewing, and interacting.  


# License

This project is open-source and available under the MIT License.
