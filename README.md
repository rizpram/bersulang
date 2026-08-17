# Bersulang Records Website

Static website untuk `bersulang.id` dan campaign single:

**Thufail Al Ghifari — Tetap Berdiri**  
Pasca Trilogi & Armorfatih  
Release Date: 11 September 2026

## Struktur File

- `index.html` — halaman utama website
- `styles.css` — styling responsive
- `script.js` — mobile menu
- `assets/` — favicon dan OG artwork placeholder
- `press-kit/` — press release dan credits txt

## Cara Upload ke Hosting Biasa

1. Upload semua isi folder ini ke `public_html` / root domain `bersulang.id`.
2. Pastikan file `index.html` ada di root.
3. Update link Spotify/YouTube/Apple Music di section Smartlink.
4. Ganti `mailto:hello@bersulang.id` jika email resmi berbeda.

## Cara Deploy ke Vercel

1. Buat repo GitHub baru, misalnya `bersulang-id`.
2. Upload semua file ini.
3. Import repo ke Vercel sebagai static site.
4. Tambahkan domain `bersulang.id` di Vercel Project Settings > Domains.
5. Arahkan DNS domain ke Vercel sesuai instruksi Vercel.

## Yang Perlu Diganti Sebelum Launch

- Link streaming / pre-save
- Link YouTube visualizer
- Cover artwork final
- Email kontak resmi
- Social media links
- Press photo / logo final
