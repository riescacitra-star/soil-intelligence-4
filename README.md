# SOIL-INTELLIGENCE 4.0
**Interactive 3D Soil Learning with WebXR and Generative AI**

Prototipe media pembelajaran mandiri untuk materi profil tanah dan horizon O, A, E, B, C pada konteks tanah tropika.

## Struktur
- `index.html` — antarmuka aplikasi, model 3D, eksplorasi horizon, lembar observasi, AI Tutor, kuis.
- `config.js` — URL backend (bukan tempat API key).
- `server.js` — backend Node.js untuk OpenAI Responses API.
- `.env.example` — contoh variabel lingkungan.
- `.github/workflows/pages.yml` — workflow publikasi GitHub Pages.
- `LAPORAN_ANALISIS.pdf` — laporan mini project.

## Publikasi frontend ke GitHub Pages
1. Buat repository publik bernama `soil-intelligence-4`.
2. Unggah seluruh isi folder ini ke root repository (termasuk folder `.github/workflows` dan file tersembunyi `.nojekyll`).
3. Buka **Settings → Pages**. Pada **Build and deployment**, pilih **GitHub Actions**.
4. Buka tab **Actions** dan tunggu workflow **Deploy SOIL-INTELLIGENCE 4.0 to GitHub Pages** selesai.
5. URL situs akan muncul di **Settings → Pages**. GitHub Pages menerbitkan file statis; backend Node.js tidak berjalan di GitHub Pages.

Dokumentasi resmi: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Aktivasi GenAI (backend terpisah)
1. Deploy `server.js` ke hosting yang mendukung Node.js.
2. Jalankan `npm install`, lalu `npm start`.
3. Atur `OPENAI_API_KEY` sebagai secret/environment variable di dashboard hosting. Jangan commit API key ke GitHub.
4. Atur `OPENAI_MODEL=gpt-6.2-astra` (atau model Responses API yang tersedia pada akun API).
5. Atur `ALLOWED_ORIGIN` ke URL frontend GitHub Pages secara persis.
6. Setelah backend aktif, isi `window.SOIL_API_URL` di `config.js` dengan URL backend, lalu commit perubahan ke GitHub.

OpenAI API menggunakan Responses API; lihat https://developers.openai.com/api/docs/quickstart dan https://developers.openai.com/api/reference/resources/responses/methods/create.

## Interaksi yang tersedia
- Putar, zoom, dan pilih horizon pada model profil 3D.
- Buka detail horizon dan catat observasi virtual.
- Ajukan pertanyaan kepada AI Soil Tutor (aktif setelah backend dan API key tersedia; selain itu mode demo).
- Kerjakan bank soal contoh atau minta AI menghasilkan soal baru (aktif setelah backend tersedia).
- Tombol WebXR hanya dapat digunakan bila browser/perangkat mendukung fitur immersive dan halaman berjalan pada HTTPS. Mode 3D biasa tetap tersedia sebagai fallback.

## Catatan akademik dan batasan
Model profil bersifat skematik/konseptual, bukan profil pedon hasil survei. Kedalaman, susunan, dan keberadaan horizon bervariasi. Horizon E tidak selalu berkembang. Hasil AI harus diverifikasi terhadap buku teks, deskripsi profil, dan data laboratorium/ lapangan. Lembar observasi belum menyimpan data permanen setelah sesi berakhir.
