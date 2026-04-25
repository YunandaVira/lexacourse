/* LEXA COURSE — script.js */
'use strict';

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mobMenu');
const backTop   = document.getElementById('backTop');
const isHome    = !!document.querySelector('.hero-wrap');

/* ── NAVBAR STATE ── */
function setNav(){
  if(!navbar) return;
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('solid', scrolled || !isHome);
  navbar.classList.toggle('transparent', !scrolled && isHome);
}
setNav();
window.addEventListener('scroll', ()=>{ setNav(); backTop?.classList.toggle('show', window.scrollY>400); }, {passive:true});

/* ── HAMBURGER ── */
hamburger?.addEventListener('click',()=>{
  const open = hamburger.classList.toggle('open');
  if(mobMenu){
    if(open){ mobMenu.style.display='flex'; requestAnimationFrame(()=>mobMenu.classList.add('open')); }
    else { mobMenu.classList.remove('open'); setTimeout(()=>{ if(mobMenu) mobMenu.style.display=''; },400); }
  }
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.mob-a').forEach(a=>a.addEventListener('click',()=>{
  hamburger?.classList.remove('open');
  mobMenu?.classList.remove('open');
  document.body.style.overflow='';
  setTimeout(()=>{ if(mobMenu) mobMenu.style.display=''; },400);
}));

/* ── BACK TO TOP ── */
backTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* ── SCROLL ANIMATIONS ── */
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('vis'); io.unobserve(e.target); } });
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.fi,.fi-l,.fi-r').forEach(el=>io.observe(el));

/* ── ACTIVE NAV ── */
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-a,.mob-a').forEach(a=>{
  const href = a.getAttribute('href');
  if(href === page || (!page && href==='index.html')) a.classList.add('active');
});

/* ── SLIDER ── */
(function(){
  const track = document.getElementById('slTrack');
  const dotsEl = document.getElementById('slDots');
  if(!track) return;
  const cards=[
  {h:'你好',p:'nǐ hǎo',  m:'Halo',             img:'assets/images/emot/hallo.png', c:'#5927f0'},
  {h:'谢谢',p:'xiè xiè', m:'Terima kasih',     img:'assets/images/emot/hands.png',c:'#D97706'},
  {h:'学习',p:'xué xí',  m:'Belajar',          img:'assets/images/emot/studying.png', c:'#16A34A'},
  {h:'朋友',p:'péng yǒu',m:'Teman',            img:'assets/images/emot/friends.png',c:'#7C3AED'},
  {h:'中文',p:'zhōng wén',m:'Bahasa Mandarin', img:'assets/images/emot/china.png', c:'#DC2626'},
  {h:'很好',p:'hěn hǎo', m:'Sangat baik',      img:'assets/images/emot/good.png',  c:'#0891B2'},
  {h:'再见',p:'zài jiàn',m:'Sampai jumpa',     img:'assets/images/emot/wave.png',   c:'#EA580C'},
];
  let cur=0,busy=false,tmr;
  cards.forEach((c,i)=>{
    const el=document.createElement('div');
    el.className='s-card'; el.dataset.i=i;
    el.innerHTML=`<div class="s-card-top" style="background:${c.c}"></div><div class="s-label">Karakter Mandarin</div><div class="s-emoji">
  <img src="${c.img}" width="28">
</div>
<div class="s-char" style="color:${c.c}">${c.h}</div><div class="s-line" style="background:${c.c}"></div><div class="s-pin" style="color:${c.c}">${c.p}</div><div class="s-mean">${c.m}</div>`;
    el.addEventListener('click',()=>{if(!busy)go(i)});
    track.appendChild(el);
  });
  cards.forEach((_,i)=>{
    const b=document.createElement('button');
    b.className='sl-dot'+(i===0?' on':'');
    b.setAttribute('aria-label','Slide '+(i+1));
    b.addEventListener('click',()=>{if(!busy){go(i);reset();}});
    dotsEl.appendChild(b);
  });
  function pos(i){const n=cards.length,d=(i-cur+n)%n;return d>n/2?d-n:d}
  function render(anim){
    const els=track.querySelectorAll('.s-card');
    if(!anim) els.forEach(e=>e.style.transition='none');
    requestAnimationFrame(()=>{
      if(!anim) requestAnimationFrame(()=>els.forEach(e=>e.style.transition=''));
      els.forEach(el=>{
        const i=+el.dataset.i,p=pos(i);
        el.className='s-card';
        el.classList.add(p===0?'s-center':p===1||p===-(cards.length-1)?'s-right':p===-1||p===cards.length-1?'s-left':p===2?'s-fr':'s-fl');
        el.style.boxShadow=p===0?`0 20px 56px ${cards[i].c}20,0 6px 18px rgba(0,0,0,0.06)`:'none';
      });
      dotsEl.querySelectorAll('.sl-dot').forEach((d,i)=>d.classList.toggle('on',i===cur));
    });
  }
  function go(idx){if(busy||idx===cur)return;busy=true;cur=((idx%cards.length)+cards.length)%cards.length;render(true);setTimeout(()=>busy=false,700);}
  function reset(){clearInterval(tmr);tmr=setInterval(()=>go(cur+1),3200);}
  let tx=0;
  track.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
  track.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>40){go(cur+(dx<0?1:-1));reset();}},{passive:true});
  render(false);reset();
})();

