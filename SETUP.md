# 📖 PANDUAN SETUP — Lexa Course Website

> Website kursus Mandarin siap pakai, dibuat dengan HTML, CSS, dan JavaScript murni.
> Panduan ini menjelaskan cara lengkap upload ke GitHub Pages dan menghubungkan ke Google Sheet.

---

## 📁 Struktur File

```
mandarin-course/
├── index.html          ← Halaman Beranda
├── tentang.html        ← Halaman Tentang Kami
├── program.html        ← Halaman Program
├── media.html          ← Halaman Media (Galeri & Video)
├── pilih-jadwal.html   ← Halaman Booking Jadwal
├── SETUP.md            ← File panduan ini
└── assets/
    ├── css/
    │   └── style.css   ← Seluruh styling website
    ├── js/
    │   └── script.js   ← Seluruh logika JavaScript
    └── images/
        └── logo.png    ← Logo website (ganti dengan logo Anda)
```

---

## 🚀 BAGIAN 1 — Upload ke GitHub Pages

### Langkah 1.1 — Buat Akun GitHub
1. Buka https://github.com
2. Klik **Sign Up** dan buat akun baru (gratis)
3. Verifikasi email Anda

### Langkah 1.2 — Buat Repository Baru
1. Login ke GitHub
2. Klik tombol **+** di pojok kanan atas → **New repository**
3. Beri nama repository, misalnya: `lexa-course` atau `website-mandarin`
4. Pastikan pilih **Public** (wajib untuk GitHub Pages gratis)
5. Centang **Add a README file**
6. Klik **Create repository**

### Langkah 1.3 — Upload File Website
**Cara A — Upload via Browser (Mudah):**
1. Buka repository yang baru dibuat
2. Klik **Add file** → **Upload files**
3. Drag & drop seluruh folder `mandarin-course/` ke area upload
4. Scroll ke bawah, isi pesan commit: `Upload website Lexa Course`
5. Klik **Commit changes**

**Cara B — Via Git (Lebih Pro):**
```bash
# Install Git di komputer Anda terlebih dahulu
git clone https://github.com/USERNAME/NAMA-REPO.git
cd NAMA-REPO
# Salin semua file ke dalam folder ini
git add .
git commit -m "Upload website Lexa Course"
git push origin main
```

### Langkah 1.4 — Aktifkan GitHub Pages
1. Di repository Anda, klik tab **Settings**
2. Scroll ke bawah cari bagian **Pages** di menu kiri
3. Di bagian **Source**, pilih **Deploy from a branch**
4. Pilih branch **main** dan folder **/ (root)**
5. Klik **Save**
6. Tunggu 1–2 menit

### Langkah 1.5 — Akses Website Anda
Setelah GitHub Pages aktif, website Anda bisa diakses di:
```
https://USERNAME.github.io/NAMA-REPO/
```
Contoh: `https://lexacourse.github.io/website-mandarin/`

> ⚠️ **Catatan:** Jika file `index.html` ada di subfolder, URL menjadi:
> `https://USERNAME.github.io/NAMA-REPO/mandarin-course/`

---

## 📊 BAGIAN 2 — Buat Google Sheet untuk Data Booking

### Langkah 2.1 — Buat Google Sheet Baru
1. Buka https://sheets.google.com
2. Klik **+ Blank** untuk membuat spreadsheet baru
3. Beri nama: `Lexa Course — Data Booking`

### Langkah 2.2 — Buat Header Kolom (Sheet 1: Data Booking)
Isi baris pertama dengan header berikut (satu kolom per sel):

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Timestamp | Nama | WhatsApp | Email | Level | Paket | Hari | Jam | Guru |

### Langkah 2.3 — Buat Sheet Jadwal Guru (Sheet 2)
1. Klik **+** di bagian bawah untuk menambah sheet baru
2. Beri nama: `Jadwal Guru`
3. Isi header:

| A | B | C | D | E |
|---|---|---|---|---|
| Nama Guru | Hari | Jam Mulai | Jam Selesai | Status |

