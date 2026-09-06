# 🌙 Sistem Pencatatan Jimpitan Ronda RT Berbasis QR Code

Aplikasi web modern, ringan, dan cepat untuk mencatat iuran jimpitan ronda warga RT. Petugas ronda cukup memindai (scan) stiker QR Code yang terpasang di depan rumah warga menggunakan kamera HP, memilih atau menginput nominal jimpitan, dan transaksi langsung tersimpan ke database **Supabase** serta tersinkronisasi otomatis ke **Google Sheets** secara real-time.

---

## 📋 Fitur Utama

1. **Scan-and-Go (Mobile-First):** Halaman web terbuka otomatis saat QR Code dipindai dengan parameter ID rumah (contoh: `?id=A-01`).
2. **Identitas Rumah Real-Time:** Menampilkan nama pemilik rumah dan alamat secara otomatis dari tabel database `warga`.
3. **Mengingat Nama Petugas Ronda:** Nama petugas ronda otomatis tersimpan di `localStorage` HP, sehingga cukup diketik sekali di awal giliran ronda.
4. **Pilihan Nominal Fleksibel:**
   - Tombol cepat: **Rp 0 (Nihil)**, **Rp 500**, **Rp 1.000**, **Rp 2.000**, **Rp 5.000**.
   - Input manual untuk nominal kustom.
   - **Validasi Cerdas:** Nilai minus (`< 0`) dilarang keras, namun **angka 0 (Nihil) diperbolehkan** untuk warga yang tidak menaruh koin hari ini dan berencana bayar dobel di ronda berikutnya.
5. **Rekap Real-Time ke Google Sheets:** Supabase Database Webhook mengirimkan setiap transaksi baru ke Google Apps Script tanpa perlu server perantara.
6. **Zero-Build & Ultra-Ringan:** Menggunakan HTML5 murni, Tailwind CSS via CDN, dan Supabase-js v2 via CDN (tanpa perlu compile/bundling webpack/vite).

---

## 📁 Struktur File

| File | Deskripsi |
| :--- | :--- |
| `index.html` | Aplikasi frontend antarmuka pengguna (Single Page Web). |
| `config.js` | Tempat meletakkan konfigurasi URL & API Key Supabase serta opsi aplikasi. |
| `supabase_schema.sql` | Skrip SQL lengkap untuk tabel `warga`, `jimpitan`, Row Level Security (RLS), dan seed data. |
| `google_apps_script.js` | Kode Google Apps Script (`doPost`) untuk menerima webhook dan merekap ke Google Sheets. |
| `server.js` | Server pengujian lokal tanpa dependensi eksternal (Node.js murni). |
| `package.json` | Script runner untuk pengujian lokal (`npm start`). |

---

## 🔑 1. Di Mana Meletakkan URL dan Anon Key Supabase?

Anda meletakkan kredensial Supabase pada file **`config.js`**.

### Langkah Mendapatkan Kredensial Supabase:
1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan masuk ke project Anda (atau buat project baru jika belum ada).
2. Klik ikon gerigi **Project Settings** di pojok kiri bawah.
3. Pilih menu **API** (di bawah menu Configuration).
4. Di bagian **Project URL**, salin URL Anda (contoh: `https://xyzcompany.supabase.co`).
5. Di bagian **Project API Keys**, salin kunci dengan label **`anon` `public`**.

### Cara Pengisian di `config.js`:
Buka file [`config.js`](config.js) dan isi variabel berikut:

```javascript
window.APP_CONFIG = {
  // Masukkan Project URL Supabase Anda di sini
  SUPABASE_URL: "https://xyzcompany.supabase.co",

  // Masukkan anon public key Supabase Anda di sini
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

  // Kustomisasi nama RT
  RT_TITLE: "Ronda Warga RT 13",
  RT_SUBTITLE: "Pencatatan Jimpitan Mandiri Berbasis QR Code",

  // Nominal cepat (termasuk 0 untuk status nihil)
  QUICK_AMOUNTS: [0, 500, 1000, 2000, 5000],

  // Fallback demo lokal (otomatis nonaktif saat kredensial terisi)
  ENABLE_MOCK_FALLBACK: true
};
```

