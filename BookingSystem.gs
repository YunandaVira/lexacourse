/**
 * ============================================================
 *  LEXA COURSE — Booking System Google Apps Script
 *  
 *  CARA DEPLOY:
 *  1. Buka Google Sheet Anda
 *  2. Extensions → Apps Script
 *  3. Paste seluruh kode ini
 *  4. Deploy → New Deployment → Web App
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  5. Copy URL → paste ke website (API_URL di script.js)
 * ============================================================
 */

// ── CONFIG ──────────────────────────────────────────────────

// Sheet yang BUKAN jadwal guru (dilewati saat looping)
const SKIP_SHEETS = ['Full', 'Coretan', 'TOTAL'];

// Warna background abu-abu = BLOCKED
// Google Sheets menyimpan warna sebagai hex string
// Jika cell abu-abu (background bukan putih/null), dianggap blocked
const WHITE_COLORS = ['#ffffff', '#FFFFFF', null, ''];

// Jam operasional (sesuai sheet Anda)
const JAM_LIST = [
  '07:00','08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00','18:00',
  '19:00','20:00','21:00','22:00'
];

// Hari (urutan kolom di sheet Anda)
const HARI_LIST = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

// Baris header jam mulai dari baris berapa (row index, 0-based)
// Sesuai screenshot: jam mulai baris 26 (row 25 jika 0-indexed di Apps Script = baris 26)
const JAM_ROW_START = 26; // Baris pertama jam di sheet (1-indexed)
const HARI_COL_START = 3; // Kolom pertama hari (C=3, 1-indexed)


// ── HELPER: Ambil semua nama guru ──────────────────────────

function getAllGuru() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheets()
    .map(s => s.getName())
    .filter(name => !SKIP_SHEETS.includes(name));
}


// ── HELPER: Cek apakah warna = abu-abu (blocked) ───────────

function isBlocked(background) {
  if (!background || WHITE_COLORS.includes(background)) return false;
  
  // Parse hex ke RGB
  const hex = background.replace('#', '');
  if (hex.length !== 6) return false;
  
  const r = parseInt(hex.substring(0,2), 16);
  const g = parseInt(hex.substring(2,4), 16);
  const b = parseInt(hex.substring(4,6), 16);
  
  // Abu-abu: R ≈ G ≈ B dan bukan putih
  const isGray = Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30;
  const isNotWhite = r < 240; // bukan hampir putih
  
  return isGray && isNotWhite;
}


// ── HELPER: Konversi nama hari ke index kolom ──────────────

function hariToColIndex(hari) {
  const idx = HARI_LIST.indexOf(hari);
  return idx === -1 ? -1 : HARI_COL_START + idx; // 1-indexed column number
}


// ── HELPER: Konversi jam ke index baris ───────────────────

function jamToRowIndex(jam) {
  const idx = JAM_LIST.indexOf(jam);
  return idx === -1 ? -1 : JAM_ROW_START + idx; // 1-indexed row number
}


// ── FUNGSI UTAMA: Baca jadwal satu guru ───────────────────

function readGuruSchedule(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return null;

  // Ambil seluruh range sekaligus (lebih efisien)
  const totalRows = JAM_LIST.length;
  const totalCols = HARI_LIST.length;
  
  const range = sheet.getRange(
    JAM_ROW_START,
    HARI_COL_START,
    totalRows,
    totalCols
  );
  
  const values      = range.getValues();
  const backgrounds = range.getBackgrounds();
  
  const schedule = [];
  
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      const cellValue = values[r][c];
      const bg        = backgrounds[r][c];
      
      let status;
      if (isBlocked(bg)) {
        status = 'blocked';
      } else if (cellValue && cellValue.toString().trim() !== '') {
        status = 'booked';
      } else {
        status = 'available';
      }
      
      schedule.push({
        guru : sheetName,
        hari : HARI_LIST[c],
        jam  : JAM_LIST[r],
        status,
        murid: status === 'booked' ? cellValue.toString().trim() : null
      });
    }
  }
  
  return schedule;
}


