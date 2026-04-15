const express = require('express');
let pokemons = require('./db-pokemons');
let helper   = require('./helper');

const app  = express();
const PORT = process.env.PORT || 3003;
app.use(express.json());

app.get('/', (req, res) => { res.send(HTML); });

const HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Pokédex</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,600;9..40,800;9..40,900&display=swap" rel="stylesheet"/>
<style>
:root{
  --bg:        #f5f0ff;
  --surface:   #ffffff;
  --card:      #ffffff;
  --card-h:    #faf7ff;
  --border:    #e2d9f3;
  --border-h:  #c8b8e8;

  --text:      #2a1a50;
  --text-2:    #5a4a80;
  --muted:     #9480c0;
  --dim:       #f0ebff;
  --dim-2:     #e8dff8;

  --mauve:     #8b5cf6;
  --mauve-d:   #6d28d9;
  --mauve-l:   #a78bfa;
  --lavender:  #ede9fe;
  --lilac:     #c4b5fd;
  --rose-m:    #e879a0;
  --white:     #ffffff;

  --hp:   #7c3aed;
  --cp:   #c026d3;
  --sc:   #a21caf;

  --r:16px; --r-sm:10px; --r-pill:999px;
  --font:'DM Sans',sans-serif;
  --trans:.18s ease;
  --shadow:0 2px 12px rgba(109,40,217,.08);
  --shadow-h:0 8px 32px rgba(109,40,217,.16);
}

*{box-sizing:border-box;margin:0;padding:0}
body{
  background:var(--bg);color:var(--text);font-family:var(--font);
  min-height:100vh;overflow-x:hidden;
}

/* fond dégradé mauve très doux */
body::before{
  content:'';position:fixed;inset:0;
  background:
    radial-gradient(ellipse 80% 50% at 20% -10%,rgba(167,139,250,.25),transparent),
    radial-gradient(ellipse 60% 40% at 90% 90%,rgba(196,181,253,.2),transparent),
    radial-gradient(ellipse 50% 30% at 50% 50%,rgba(237,233,254,.4),transparent);
  pointer-events:none;z-index:0;
}

.layout{display:flex;min-height:100vh;position:relative;z-index:1}

/* ════ SIDEBAR ════ */
.sidebar{
  width:230px;min-width:230px;
  background:rgba(255,255,255,.85);
  backdrop-filter:blur(16px);
  border-right:1px solid var(--border);
  padding:24px 14px;display:flex;flex-direction:column;gap:22px;
  position:sticky;top:0;height:100vh;overflow-y:auto;
  box-shadow:2px 0 20px rgba(109,40,217,.05);
}
.sidebar::-webkit-scrollbar{width:3px}
.sidebar::-webkit-scrollbar-thumb{background:var(--dim-2);border-radius:3px}

.logo{display:flex;align-items:center;gap:11px;padding:4px 6px}
.logo-gem{
  width:32px;height:32px;flex-shrink:0;
  background:linear-gradient(135deg,var(--mauve-l),var(--mauve-d));
  border-radius:10px;display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 14px rgba(109,40,217,.35);
}
.logo-gem::after{content:'';width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.35);border:2px solid rgba(255,255,255,.65);}
.logo-text{font-size:1.1rem;font-weight:900;color:var(--mauve-d);letter-spacing:-.03em}
.logo-sub{font-size:.6rem;color:var(--muted);font-weight:400;margin-top:1px;letter-spacing:.04em}

.nav-label{font-size:.58rem;font-weight:700;color:var(--muted);letter-spacing:.18em;text-transform:uppercase;padding:0 8px;margin-bottom:4px}
.nav-section{display:flex;flex-direction:column;gap:3px}

.nav-btn{
  background:none;border:none;color:var(--muted);font-family:var(--font);
  font-size:.83rem;font-weight:500;padding:9px 10px;border-radius:var(--r-sm);
  cursor:pointer;text-align:left;display:flex;align-items:center;gap:9px;
  transition:all var(--trans);width:100%;
}
.nav-btn:hover{background:var(--dim);color:var(--text-2)}
.nav-btn.active{background:var(--lavender);color:var(--mauve-d);font-weight:700}
.dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.cnt{margin-left:auto;font-size:.62rem;font-weight:600;background:var(--dim-2);padding:2px 7px;border-radius:var(--r-pill);color:var(--muted)}
.nav-btn.active .cnt{background:rgba(109,40,217,.12);color:var(--mauve-d)}

.divider{height:1px;background:var(--border);margin:4px 6px}

/* ════ MAIN ════ */
.main{flex:1;display:flex;flex-direction:column;min-width:0}

