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

* The numbers API is requested over HTTP as you specified. If your browser enforces HTTPS only or blocks mixed content, run the site over `http://localhost:3000` to allow the request. If you prefer HTTPS, change the numbers API to a CORS-enabled HTTPS endpoint or proxy it through your server.
* The server stores files locally in `upload_images` and uses `multer` for security and filename normalization.
* The MySQL script is ready to be run in a MySQL client (adjust as needed for your environment).

If you'd like, I can also:

* Provide a zip archive of the project files, or

Enjoy!
```
