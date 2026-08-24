export interface Procedure {
  number?: string;
  slug: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  details: string[];
}

export interface Value {
  title: string;
  description: string;
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
  instagram: 'https://www.instagram.com/facial_harmony_by_dr_ana?igsh=MWwxNmFqbzF6ZnFqcw%3D%3D&utm_source=qr',
};

export function whatsappHref(message: string) {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { id: 'despre', label: 'Despre Dr. Ana' },
  { id: 'servicii', label: 'Proceduri' },
  { id: 'filozofie', label: 'Abordare' },
  { id: 'contact', label: 'Contact' },
];

export const procedures: Procedure[] = [
  {
    slug: 'mezoterapie',
    title: 'Mezoterapie',
    description:
      'Îmbunătățirea hidratării și revitalizarea pielii printr-un tratament personalizat, pentru un aspect mai luminos și uniform.',
    metaTitle:
      'Mezoterapie facială în Galați | Facial Harmony Clinic by Dr. Ana',
    metaDescription:
      'Mezoterapie facială în Galați: cocktail de vitamine și acid hialuronic pentru un ten mai luminos, mai uniform și mai bine hidratat.',
    intro:
      'Mezoterapia livrează direct în piele vitamine, aminoacizi și acid hialuronic, pentru un ten mai uniform, mai luminos și mai bine hidratat.',
    details: [
      'Stabilim compoziția cocktailului în funcție de nevoile pielii tale.',
      'Aplicarea se face cu microinjecții superficiale, pe toată suprafața tratată.',
      'O ședință durează aproximativ 30 de minute, cu roșeață trecătoare după tratament.',
      'Protocolul obișnuit include 4 ședințe la interval de 2–3 săptămâni.',
    ],
  },
  {
    slug: 'biorevitalizare',
    title: 'Biorevitalizare',
    description:
      'Redarea luminozității și hidratării pielii, pentru un aspect proaspăt și natural.',
    metaTitle: 'Biorevitalizare în Galați | Facial Harmony Clinic by Dr. Ana',
    metaDescription:
      'Biorevitalizare facială în Galați cu Dr. Ana: hidratare profundă și luminozitate redată pielii, printr-un protocol personalizat.',
    intro:
      'Biorevitalizarea redă pielii hidratarea și luminozitatea pierdute, printr-un protocol adaptat tipului tău de ten și vârstei pielii.',
    details: [
      'Consultație inițială în care evaluăm calitatea pielii, gradul de deshidratare și obiceiurile de îngrijire.',
      'Protocol cu substanțe injectabile pe bază de acid hialuronic nereticulat, aplicate în straturile superficiale ale pielii.',
      'Ședința durează aproximativ 30 de minute, cu revenire rapidă la activitățile obișnuite.',
      'Rezultatele se acumulează după 2–3 ședințe și se mențin prin cure de întreținere.',
    ],
  },
  {
    slug: 'toxina-botulinica',
    title: 'Toxina botulinică',
    description:
      'Estomparea ridurilor de expresie și păstrarea unui aspect relaxat, natural și echilibrat.',
    metaTitle:
      'Toxină botulinică (botox) în Galați | Facial Harmony Clinic by Dr. Ana',
    metaDescription:
      'Tratament cu toxină botulinică în Galați pentru ridurile de expresie, cu doze calculate ca privirea să rămână naturală.',
    intro:
      'Tratamentul cu toxină botulinică estompează ridurile de expresie păstrând mimica: dozele sunt calculate pe mușchii tăi, nu pe o schemă standard.',
    details: [
      'Evaluăm dinamica musculară a feței și zonele care îți creează disconfort.',
      'Aplicăm doze individualizate în zona frunții, glabelei sau a ridurilor periorbitale.',
      'Procedura durează 15–20 de minute și nu necesită perioadă de recuperare.',
      'Efectul se instalează în 3–7 zile și se menține aproximativ 4–6 luni.',
    ],
  },
  {
    slug: 'augmentarea-buzelor',
    title: 'Augmentarea buzelor',
    description:
      'Contur și volum armonios, adaptate proporțiilor feței pentru un rezultat natural.',
    metaTitle: 'Augmentarea buzelor cu acid hialuronic în Galați | Dr. Ana',
    metaDescription:
      'Augmentarea buzelor în Galați cu acid hialuronic: contur definit și volum echilibrat, adaptate proporțiilor feței tale.',
    intro:
      'Augmentarea buzelor cu acid hialuronic urmărește proporțiile feței tale, nu un model impus: contur clar, volum echilibrat, expresivitate păstrată.',
    details: [
      'Discutăm întâi ce te deranjează și ce rezultat îți dorești, apoi stabilim împreună planul.',
      'Folosim produse reticulate, alese în funcție de structura buzelor și de rezultatul dorit.',
      'Disconfortul este redus prin anestezie topică; ședința durează aproximativ 45 de minute.',
      'Edemul se resoarbe în 3–7 zile, iar rezultatul se menține în general 8–12 luni.',
    ],
  },
  {
    slug: 'hiperhidroza',
    title: 'Tratamentul hiperhidrozei',
    description:
      'Reducerea transpirației excesive localizate, printr-un plan adaptat zonei tratate și nevoilor tale.',
    metaTitle:
      'Tratamentul hiperhidrozei în Galați | Facial Harmony Clinic by Dr. Ana',
    metaDescription:
      'Tratamentul hiperhidrozei axilare în Galați cu toxină botulinică, pentru reducerea transpirației excesive printr-un protocol personalizat.',
    intro:
      'Hiperhidroza înseamnă transpirație excesivă, care poate afecta confortul de zi cu zi și încrederea în sine. Toxina botulinică poate reduce temporar activitatea glandelor sudoripare din zona tratată.',
    details: [
      'Începem cu o evaluare medicală pentru a stabili dacă tratamentul este potrivit și pentru a exclude eventuale cauze secundare ale transpirației excesive.',
      'Tratamentul este folosit cel mai frecvent pentru hiperhidroza axilară; alte zone pot fi evaluate individual.',
      'Procedura constă în microinjecții superficiale și durează, de regulă, aproximativ 30 de minute.',
      'Reducerea transpirației apare treptat în zilele următoare, iar efectul este temporar și diferă de la o persoană la alta.',
    ],
  },
];

export const values: Value[] = [
  { title: 'Ascultare', description: 'Începem cu ceea ce îți dorești.' },
  { title: 'Precizie', description: 'Explic fiecare decizie medicală.' },
  { title: 'Naturalețe', description: 'Îți păstrezi expresivitatea.' },
  { title: 'Încredere', description: 'Rămân alături de tine și după.' },
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
  tagline: 'Chirurgie estetică cu intenție și echilibru.',
  backToTopLabel: 'Înapoi sus',
  legalName: company.legalName,
  vatId: company.vatId,
  location: company.location,
};
