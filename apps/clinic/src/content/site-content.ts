type ProcedurePrice = {
  label: string;
  value: string;
};

export type Procedure = {
  slug: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  details: string[];
  product?: string;
  pricing: ProcedurePrice[];
};

export function priceFrom(procedure: Procedure): string | undefined {
  if (!procedure.pricing?.length) {
    return undefined;
  }

  const amounts = procedure.pricing
    .map((price) => Number(price.value.replace(/[^\d,.]/g, '').replace(/\./g, '').replace(',', '.')))
    .filter((amount) => Number.isFinite(amount) && amount > 0);

  if (!amounts.length) {
    return undefined;
  }

  const min = Math.min(...amounts);
  return `de la ${min.toLocaleString('ro-RO')} lei`;
}

export interface Value {
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  /** Short display name (first name + initial), shown only with consent. */
  author?: string;
  source?: string;
}

export const brand = {
  name: 'Facial Harmony Clinic',
  subtitle: 'by Dr. Ana',
  fullName: 'Facial Harmony Clinic by Dr. Ana',
  city: 'Galați',
  logoSrc: '/logo.svg',
  topbarLeft: 'Facial Harmony Clinic by Dr. Ana · Galați',
  phone: '+40 756 599 985',
  whatsapp: '40756599985',
  email: 'facial.harmony@drana.ro',
  addressName: 'ELIA Clinc',
  address: 'Strada Cosminului nr. 13',
  mapsHref:
    'https://www.google.com/maps/search/?api=1&query=Dental%20One%20Studio%2C%20Strada%20Cosminului%20nr.%2013',
  instagram: 'https://www.instagram.com/facial_harmony_by_dr_ana?igsh=MWwxNmFqbzF6ZnFqcw%3D%3D&utm_source=qr',
  facebook: 'https://www.facebook.com/share/1F8ECLDVkN/?mibextid=wwXIfr',
};

export function whatsappHref(message: string) {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { id: 'despre', label: 'Despre Dr. Ana' },
  { id: 'servicii', label: 'Proceduri' },
  { id: 'filozofie', label: 'Abordare' },
  { id: 'recenzii', label: 'Recenzii' },
  { id: 'contact', label: 'Contact' },
];

