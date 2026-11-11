# SPR Solaville

Aplikasi web untuk membuat Surat Pesanan Rumah (SPR) perumahan Solaville. Pengguna mengisi simulasi, melengkapi data pemesan, lalu mengunduh SPR dalam bentuk PDF. Semua proses berjalan di browser, tidak ada server dan tidak ada data yang dikirim keluar.

Dipisahkan dari project landing page Solaville agar bisa berdiri sendiri.

## Alur

| Langkah | Alamat | Isi |
|---|---|---|
| 1. Simulasi | `/simulasi` | Pilih tipe unit, isi harga jual, pilih tenor dan suku bunga. Hasilnya: estimasi cicilan, DP, diskon DP, total pembayaran, total bunga. |
| 2. Data Pemesanan | `/spr` | Isi data diri, data unit (blok, nomor unit, booking fee), lalu tekan "Buat SPR (PDF)". |
| 3. Selesai | `/selesai` | Ringkasan SPR, tombol unduh ulang, dan tombol membuat SPR baru. |

Alamat `/` dan alamat yang tidak dikenal diarahkan ke `/simulasi`.

## Menjalankan

Membutuhkan Node.js 22 (lihat `.nvmrc`).

```bash
npm install
npm run dev       # server pengembangan, biasanya di http://localhost:5173
npm run build     # hasil build ke folder dist
npm run preview   # mencoba hasil build secara lokal
npm run lint      # oxlint
```

## Teknologi

React 19, React Router 7, Vite, Tailwind CSS 4, jsPDF dan jsPDF-AutoTable untuk PDF, serta lucide-react untuk ikon.

## Struktur

```
src/
  App.jsx                  rute aplikasi
  pages/                   SimulasiPage, SprPage, SelesaiPage
  components/
    layout/SprLayout.jsx   header, footer, judul tab per halaman
    simulasi/              form simulasi, panel hasil, form SPR, penanda langkah
    common/                SectionHeading, ikon
  data/
    siteConfig.js          nama brand dan booking fee bawaan
    units.js               daftar tipe unit
  utils/
    loan.js                rumus cicilan, DP, tenor, dan suku bunga
    sprDocument.js         isi dan tata letak PDF SPR
    sprValidation.js       aturan validasi form SPR
    simulationStore.js     penyimpanan pilihan simulasi (sessionStorage)
    sprDraft.js            draf form dan SPR yang sudah jadi (hanya di memori)
  index.css                warna dan tema (terang dan gelap)
```

## Mengubah nilai yang sering berubah

- **Booking fee bawaan:** `bookingFee` di `src/data/siteConfig.js`. Pemesan tetap bisa mengubahnya di form.
- **Tipe unit dan luasnya:** `src/data/units.js`. Nama tipe, luas tanah, dan luas bangunan ikut tercetak di PDF.
- **DP, tenor, dan suku bunga:** `DP_PERSEN`, `TENOR_OPTIONS`, dan `RATE_OPTIONS` di `src/utils/loan.js`.
- **Isi ketentuan di PDF:** konstanta `CATATAN`, `KETENTUAN`, dan `PENUTUP` di `src/utils/sprDocument.js`.
- **Warna dan tema:** blok `@theme` dan `.dark` di `src/index.css`.

## Cara hitung

- DP sebesar 5% dari harga jual, seluruhnya ditutup diskon DP.
- Plafon KPR adalah harga jual dikurangi DP. Angka ini tercetak di PDF dan menjadi pokok pinjaman.
- Cicilan memakai metode anuitas atas plafon KPR, dengan suku bunga yang sama sepanjang tenor. Suku bunga fix hanya 3 tahun pertama, jadi hasilnya adalah estimasi dan mengikuti kebijakan bank untuk tahun berikutnya.
- Hasilnya cocok dengan tabel simulasi brosur setelah pembulatan. Angka brosur dibulatkan manual, jadi selisih sampai beberapa ribu rupiah per bulan wajar.

## Data pribadi

- Data pemesan (nama, NIK, alamat, dan seterusnya) hanya disimpan di memori selama tab terbuka. Data itu hilang saat halaman dimuat ulang atau tab ditutup, dan tidak ditulis ke browser storage.
- Yang tersimpan di browser hanya pilihan simulasi (tipe, harga, tenor, suku bunga) di `sessionStorage`, dan pilihan tema di `localStorage`.
- PDF dibuat di perangkat pengguna. Jangan menyimpan PDF hasil unduhan di dalam repo: berkas `*.pdf` sudah diabaikan oleh `.gitignore`, tetapi isinya memuat NIK.

## Deploy

Hasil build (`dist`) adalah situs statis. Karena memakai rute di sisi browser, hosting harus mengarahkan semua alamat ke `index.html`, kalau tidak membuka atau me-refresh `/simulasi`, `/spr`, atau `/selesai` akan menghasilkan 404.

- **Vercel:** sudah ditangani oleh `vercel.json` di root project (aturan `rewrites` ke `index.html`, plus cache panjang untuk berkas di `/assets`). Tidak ada pengaturan tambahan; preset framework Vite dengan perintah `npm run build` dan folder keluaran `dist` sudah cukup.
- **Netlify:** tambahkan berkas `public/_redirects` berisi `/* /index.html 200`.
- **Hosting lain:** setel aturan fallback yang setara, yaitu semua alamat yang bukan berkas dilayani dengan `index.html`.
