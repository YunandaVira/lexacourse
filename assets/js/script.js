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
    {h:'你好',p:'nǐ hǎo',  m:'Halo',             e:'👋',c:'#2775F0'},
    {h:'谢谢',p:'xiè xiè', m:'Terima kasih',     e:'🙏',c:'#D97706'},
    {h:'学习',p:'xué xí',  m:'Belajar',          e:'📚',c:'#16A34A'},
    {h:'朋友',p:'péng yǒu',m:'Teman',            e:'🤝',c:'#7C3AED'},
    {h:'中文',p:'zhōng wén',m:'Bahasa Mandarin', e:'🀄',c:'#DC2626'},
    {h:'很好',p:'hěn hǎo', m:'Sangat baik',      e:'✨',c:'#0891B2'},
    {h:'再见',p:'zài jiàn',m:'Sampai jumpa',      e:'🌟',c:'#EA580C'},
  ];
  let cur=0,busy=false,tmr;
  cards.forEach((c,i)=>{
    const el=document.createElement('div');
    el.className='s-card'; el.dataset.i=i;
    el.innerHTML=`<div class="s-card-top" style="background:${c.c}"></div><div class="s-label">Karakter Mandarin</div><div class="s-emoji">${c.e}</div><div class="s-char" style="color:${c.c}">${c.h}</div><div class="s-line" style="background:${c.c}"></div><div class="s-pin" style="color:${c.c}">${c.p}</div><div class="s-mean">${c.m}</div>`;
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
  let step=1, total=5, data={paket:'',hari:[],jam:[],guru:'',nama:'',wa:'',email:'',level:''};
  const API_URL='YOUR_GOOGLE_APPS_SCRIPT_URL';
  const WA_NUM='6281234567890';

  document.querySelectorAll('.pkg-opt').forEach(el=>el.addEventListener('click',()=>{
    document.querySelectorAll('.pkg-opt').forEach(e=>e.classList.remove('on'));
    el.classList.add('on'); data.paket=el.dataset.pkg; genSchedule();
  }));

  function genSchedule(){
    const wrap=document.getElementById('sched-fields');
    if(!wrap) return;
    const n={silver:1,gold:2,platinum:3}[data.paket]||1;
    const days=['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
    const hrs=Array.from({length:16},(_,i)=>`${String(i+7).padStart(2,'0')}:00`);
    wrap.innerHTML=Array.from({length:n},(_,i)=>`
      <div class="form-group"><label class="form-label">Sesi ${i+1}</label>
      <div class="schedule-row">
        <select class="form-control" id="hari${i}"><option value="">Pilih hari</option>${days.map(d=>`<option>${d}</option>`).join('')}</select>
        <select class="form-control" id="jam${i}"><option value="">Pilih jam</option>${hrs.map(h=>`<option>${h}</option>`).join('')}</select>
      </div></div>`).join('');
    data.sessions=n;
  }

  document.querySelectorAll('.teacher-opt').forEach(el=>el.addEventListener('click',()=>{
    document.querySelectorAll('.teacher-opt').forEach(e=>e.classList.remove('on'));
    el.classList.add('on'); data.guru=el.dataset.teacher;
  }));

  function validate(s){
    clearErr();
    if(s===1&&!data.paket){showErr('Pilih paket terlebih dahulu.');return false;}
    if(s===2){
      data.hari=[]; data.jam=[];
      for(let i=0;i<(data.sessions||1);i++){
        const h=document.getElementById('hari'+i)?.value;
        const j=document.getElementById('jam'+i)?.value;
        if(!h||!j){showErr('Lengkapi semua hari dan jam.');return false;}
        data.hari.push(h); data.jam.push(j);
      }
    }
    if(s===3&&!data.guru){showErr('Pilih pengajar.');return false;}
    if(s===4){
      const n=document.getElementById('inp-nama')?.value.trim();
      const w=document.getElementById('inp-wa')?.value.trim();
      if(!n){showErr('Nama wajib diisi.');return false;}
      if(!w){showErr('Nomor WhatsApp wajib diisi.');return false;}
      data.nama=n; data.wa=w;
      data.email=document.getElementById('inp-email')?.value.trim()||'';
      data.level=document.getElementById('inp-level')?.value||'';
    }
    return true;
  }

  function buildSummary(){
    const el=document.getElementById('booking-summary');
    if(!el) return;
    const jadwal=data.hari.map((h,i)=>`${h} ${data.jam[i]}`).join(', ');
    el.innerHTML=[
      ['Nama',data.nama],['Paket',cap(data.paket)],['Jadwal',jadwal],
      ['Pengajar',data.guru],['WhatsApp',data.wa],
      ...(data.email?[['Email',data.email]]:[]),
      ...(data.level?[['Level',data.level]]:[]),
    ].map(([k,v])=>`<div class="sum-row"><span class="sum-k">${k}</span><span class="sum-v">${v}</span></div>`).join('');
  }

  function updateUI(){
    document.querySelectorAll('.step-panel').forEach((p,i)=>p.classList.toggle('on',i+1===step));
    document.querySelectorAll('.step-item').forEach((el,i)=>{
      const n=i+1;
      el.classList.toggle('cur',n===step);
      el.classList.toggle('done',n<step);
    });
    document.querySelectorAll('.step-conn').forEach((el,i)=>el.classList.toggle('done',i+1<step));
    const prev=document.getElementById('btnPrev'),next=document.getElementById('btnNext'),sub=document.getElementById('btnSubmit');
    if(prev) prev.style.display=step===1?'none':'flex';
    if(next) next.style.display=step===total?'none':'flex';
    if(sub)  sub.style.display=step===total?'flex':'none';
    document.querySelector('.booking-wrap')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  window.nextStep=()=>{ if(validate(step)){ step++; updateUI(); if(step===total) buildSummary(); }};
  window.prevStep=()=>{ if(step>1){ step--; updateUI(); }};
  window.submitBooking=async()=>{
    const btn=document.getElementById('btnSubmit');
    if(!btn) return;
    btn.classList.add('btn-loading');
    btn.innerHTML='<div class="spinner"></div> Mengirim...';
    const jadwal=data.hari.map((h,i)=>`${h} pukul ${data.jam[i]}`).join(', ');
    if(API_URL!=='YOUR_GOOGLE_APPS_SCRIPT_URL'){
      try{ await fetch(API_URL,{method:'POST',mode:'no-cors',body:JSON.stringify({...data,jadwal})}); }catch(e){}
    }
    const msg=`Halo Lexa Course, saya ingin booking kelas Mandarin.\n\nNama: ${data.nama}\nPaket: ${cap(data.paket)}\nJadwal: ${jadwal}\nGuru: ${data.guru}\nWhatsApp: ${data.wa}${data.email?'\nEmail: '+data.email:''}${data.level?'\nLevel: '+data.level:''}`;
    setTimeout(()=>{
      window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`,'_blank');
      btn.classList.remove('btn-loading');
      btn.innerHTML='✓ Booking Terkirim!';
    },1000);
  };

  function showErr(m){const el=document.getElementById('bk-err');if(el){el.textContent=m;el.style.display='block';el.scrollIntoView({behavior:'smooth',block:'nearest'});}}
  function clearErr(){const el=document.getElementById('bk-err');if(el)el.style.display='none';}
  function cap(s){return s?s[0].toUpperCase()+s.slice(1):'';}

  // Pre-select from URL
  const params=new URLSearchParams(location.search);
  const pkg=params.get('paket');
  if(pkg){ const el=document.querySelector(`.pkg-opt[data-pkg="${pkg}"]`); if(el){ el.click(); } }

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
