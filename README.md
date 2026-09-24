# Portofolio Michelle (@chelartllie)

Website portofolio ilustrator: React (Create React App), semua file komponen berekstensi `.js`.

## Menjalankan
```
npm start        # development di http://localhost:3000
npm run build    # build produksi ke folder /build
```

## Struktur
- `src/data/works.js`: data artis & semua karya (judul, caption, tag). Edit di sini untuk menambah atau mengubah karya.
- `public/works/`: foto & video hasil download dari Instagram.
- `src/components/`: Navbar, Hero, About, Story, Gallery, Motion, Contact, Footer, Lightbox, TornEdge, FloatingLeaves.
- `src/App.css`: seluruh styling; warna utama `--sky: #c3cad0` ada di `src/index.css`.

## Menambah karya baru
1. Taruh file di `public/works/` (jpg, atau mp4 + `-poster.jpg`).
2. Tambah satu entri di array `works` pada `src/data/works.js`.
