import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const updated = '24 august 2026';

export function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const privacy = type === 'privacy';
  useEffect(() => {
    document.title = `${privacy ? 'Politica de confidențialitate' : 'Termeni și condiții'} | Facial Harmony Clinic by Dr. Ana`;
  }, [privacy]);
  return (
    <main className="min-h-screen bg-[#f7f3f0] px-6 py-16 text-[#58494f] md:px-20">
      <div className="mx-auto max-w-3xl">
        <Link className="text-sm text-wine" to="/">← Pagina principală</Link>
        <h1 className="mt-10 font-serif text-5xl">{privacy ? 'Politica de confidențialitate' : 'Termeni și condiții'}</h1>
        <p className="mt-3 italic">Ultima actualizare: {updated}</p>
        {privacy ? <PrivacyContent /> : <TermsContent />}
      </div>
    </main>
  );
}

function PrivacyContent() {
  return (
    <div className="prose mt-12 max-w-none text-[#70656a]">
      <p>Facial Harmony Clinic by Dr. Ana respectă confidențialitatea datelor cu caracter personal. Această politică explică modul în care prelucrăm datele cu caracter personal furnizate prin website-ul drana.ro, prin e-mail, telefon, WhatsApp sau alte canale de contact indicate pe website.</p>
      <h2>1. Operatorul datelor</h2>
      <p>Operatorul datelor cu caracter personal este <strong>AXIS CLINIC BY DR ANA SRL</strong>, cu sediul în Str. Nicolae Bălcescu nr. 46 Bis, Bl. B1, Sc. 1, Et. 4, Ap. 17, Galați, România, CUI 55372109. Ne poți contacta la facial.harmony@drana.ro sau +40 756 599 985.</p>
      <p>În această politică, „clinica”, „noi” și „operatorul” se referă la AXIS CLINIC BY DR ANA SRL. Domeniul drana.ro este înregistrat și deținut juridic de ULTRAWEB SYSTEM SRL, care asigură, după caz, dezvoltarea, administrarea și mentenanța tehnică a website-ului. AXIS CLINIC BY DR ANA SRL rămâne operatorul datelor colectate prin website și canalele clinicii.</p>
      <h2>2. Domeniul de aplicare</h2><p>Această politică nu înlocuiește informarea specifică oferită pacienților în cadrul consultațiilor, tratamentelor sau altor servicii medicale.</p>
      <h2>3. Ce date putem prelucra</h2><p>Numele și prenumele, telefonul, e-mailul, procedura sau serviciul de interes, mesajul, informațiile despre solicitare sau programare, data și ora comunicării, adresa IP, informații despre browser, dispozitiv și sistemul de operare, loguri server și informații transmise voluntar. Te rugăm să nu transmiți diagnostice, rezultate, fotografii, tratamente sau alte date privind sănătatea, cu excepția unui canal adecvat și securizat indicat expres de clinică. Datele privind sănătatea sunt date speciale conform art. 9 GDPR.</p>
      <h2>4. Cum colectăm datele</h2><p>Putem colecta date când ne contactezi prin e-mail, telefon, WhatsApp, formular, când navighezi pe website sau accesezi linkuri externe precum Instagram.</p>
      <h2>5. Scopurile și temeiurile prelucrării</h2>
      <p>Folosim datele pentru răspunsul la solicitări, programări și comunicări administrative, furnizarea serviciilor medicale, securitatea website-ului, respectarea obligațiilor legale și apărarea drepturilor. Temeiurile pot fi art. 6 alin. (1) lit. b), c) sau f) GDPR și, după caz, consimțământul. Solicitarea nu confirmă automat o programare; aceasta devine valabilă numai după confirmarea clinicii.</p>
      <p>Nu folosim datele pentru marketing direct fără temei juridic valid și, atunci când este necesar, fără consimțământ prealabil. Consimțământul pentru marketing este separat de acceptarea acestei politici.</p>
      <h2>6. WhatsApp și platformele externe</h2><p>Dacă folosești WhatsApp, conversația este transmisă către WhatsApp/Meta, care poate prelucra și transfera date conform propriilor politici. Nu transmite date medicale sensibile, fotografii sau documente medicale prin WhatsApp decât la instrucțiunea expresă a clinicii. Linkurile Instagram duc către o platformă administrată de un terț.</p>
      <h2>7. Furnizorii tehnici</h2><p>ULTRAWEB SYSTEM SRL acționează, în măsura accesului la date, ca persoană împuternicită a clinicii. Găzduirea este asigurată de ROMARG SRL, care poate prelucra date tehnice pentru găzduire, securitate, backup și mentenanță. Furnizorii nu sunt autorizați să utilizeze datele în scopuri proprii, comerciale sau de marketing.</p>
      <h2>8. Transferuri internaționale</h2><p>ROMARG declară că utilizează infrastructură și centre de date în România. Nu utilizăm intenționat servicii de analiză, marketing sau publicitate care instalează cookie-uri opționale. WhatsApp, Instagram și alți furnizori externi pot efectua transferuri internaționale conform propriilor politici. Pentru viitori furnizori vom aplica mecanismele art. 44–49 GDPR.</p>
      <h2>9. Perioada de păstrare</h2><p>Solicitările generale se păstrează maximum 12 luni de la ultima interacțiune, iar logurile tehnice și de securitate aproximativ 30 de zile. Datele privind programările, datele contabile și fiscale, datele medicale și datele necesare apărării unui drept se păstrează cât timp este necesar sau cât impune legea.</p>
      <h2>10. Cookie-uri</h2><p>Website-ul nu utilizează cookie-uri de analiză, marketing, publicitate, profilare sau alte cookie-uri opționale. Poate utiliza tehnologii tehnice necesare funcționării, securității și livrării conținutului.</p>
      <h2>11. Drepturile tale</h2><p>Poți solicita accesul, rectificarea, ștergerea, restricționarea, portabilitatea, opoziția sau retragerea consimțământului, în condițiile GDPR. Scrie la facial.harmony@drana.ro; putem solicita verificarea identității și vom răspunde, de regulă, în termen de o lună.</p>
      <h2>12. Dreptul de a depune plângere</h2><p>Poți depune plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal: <a href="https://www.dataprotection.ro">www.dataprotection.ro</a>.</p>
      <h2>13. Securitatea datelor</h2><p>Aplicăm măsuri tehnice și organizatorice adecvate, inclusiv conexiuni securizate, controlul accesului, backupuri și proceduri de gestionare a incidentelor.</p>
      <h2>14. Profilare și decizii automatizate</h2><p>Nu utilizăm datele pentru decizii bazate exclusiv pe prelucrare automatizată și nu realizăm profilare cu efecte juridice sau similare semnificative.</p>
      <h2>15. Datele minorilor</h2><p>Website-ul nu este destinat colectării intenționate de date de la minori fără implicarea reprezentantului legal, atunci când aceasta este necesară.</p>
      <h2>16. Modificarea politicii</h2><p>Versiunea actuală și data ultimei actualizări vor fi publicate pe această pagină.</p>
      <h2>17. Contact</h2><p><strong>AXIS CLINIC BY DR ANA SRL</strong><br />Str. Nicolae Bălcescu nr. 46 Bis, Bl. B1, Sc. 1, Et. 4, Ap. 17, Galați, România<br />facial.harmony@drana.ro · +40 756 599 985</p>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="prose mt-12 max-w-none text-[#70656a]">
      <h2>1. Informații generale</h2>
      <p>Website-ul drana.ro este utilizat pentru prezentarea serviciilor oferite de:</p>
      <p><strong>AXIS CLINIC BY DR ANA SRL</strong><br />Sediu: Str. Nicolae Bălcescu nr. 46 Bis, Bl. B1, Sc. 1, Et. 4, Ap. 17, Galați, România<br />CUI: 55372109<br />E-mail: facial.harmony@drana.ro<br />Telefon: +40 756 599 985</p>
      <p>Domeniul drana.ro este înregistrat și deținut juridic de ULTRAWEB SYSTEM SRL, care asigură dezvoltarea și/sau administrarea tehnică a website-ului.</p>
      <h2>2. Acceptarea termenilor</h2>
      <p>Prin accesarea și utilizarea website-ului, accepți acești Termeni și condiții. Dacă nu ești de acord cu acești termeni, te rugăm să nu utilizezi website-ul. Acești termeni se aplică împreună cu <Link className="text-wine" to="/politica-de-confidentialitate">Politica de confidențialitate</Link>.</p>
      <h2>3. Scopul website-ului</h2>
      <p>Website-ul are scop informativ și prezintă informații generale despre clinică, medic, proceduri și modalități de contact.</p>
      <p>Informațiile publicate pe website nu reprezintă consultație medicală, diagnostic, recomandare medicală individuală, plan de tratament, promisiune privind un anumit rezultat sau înlocuitor al unei consultații medicale. Decizia privind efectuarea unei proceduri se ia numai după evaluarea individuală și consultația medicală corespunzătoare.</p>
      <p>Pentru urgențe medicale, apelează serviciul de urgență 112 sau adresează-te celei mai apropiate unități medicale.</p>
      <h2>4. Proceduri și rezultate</h2>
      <p>Informațiile despre proceduri sunt prezentate cu caracter general. Rezultatele pot varia în funcție de particularitățile fiecărei persoane, starea de sănătate, anatomie, istoricul medical, indicațiile medicului și respectarea recomandărilor medicale. Imaginile, descrierile sau exemplele prezentate nu garantează obținerea acelorași rezultate de către o altă persoană.</p>
      <h2>5. Programări și solicitări de contact</h2>
      <p>Transmiterea unei solicitări prin website, e-mail, telefon sau WhatsApp reprezintă o cerere de contact și nu constituie automat o programare confirmată. Programarea este considerată confirmată numai după comunicarea expresă a clinicii. Clinica poate solicita informații suplimentare înainte de confirmarea unei programări.</p>
      <p>Te rugăm să nu transmiți prin website, e-mail sau WhatsApp date medicale, fotografii medicale sau documente medicale, decât dacă primești instrucțiuni exprese din partea clinicii.</p>
      <h2>6. Comunicarea prin WhatsApp</h2>
      <p>Website-ul poate conține un link către WhatsApp. WhatsApp este o platformă administrată de un operator terț. Utilizarea WhatsApp este supusă condițiilor și politicii de confidențialitate ale WhatsApp/Meta. Clinica nu controlează în totalitate prelucrarea datelor realizată de WhatsApp/Meta și recomandă utilizatorilor să nu transmită date medicale sensibile prin această platformă.</p>
      <h2>7. Disponibilitatea website-ului</h2>
      <p>Depunem eforturi rezonabile pentru menținerea website-ului funcțional și actualizat. Cu toate acestea, website-ul poate fi temporar indisponibil din cauza lucrărilor de mentenanță, problemelor tehnice, problemelor furnizorilor de internet sau hosting, atacurilor informatice ori unor cauze aflate în afara controlului nostru. Nu garantăm că website-ul va fi disponibil permanent sau fără erori.</p>
      <h2>8. Conținutul website-ului</h2>
      <p>Conținutul website-ului poate include texte, imagini, fotografii, logo-uri, elemente grafice și materiale video. Conținutul aparține AXIS CLINIC BY DR ANA SRL, ULTRAWEB SYSTEM SRL sau unor terți care au acordat dreptul de utilizare, după caz.</p>
      <p>Este interzisă copierea, reproducerea, modificarea, distribuirea sau folosirea conținutului în scop comercial fără acordul titularului drepturilor. Este permisă consultarea website-ului pentru uz personal, necomercial.</p>
      <h2>9. Linkuri către terți</h2>
      <p>Website-ul poate conține linkuri către website-uri sau platforme terțe, inclusiv Instagram și WhatsApp. Nu controlăm conținutul, disponibilitatea, securitatea sau politicile acestor platforme. Accesarea platformelor terțe se face pe propria răspundere și este supusă termenilor și politicilor operatorilor respectivi.</p>
      <h2>10. Date cu caracter personal</h2>
      <p>Prelucrarea datelor cu caracter personal este descrisă în <Link className="text-wine" to="/politica-de-confidentialitate">Politica de confidențialitate</Link>. Operatorul datelor colectate prin website și prin canalele de contact ale clinicii este AXIS CLINIC BY DR ANA SRL. ULTRAWEB SYSTEM SRL este titularul domeniului și poate asigura servicii de dezvoltare și administrare tehnică. În măsura în care are acces la date, aceasta acționează conform instrucțiunilor clinicii. Găzduirea website-ului este asigurată prin ROMARG SRL.</p>
      <h2>11. Cookie-uri</h2>
      <p>La data ultimei actualizări, website-ul nu utilizează cookie-uri de analiză, marketing, publicitate, profilare sau alte cookie-uri opționale. Website-ul poate utiliza tehnologii tehnice necesare funcționării și securității sale. În cazul introducerii unor cookie-uri opționale, vom actualiza politica aplicabilă și vom solicita consimțământul utilizatorilor atunci când legea impune acest lucru.</p>
      <h2>12. Limitarea răspunderii</h2>
      <p>Informațiile sunt furnizate cu bună-credință și sunt destinate informării generale. Nu garantăm că toate informațiile sunt complete, permanente sau aplicabile fiecărei persoane. Nicio informație de pe website nu înlocuiește consultația, evaluarea sau recomandarea unui medic.</p>
      <p>În limitele permise de lege, nu răspundem pentru prejudiciile rezultate exclusiv din folosirea informațiilor generale de pe website fără consultarea unui medic. Nicio prevedere din acești termeni nu exclude sau limitează răspunderea care nu poate fi exclusă sau limitată prin lege.</p>
      <h2>13. Modificarea website-ului și a termenilor</h2>
      <p>Putem modifica, suspenda sau elimina anumite secțiuni, materiale sau funcționalități ale website-ului. Putem actualiza acești Termeni și condiții pentru a reflecta modificări legislative, tehnice sau comerciale. Versiunea actuală va fi publicată pe această pagină și va indica data ultimei actualizări.</p>
      <h2>14. Legea aplicabilă</h2>
      <p>Acești Termeni și condiții sunt guvernați de legislația română. Orice litigiu va fi soluționat de instanțele competente potrivit legislației aplicabile.</p>
      <h2>15. Contact</h2>
      <p>Pentru întrebări sau sesizări privind website-ul, ne poți contacta:</p>
      <p><strong>AXIS CLINIC BY DR ANA SRL</strong><br />Str. Nicolae Bălcescu nr. 46 Bis, Bl. B1, Sc. 1, Et. 4, Ap. 17, Galați, România<br />E-mail: facial.harmony@drana.ro<br />Telefon: +40 756 599 985</p>
    </div>
  );
}