export const procedures: Procedure[] = [
  {
    slug: 'toxina-botulinica',
    title: 'Toxină botulinică',
    description:
      'Estomparea ridurilor de expresie, cu obiectivul de a păstra expresivitatea naturală a feței.',
    metaTitle: 'Toxină botulinică în Galați | Facial Harmony Clinic by Dr. Ana',
    metaDescription:
      'Tratament cu toxină botulinică în Galați, pentru ridurile de expresie și un rezultat natural, adaptat feței tale.',
    intro:
      'Tratamentul cu toxină botulinică este personalizat după dinamica musculară a feței, fără aplicarea unei scheme standard pentru fiecare pacient.',
    details: [
      'Evaluăm expresivitatea feței, dinamica musculară și zonele care te deranjează.',
      'Tratamentul poate viza zona frunții, glabela și ridurile perioculare.',
      'Procedura este minim invazivă și durează, de regulă, 15–20 de minute.',
      'Controlul la 14 zile este inclus atunci când este indicat medical.',
    ],
    pricing: [
      {
        label: '1 zonă',
        value: '800 lei',
      },
      {
        label: '2 zone',
        value: '1.200 lei',
      },
      {
        label: '3 zone',
        value: '1.500 lei',
      },
    ],
  },
  {
    slug: 'augmentarea-buzelor',
    title: 'Augmentarea buzelor',
    description:
      'Contur, hidratare și volum armonios, adaptate proporțiilor feței pentru un rezultat natural.',
    metaTitle: 'Augmentarea buzelor cu acid hialuronic în Galați | Dr. Ana',
    metaDescription:
      'Augmentarea buzelor în Galați cu acid hialuronic RESTYLANE, pentru contur, hidratare și volum adaptate proporțiilor feței.',
    product: 'Acid hialuronic RESTYLANE',
    intro:
      'Augmentarea buzelor cu acid hialuronic RESTYLANE urmărește echilibrul facial și păstrarea expresivității, nu un model impus.',
    details: [
      'Discutăm ce îți dorești, ce te deranjează și stabilim împreună un plan potrivit anatomiei buzelor tale.',
      'Produsul RESTYLANE și volumul administrat sunt alese individual, în funcție de rezultat și indicația medicală.',
      'Procedura se realizează cu anestezie locală sau topică, pentru un confort cât mai bun.',
      'Edemul este temporar, iar controlul și recomandările post-procedură sunt oferite individual.',
    ],
    pricing: [
      {
        label: 'Contur și hidratare buze — 0,5 ml',
        value: '1.200 lei',
      },
      {
        label: 'Augmentare buze — 1 ml',
        value: '1.500 lei',
      },
    ],
  },
  {
    slug: 'sculptra',
    title: 'Sculptra — stimularea colagenului',
    description:
      'Stimularea producției proprii de colagen, pentru corectarea progresivă a pierderii de volum și îmbunătățirea aspectului pielii.',
    metaTitle: 'Sculptra în Galați | Facial Harmony Clinic by Dr. Ana',
    metaDescription:
      'Tratament Sculptra în Galați, cu acid poli-L-lactic, pentru stimularea colagenului și corectarea progresivă a pierderii de volum facial.',
    product: 'Sculptra® — acid poli-L-lactic (PLLA)',
    intro:
      'Sculptra® este un tratament injectabil pe bază de acid poli-L-lactic, care stimulează producția proprie de colagen. Tratamentul urmărește corectarea progresivă a pierderii de volum și îmbunătățirea aspectului pielii, printr-un plan adaptat anatomiei și nevoilor tale.',
    details: [
      'Începem cu o consultație pentru evaluarea feței, discutarea istoricului medical și stabilirea indicației de tratament.',
      'Rezultatele se dezvoltă treptat, pe parcursul săptămânilor și lunilor; aspectul imediat după injectare nu reprezintă rezultatul final.',
      'Numărul de ședințe și cantitatea de produs se stabilesc individual, în funcție de zonele tratate și răspunsul la tratament.',
      'Rezultatele pot persista până la aproximativ 2 ani, cu variații de la o persoană la alta.',
      'Pot apărea umflare, vânătăi, sensibilitate sau noduli; riscurile, contraindicațiile și recomandările post-procedură sunt discutate la consultație.',
    ],
    pricing: [
      {
        label: 'Tratament Sculptra® - 1 fiolă',
        value: '3.000 lei',
      },
    ],
  },
  {
    slug: 'remodelare-faciala',
    title: 'Remodelare și conturare facială',
    description:
      'Remodelare și conturare facială pentru bărbia dublă, cu beneficii pentru fermitatea, hidratarea și aspectul pielii.',
    metaTitle:
      'Remodelare facială cu CELLBOOSTER Shape în Galați | Facial Harmony Clinic by Dr. Ana',
    metaDescription:
      'Remodelare și conturare facială pentru bărbia dublă cu CELLBOOSTER Shape, în Galați, printr-un protocol personalizat.',
    product: 'Suisselle CELLBOOSTER® Shape',
    intro:
      'Tratamentul cu Suisselle CELLBOOSTER® Shape este destinat remodelării și conturării zonei faciale, în special pentru bărbia dublă, contribuind la îmbunătățirea fermității, hidratării și aspectului pielii.',
    details: [
      'Începem cu o consultație pentru evaluarea zonei și stabilirea protocolului potrivit.',
      'Tratamentul poate fi recomandat pentru zona bărbiei duble și alte zone care necesită remodelare și conturare.',
      'CELLBOOSTER® Shape are o acțiune complexă, nu doar lipolitică, contribuind la hidratarea și fermitatea pielii.',
      'Pentru rezultate progresive, cura intensivă poate include 3 ședințe la interval de 2–3 săptămâni.',
      'Consultația și controlul la 14 zile sunt incluse.',
    ],
    pricing: [
      {
        label: 'CELLBOOSTER® Shape — 1 flacon',
        value: '690 lei / ședință',
      },
      {
        label: 'Pachet 3 ședințe — 1 flacon / ședință',
        value: '1.690 lei',
      },
    ],
  },
  {
    slug: 'mezoterapie',
    title: 'Mezoterapie facială',
    description:
      'Hidratarea și revitalizarea pielii printr-un tratament injectabil personalizat, pentru un aspect mai luminos și uniform.',
    metaTitle:
      'Mezoterapie facială în Galați | Facial Harmony Clinic by Dr. Ana',
    metaDescription:
      'Mezoterapie facială în Galați cu Suisselle CELLBOOSTER® Glow, pentru hidratare, luminozitate și revitalizarea pielii.',
    product: 'Suisselle CELLBOOSTER® Glow',
    intro:
      'Mezoterapia facială cu Suisselle CELLBOOSTER® Glow este un tratament injectabil dedicat hidratării, luminozității și îmbunătățirii aspectului general al pielii.',
    details: [
      'Începem cu o consultație în care evaluăm nevoile pielii și stabilim planul potrivit pentru tine.',
      'Tratamentul utilizează Suisselle CELLBOOSTER® Glow, un skin booster cu acid hialuronic, aminoacizi, vitamine și oligoelemente.',
      'O ședință durează aproximativ 30 de minute, iar roșeața ușoară de după tratament este de obicei trecătoare.',
      'Pentru rezultate progresive, protocolul poate include mai multe ședințe, stabilite individual.',
    ],
    pricing: [
      {
        label: 'Mezoterapie facială — CELLBOOSTER® Glow',
        value: '800 lei față',
      },
      {
        label: 'Mezoterapie facială — CELLBOOSTER® Glow',
        value: '1200 lei față plus gât',
      },
    ],
  },
  {
    slug: 'biorevitalizare',
    title: 'Biorevitalizare facială',
    description:
      'Îmbunătățirea hidratării, luminozității și calității pielii, printr-un protocol injectabil adaptat.',
    metaTitle: 'Biorevitalizare în Galați | Facial Harmony Clinic by Dr. Ana',
    metaDescription:
      'Biorevitalizare facială în Galați cu Suisselle CELLBOOSTER® Lift, pentru hidratare profundă și îmbunătățirea calității pielii.',
    product: 'Suisselle CELLBOOSTER® Lift',
    intro:
      'Biorevitalizarea cu Suisselle CELLBOOSTER® Lift este destinată pielii deshidratate, lipsite de luminozitate sau cu semne ușoare de pierdere a fermității.',
    details: [
      'Consultația inițială ajută la alegerea planului potrivit în funcție de tipul de ten și obiectivul tratamentului.',
      'Tratamentul utilizează Suisselle CELLBOOSTER® Lift, un skin booster cu acid hialuronic, aminoacizi și vitamine.',
      'Ședința durează aproximativ 30 de minute, cu revenire rapidă la activitățile obișnuite.',
      'Rezultatele apar progresiv, iar necesarul de ședințe se stabilește individual.',
    ],
    pricing: [
      {
        label: 'Biorevitalizare facială — CELLBOOSTER® Lift',
        value: '1.000 lei / ședință',
      },
    ],
  },
  {
    slug: 'hiperhidroza',
    title: 'Tratamentul hiperhidrozei',
    description:
      'Reducerea transpirației excesive localizate, printr-un plan medical adaptat zonei tratate.',
    metaTitle:
      'Tratamentul hiperhidrozei în Galați | Facial Harmony Clinic by Dr. Ana',
    metaDescription:
      'Tratamentul hiperhidrozei axilare în Galați, pentru reducerea transpirației excesive printr-un protocol personalizat.',
    intro:
      'Hiperhidroza poate afecta confortul de zi cu zi și încrederea în sine. Tratamentul cu toxină botulinică poate reduce temporar activitatea glandelor sudoripare din zona tratată.',
    details: [
      'Începem cu o evaluare medicală pentru a stabili dacă tratamentul este potrivit.',
      'Tratamentul prezentat este destinat hiperhidrozei axilare bilaterale.',
      'Procedura constă în microinjecții superficiale și durează, de regulă, aproximativ 30 de minute.',
      'Efectul este temporar, iar răspunsul la tratament diferă de la o persoană la alta.',
    ],
    pricing: [
      {
        label: 'Hiperhidroză axilară bilaterală',
        value: '1.800 lei',
      },
    ],
  },
];

