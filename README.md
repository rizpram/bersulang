# Bersulang Records Website

Static website untuk `bersulang.id` dan campaign single:

**Thufail Al Ghifari — Pasca Trilogi & Armorfatih**  
Release Date: 11 September 2026

## Struktur File

- `index.html` — halaman utama website
- `styles.css` — styling responsive dengan font stack Akzidenz Grotesk Next
- `script.js` — mobile menu
- `assets/` — favicon dan OG artwork placeholder
- `press-kit/` — press release dan credits txt

## Font

Website memakai CSS font stack:

```css
font-family: "Akzidenz Grotesk Next", Arial, Helvetica, sans-serif;
```

File font mentah tidak disimpan di repo publik. Jika Akzidenz Grotesk Next terpasang di device pengunjung, browser akan memakainya. Jika tidak, browser fallback ke Arial/Helvetica.

Untuk menampilkan Akzidenz ke semua pengunjung, gunakan webfont hanya jika lisensi web/public sudah aman.

## Cara Upload ke Hosting Biasa

1. Upload semua isi folder ini ke `public_html` / root domain `bersulang.id`.
2. Pastikan file `index.html` ada di root.
3. Update link Spotify/YouTube/Apple Music di section Smartlink.
4. Ganti `mailto:hello@bersulang.id` jika email resmi berbeda.

## Cara Deploy ke Vercel

1. Import repo ini ke Vercel sebagai static site.
2. Tambahkan domain `bersulang.id` di Vercel Project Settings > Domains.
3. Arahkan DNS domain ke Vercel sesuai instruksi Vercel.

## Yang Perlu Diganti Sebelum Launch

- Link streaming / pre-save
- Link YouTube visualizer
- Cover artwork final
- Email kontak resmi
- Social media links
- Press photo / logo final
