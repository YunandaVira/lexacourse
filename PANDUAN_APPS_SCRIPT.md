# 📋 PANDUAN SETUP APPS SCRIPT — LEXA COURSE BOOKING SYSTEM

## LANGKAH 1 — Buka Google Apps Script

1. Buka **Google Sheet** Lexa Laoshi Anda
2. Klik menu **Ekstensi** → **Apps Script**
3. Editor akan terbuka di tab baru

---

## LANGKAH 2 — Paste Kode

1. **Hapus** semua kode yang ada (`Ctrl+A` → `Delete`)
2. **Paste** seluruh isi file `BookingSystem.gs`
3. Klik ikon 💾 **Save** (atau `Ctrl+S`)
4. Beri nama project: `Lexa Course Booking`

---

## LANGKAH 3 — Sesuaikan Config (PENTING!)

Di bagian atas kode, sesuaikan nilai berikut sesuai sheet Anda:

```javascript
// Sheet yang dilewati (bukan jadwal guru)
const SKIP_SHEETS = ['Full', 'Coretan', 'TOTAL'];
// → Tambahkan nama sheet lain yang bukan jadwal guru

// Jam mulai dari baris berapa?
const JAM_ROW_START = 26;
// → Lihat screenshot sheet Anda: jam 07:00 ada di baris berapa?
// → Dari screenshot: baris 26 ✓

// Hari mulai dari kolom berapa?
const HARI_COL_START = 3;
// → Kolom C = 3, sesuai screenshot ✓
```

---

## LANGKAH 4 — Test Dulu (Sebelum Deploy)

Di Apps Script editor, klik tombol **Run** pada fungsi:

### Test 1: Cek daftar guru
```
Pilih fungsi: testAllGuru → Run
```
✅ Harus muncul: "Total guru: 39" (atau sesuai jumlah sheet Anda)

### Test 2: Cek slot tersedia
```
Pilih fungsi: testCheckAvailable → Run
```
✅ Harus muncul: daftar nama guru yang available Senin jam 19:00

### Test 3: Baca jadwal satu guru
```
Pilih fungsi: testReadSchedule → Run
```
✅ Harus muncul: jumlah slot available guru pertama

---

## LANGKAH 5 — Deploy sebagai Web App

1. Klik tombol **Deploy** → **New Deployment**
2. Klik ikon ⚙️ → pilih **Web app**
3. Isi:
   - **Description:** `Lexa Course Booking v1`
   - **Execute as:** `Me (email Anda)`
   - **Who has access:** `Anyone`
4. Klik **Deploy**
5. Klik **Authorize access** → pilih akun Google → Allow
6. **Copy URL** yang muncul (bentuknya: `https://script.google.com/macros/s/XXXX/exec`)

---

## LANGKAH 6 — Pasang URL ke Website

Buka `assets/js/script.js`, cari baris:
```javascript
const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
```
Ganti dengan URL yang Anda copy:
```javascript
const API_URL = 'https://script.google.com/macros/s/XXXX/exec';
```

---

## CARA KERJA API

### GET — Cek guru tersedia
```
GET /exec?action=check&hari=Monday&jam=19:00

Response:
{
  "hari": "Monday",
  "jam": "19:00",
  "tersedia": ["Mei", "Zhang", "Li"],
  "jumlah": 3
}
```

### GET — Semua slot tersedia untuk 1 hari
```
GET /exec?action=slots&hari=Monday

Response:
{
  "hari": "Monday",
  "slots": {
    "07:00": ["Mei", "Zhang"],
    "08:00": ["Li"],
    ...
  }
}
```

### GET — Daftar semua guru
```
GET /exec?action=list

Response:
{
  "guru": ["Mei", "Zhang", "Li", ...]
}
```

### POST — Booking slot
```
POST /exec
Body:
{
  "action": "book",
  "guru": "Mei",
  "hari": "Monday",
  "jam": "19:00",
  "nama": "Anindita",
  "wa": "08123456789",
  "paket": "Gold",
  "email": "anindita@email.com"
}

Response sukses:
{
  "success": true,
  "message": "Booking berhasil! Anindita → Mei · Monday 19:00"
}

Response gagal:
{
  "success": false,
  "error": "Slot ini sudah dibooking oleh USER_LAIN"
}
```

---

## CATATAN PENTING

### Menambah sheet guru baru
Tidak perlu ubah kode. Sheet baru otomatis terbaca selama namanya tidak ada di `SKIP_SHEETS`.

### Jika nama hari di sheet berbeda
Sesuaikan `HARI_LIST` di kode:
```javascript
// Jika sheet pakai bahasa Indonesia:
const HARI_LIST = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
```

### Jika posisi jam/hari bergeser
- `JAM_ROW_START` = baris pertama jam di sheet (angka baris di Google Sheets)
- `HARI_COL_START` = kolom pertama hari (A=1, B=2, C=3...)

### Update script setelah perubahan
Jika Anda mengubah kode, deploy ulang:
**Deploy → Manage Deployments → Edit → versi baru → Deploy**

---

## TROUBLESHOOTING

| Masalah | Solusi |
|---------|--------|
| "Guru tidak ditemukan" | Cek nama sheet persis sama (case-sensitive) |
| Semua slot "blocked" | Cek `JAM_ROW_START` dan `HARI_COL_START` |
| Error "Authorization" | Deploy ulang dan klik Allow |
| Response kosong | Pastikan "Who has access: Anyone" |
| Slot tidak ter-update | Pastikan script berjalan sebagai "Me" |