/* ── FAQ ── */
window.faqToggle = function(btn){
  const ans=btn.nextElementSibling, wasOn=btn.classList.contains('on');
  document.querySelectorAll('.faq-btn.on').forEach(q=>{q.classList.remove('on');q.nextElementSibling.classList.remove('on');});
  if(!wasOn){btn.classList.add('on');ans.classList.add('on');}
};

/* ── PROGRESS BARS ── */
(function(){
  const pio=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){setTimeout(()=>{e.target.style.width=e.target.dataset.target+'%';},200);pio.unobserve(e.target);}
    });
  },{threshold:0.4});
  document.querySelectorAll('.prog-fill[data-target]').forEach(b=>pio.observe(b));
})();

/* ── BOOKING ── */
(function(){
  if(!document.querySelector('.booking-wrap')) return;

  /* ── CONFIG ── ganti setelah deploy Apps Script */
  const API_URL = 'https://script.google.com/macros/s/AKfycbzr0WBZQC0ykz4Kv9VU5AsZtCwqGuXRR9Rjr422bMU86oEfmw-yIZdxF-_3kd0rPea3/exec';
  const WA_NUM  = '6285280051105';

  /* Map hari Indonesia → English (sesuai sheet) */
  const HARI_MAP = {
    'Senin':'Monday','Selasa':'Tuesday','Rabu':'Wednesday',
    'Kamis':'Thursday','Jumat':'Friday','Sabtu':'Saturday','Minggu':'Sunday'
  };

  let step  = 1;
  const TOTAL = 6;
  let data  = { paket:'', hari:[], jam:[], guru:'', nama:'', wa:'', email:'', tujuan:'' };
  let availableGuruCache = {}; // { "Monday_19:00": ["Mei","Zhang"] }

  /* ── Paket selection ── */
  document.querySelectorAll('.pkg-opt').forEach(el => el.addEventListener('click', () => {
    document.querySelectorAll('.pkg-opt').forEach(e => e.classList.remove('on'));
    el.classList.add('on');
    data.paket = el.dataset.pkg;
    genSchedule();
  }));

  /* ── Generate jadwal fields ── */
  function genSchedule(){
    const wrap = document.getElementById('sched-fields');
    if(!wrap) return;
    const basePkg = (data.paket || '').split('-')[0]; // ambil "silver" dari "silver-sg"

const n = {
  silver: 1,
  gold: 2,
  platinum: 3
}[basePkg] || 1;
    const days = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
    const hrs  = Array.from({length:16}, (_,i) => `${String(i+7).padStart(2,'0')}:00`);
    wrap.innerHTML = Array.from({length:n}, (_,i) => `
      <div class="form-group">
        <label class="form-label">Sesi ${i+1} — Pilih Hari &amp; Jam</label>
        <div class="schedule-row">
          <select class="form-control" id="hari${i}" onchange="window.onScheduleChange()">
            <option value="">Pilih hari</option>
            ${days.map(d => `<option value="${d}">${d}</option>`).join('')}
          </select>
          <select class="form-control" id="jam${i}" onchange="window.onScheduleChange()">
            <option value="">Pilih jam</option>
            ${hrs.map(h => `<option value="${h}">${h}</option>`).join('')}
          </select>
        </div>
      </div>`).join('');
    data.sessions = n;
  }

  /* ── Saat hari/jam berubah, prefetch available guru ── */
  window.onScheduleChange = async function(){
    if(API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') return;
    const n = data.sessions || 1;
    for(let i = 0; i < n; i++){
      const hari = document.getElementById('hari'+i)?.value;
      const jam  = document.getElementById('jam'+i)?.value;
      if(!hari || !jam) continue;
      const hariEn = HARI_MAP[hari] || hari;
      const key    = `${hariEn}_${jam}`;
      if(availableGuruCache[key]) continue; // sudah di-cache
      try {
        const res  = await fetch(`${API_URL}?action=check&hari=${hariEn}&jam=${encodeURIComponent(jam)}`);
        const json = await res.json();
        if(json.tersedia) availableGuruCache[key] = json.tersedia;
      } catch(e) { /* silent fail */ }
    }
  };

function getGuruImgHtml(nama) {
  const base = nama.toLowerCase().trim().replace(/\s+/g, '-');
  const exts = ['jpg', 'jpeg', 'png', 'webp'];
  
  // Coba ekstensi satu per satu via onerror chain
  // jpg → jpeg → png → webp → default
  return `<img 
    src="./assets/images/guru/${base}.jpg"
    alt="${nama}"
    class="teacher-img"
    onerror="
      var exts = ['jpeg','png','webp'];
      var tried = this.dataset.tried ? parseInt(this.dataset.tried) : 0;
      if(tried < exts.length){
        this.dataset.tried = tried + 1;
        this.src = './assets/images/guru/${base}.' + exts[tried];
      } else {
        this.onerror=null;
        this.src='./assets/images/guru/default.jpg';
      }
    "
  />`;
}
  /* ── Cache level guru dari sheet Level-Laoshi ── */
  let levelLaoshiCache = null; // { "Merki": ["HSK 1","HSK 2",...], ... }

  async function fetchLevelLaoshi() {
    if (levelLaoshiCache) return levelLaoshiCache;
    try {
      const res  = await fetch(`${API_URL}?action=getlevel`);
      const json = await res.json();
      levelLaoshiCache = json.data || {};
    } catch(e) {
      levelLaoshiCache = {};
    }
    return levelLaoshiCache;
  }

  // Cocokkan tujuan user dengan level yang dimiliki guru
  // Tujuan user contoh: "HSK 3", "Speaking", "Basic (Belum Pernah)"
  // Level di sheet contoh: "HSK 3", "HSKK 1", "YCT 1", "Taiwan", "BCT 1"
  function guruCocokTujuan(levelGuru, tujuanUser) {
    if (!levelGuru || levelGuru.length === 0) return true;
    if (!tujuanUser) return true;

    const t = tujuanUser.toLowerCase().trim();

    // ✅ Tujuan umum: semua guru bisa mengajar, cukup cek jadwal saja
    const tujuanUmum = ['basic (belum pernah)', 'speaking', 'writing', 'listening'];
    if (tujuanUmum.includes(t)) return true;

    // Sisanya tetap cek level di sheet
    const mappingTujuan = {
      'hsk 1':  ['hsk 1'],
      'hsk 2':  ['hsk 2'],
      'hsk 3':  ['hsk 3'],
      'hsk 4':  ['hsk 4'],
      'hsk 5':  ['hsk 5'],
      'hsk 6':  ['hsk 6'],
      'hskk 1': ['hskk 1'],
      'hskk 2': ['hskk 2'],
      'hskk 3': ['hskk 3'],
      'hskk 4': ['hskk 4'],
      'yct 1':  ['yct 1'],
      'yct 2':  ['yct 2'],
      'yct 3':  ['yct 3'],
      'yct 4':  ['yct 4'],
      'yct 5':  ['yct 5'],
      'yct 6':  ['yct 6'],
      'bct 1':  ['bct 1'],
      'bct 2':  ['bct 2'],
      'bct 3':  ['bct 3'],
    };

    const targetKolom = mappingTujuan[t] || [t];
    return levelGuru.some(lvl =>
      targetKolom.some(target => lvl.toLowerCase().trim() === target)
    );
  }

  // Render badge level untuk card guru (tampilkan maks 4)
  function renderLevelBadges(levelGuru) {
    if (!levelGuru || levelGuru.length === 0) return '';
    const shown = levelGuru.slice(0, 4);
    const sisa  = levelGuru.length - shown.length;
    return shown.map(l => `<span class="guru-level-badge">${l}</span>`).join('')
      + (sisa > 0 ? `<span class="guru-level-badge guru-level-more">+${sisa}</span>` : '');
  }

  /* ── Card rekomendasi admin ── */
  function adminCard(){
    return `
      <div class="teacher-opt guru-card-full" data-teacher="rekomendasi admin" onclick="selectTeacher(this)"
        style="border-style:dashed; opacity:0.85;">
        <div class="guru-card-foto-wrap" style="font-size:2.5rem;display:flex;align-items:center;justify-content:center">🙋</div>
        <div class="guru-card-info">
          <div class="guru-card-nama" style="color:var(--ink-3)">Ingin Laoshi lain?</div>
          <div class="guru-card-bio">Tidak menemukan yang cocok? Tim kami siap membantu mencarikan pengajar terbaik.</div>
          <div class="guru-card-status" style="color:var(--ink-4)">✉️ Minta rekomendasi admin</div>
        </div>
      </div>`;
  }

  /* ── Render daftar guru dari API + filter level dari sheet ── */
  async function renderTeacherOptions(){
    const wrap = document.getElementById('teacher-options-wrap');
    if(!wrap) return;

    // Kumpulkan semua hari+jam yang dipilih
    const n     = data.sessions || 1;
    const slots = [];
    for(let i = 0; i < n; i++){
      const h = document.getElementById('hari'+i)?.value;
      const j = document.getElementById('jam'+i)?.value;
      if(h && j) slots.push({ hari: HARI_MAP[h] || h, jam: j });
    }

    // Jika API belum dikonfigurasi, tampilkan guru statis
    if(API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL'){
      renderStaticTeachers(wrap);
      return;
    }

    // Pastikan semua sesi sudah diisi
    if(slots.length < n){
      wrap.innerHTML = `<div class="teacher-empty">
        <div style="font-size:2rem;margin-bottom:10px">⚠️</div>
        <div style="font-size:15px;font-weight:600;color:var(--ink)">Lengkapi semua jadwal</div>
        <div style="font-size:13px;font-weight:300;color:var(--ink-3)">Pilih hari dan jam untuk semua sesi terlebih dahulu.</div>
      </div>`;
      return;
    }

    wrap.innerHTML = `<div class="teacher-loading">
      <div class="spinner" style="border-color:rgba(130,0,0,0.2);border-top-color:var(--blue);width:24px;height:24px;margin:0 auto 12px"></div>
      <div style="font-size:14px;font-weight:400;color:var(--ink-3);text-align:center">Mengecek ketersediaan pengajar...</div>
    </div>`;

    try {
      // STEP 1: Fetch ketersediaan jadwal + data level secara paralel
      const params = new URLSearchParams({ action: 'check' });
      slots.forEach((slot, i) => {
        params.append(`hari${i + 1}`, slot.hari);
        params.append(`jam${i + 1}`,  slot.jam);
      });

      const [resJadwal, levelData] = await Promise.all([
        fetch(`${API_URL}?${params.toString()}`).then(r => r.json()),
        fetchLevelLaoshi()
      ]);

      const tersediaJadwal = resJadwal.tersedia || [];

      // STEP 2: Filter berdasarkan level/tujuan yang dipilih user
      const tujuan = data.tujuan || '';
      const tersediaFinal = tersediaJadwal.filter(nama => {
        // Cari level guru di data sheet — coba match nama dengan/tanpa suffix " - Taiwan" dll
        const levelGuru = levelData[nama]
          || levelData[Object.keys(levelData).find(k => k.toLowerCase().startsWith(nama.toLowerCase()))]
          || [];
        return guruCocokTujuan(levelGuru, tujuan);
      });

      const showAdminCard = tersediaFinal.length === 0 || tersediaFinal.length === 1;

      if(tersediaFinal.length === 0){
        wrap.innerHTML = `<div class="teacher-empty">
          <div style="font-size:2rem;margin-bottom:10px">😕</div>
          <div style="font-size:15px;font-weight:600;color:var(--ink);margin-bottom:6px">Tidak Ada Pengajar Tersedia</div>
          <div style="font-size:13px;font-weight:300;color:var(--ink-3)">
            Tidak ada pengajar yang tersedia untuk jadwal dan tujuan belajar yang dipilih.<br>
            Coba ubah jadwal atau tujuan belajar, atau minta rekomendasi admin.
          </div>
        </div>
        <div class="teacher-opts">${adminCard()}</div>`;
        return;
      }

      const infoTujuan = tujuan ? ` · Tujuan: <strong>${tujuan}</strong>` : '';
      wrap.innerHTML = `
        <div style="font-size:13px;font-weight:500;color:var(--ink-3);margin-bottom:16px">
          ✅ <strong style="color:var(--blue)">${tersediaFinal.length} pengajar tersedia</strong>${infoTujuan}
        </div>
        <div class="teacher-opts">
          ${tersediaFinal.map(nama => {
            const levelGuru = levelData[nama]
              || levelData[Object.keys(levelData).find(k => k.toLowerCase().startsWith(nama.toLowerCase()))]
              || [];
            return `
              <div class="teacher-opt guru-card-full" data-teacher="${nama}" onclick="selectTeacher(this)">
                <div class="guru-card-foto-wrap">
                  ${getGuruImgHtml(nama)}
                </div>
                <div class="guru-card-info">
                  <div class="guru-card-nama">Laoshi ${nama}</div>
                  <div class="guru-card-levels">${renderLevelBadges(levelGuru)}</div>
                  <div class="guru-card-status">✓ Tersedia &amp; sesuai level</div>
                </div>
              </div>`;
          }).join('')}
          ${showAdminCard ? adminCard() : ''}
        </div>`;

    } catch(err) {
      renderStaticTeachers(wrap);
    }
  }

  function renderStaticTeachers(wrap){
    wrap.innerHTML = `
      <div style="font-size:12px;font-weight:400;color:var(--ink-4);margin-bottom:14px;padding:10px 14px;background:var(--surface);border-radius:var(--r-sm);border:1px solid var(--line)">
        ℹ️ Koneksi ke jadwal belum aktif. Konfirmasi ketersediaan akan dilakukan via WhatsApp.
      </div>
      <div class="teacher-opts">
        <div class="teacher-opt" data-teacher="Laoshi Mei" onclick="selectTeacher(this)">
          <div class="teacher-av">👩‍🏫</div>
          <div class="teacher-nm">Laoshi Mei</div>
          <div class="teacher-sp">Percakapan · HSK 1–4</div>
        </div>
        <div class="teacher-opt" data-teacher="Laoshi Zhang" onclick="selectTeacher(this)">
          <div class="teacher-av">👨‍🏫</div>
          <div class="teacher-nm">Laoshi Zhang</div>
          <div class="teacher-sp">Bisnis · HSK 4–6</div>
        </div>
        <div class="teacher-opt" data-teacher="Laoshi Li" onclick="selectTeacher(this)">
          <div class="teacher-av">👩‍🏫</div>
          <div class="teacher-nm">Laoshi Li</div>
          <div class="teacher-sp">Karakter · HSK 1–3</div>
        </div>
      </div>`;
  }

  window.selectTeacher = function(el){
    document.querySelectorAll('.teacher-opt').forEach(e => e.classList.remove('on'));
    el.classList.add('on');
    data.guru = el.dataset.teacher;
  };

  /* ── Pilih Tujuan Belajar ── */
  window.selectTujuan = function(el){
    document.querySelectorAll('.tujuan-opt').forEach(e => e.classList.remove('on'));
    el.classList.add('on');
    const tujuan = el.dataset.tujuan;
    const lainnyaWrap = document.getElementById('tujuan-lainnya-wrap');
    if(tujuan === 'Lainnya'){
      lainnyaWrap.style.display = 'block';
      data.tujuan = document.getElementById('tujuan-lainnya-input')?.value.trim() || '';
    } else {
      lainnyaWrap.style.display = 'none';
      data.tujuan = tujuan;
    }
  };

  window.onTujuanLainnyaInput = function(inp){
    data.tujuan = inp.value.trim();
  };

  /* ── Validasi setiap step ── */
  function validate(s){
    clearErr();
    if(s === 1 && !data.paket){
      showErr('Pilih paket terlebih dahulu.'); return false;
    }
    if(s === 2){
      data.hari = []; data.jam = [];
      for(let i = 0; i < (data.sessions||1); i++){
        const h = document.getElementById('hari'+i)?.value;
        const j = document.getElementById('jam'+i)?.value;
        if(!h || !j){ showErr('Lengkapi semua hari dan jam untuk setiap sesi.'); return false; }
        data.hari.push(h);
        data.jam.push(j);
      }
    }
    if(s === 3){
      const tujuanEl = document.querySelector('.tujuan-opt.on');
      if(!tujuanEl){ showErr('Pilih tujuan belajar terlebih dahulu.'); return false; }
      if(tujuanEl.dataset.tujuan === 'Lainnya'){
        const custom = document.getElementById('tujuan-lainnya-input')?.value.trim();
        if(!custom){ showErr('Tuliskan tujuan belajar Anda.'); return false; }
        data.tujuan = custom;
      }
    }
    if(s === 4 && !data.guru){
      showErr('Pilih salah satu pengajar.'); return false;
    }
    if(s === 5){
      const n = document.getElementById('inp-nama')?.value.trim();
      const w = document.getElementById('inp-wa')?.value.trim();
      if(!n){ showErr('Nama lengkap wajib diisi.'); return false; }
      if(!w){ showErr('Nomor WhatsApp wajib diisi.'); return false; }
      data.nama  = n; data.wa = w;
      data.email = document.getElementById('inp-email')?.value.trim() || '';
    }
    return true;
  }

  /* ── Ringkasan konfirmasi ── */
  function buildSummary(){
    const el = document.getElementById('booking-summary');
    if(!el) return;
    const jadwal = data.hari.map((h,i) => `${h} pukul ${data.jam[i]}`).join(' • ');
    el.innerHTML = [
      ['Nama',           data.nama],
      ['Paket',          cap(data.paket)],
      ['Jadwal',         jadwal],
      ['Tujuan Belajar', data.tujuan],
      ['Pengajar',       data.guru],
      ['WhatsApp',       data.wa],
      ...(data.email ? [['Email', data.email]] : []),
    ].map(([k,v]) => `
      <div class="sum-row">
        <span class="sum-k">${k}</span>
        <span class="sum-v">${v}</span>
      </div>`).join('');
  }

  /* ── Update UI step indicator ── */
  function updateUI(){
    document.querySelectorAll('.step-panel').forEach((p,i) => p.classList.toggle('on', i+1 === step));
    document.querySelectorAll('.step-item').forEach((el,i) => {
      el.classList.toggle('cur',  i+1 === step);
      el.classList.toggle('done', i+1 <  step);
    });
    document.querySelectorAll('.step-conn').forEach((el,i) => el.classList.toggle('done', i+1 < step));
    const prev = document.getElementById('btnPrev');
    const next = document.getElementById('btnNext');
    const sub  = document.getElementById('btnSubmit');
    if(prev) prev.style.display = step === 1     ? 'none' : 'flex';
    if(next) next.style.display = step === TOTAL ? 'none' : 'flex';
    if(sub)  sub.style.display  = step === TOTAL ? 'flex' : 'none';
    document.querySelector('.booking-wrap')?.scrollIntoView({ behavior:'smooth', block:'start' });
  }

  /* ── Navigasi step ── */
  window.nextStep = async () => {
    if(!validate(step)) return;

    // Saat masuk step 4 (pilih guru), fetch dulu dari API
    if(step === 3){
      step++;
      updateUI();
      await renderTeacherOptions();
    } else {
      step++;
      updateUI();
      if(step === TOTAL) buildSummary();
    }
  };

  window.prevStep = () => {
    if(step > 1){ step--; updateUI(); }
  };

  /* ── Submit booking ── */
  window.submitBooking = async () => {
    const btn = document.getElementById('btnSubmit');
    if(!btn) return;
    btn.classList.add('btn-loading');
    btn.innerHTML = '<div class="spinner"></div> Mengirim...';

    const jadwal = data.hari.map((h,i) => `${h} pukul ${data.jam[i]}`).join(', ');

    /* Kirim ke API jika sudah dikonfigurasi */
    if(API_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL'){
      try {
        // Booking untuk setiap sesi
        const hariEn = (HARI_MAP[data.hari[0]] || data.hari[0]);
        const payload = {
          action  : 'book',
          guru    : data.guru,
          hari    : hariEn,
          jam     : data.jam[0],
          nama    : data.nama,
          wa      : data.wa,
          email   : data.email,
          paket   : cap(data.paket),
        };
        const res  = await fetch(API_URL, {
          method  : 'POST',
          mode    : 'no-cors', // wajib untuk Apps Script
          headers : { 'Content-Type': 'application/json' },
          body    : JSON.stringify(payload),
        });
      } catch(e) {
        // Lanjutkan ke WhatsApp meski API error
      }
    }

    /* Redirect ke WhatsApp */
    const msg = `Halo Lexa Course, saya ingin booking kelas Mandarin.\n\n` +
      `Nama: ${data.nama}\n` +
      `Paket: ${cap(data.paket)}\n` +
      `Jadwal: ${jadwal}\n` +
      `Tujuan Belajar: ${data.tujuan}\n` +
      `Guru: ${data.guru}\n` +
      `WhatsApp: ${data.wa}` +
      (data.email ? `\nEmail: ${data.email}` : '');

    setTimeout(() => {
      window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`, '_blank');
      btn.classList.remove('btn-loading');
      btn.innerHTML = '✓ Booking Terkirim!';
    }, 900);
  };

  function showErr(m){
    const el = document.getElementById('bk-err');
    if(el){ el.textContent = m; el.style.display = 'block'; el.scrollIntoView({behavior:'smooth',block:'nearest'}); }
  }
  function clearErr(){
    const el = document.getElementById('bk-err');
    if(el) el.style.display = 'none';
  }
  function cap(s){ return s ? s[0].toUpperCase() + s.slice(1) : ''; }

  /* Pre-select paket dari URL param */
  const urlPkg = new URLSearchParams(location.search).get('paket');
  if(urlPkg){
    const el = document.querySelector(`.pkg-opt[data-pkg="${urlPkg}"]`);
    if(el){ setTimeout(() => el.click(), 100); }
  }

  updateUI();
})();

/* ── TAB SWITCHER (media) ── */
window.switchTab=function(id,btn){
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('on'));
  document.getElementById('tab-'+id)?.classList.add('on');
  btn.classList.add('on');
};
window.openLightbox=function(){document.getElementById('lightbox')?.classList.add('open');document.body.style.overflow='hidden';};
window.closeLightbox=function(){document.getElementById('lightbox')?.classList.remove('open');document.body.style.overflow='';};
document.addEventListener('keydown',e=>{if(e.key==='Escape')window.closeLightbox();});

/* ── hitung harga 0-70 ── */
document.addEventListener("DOMContentLoaded", function () {
  let target = 70;
  let current = 0;
  let speed = 20;

  let counter = setInterval(() => {
    current++;
    document.getElementById("price").innerText = current;

    if (current >= target) {
      clearInterval(counter);
    }
  }, speed);
});



/* ── PROGRAM PAGE TABS ── */
window.switchProgTab = function(id, btn) {
  document.querySelectorAll('.prog-tab-content').forEach(t => t.classList.remove('on'));
  document.querySelectorAll('.prog-tab').forEach(b => b.classList.remove('on'));
  const el = document.getElementById('prog-' + id);
  if(el) el.classList.add('on');
  btn.classList.add('on');
  // Update URL hash
  history.replaceState(null, '', '#' + id);
};

// Auto-activate tab from URL hash
(function(){
  const hash = location.hash.replace('#','');
  const map  = { 'private': 'private', 'small-group': 'small-group', 'group': 'group', 'intensif': 'intensif' };
  const tab  = map[hash] || 'private';
  const btn  = document.querySelector(`.prog-tab[data-tab="${tab}"]`);
  if(btn) btn.click();
  else {
    const first = document.querySelector('.prog-tab');
    if(first) first.click();
  }
})();

/* ── PROGRAM PAGE: tab switcher ── */
window.switchProgTab = function(id, btn){
  document.querySelectorAll('.prog-tab-content').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('.prog-tab').forEach(b=>b.classList.remove('on'));
  const el = document.getElementById('prog-'+id);
  if(el) el.classList.add('on');
  btn.classList.add('on');
  history.replaceState(null,'','#'+id);
};

// Auto-activate from hash on page load
(function(){
  if(!document.querySelector('.prog-tabs')) return;
  const hash = location.hash.replace('#','');
  const valid = ['private','small-group','group','intensif'];
  const tab   = valid.includes(hash) ? hash : 'private';
  const btn   = document.querySelector(`.prog-tab[data-tab="${tab}"]`);
  if(btn){ btn.classList.add('on'); }
  else    { document.querySelector('.prog-tab')?.classList.add('on'); }
  const content = document.getElementById('prog-'+tab);
  if(content) content.classList.add('on');
  else        { document.querySelector('.prog-tab-content')?.classList.add('on'); }
})();



function goToProgram(e, tab) {
  // kalau sudah di halaman program
  if (window.location.pathname.includes("program.html")) {
    e.preventDefault();

    switchProgTab(tab, document.querySelector(`.prog-tab[data-tab="${tab}"]`));

    // scroll ke section
    const section = document.getElementById(tab);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }
}

window.addEventListener("load", function () {
  const hash = window.location.hash.replace("#", "");

  if (hash) {
    const btn = document.querySelector(`.prog-tab[data-tab="${hash}"]`);
    if (btn) {
      switchProgTab(hash, btn);
    }
  }
});

document.querySelectorAll('.gp-img').forEach(img => {
  img.addEventListener('error', function () {
    this.style.display = 'none';
    this.parentElement.classList.add('gp-empty');
  });
});

/* ── DROPDOWN NAVIGATION (click toggle) ── */
document.querySelectorAll('.nav-item').forEach(item => {
  const trigger = item.querySelector('.nav-a-drop');
  if (!trigger) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('open'));
});

/* ── COUNTING NUMBER ── */
(function(){
  const els = document.querySelectorAll('.band-n');

  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.dataset.target) || 0;
        const suffix = el.dataset.suffix || '+';

        let current = 0;
        const speed = target / 60; // makin kecil = makin lambat

        const counter = setInterval(()=>{
          current += Math.ceil(speed);
          if(current >= target){
            current = target;
            clearInterval(counter);
          }
          el.textContent = current + (suffix || '');
        }, 20);

        io.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  els.forEach(el => io.observe(el));
})();


  function toggleTjCert(id) {
    var row = document.getElementById(id);
    var isOpen = row.classList.contains('open');
    document.querySelectorAll('.tj-cert-row').forEach(r => r.classList.remove('open'));
    if (!isOpen) row.classList.add('open');
  }
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.tj-cert-row')) {
      document.querySelectorAll('.tj-cert-row').forEach(r => r.classList.remove('open'));
    }
  });
  window.selectTujuan = function(el) {
    document.querySelectorAll('.tj-skill-card, .tj-lvl').forEach(e => e.classList.remove('on'));
    el.classList.add('on');
    var val = el.dataset.tujuan;
    if (window.data) window.data.tujuan = val;
    // update label di button
    var map = {'HSK 1':'tj-hsk','HSK 2':'tj-hsk','HSK 3':'tj-hsk','HSK 4':'tj-hsk','HSK 5':'tj-hsk','HSK 6':'tj-hsk',
               'HSKK Dasar':'tj-hskk','HSKK Menengah':'tj-hskk','HSKK Mahir':'tj-hskk',
               'BCT Listening & Reading':'tj-bct','BCT Speaking & Writing':'tj-bct',
               'YCT 1':'tj-yct','YCT 2':'tj-yct','YCT 3':'tj-yct','YCT 4':'tj-yct'};
    if (map[val]) {
      var selEl = document.getElementById('sel-' + map[val]);
      if (selEl) { selEl.textContent = val; selEl.classList.add('tj-cert-selected-active'); }
    }
    document.querySelectorAll('.tj-cert-row').forEach(r => r.classList.remove('open'));
    var wrap = document.getElementById('tujuan-lainnya-wrap');
    if (wrap) wrap.style.display = (val === 'Lainnya') ? 'block' : 'none';
  };

window.selectBkType = function(btn){
  document.querySelectorAll('.bk-type-btn').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');

  const type = btn.dataset.type;

  // 🔥 langsung simpan ke data global JS
  if(window.data) window.data.tipe = type;

  // tampilkan paket sesuai tipe
  ['private','small-group','group'].forEach(t=>{
    const el = document.getElementById('pkgs-'+t);
    if(el) el.style.display='none';
  });

  const pkgEl = document.getElementById('pkgs-'+type);
  if(pkgEl) pkgEl.style.display='grid';

  document.getElementById('pkg-hint').style.display='none';

  // reset paket
  document.querySelectorAll('.pkg-opt').forEach(e=>e.classList.remove('on'));
  if(window.data) window.data.paket = '';

  // 🔥 generate jadwal otomatis
  if(typeof genSchedule === 'function') genSchedule();
};

window.selectPkg = function(el){
  document.querySelectorAll('.pkg-opt').forEach(e=>e.classList.remove('on'));
  el.classList.add('on');

  if(window.data) window.data.paket = el.dataset.pkg;

  // 🔥 generate ulang jadwal sesuai paket
  if(typeof genSchedule === 'function') genSchedule();
};