// ── API: checkAvailable(hari, jam) ────────────────────────
// Mengembalikan daftar guru yang AVAILABLE pada slot tersebut

function checkAvailable(hari, jam) {
  const guruList = getAllGuru();
  const ss       = SpreadsheetApp.getActiveSpreadsheet();
  const available = [];
  
  const colIdx = hariToColIndex(hari);
  const rowIdx = jamToRowIndex(jam);
  
  if (colIdx === -1) return { error: 'Hari tidak valid: ' + hari };
  if (rowIdx === -1) return { error: 'Jam tidak valid: ' + jam };
  
  for (const guruName of guruList) {
    try {
      const sheet = ss.getSheetByName(guruName);
      if (!sheet) continue;
      
      const cell = sheet.getRange(rowIdx, colIdx);
      const val  = cell.getValue();
      const bg   = cell.getBackground();
      
      if (!isBlocked(bg) && (!val || val.toString().trim() === '')) {
        available.push(guruName);
      }
    } catch (e) {
      // Skip sheet jika ada error
      console.log('Error reading sheet: ' + guruName + ' — ' + e.message);
    }
  }
  
  return {
    hari,
    jam,
    tersedia: available,
    jumlah  : available.length
  };
}


// ── API: bookSlot(guru, hari, jam, namaUser) ──────────────
// Mengisi cell di sheet guru dengan nama user

function bookSlot(guru, hari, jam, namaUser) {
  const colIdx = hariToColIndex(hari);
  const rowIdx = jamToRowIndex(jam);
  
  if (colIdx === -1) return { success: false, error: 'Hari tidak valid: ' + hari };
  if (rowIdx === -1) return { success: false, error: 'Jam tidak valid: ' + jam };
  
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(guru);
  
  if (!sheet) return { success: false, error: 'Guru tidak ditemukan: ' + guru };
  
  const cell = sheet.getRange(rowIdx, colIdx);
  const val  = cell.getValue();
  const bg   = cell.getBackground();
  
  // Cek ulang apakah masih available
  if (isBlocked(bg)) {
    return { success: false, error: 'Slot ini tidak tersedia (blocked).' };
  }
  if (val && val.toString().trim() !== '') {
    return { success: false, error: 'Slot ini sudah dibooking oleh ' + val };
  }
  
  // Isi cell dengan nama user
  cell.setValue(namaUser);
  
  // Warnai kuning untuk menandai booking baru
  cell.setBackground('#FFF9C4');
  
  // Log ke sheet TOTAL jika ada
  logBooking(guru, hari, jam, namaUser);
  
  return {
    success: true,
    message: `Booking berhasil! ${namaUser} → ${guru} · ${hari} ${jam}`
  };
}


// ── HELPER: Log booking ke sheet TOTAL ───────────────────

function logBooking(guru, hari, jam, namaUser) {
  try {
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('TOTAL');
    if (!sheet) return;
    
    const timestamp = new Date().toLocaleString('id-ID', {timeZone: 'Asia/Jakarta'});
    sheet.appendRow([timestamp, namaUser, guru, hari, jam, 'WEBSITE']);
  } catch (e) {
    // Gagal log tidak mempengaruhi booking
  }
}


// ── WEB APP: doGet ────────────────────────────────────────
// GET /exec?action=check&hari=Monday&jam=19:00
// GET /exec?action=all
// GET /exec?action=guru&nama=Mei