.topbar{
  position:sticky;top:0;z-index:50;
  background:rgba(255,255,255,.88);backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border);
  padding:14px 26px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;
  box-shadow:0 1px 12px rgba(109,40,217,.06);
}
.topbar-title{font-size:1rem;font-weight:800;color:var(--mauve-d);letter-spacing:-.02em;margin-right:2px}
.topbar-count{
  font-size:.75rem;font-weight:600;
  background:var(--lavender);border:1px solid var(--lilac);
  color:var(--mauve-d);padding:3px 10px;border-radius:var(--r-pill);
}
.topbar-right{margin-left:auto;display:flex;align-items:center;gap:8px;flex-wrap:wrap}

.search-wrap{position:relative}
.search-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none}
#search{
  background:var(--dim);border:1.5px solid var(--border);
  color:var(--text);font-family:var(--font);font-size:.83rem;
  border-radius:var(--r-pill);padding:8px 14px 8px 33px;
  width:205px;outline:none;transition:border-color var(--trans),width var(--trans),box-shadow var(--trans);
}
#search:focus{border-color:var(--mauve);width:245px;box-shadow:0 0 0 3px rgba(139,92,246,.15)}
#search::placeholder{color:var(--muted)}

.icon-btn{
  background:var(--white);border:1.5px solid var(--border);color:var(--muted);
  width:34px;height:34px;border-radius:var(--r-sm);cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:all var(--trans);font-size:.9rem;flex-shrink:0;
  box-shadow:var(--shadow);
}
.icon-btn:hover{background:var(--dim);color:var(--text-2);border-color:var(--border-h)}
.icon-btn.active{background:var(--lavender);color:var(--mauve-d);border-color:var(--lilac)}

select{
  background:var(--white);border:1.5px solid var(--border);color:var(--text-2);
  font-family:var(--font);font-size:.8rem;font-weight:500;
  border-radius:var(--r-sm);padding:7px 11px;outline:none;cursor:pointer;
  transition:border-color var(--trans);box-shadow:var(--shadow);
}
select:focus{border-color:var(--mauve)}

/* filters bar */
.filters-bar{
  padding:10px 26px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;gap:18px;flex-wrap:wrap;
  background:rgba(255,255,255,.6);
}
.slider-group{display:flex;align-items:center;gap:7px}
.slider-label{font-size:.68rem;color:var(--muted);font-weight:600;white-space:nowrap}
input[type=range]{
  -webkit-appearance:none;appearance:none;
  height:3px;border-radius:3px;background:var(--dim-2);outline:none;cursor:pointer;width:85px;
}
input[type=range]::-webkit-slider-thumb{
  -webkit-appearance:none;width:13px;height:13px;border-radius:50%;
  background:var(--mauve);border:2px solid #fff;cursor:pointer;
  box-shadow:0 1px 6px rgba(139,92,246,.4);
}
.slider-val{font-size:.68rem;font-weight:700;color:var(--mauve-d);min-width:20px;text-align:center}

/* ════ CARDS ════ */
.content{padding:22px 26px;flex:1}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:14px}

.card{
  background:var(--card);border:1.5px solid var(--border);border-radius:var(--r);
  overflow:hidden;cursor:pointer;position:relative;
  transition:transform var(--trans),border-color var(--trans),box-shadow var(--trans);
  animation:fadeUp .3s ease both;
  box-shadow:var(--shadow);
}
.card:hover{
  transform:translateY(-5px);border-color:var(--mauve-l);
  box-shadow:var(--shadow-h);
}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}

.card-img{
  width:100%;aspect-ratio:1;display:flex;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
}
.card-img img{
  width:72%;height:72%;object-fit:contain;position:relative;z-index:1;
  transition:transform .3s ease;
  filter:drop-shadow(0 6px 16px rgba(109,40,217,.18));
}
.card:hover .card-img img{transform:scale(1.1) translateY(-4px)}

.card-fav{
  position:absolute;top:8px;right:8px;z-index:2;
  background:rgba(255,255,255,.75);border:1.5px solid var(--border);
  width:28px;height:28px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;font-size:.8rem;
  transition:transform .15s,background .15s,border-color .15s;
  box-shadow:0 1px 6px rgba(0,0,0,.08);
}
.card-fav:hover{transform:scale(1.2);background:#fff;border-color:var(--rose-m)}

.card-body{padding:12px 13px 14px}
.card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:3px}
.card-id{font-size:.62rem;color:var(--muted);font-weight:700}
.card-score{
  font-size:.6rem;font-weight:700;padding:2px 7px;border-radius:var(--r-pill);
  background:var(--lavender);color:var(--mauve-d);border:1px solid var(--lilac);
}
.card-name{
  font-size:.97rem;font-weight:800;margin-bottom:7px;
  letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  color:var(--text);
}
.types{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:9px}
.badge{font-size:.58rem;font-weight:700;padding:3px 8px;border-radius:var(--r-pill);letter-spacing:.03em}