export const values: Value[] = [
  { title: 'Ascultare', description: 'Începem cu ceea ce îți dorești.' },
  { title: 'Precizie', description: 'Explic fiecare decizie medicală.' },
  { title: 'Naturalețe', description: 'Îți păstrezi expresivitatea.' },
  { title: 'Încredere', description: 'Rămân alături de tine și după.' },
];

export const testimonials: Testimonial[] = [
  {
    quote: 'Un medic foarte competent și empatic, recomand din suflet dr. Ana!',
    author: 'Mia D.',
    source: 'Facebook',
  },
  {
    quote:
      'Doamna dr. Ana mi-a explicat cu răbdare fiecare etapă și mi-a răspuns la toate întrebările. Am apreciat atenția la detalii și felul în care m-a făcut să mă simt în largul meu.',
  },
  {
    quote: 'Recomand din suflet, o doamnă doctor minunată și foarte dedicată!',
    author: 'Andreea M.',
    source: 'Facebook',
  },
  {
    quote:
      'O experiență plăcută, de la consultație până la recomandările de după procedură. Doamna dr. Ana a ascultat ce îmi doream și mi-a explicat ce mi se potrivește. M-am simțit ascultată și bine îngrijită.',
  },
  {
    quote:
      'Frumusețea înseamnă armonie, iar lucrările doamnei doctor sunt minunate!',
    author: 'Nadia G.',
    source: 'Facebook',
  },
];

export const appointmentOptions = [
  'Consultație generală',
  'Biorevitalizare',
  'Augmentarea buzelor',
  'Toxina botulinică',
  'Mezoterapie',
];

export const company = {
  legalName: 'AXIS CLINIC BY DR ANA SRL',
  vatId: 'CUI 55372109',
  location: 'Galați, România',
};

export const footer = {
  copyright: '© 2026 Facial Harmony Clinic by Dr. Ana',
  backToTopLabel: 'Înapoi sus',
  legalName: company.legalName,
  vatId: company.vatId,
  location: company.location,
};