function doGet(e) {
  const params = e.parameter;
  const action = params.action || 'all';
  
  let result;
  
  try {
    if (action === 'check') {
      // Cek guru tersedia untuk hari+jam tertentu
      const hari = params.hari;
      const jam  = params.jam;
      if (!hari || !jam) throw new Error('Parameter hari dan jam wajib diisi.');
      result = checkAvailable(hari, jam);
      
    } else if (action === 'guru') {
      // Ambil jadwal lengkap satu guru
      const nama = params.nama;
      if (!nama) throw new Error('Parameter nama guru wajib diisi.');
      result = readGuruSchedule(nama);
      
    } else if (action === 'list') {
      // Ambil daftar semua guru
      result = { guru: getAllGuru() };
      
    } else if (action === 'slots') {
      // Ambil semua slot available untuk hari tertentu
      const hari = params.hari;
      if (!hari) throw new Error('Parameter hari wajib diisi.');
      
      const slots = {};
      for (const jam of JAM_LIST) {
        const res = checkAvailable(hari, jam);
        if (res.tersedia && res.tersedia.length > 0) {
          slots[jam] = res.tersedia;
        }
      }
      result = { hari, slots };
      
    } else {
      // Default: semua guru
      result = { guru: getAllGuru(), jam: JAM_LIST, hari: HARI_LIST };
    }
    
  } catch (err) {
    result = { error: err.message };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders ? 
    ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON) :
    ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
}


// ── WEB APP: doPost ───────────────────────────────────────
// POST /exec  body: { action:"book", guru, hari, jam, nama, wa, paket }

function doPost(e) {
  let result;
  
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action || 'book';
    
    if (action === 'book') {
      const { guru, hari, jam, nama, wa, paket, email } = body;
      
      if (!guru)  throw new Error('Nama guru wajib diisi.');
      if (!hari)  throw new Error('Hari wajib diisi.');
      if (!jam)   throw new Error('Jam wajib diisi.');
      if (!nama)  throw new Error('Nama siswa wajib diisi.');
      
      // Booking di sheet guru
      const bookResult = bookSlot(guru, hari, jam, nama);
      
      if (bookResult.success) {
        // Simpan juga detail lengkap ke sheet TOTAL
        try {
          const ss    = SpreadsheetApp.getActiveSpreadsheet();
          const sheet = ss.getSheetByName('TOTAL');
          if (sheet) {
            const timestamp = new Date().toLocaleString('id-ID', {timeZone: 'Asia/Jakarta'});
            // Cari atau buat header jika belum ada
            const lastRow = sheet.getLastRow();
            if (lastRow < 1) {
              sheet.appendRow(['Timestamp','Nama','WhatsApp','Email','Guru','Hari','Jam','Paket','Source']);
            }
            sheet.appendRow([
              new Date(),
              nama,
              wa || '',
              email || '',
              guru,
              hari,
              jam,
              paket || '',
              'WEBSITE'
            ]);
          }
        } catch (logErr) {
          // log error tidak mempengaruhi response
        }
      }
      
      result = bookResult;
      
    } else if (action === 'check') {
      const { hari, jam } = body;
      result = checkAvailable(hari, jam);
      
    } else {
      throw new Error('Action tidak dikenal: ' + action);
    }
    
  } catch (err) {
    result = { success: false, error: err.message };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}


// ── TEST FUNCTIONS (jalankan manual dari Apps Script editor) ─

function testCheckAvailable() {
  const result = checkAvailable('Monday', '19:00');
  console.log(JSON.stringify(result, null, 2));
}

function testReadSchedule() {
  const guruList = getAllGuru();
  console.log('Daftar guru:', guruList);
  
  if (guruList.length > 0) {
    const jadwal = readGuruSchedule(guruList[0]);
    const available = jadwal.filter(s => s.status === 'available');
    console.log(`${guruList[0]}: ${available.length} slot tersedia`);
  }
}

function testBookSlot() {
  // HATI-HATI: ini akan menulis ke sheet!
  // Uncomment untuk test:
  // const result = bookSlot('Mei', 'Monday', '19:00', 'TEST USER');
  // console.log(JSON.stringify(result, null, 2));
  console.log('Test booking dinonaktifkan untuk keamanan.');
}

function testAllGuru() {
  const list = getAllGuru();
  console.log('Total guru:', list.length);
  console.log('Nama:', list.join(', '));
}