.rarity{
  position:absolute;top:8px;left:8px;font-size:.52rem;font-weight:800;
  letter-spacing:.08em;padding:3px 8px;border-radius:var(--r-pill);text-transform:uppercase;z-index:2;
}

.bars{display:flex;flex-direction:column;gap:4px}
.bar-row{display:flex;align-items:center;gap:6px}
.bar-lbl{font-size:.6rem;color:var(--muted);font-weight:700;width:16px;text-align:right}
.bar-track{flex:1;height:3px;background:var(--dim-2);border-radius:3px;overflow:hidden}
.bar-fill{height:100%;border-radius:3px;transition:width .5s ease}
.bar-val{font-size:.6rem;color:var(--muted);font-weight:700;width:16px}

/* list view */
.list-view .grid{display:flex;flex-direction:column;gap:8px}
.list-view .card{display:flex;flex-direction:row;height:70px}
.list-view .card-img{width:70px;min-width:70px;aspect-ratio:unset;height:70px}
.list-view .card-img img{width:60%;height:60%}
.list-view .card-body{display:flex;align-items:center;gap:14px;flex:1;padding:0 14px}
.list-view .card-name{margin-bottom:0;min-width:110px}
.list-view .types{margin-bottom:0}
.list-view .bars{flex-direction:row;gap:8px;flex:1}
.list-view .bar-row{flex-direction:column;align-items:flex-start;gap:2px;min-width:55px}
.list-view .bar-track{width:80px}

