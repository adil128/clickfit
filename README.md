```

---

## How to run locally

1. Create the project folder and paste the files accordingly (see structure above). Put `index.html` and assets under `public/`.
2. `npm install` (runs from project root)
3. `npm start` to start the Node server (listens on port 3000 by default).
4. Open `http://localhost:3000` in your browser.

Uploaded images will be saved to the `upload_images/` folder in the project root and served at `/upload_images/<filename>`.

---

### Notes & remarks

* The server stores files locally in `upload_images` and uses `multer` for security and filename normalization.
* The MySQL script is ready to be run in a MySQL client (adjust as needed for your environment).



Enjoy!
```