### Langkah 2.4 — Contoh Isi Data Jadwal Guru
```
Laoshi Mei   | Senin    | 09:00 | 10:00 | Tersedia
Laoshi Mei   | Rabu     | 14:00 | 15:00 | Penuh
Laoshi Zhang | Selasa   | 10:00 | 11:00 | Tersedia
Laoshi Li    | Kamis    | 16:00 | 17:00 | Tersedia
```

### Langkah 2.5 — Salin Spreadsheet ID
URL spreadsheet Anda akan seperti:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```
Catat **SPREADSHEET_ID** tersebut untuk digunakan di langkah selanjutnya.

---

## ⚙️ BAGIAN 3 — Buat Google Apps Script

### Langkah 3.1 — Buka Apps Script
1. Di Google Sheet Anda, klik menu **Extensions** → **Apps Script**
2. Akan terbuka editor Apps Script

### Langkah 3.2 — Hapus Kode Default
Hapus semua kode yang ada (fungsi `myFunction()` default)

### Langkah 3.3 — Paste Kode Berikut

```javascript
// =============================================
// LEXA COURSE — Google Apps Script
// Simpan ke: Extensions > Apps Script
// =============================================

const SPREADSHEET_ID = 'GANTI_DENGAN_SPREADSHEET_ID_ANDA';
const SHEET_BOOKING = 'Data Booking';
const SHEET_JADWAL = 'Jadwal Guru';