/* skeleton */
.skeleton{background:var(--card);border:1.5px solid var(--border);border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow);animation:fadeUp .3s ease both}
.skel-img{width:100%;aspect-ratio:1;background:var(--dim)}
.skel-body{padding:11px 13px;display:flex;flex-direction:column;gap:7px}
.skel-line{border-radius:4px;background:linear-gradient(90deg,var(--dim) 25%,var(--dim-2) 50%,var(--dim) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite linear}
@keyframes shimmer{0%{background-position:200%}100%{background-position:-200%}}

.empty{grid-column:1/-1;text-align:center;padding:72px 0;color:var(--muted);font-size:.9rem}
.empty-ico{font-size:2.2rem;margin-bottom:12px;opacity:.4}

/* ════ MODAL ════ */
.overlay{
  position:fixed;inset:0;background:rgba(109,40,217,.15);backdrop-filter:blur(6px);
  display:flex;align-items:center;justify-content:center;
  z-index:200;opacity:0;pointer-events:none;transition:opacity .2s;padding:20px;
}
.overlay.open{opacity:1;pointer-events:all}

.modal{
  background:var(--white);border:1.5px solid var(--border);border-radius:22px;
  width:100%;max-width:430px;overflow:hidden;position:relative;
  transform:translateY(10px) scale(.97);transition:transform .22s ease;
  box-shadow:0 24px 64px rgba(109,40,217,.2);
}
.overlay.open .modal{transform:none}

.modal-hero{
  height:175px;display:flex;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
}
.modal-hero-bg{position:absolute;inset:0}
.modal-hero-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,transparent 30%,#fff)}
.modal-hero img{
  width:125px;height:125px;object-fit:contain;position:relative;z-index:1;
  filter:drop-shadow(0 8px 20px rgba(109,40,217,.25));
}

.close-btn{
  position:absolute;top:11px;right:11px;z-index:10;
  background:rgba(255,255,255,.8);border:1.5px solid var(--border);
  color:var(--muted);width:28px;height:28px;border-radius:50%;cursor:pointer;
  display:flex;align-items:center;justify-content:center;font-size:.8rem;
  transition:all .15s;
}
.close-btn:hover{background:var(--lavender);color:var(--mauve-d);border-color:var(--lilac)}

.modal-body{padding:2px 22px 24px}
.modal-row1{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:6px}
.modal-id{font-size:.68rem;color:var(--muted);font-weight:700;margin-bottom:3px}
.modal-name{font-size:1.65rem;font-weight:900;letter-spacing:-.03em;line-height:1;color:var(--text)}
.modal-types{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:18px}
.modal-sec-label{font-size:.58rem;font-weight:700;color:var(--muted);letter-spacing:.14em;text-transform:uppercase;margin-bottom:9px}

.stat-rows{display:flex;flex-direction:column;gap:8px;margin-bottom:18px}
.stat-r{display:flex;align-items:center;gap:10px}
.stat-lbl{font-size:.75rem;color:var(--muted);font-weight:600;width:26px}
.stat-track{flex:1;height:5px;background:var(--dim-2);border-radius:4px;overflow:hidden}
.stat-fill{height:100%;border-radius:4px;width:0;transition:width .75s cubic-bezier(.16,1,.3,1)}
.stat-num{font-size:.75rem;font-weight:800;width:26px;text-align:right;color:var(--text-2)}

.modal-actions{display:flex;gap:7px}
.modal-btn{
  flex:1;padding:10px;border-radius:var(--r-sm);
  border:1.5px solid var(--border);background:var(--dim);
  color:var(--text-2);font-family:var(--font);font-size:.8rem;font-weight:600;
  cursor:pointer;transition:all var(--trans);
  display:flex;align-items:center;justify-content:center;gap:5px;
}
.modal-btn:hover{background:var(--dim-2);border-color:var(--border-h)}
.modal-btn.primary{
  background:linear-gradient(135deg,var(--mauve-l),var(--mauve-d));
  border-color:transparent;color:#fff;box-shadow:0 4px 14px rgba(109,40,217,.3);
}
.modal-btn.primary:hover{opacity:.88}

@media(max-width:680px){
  .sidebar{display:none}.topbar,.filters-bar{padding:12px 14px}.content{padding:14px}
}
</style>
</head>
<body>
<div class="layout">

<!-- ══ SIDEBAR ══ -->
<aside class="sidebar">
  <div class="logo">
    <div class="logo-gem"></div>
    <div><div class="logo-text">Pokédex</div><div class="logo-sub">Collection</div></div>
  </div>

  <div class="nav-section">
    <div class="nav-label">Vue</div>
    <button class="nav-btn active" id="tab-all" onclick="setTab('all')">
      <span style="font-size:.8rem">✦</span> Tous
      <span class="cnt" id="cnt-all">0</span>
    </button>
    <button class="nav-btn" id="tab-fav" onclick="setTab('fav')">
      <span style="font-size:.8rem;color:var(--rose-m)">♥</span> Favoris
      <span class="cnt" id="cnt-fav">0</span>
    </button>
  </div>

  <div class="divider"></div>

  <div class="nav-section">
    <div class="nav-label">Types</div>
    <div id="typeFilters">
      <button class="nav-btn active" data-type="" onclick="filterType(this,'')">
        <span class="dot" style="background:var(--dim-2);border:1px solid var(--border)"></span>
        Tous <span class="cnt" id="cnt-type-all">0</span>
      </button>
    </div>
  </div>
</aside>

<!-- ══ MAIN ══ -->
<div class="main">
  <div class="topbar">
    <span class="topbar-title">Ma collection</span>
    <span class="topbar-count" id="resCount">…</span>
    <div class="topbar-right">
      <div class="search-wrap">
        <svg class="search-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="search" type="text" placeholder="Rechercher… (/)" oninput="render()"/>
      </div>
      <select id="sort" onchange="render()">
        <option value="id">N° Pokédex</option>
        <option value="name">Nom A→Z</option>
        <option value="hp">HP ↓</option>
        <option value="cp">CP ↓</option>
        <option value="score">Score ↓</option>
      </select>
      <button class="icon-btn" title="Aléatoire (R)" onclick="openRandom()">⚡</button>
      <button class="icon-btn active" id="btn-grid" title="Grille" onclick="setView('grid')">⊞</button>
      <button class="icon-btn" id="btn-list" title="Liste" onclick="setView('list')">☰</button>
    </div>
  </div>

  <div class="filters-bar">
    <div class="slider-group">
      <span class="slider-label">HP min</span>
      <input type="range" id="hp-min" min="0" max="60" value="0" oninput="updSlider('hp-min-v',this.value);render()"/>
      <span class="slider-val" id="hp-min-v">0</span>
    </div>
    <div class="slider-group">
      <span class="slider-label">HP max</span>
      <input type="range" id="hp-max" min="0" max="60" value="60" oninput="updSlider('hp-max-v',this.value);render()"/>
      <span class="slider-val" id="hp-max-v">60</span>
    </div>
    <div class="slider-group">
      <span class="slider-label">CP min</span>
      <input type="range" id="cp-min" min="0" max="10" value="0" oninput="updSlider('cp-min-v',this.value);render()"/>
      <span class="slider-val" id="cp-min-v">0</span>
    </div>
    <div class="slider-group">
      <span class="slider-label">CP max</span>
      <input type="range" id="cp-max" min="0" max="10" value="10" oninput="updSlider('cp-max-v',this.value);render()"/>
      <span class="slider-val" id="cp-max-v">10</span>
    </div>
    <button class="icon-btn" title="Réinitialiser" onclick="resetFilters()">↺</button>
  </div>

  <div class="content" id="contentWrap">
    <div class="grid" id="grid"></div>
  </div>
</div>
</div>

<!-- ══ MODAL ══ -->
<div class="overlay" id="overlay" onclick="overlayClick(event)">
  <div class="modal">
    <button class="close-btn" onclick="closeModal()">✕</button>
    <div class="modal-hero">
      <div class="modal-hero-bg" id="m-bg"></div>
      <img id="m-img" src="" alt=""/>
    </div>
    <div class="modal-body">
      <div class="modal-row1">
        <div><div class="modal-id" id="m-id"></div><div class="modal-name" id="m-name"></div></div>
        <div id="m-rarity"></div>
      </div>
      <div class="modal-types" id="m-types"></div>
      <div class="modal-sec-label">Statistiques</div>
      <div class="stat-rows">
        <div class="stat-r">
          <div class="stat-lbl">HP</div>
          <div class="stat-track"><div class="stat-fill" id="m-hp-bar" style="background:var(--hp)"></div></div>
          <div class="stat-num" id="m-hp-v"></div>
        </div>
        <div class="stat-r">
          <div class="stat-lbl">CP</div>
          <div class="stat-track"><div class="stat-fill" id="m-cp-bar"></div></div>
          <div class="stat-num" id="m-cp-v"></div>
        </div>
        <div class="stat-r">
          <div class="stat-lbl" style="color:var(--mauve)">Score</div>
          <div class="stat-track"><div class="stat-fill" id="m-sc-bar" style="background:var(--sc)"></div></div>
          <div class="stat-num" id="m-sc-v"></div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="modal-btn" id="m-fav-btn" onclick="toggleFavModal()">♥ Favoris</button>
        <button class="modal-btn primary" onclick="closeModal()">← Retour</button>
      </div>
    </div>
  </div>
</div>

<script>
let all=[], favs=new Set(JSON.parse(localStorage.getItem('pokefavs')||'[]'));
let activeType='', activeTab='all', viewMode='grid', currentModal=null;

const TC={
  'Feu':      {bg:'#fff1ee',border:'#fcc9b8',text:'#c2370f',g:'rgba(220,80,30,.12)'},
  'Eau':      {bg:'#eef5ff',border:'#bdd8f8',text:'#1a5fb4',g:'rgba(60,130,220,.1)'},
  'Plante':   {bg:'#edfaf2',border:'#b3e8c8',text:'#1a7a40',g:'rgba(40,180,90,.1)'},
  'Électrik': {bg:'#fffbea',border:'#f5e07a',text:'#946b00',g:'rgba(220,180,20,.1)'},
  'Electrik': {bg:'#fffbea',border:'#f5e07a',text:'#946b00',g:'rgba(220,180,20,.1)'},
  'Poison':   {bg:'#f5eeff',border:'#d4b0f5',text:'#6b21a8',g:'rgba(139,60,210,.1)'},
  'Normal':   {bg:'#f5f4f2',border:'#ddd9d0',text:'#57534e',g:'rgba(120,110,100,.08)'},
  'Vol':      {bg:'#eef3ff',border:'#c0d0f8',text:'#2040a0',g:'rgba(60,100,220,.1)'},
  'Insecte':  {bg:'#f0fbe8',border:'#b8e890',text:'#3a6b10',g:'rgba(80,180,30,.1)'},
  'Fée':      {bg:'#fff0f7',border:'#f5b8d8',text:'#9c1060',g:'rgba(220,60,140,.1)'},
  'Psychique':{bg:'#fdf0fb',border:'#eeb0e8',text:'#8b1a88',g:'rgba(180,40,180,.1)'},
  'Sol':      {bg:'#fef9ec',border:'#f0d890',text:'#854d0e',g:'rgba(200,160,30,.1)'},
  'Roche':    {bg:'#f5f3f0',border:'#d8d0c0',text:'#57534e',g:'rgba(150,140,120,.08)'},
  'Spectre':  {bg:'#f0eeff',border:'#c8b8f8',text:'#4930c8',g:'rgba(80,60,200,.1)'},
  'Acier':    {bg:'#f0f4f8',border:'#c0ccd8',text:'#334155',g:'rgba(80,110,140,.08)'},
  'Combat':   {bg:'#fff0ee',border:'#f8c0b0',text:'#c0290d',g:'rgba(210,60,30,.1)'},
  'Glace':    {bg:'#edfcff',border:'#a8e8f8',text:'#0e6a80',g:'rgba(30,180,220,.1)'},
  'Dragon':   {bg:'#eeeeff',border:'#c0b8f8',text:'#3730a3',g:'rgba(60,50,200,.1)'},
};
const DEF={bg:'#f5f3ff',border:'#ddd8f0',text:'#6b5fa0',g:'rgba(120,100,200,.08)'};
const tc=t=>TC[t]||DEF;

function rarity(p){
  const s=p.hp+p.cp;
  if(s>=50) return{label:'Légendaire',bg:'#fffbea',border:'#f0c040',text:'#854d0e'};
  if(s>=28) return{label:'Rare',      bg:'#f5eeff',border:'#c4b5fd',text:'#6d28d9'};
  return          {label:'Commun',    bg:'#f5f3ff',border:'#ddd8f0',text:'#9480c0'};
}

async function init(){
  showSkeleton();
  const j=await fetch('/api/pokemons').then(r=>r.json());
  all=j.data;

  const maxHP=Math.max(...all.map(p=>p.hp));
  const maxCP=Math.max(...all.map(p=>p.cp));
  ['hp-min','hp-max'].forEach(id=>document.getElementById(id).max=maxHP);
  document.getElementById('hp-max').value=maxHP;
  document.getElementById('hp-max-v').textContent=maxHP;
  ['cp-min','cp-max'].forEach(id=>document.getElementById(id).max=maxCP);
  document.getElementById('cp-max').value=maxCP;
  document.getElementById('cp-max-v').textContent=maxCP;

  buildSidebar(); render();
}

function showSkeleton(){
  document.getElementById('grid').innerHTML=
    Array.from({length:12},(_,i)=>
      '<div class="skeleton" style="animation-delay:'+i*.04+'s">'+
      '<div class="skel-img"></div>'+
      '<div class="skel-body">'+
      '<div class="skel-line" style="height:7px;width:38%;margin-bottom:3px"></div>'+
      '<div class="skel-line" style="height:11px;width:65%"></div>'+
      '</div></div>'
    ).join('');
}

function buildSidebar(){
  const types=[...new Set(all.flatMap(p=>p.types))].sort();
  const sb=document.getElementById('typeFilters');
  document.getElementById('cnt-type-all').textContent=all.length;
  types.forEach(t=>{
    const count=all.filter(p=>p.types.includes(t)).length;
    const c=tc(t);
    const btn=document.createElement('button');
    btn.className='nav-btn'; btn.dataset.type=t;
    btn.onclick=()=>filterType(btn,t);
    btn.innerHTML='<span class="dot" style="background:'+c.border+'"></span>'+t+
      '<span class="cnt">'+count+'</span>';
    sb.appendChild(btn);
  });
  document.getElementById('cnt-all').textContent=all.length;
  updateFavCount();
}

function render(){
  const q=document.getElementById('search').value.toLowerCase();
  const sort=document.getElementById('sort').value;
  const hpMin=+document.getElementById('hp-min').value, hpMax=+document.getElementById('hp-max').value;
  const cpMin=+document.getElementById('cp-min').value, cpMax=+document.getElementById('cp-max').value;

  let list=[...all];
  if(activeTab==='fav') list=list.filter(p=>favs.has(p.id));
  if(activeType) list=list.filter(p=>p.types.includes(activeType));
  if(q) list=list.filter(p=>p.name.toLowerCase().includes(q));
  list=list.filter(p=>p.hp>=hpMin&&p.hp<=hpMax&&p.cp>=cpMin&&p.cp<=cpMax);

  if(sort==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
  else if(sort==='hp') list.sort((a,b)=>b.hp-a.hp);
  else if(sort==='cp') list.sort((a,b)=>b.cp-a.cp);
  else if(sort==='score') list.sort((a,b)=>(b.hp+b.cp)-(a.hp+a.cp));
  else list.sort((a,b)=>a.id-b.id);

  document.getElementById('resCount').textContent=list.length+' pokémon'+(list.length>1?'s':'');

  const grid=document.getElementById('grid');
  if(!list.length){
    grid.innerHTML='<div class="empty"><div class="empty-ico">✦</div>Aucun pokémon trouvé</div>';
    return;
  }

  const maxHP=Math.max(...all.map(p=>p.hp));
  const maxCP=Math.max(...all.map(p=>p.cp));

  grid.innerHTML=list.map((p,i)=>{
    const c=tc(p.types[0]), rar=rarity(p), score=p.hp+p.cp;
    const hpW=Math.min(100,(p.hp/maxHP)*100), cpW=Math.min(100,(p.cp/maxCP)*100);
    const badges=p.types.map(t=>'<span class="badge" style="background:'+tc(t).bg+';color:'+tc(t).text+';border:1px solid '+tc(t).border+'">'+t+'</span>').join('');
    const faved=favs.has(p.id);
    return '<div class="card" style="animation-delay:'+i*.04+'s" onclick="openModal('+p.id+')">'+
      '<div class="card-img" style="background:radial-gradient(ellipse at 60% 30%,'+c.g+',#faf8ff)">'+
        '<span class="rarity" style="background:'+rar.bg+';color:'+rar.text+';border:1px solid '+rar.border+'">'+rar.label+'</span>'+
        '<button class="card-fav" onclick="event.stopPropagation();toggleFav('+p.id+',this)">'+
          (faved?'<span style="color:var(--rose-m)">♥</span>':'<span style="opacity:.3;color:var(--muted)">♡</span>')+
        '</button>'+
        '<img src="'+p.picture+'" alt="'+p.name+'" loading="lazy"/>'+
      '</div>'+
      '<div class="card-body">'+
        '<div class="card-top"><span class="card-id">#'+String(p.id).padStart(3,'0')+'</span>'+
        '<span class="card-score">'+score+'pts</span></div>'+
        '<div class="card-name">'+p.name+'</div>'+
        '<div class="types">'+badges+'</div>'+
        '<div class="bars">'+
          '<div class="bar-row"><span class="bar-lbl">HP</span><div class="bar-track"><div class="bar-fill" style="width:'+hpW+'%;background:var(--hp)"></div></div><span class="bar-val">'+p.hp+'</span></div>'+
          '<div class="bar-row"><span class="bar-lbl">CP</span><div class="bar-track"><div class="bar-fill" style="width:'+cpW+'%;background:var(--cp)"></div></div><span class="bar-val">'+p.cp+'</span></div>'+
        '</div>'+
      '</div></div>';
  }).join('');
}

function setTab(t){
  activeTab=t;
  document.getElementById('tab-all').classList.toggle('active',t==='all');
  document.getElementById('tab-fav').classList.toggle('active',t==='fav');
  render();
}
function filterType(el,type){
  activeType=type;
  document.querySelectorAll('[data-type]').forEach(b=>b.classList.remove('active'));
  el.classList.add('active'); render();
}
function setView(v){
  viewMode=v;
  document.getElementById('contentWrap').classList.toggle('list-view',v==='list');
  document.getElementById('btn-grid').classList.toggle('active',v==='grid');
  document.getElementById('btn-list').classList.toggle('active',v==='list');
}
function updSlider(id,val){ document.getElementById(id).textContent=val; }
function resetFilters(){
  const mH=Math.max(...all.map(p=>p.hp)), mC=Math.max(...all.map(p=>p.cp));
  document.getElementById('hp-min').value=0; updSlider('hp-min-v',0);
  document.getElementById('hp-max').value=mH; updSlider('hp-max-v',mH);
  document.getElementById('cp-min').value=0; updSlider('cp-min-v',0);
  document.getElementById('cp-max').value=mC; updSlider('cp-max-v',mC);
  document.getElementById('search').value='';
  document.getElementById('sort').value='id';
  activeType='';
  document.querySelectorAll('[data-type]').forEach(b=>b.classList.remove('active'));
  document.querySelector('[data-type=""]').classList.add('active');
  render();
}
function openRandom(){
  openModal(all[Math.floor(Math.random()*all.length)].id);
}

function toggleFav(id,btn){
  if(favs.has(id)){favs.delete(id);btn.innerHTML='<span style="opacity:.3;color:var(--muted)">♡</span>';}
  else{favs.add(id);btn.innerHTML='<span style="color:var(--rose-m)">♥</span>';}
  saveFavs();
  if(currentModal===id) updateFavBtn();
  if(activeTab==='fav') render();
}
function toggleFavModal(){
  if(!currentModal) return;
  favs.has(currentModal)?favs.delete(currentModal):favs.add(currentModal);
  saveFavs(); updateFavBtn();
  if(activeTab==='fav') render();
}
function updateFavBtn(){
  const b=document.getElementById('m-fav-btn');
  if(b) b.textContent=favs.has(currentModal)?'♥ Retirer':'♡ Favoris';
}
function saveFavs(){ localStorage.setItem('pokefavs',JSON.stringify([...favs])); updateFavCount(); }
function updateFavCount(){ document.getElementById('cnt-fav').textContent=favs.size; }

function openModal(id){
  const p=all.find(x=>x.id===id); if(!p) return;
  currentModal=id;
  const c=tc(p.types[0]), rar=rarity(p), score=p.hp+p.cp;
  const maxHP=Math.max(...all.map(x=>x.hp));
  const maxCP=Math.max(...all.map(x=>x.cp));
  const maxSC=Math.max(...all.map(x=>x.hp+x.cp));

  document.getElementById('m-bg').style.background=
    'radial-gradient(ellipse at 50% 0%,'+c.g+' 0%,#faf7ff 100%)';
  document.getElementById('m-img').src=p.picture;
  document.getElementById('m-id').textContent='#'+String(p.id).padStart(3,'0');
  document.getElementById('m-name').textContent=p.name;
  document.getElementById('m-rarity').innerHTML=
    '<span class="badge" style="background:'+rar.bg+';color:'+rar.text+';border:1px solid '+rar.border+';font-size:.6rem;padding:3px 10px">'+rar.label+'</span>';
  document.getElementById('m-types').innerHTML=p.types.map(t=>
    '<span class="badge" style="background:'+tc(t).bg+';color:'+tc(t).text+';border:1px solid '+tc(t).border+';font-size:.7rem;padding:4px 12px">'+t+'</span>'
  ).join('');

  ['m-hp-bar','m-cp-bar','m-sc-bar'].forEach(id=>document.getElementById(id).style.width='0');
  setTimeout(()=>{
    document.getElementById('m-hp-bar').style.width=(p.hp/maxHP*100)+'%';
    document.getElementById('m-cp-bar').style.width=(p.cp/maxCP*100)+'%';
    document.getElementById('m-cp-bar').style.background=c.text;
    document.getElementById('m-sc-bar').style.width=(score/maxSC*100)+'%';
  },60);

  document.getElementById('m-hp-v').textContent=p.hp;
  document.getElementById('m-cp-v').textContent=p.cp;
  document.getElementById('m-sc-v').textContent=score;
  updateFavBtn();
  document.getElementById('overlay').classList.add('open');
}
function closeModal(){ document.getElementById('overlay').classList.remove('open'); currentModal=null; }
function overlayClick(e){ if(e.target===document.getElementById('overlay')) closeModal(); }

document.addEventListener('keydown',e=>{
  if(e.key==='Escape') closeModal();
  if(e.key==='/'&&document.activeElement.tagName!=='INPUT'){ e.preventDefault(); document.getElementById('search').focus(); }
  if(e.key.toLowerCase()==='r'&&document.activeElement.tagName!=='INPUT') openRandom();
});

init();
</script>
</body>
</html>`;

/* ══ API ══ */
app.get('/api/pokemons',(req,res)=>{
  let r=[...pokemons];
  if(req.query.name){const q=req.query.name.toLowerCase();r=r.filter(p=>p.name.toLowerCase().includes(q));}
  if(req.query.type){const q=req.query.type.toLowerCase();r=r.filter(p=>p.types.some(t=>t.toLowerCase().includes(q)));}
  const lim=parseInt(req.query.limit)||r.length,off=parseInt(req.query.offset)||0;
  res.json(helper.success(r.slice(off,off+lim).length+' pokémon(s)',r.slice(off,off+lim)));
});
app.get('/api/pokemons/:id',(req,res)=>{
  const p=pokemons.find(p=>p.id===parseInt(req.params.id));
  if(!p) return res.status(404).json(helper.error('Introuvable'));
  res.json(helper.success('Pokémon trouvé !',p));
});
app.post('/api/pokemons',(req,res)=>{
  const{name,hp,cp,picture,types}=req.body;
  if(!name||!hp||!cp||!picture||!types) return res.status(400).json(helper.error('Champs manquants'));
  const p={id:pokemons.length?Math.max(...pokemons.map(p=>p.id))+1:1,name,hp:+hp,cp:+cp,picture,types:Array.isArray(types)?types:[types],created:new Date()};
  pokemons.push(p); res.status(201).json(helper.success('Créé !',p));
});
app.put('/api/pokemons/:id',(req,res)=>{
  const id=parseInt(req.params.id),i=pokemons.findIndex(p=>p.id===id);
  if(i===-1) return res.status(404).json(helper.error('Introuvable'));
  const{name,hp,cp,picture,types}=req.body;
  if(!name||!hp||!cp||!picture||!types) return res.status(400).json(helper.error('Champs manquants'));
  pokemons[i]={id,name,hp:+hp,cp:+cp,picture,types:Array.isArray(types)?types:[types],created:pokemons[i].created};
  res.json(helper.success('Mis à jour !',pokemons[i]));
});
app.patch('/api/pokemons/:id',(req,res)=>{
  const id=parseInt(req.params.id),i=pokemons.findIndex(p=>p.id===id);
  if(i===-1) return res.status(404).json(helper.error('Introuvable'));
  ['name','hp','cp','picture','types'].forEach(k=>{if(req.body[k]!==undefined)pokemons[i][k]=req.body[k];});
  res.json(helper.success('Modifié !',pokemons[i]));
});
app.delete('/api/pokemons/:id',(req,res)=>{
  const id=parseInt(req.params.id),i=pokemons.findIndex(p=>p.id===id);
  if(i===-1) return res.status(404).json(helper.error('Introuvable'));
  res.json(helper.success('Supprimé !',pokemons.splice(i,1)[0]));
});
app.use((req,res)=>res.status(404).json(helper.error(req.method+' '+req.path+' introuvable')));
app.listen(PORT,()=>console.log('✅  http://localhost:'+PORT));