---

## 🗄️ 2. Setup Database Supabase

1. Buka project Supabase Anda.
2. Klik menu **SQL Editor** di bilah navigasi kiri.
3. Klik tombol **New query**.
4. Buka file [`supabase_schema.sql`](supabase_schema.sql), salin seluruh isinya, dan tempelkan ke SQL Editor Supabase.
5. Klik **Run**.
6. Skrip ini otomatis:
   - Membuat tabel master `warga` dan tabel transaksi `jimpitan`.
   - Mengaktifkan Row Level Security (RLS) dengan kebijakan publik (`anon`) agar petugas ronda dapat membaca data warga dan mencatat transaksi tanpa harus login akun.
   - Mengisi data sampel rumah warga (`A-01` s/d `A-05`, `B-01` s/d `B-03`).

---

## 📊 3. Setup Rekap Otomatis ke Google Sheets

1. Buka [Google Sheets](https://sheets.new) dan buat spreadsheet baru (misal beri judul: `Rekap Jimpitan RT 13`).
2. Klik menu **Extensions** (Ekstensi) -> **Apps Script**.
3. Hapus semua kode default di editor Apps Script, lalu salin dan tempel seluruh isi file [`google_apps_script.js`](google_apps_script.js).
4. Klik tombol **Deploy** (Terapkan) di pojok kanan atas -> pilih **New deployment** (Penerapan baru).
5. Klik ikon gerigi di sebelah kiri jenis penerapan -> pilih **Web app** (Aplikasi web).
6. Konfigurasikan:
   - **Description:** `Webhook Rekap Jimpitan`
   - **Execute as:** `Me (email Anda)`
   - **Who has access:** `Anyone` *(PENTING: Pilih "Anyone" agar Supabase dapat mengirim webhook tanpa autentikasi login Google)*.
7. Klik **Deploy**, beri izin otorisasi akses akun Google Anda jika diminta.
8. Salin **Web App URL** yang diberikan (berakhiran `/exec`).
9. Hubungkan ke Supabase:
   - Masuk ke **Supabase Dashboard** -> **Database** -> **Webhooks**.
   - Klik **Create a new webhook**.
   - Nama: `Kirim ke Google Sheets`.
   - Table: `public.jimpitan`.
   - Events: Centang **Insert** saja.
   - Webhook Configuration:
     - Type: `HTTP Request`
     - Method: `POST`
     - URL: *Tempelkan Web App URL dari Google Apps Script tadi*.
     - HTTP Headers: `Content-Type = application/json`.
   - Klik **Save**.

---

## 💻 4. Panduan Pengujian di Komputer Lokal

Anda dapat menguji tampilan dan fungsionalitas di browser laptop/komputer Anda dengan dev server bawaan:

```bash
# Jalankan server lokal
node server.js

# Atau menggunakan npm
npm start
```

Terminal akan menampilkan link pengujian langsung:
- Buka di browser: **`http://localhost:3000/index.html?id=A-01`**
- Coba ganti parameter URL ke rumah lain: `?id=A-02` atau `?id=B-01`.
- Coba masukkan nama petugas: nama akan tersimpan di browser untuk kunjungan berikutnya.
- Coba tombol nominal cepat atau input nominal `0` (Nihil) maupun nominal lainnya.
- Coba input nominal minus (misal: `-500`): sistem akan langsung menolak dan menampilkan pesan error validasi.

---

## 🚀 5. Cara Deploy Gratis & Instan ke Internet

### Opsi A: Deploy ke GitHub Pages (Paling Mudah)
1. Buat repositori baru di [GitHub](https://github.com/new) (contoh nama: `jimpitan-rt`).
2. Masukkan file proyek ini (`index.html`, `config.js`) ke repository Anda melalui git atau upload file langsung di GitHub:
   ```bash
   git init
   git add index.html config.js README.md
   git commit -m "Deploy jimpitan RT"
   git branch -M main
   git remote add origin https://github.com/<USERNAME>/jimpitan-rt.git
   git push -u origin main
   ```
3. Di halaman repository GitHub Anda, buka tab **Settings** -> pilih menu **Pages** di sebelah kiri.
4. Di bagian **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: Pilih **main**, folder: **/ (root)**
   - Klik **Save**.
5. Tunggu sekitar 1 menit. Web Anda langsung live di:
   ```
   https://<username>.github.io/jimpitan-rt/index.html
   ```

---

### Opsi B: Deploy ke Vercel (Super Cepat + Custom Domain Gratis)
1. Buka [Vercel](https://vercel.com) dan login menggunakan akun GitHub/Google.
2. Klik tombol **Add New...** -> **Project**.
3. Impor repositori GitHub Anda tadi (atau gunakan Vercel CLI dengan mengetik `npx vercel` di terminal).
4. Biarkan konfigurasi default (Framework Preset: *Other*, Root Directory: `./`).
5. Klik **Deploy**.
6. Dalam hitungan detik web Anda aktif di alamat seperti:
   ```
   https://jimpitan-rt13.vercel.app
   ```

---

## 🖨️ 6. Cara Membuat Generator QR Code Massal Per Rumah dari Google Sheets

Anda tidak perlu berlangganan aplikasi pembuat QR berbayar. Anda dapat menghasilkan ratusan QR Code siap cetak langsung di dalam Google Sheets menggunakan formula bawaan `=IMAGE(...)`.

### Langkah-langkah Pembuatan di Google Sheets:

1. Buat tab baru di Google Sheets bernama **`Data_QR_Rumah`**.
2. Buat kolom-kolom berikut di baris 1 (Header):
   - **Kolom A:** `No`
   - **Kolom B:** `Kode Rumah`
   - **Kolom C:** `Nama Pemilik Rumah`
   - **Kolom D:** `Alamat / Blok`
   - **Kolom E:** `Link Web Jimpitan`
   - **Kolom F:** `Gambar QR Code (Siap Cetak)`

3. Isi baris 2 dengan contoh data warga Anda:
   - Kolom A2: `1`
   - Kolom B2: `A-01`
   - Kolom C2: `Bpk. Bambang Pamungkas`
   - Kolom D2: `Jl. Melati Blok A No. 1`
   - Kolom E2 (Formula Link):
     ```excel
     ="https://jimpitan-rt13.vercel.app/?id=" & B2
     ```
     *(Ganti `https://jimpitan-rt13.vercel.app/` dengan URL web hasil deploy GitHub Pages atau Vercel Anda).*

   - Kolom F2 (Formula Generator Gambar QR Code):
     ```excel
     =IMAGE("https://api.qrserver.com/v1/create-qr-code/?size=250x250&format=png&data=" & ENCODEURL(E2))
     ```

4. **Tarik rumus ke bawah (Drag-down)** untuk baris-baris rumah warga lainnya (`A-02`, `A-03`, `B-01`, dst.).
5. Sesuaikan ukuran baris (Row Height) menjadi sekitar `120px` dan lebar kolom F menjadi `120px` agar gambar QR Code terlihat jelas.

### Tips Cetak Stiker QR Code Warga:
- Gunakan fitur **File -> Print (Cetak)** di Google Sheets.
- Atur tata letak menjadi Grid / Label stiker.
- Lapisi stiker dengan stiker laminasi bening atau masukkan ke gantungan akrilik tahan air agar tidak rusak terkena hujan saat dipasang di pagar/depan pintu rumah warga.
- Ketika ronda malam hari, petugas cukup membuka kamera bawaan smartphone Android/iPhone, arahkan ke QR code tersebut, dan link web pencatatan jimpitan langsung terbuka otomatis!

---

## 🔒 Keamanan & Kebijakan Data
- Database dilindungi Row Level Security (RLS). Peran publik (`anon`) hanya diizinkan membaca master data rumah dan menambahkan transaksi baru.
- Kunci `anon` aman ditaruh di sisi klien (`config.js`) karena hanya memiliki akses terbatas sesuai aturan RLS PostgreSQL yang sudah dikunci.