// Handle POST request (terima data booking dari website)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_BOOKING);
    
    // Tambah baris baru dengan data booking
    sheet.appendRow([
      new Date().toLocaleString('id-ID'),  // Timestamp
      data.nama || '',
      data.whatsapp || '',
      data.email || '',
      data.level || '',
      data.paket || '',
      data.hari || '',
      data.jam || '',
      data.guru || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Booking tersimpan' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET request (ambil data jadwal guru)
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_JADWAL);
    const data = sheet.getDataRange().getValues();
    
    // Skip header row
    const jadwal = data.slice(1).map(row => ({
      guru: row[0],
      hari: row[1],
      jamMulai: row[2],
      jamSelesai: row[3],
      status: row[4]
    }));
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', data: jadwal }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Langkah 3.4 — Ganti SPREADSHEET_ID
Di baris pertama kode, ganti:
```
'GANTI_DENGAN_SPREADSHEET_ID_ANDA'
```
Dengan ID spreadsheet Anda yang sudah disalin di Langkah 2.5.

### Langkah 3.5 — Simpan Script
Klik ikon 💾 **Save** atau tekan `Ctrl+S`

---

## 🌐 BAGIAN 4 — Deploy Apps Script sebagai Web App

### Langkah 4.1 — Deploy
1. Di editor Apps Script, klik **Deploy** → **New deployment**
2. Klik ikon ⚙️ di samping "Select type" → pilih **Web app**

### Langkah 4.2 — Konfigurasi Deployment
Isi pengaturan berikut:
- **Description:** `Lexa Course API v1`
- **Execute as:** `Me (alamat email Anda)`
- **Who has access:** **Anyone** ← *Wajib dipilih agar website bisa kirim data*

### Langkah 4.3 — Izinkan Akses
1. Klik **Deploy**
2. Akan muncul popup izin → klik **Authorize access**
3. Pilih akun Google Anda
4. Klik **Advanced** → **Go to Lexa Course (unsafe)** (ini aman, hanya peringatan Google)
5. Klik **Allow**

### Langkah 4.4 — Salin Web App URL
Setelah berhasil, Anda akan melihat URL seperti:
```
https://script.google.com/macros/s/AKfycby.../exec
```
**Salin URL ini!** Ini adalah API URL Anda.

---

## 🔗 BAGIAN 5 — Hubungkan Website dengan Google Sheet

### Langkah 5.1 — Buka File script.js
Buka file `assets/js/script.js` dengan text editor (Notepad, VS Code, dll.)

### Langkah 5.2 — Ganti API_URL
Cari baris paling atas:
```javascript
const API_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL";
```

Ganti dengan URL yang Anda salin di Langkah 4.4:
```javascript
const API_URL = "https://script.google.com/macros/s/AKfycby.../exec";
```

### Langkah 5.3 — Ganti Nomor WhatsApp
Di baris berikutnya, ganti nomor WhatsApp:
```javascript
const WHATSAPP_NUMBER = "6281234567890";
```
Ganti `6281234567890` dengan nomor WhatsApp bisnis Anda (format: 62xxxxxxxxxx, tanpa tanda +)

### Langkah 5.4 — Update di GitHub
1. Simpan file `script.js`
2. Upload ulang file ke GitHub (seperti Langkah 1.3)
3. Commit dengan pesan: `Update API URL dan nomor WhatsApp`

---

## 🔄 BAGIAN 6 — Cara Admin Update Jadwal dari Google Sheet

### Update Jadwal Guru
1. Buka Google Sheet `Lexa Course — Data Booking`
2. Klik sheet **Jadwal Guru**
3. Edit langsung sel yang ingin diubah:
   - Ubah **Status** menjadi `Penuh` jika slot sudah terisi
   - Tambah baris baru untuk jadwal baru
   - Hapus baris untuk jadwal yang dihapus

### Lihat Data Booking Masuk
1. Klik sheet **Data Booking**
2. Setiap booking baru akan otomatis muncul sebagai baris baru
3. Kolom Timestamp menunjukkan waktu booking masuk

### Tips Admin Lainnya

**Menambah foto ke Galeri:**
1. Siapkan foto dalam format JPG/PNG (ukuran disarankan: 800x600px)
2. Upload ke folder `assets/images/` di GitHub
3. Buka `media.html`
4. Ganti `<div class="gallery-placeholder">` dengan:
```html
<img src="assets/images/nama-foto.jpg" alt="Deskripsi foto" class="gallery-img" />
```

**Mengganti video YouTube:**
1. Buka `media.html`
2. Cari `src="https://www.youtube.com/embed/dQw4w9WgXcQ"`
3. Ganti `dQw4w9WgXcQ` dengan ID video YouTube Anda
   - ID video ada di URL YouTube: `youtube.com/watch?v=**ID_VIDEO_INI**`

**Mengganti Logo:**
1. Siapkan logo dalam format PNG (disarankan 200x80px, background transparan)
2. Beri nama `logo.png`
3. Upload ke folder `assets/images/`
4. Logo akan otomatis muncul di navbar

---

## 🎨 BAGIAN 7 — Kustomisasi Tampilan

### Ganti Warna Utama
Buka `assets/css/style.css` dan cari bagian `:root`:
```css
:root {
  --primary: #2775F0;  /* ← Ganti dengan warna pilihan Anda */
}
```

### Ganti Informasi Kontak
Di setiap file HTML, cari dan ganti:
- `+62 812-3456-7890` → nomor WhatsApp Anda
- `info@lexacourse.com` → email Anda
- `6281234567890` → nomor WA format internasional

### Ganti Nama Kursus
Cari teks `Lexa Course` di semua file HTML dan ganti dengan nama kursus Anda.

---

## ❓ TROUBLESHOOTING

| Masalah | Solusi |
|---------|--------|
| Website tidak muncul di GitHub Pages | Pastikan file `index.html` ada di root repository, bukan di subfolder |
| Data booking tidak masuk ke Sheet | Periksa API_URL di script.js, pastikan sudah benar dan Web App sudah di-deploy ulang |
| Booking berhasil tapi tidak ada di Sheet | Periksa permission Apps Script: "Who has access" harus "Anyone" |
| Logo tidak muncul | Pastikan nama file persis `logo.png` di folder `assets/images/` |
| Redirect WhatsApp tidak bekerja | Periksa format nomor WHATSAPP_NUMBER (harus diawali 62, bukan 0) |

---

## 📞 Butuh Bantuan?

Jika mengalami kendala dalam setup, Anda bisa:
1. Buka Issues di repository GitHub Anda
2. Cari tutorial di YouTube: "GitHub Pages tutorial bahasa Indonesia"
3. Baca dokumentasi Google Apps Script: https://developers.google.com/apps-script

---

*Dibuat dengan ❤️ untuk Lexa Course*
*Website ini 100% gratis untuk di-hosting di GitHub Pages*
