const mockupMarkup = `<div class="caliper" aria-hidden="true">
  <div class="stem"></div>
  <div class="tick active" data-sec="hero"><span class="dash"></span><span class="lbl mono">00 START</span></div>
  <div class="tick" data-sec="about"><span class="dash"></span><span class="lbl mono">01 MEDIC</span></div>
  <div class="tick" data-sec="services"><span class="dash"></span><span class="lbl mono">02 SERVICII</span></div>
  <div class="tick" data-sec="symmetry"><span class="dash"></span><span class="lbl mono">03 ABORDARE</span></div>
  <div class="tick" data-sec="booking"><span class="dash"></span><span class="lbl mono">04 PROGRAMARE</span></div>
  <div class="tick" data-sec="login"><span class="dash"></span><span class="lbl mono">05 CONT</span></div>
</div>

<header>
  <div class="wrap">
    <div class="brand">
      <span class="name">Dr. Ana Gavrilita Cristian</span>
      <span class="tag">Chirurgie Plastică &amp; Estetică</span>
    </div>
    <nav class="links">
      <a href="#about">Despre</a>
      <a href="#services">Servicii</a>
      <a href="#symmetry">Abordare</a>
      <a href="#booking">Programare</a>
    </nav>
    <div class="nav-actions">
      <a href="#login" class="btn ghost">Contul meu</a>
      <a href="#booking" class="btn primary">Programează-te</a>
    </div>
  </div>
</header>

<section class="hero" id="hero">
  <div class="wrap">
    <div>
      <div class="eyebrow">Consultație &amp; evaluare individuală</div>
      <h1 class="display">Precizie chirurgicală,<br><em>rezultate naturale</em>.</h1>
      <p class="sub">18 ani de practică în chirurgia plastică și estetică facială și corporală, cu un accent pe simetrie, proporție și un rezultat care rămâne, în primul rând, al tău.</p>
      <div class="cta-row">
        <a href="#booking" class="btn primary">Solicită o consultație</a>
        <a href="#services" class="btn">Vezi procedurile</a>
      </div>
      <div class="meta-row">
        <div class="m"><span class="num serif">18</span><span class="lbl">Ani experiență</span></div>
        <div class="m"><span class="num serif">2400+</span><span class="lbl">Intervenții</span></div>
        <div class="m"><span class="num serif">4.9/5</span><span class="lbl">Din 310 recenzii</span></div>
      </div>
    </div>
    <div class="hero-portrait">
      <svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 20 C 60 20 42 55 42 95 C 42 140 62 175 100 190 C 138 175 158 140 158 95 C 158 55 140 20 100 20 Z" stroke="#12231F" stroke-width="1"/>
        <line x1="100" y1="20" x2="100" y2="190" stroke="#C98B79" stroke-width="1" stroke-dasharray="3 4"/>
        <line x1="30" y1="70" x2="170" y2="70" stroke="#12231F" stroke-width="0.5" opacity="0.35"/>
        <line x1="30" y1="115" x2="170" y2="115" stroke="#12231F" stroke-width="0.5" opacity="0.35"/>
        <line x1="30" y1="150" x2="170" y2="150" stroke="#12231F" stroke-width="0.5" opacity="0.35"/>
        <circle cx="72" cy="95" r="3" fill="#A98A55"/>
        <circle cx="128" cy="95" r="3" fill="#A98A55"/>
        <circle cx="100" cy="150" r="3" fill="#A98A55"/>
      </svg>
      <div class="frame-label mono">
        <span>FIG. 01 — SIMETRIE</span>
        <span>SCARA 1:1</span>
      </div>
    </div>
  </div>
</section>

<section class="about" id="about">
  <div class="wrap">
    <div>
      <div class="eyebrow">Parcurs profesional</div>
      <div class="creds">
        <div class="row"><span class="yr mono">2007</span><span class="txt">Licență Medicină Generală, UMF „Carol Davila", București</span></div>
        <div class="row"><span class="yr mono">2013</span><span class="txt">Specializare Chirurgie Plastică, Estetică și Microchirurgie Reconstructivă</span></div>
        <div class="row"><span class="yr mono">2016</span><span class="txt">Fellowship în chirurgie facială estetică, Paris</span></div>
        <div class="row"><span class="yr mono">2019</span><span class="txt">Membru titular al Societății Române de Chirurgie Plastică</span></div>
        <div class="row"><span class="yr mono">2024</span><span class="txt">Deschide propria clinică de chirurgie estetică, Cluj-Napoca</span></div>
      </div>
    </div>
    <div>
      <div class="lead">„O intervenție reușită e cea despre care nimeni nu vorbește — pentru că <span style="color:var(--rose)">arăți firesc</span>, doar mai odihnit(ă)."</div>
      <p class="body">Cred într-o abordare conservatoare: fiecare consultație pornește de la anatomia proprie a pacientului, nu de la un rezultat standard. Discutăm limitele realiste, riscurile și alternativele non-chirurgicale înainte de a stabili orice plan.</p>
      <p class="body">Lucrez în echipă cu anesteziști și asistente cu experiență dedicată în chirurgia estetică, într-un spațiu acreditat pentru intervenții de zi și internare scurtă.</p>
    </div>
  </div>
</section>

<section id="services">
  <div class="section-head">
    <div>
      <div class="eyebrow">Ce ofer</div>
      <h2>Proceduri principale</h2>
    </div>
    <p>Fiecare procedură începe cu o consultație dedicată de evaluare — nu cu o ofertă de preț.</p>
  </div>
  <div class="services-grid">
    <div class="service-card"><div class="idx mono">01</div><h3>Rinoplastie</h3><p>Corecție structurală și estetică a nasului, cu simulare 3D a rezultatului preconizat.</p></div>
    <div class="service-card"><div class="idx mono">02</div><h3>Blefaroplastie</h3><p>Rejuvenare a zonei periorbitale, păstrând expresivitatea naturală a privirii.</p></div>
    <div class="service-card"><div class="idx mono">03</div><h3>Lifting facial</h3><p>Tehnică cu incizii minime, orientată spre un aspect odihnit.</p></div>
    <div class="service-card"><div class="idx mono">04</div><h3>Augmentare mamară</h3><p>Alegerea implantului pornește de la structura toracică, nu de la o mărime fixă.</p></div>
    <div class="service-card"><div class="idx mono">05</div><h3>Abdominoplastie</h3><p>Remodelare a peretelui abdominal, frecvent asociată cu recuperare post-sarcină.</p></div>
    <div class="service-card"><div class="idx mono">06</div><h3>Liposculptură</h3><p>Redefinire a conturului corporal prin tehnică asistată, cu accent pe simetrie.</p></div>
  </div>
</section>

<section class="symmetry" id="symmetry">
  <div class="wrap">
    <div class="diagram">
      <svg viewBox="0 0 300 180" width="100%" height="auto">
        <line x1="20" y1="90" x2="280" y2="90" stroke="#12231F" stroke-width="0.6" opacity="0.4"/>
        <line x1="150" y1="20" x2="150" y2="160" stroke="#C98B79" stroke-width="1" stroke-dasharray="2 5"/>
        <path d="M60 40 Q150 10 240 40" stroke="#12231F" stroke-width="1" fill="none"/>
        <path d="M60 140 Q150 170 240 140" stroke="#12231F" stroke-width="1" fill="none"/>
        <circle cx="60" cy="40" r="2.5" fill="#A98A55"/>
        <circle cx="240" cy="40" r="2.5" fill="#A98A55"/>
        <circle cx="60" cy="140" r="2.5" fill="#A98A55"/>
        <circle cx="240" cy="140" r="2.5" fill="#A98A55"/>
        <text x="150" y="176" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#12231F" opacity="0.5">AXA DE SIMETRIE — REF. INTERNĂ</text>
      </svg>
    </div>
    <div>
      <div class="eyebrow">Filozofia clinică</div>
      <div class="quote">Rezultatul nu se măsoară în <span>milimetri</span>, ci în cât de firesc te simți în oglindă, o lună mai târziu.</div>
      <div class="attribution mono">— Principiul din spatele fiecărui plan de tratament</div>
    </div>
  </div>
</section>

<section class="booking" id="booking">
  <div class="wrap">
    <div>
      <div class="eyebrow">Programare</div>
      <h2 style="font-family:'Instrument Serif',serif; font-weight:400; font-size:clamp(30px,4vw,42px); margin-bottom:24px;">Rezervă o consultație</h2>
      <p style="opacity:.75; font-size:14.5px; line-height:1.7; max-width:420px; margin-bottom:8px;">Completează formularul — programarea este salvată direct în agenda clinicii, iar confirmarea ajunge pe e-mail și SMS.</p>
      <div style="margin-top:28px;">
        <div class="info-line"><span class="k mono">Program</span><span>Luni – Vineri, 10:00 – 18:00</span></div>
        <div class="info-line"><span class="k mono">Locație</span><span>Str. Memorandumului 12, Cluj-Napoca</span></div>
        <div class="info-line"><span class="k mono">Urgențe</span><span>Consultații prioritare în 48h, la cerere</span></div>
      </div>
    </div>
    <div class="form-card">
      <div class="form-grid">
        <div class="field"><label>Nume complet</label><input type="text" placeholder="Ex: Ana Popescu"></div>
        <div class="field"><label>Telefon</label><input type="tel" placeholder="07xx xxx xxx"></div>
        <div class="field full"><label>E-mail</label><input type="email" placeholder="nume@exemplu.ro"></div>
        <div class="field"><label>Procedură de interes</label>
          <select>
            <option>Rinoplastie</option>
            <option>Blefaroplastie</option>
            <option>Lifting facial</option>
            <option>Augmentare mamară</option>
            <option>Abdominoplastie</option>
            <option>Liposculptură</option>
            <option>Nu sunt sigur(ă) încă</option>
          </select>
        </div>
        <div class="field"><label>Data preferată</label><input type="date"></div>
        <div class="field full"><label>Detalii suplimentare (opțional)</label><textarea rows="3" placeholder="Orice context util pentru consultație"></textarea></div>
      </div>
      <button class="btn primary block" type="button">Trimite cererea de programare</button>
      <div class="form-note">Aceasta este o solicitare — echipa confirmă ora exactă în maximum 24h lucrătoare.</div>
    </div>
  </div>
</section>

<section class="login-section" id="login">
  <div class="wrap">
    <div class="login-card">
      <div class="role-tabs">
        <div class="role-tab active" id="tab-user">Pacient</div>
        <div class="role-tab" id="tab-doctor">Medic</div>
      </div>
      <h3>Autentificare</h3>
      <div class="sub" id="login-sub">Vezi programările tale și istoricul consultațiilor.</div>
      <div class="field"><label>E-mail</label><input type="email" placeholder="nume@exemplu.ro"></div>
      <div class="field"><label>Parolă</label><input type="password" placeholder="••••••••"></div>
      <div class="row-between">
        <label style="display:flex; align-items:center; gap:8px; opacity:.7;"><input type="checkbox"> Ține-mă minte</label>
        <a href="#">Am uitat parola</a>
      </div>
      <button class="btn primary block" type="button">Autentificare</button>
      <div style="text-align:center; margin-top:18px; font-size:12.5px; opacity:.6;">Nu ai cont? <a href="#" style="color:var(--rose); font-weight:600;">Creează unul</a></div>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">
    <div class="brand"><span class="name">Dr. Ana Gavrilita Cristian</span></div>
    <div class="fmeta mono">© 2026 · Galati, România · Acest site nu înlocuiește un consult medical direct</div>
  </div>
</footer>`;

export function App() {
  return <div dangerouslySetInnerHTML={{ __html: mockupMarkup }} />;
}

export default App;
