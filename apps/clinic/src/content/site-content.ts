export interface Procedure {
  number?: string;
  title: string;
  description: string;
}

export interface Value {
  title: string;
  description: string;
}

export const brand = {
  name: 'FACIAL HARMONY CLINIC',
  subtitle: 'BY DR. ANA',
  logoSrc: '/logo.svg',
  topbarLeft: 'Facial Harmony Clinic by Dr. Ana · Galați',
  phone: '+40 756 599 985',
  email: 'facial.harmony@drana.ro',
};

export const navLinks = [
  { id: 'despre', label: 'Despre Dr. Ana' },
  { id: 'servicii', label: 'Proceduri' },
  { id: 'filozofie', label: 'Abordare' },
  { id: 'contact', label: 'Contact' },
];

export const procedures: Procedure[] = [
  {
    title: 'Biorevitalizare',
    description:
      'Redarea luminozității și hidratării pielii, pentru un aspect proaspăt și natural.',
  },
  {
    title: 'Augmentarea buzelor',
    description:
      'Contur și volum armonios, adaptate proporțiilor feței pentru un rezultat natural.',
  },
  {
    title: 'Toxina botulinică',
    description:
      'Estomparea ridurilor de expresie și păstrarea unui aspect relaxat, natural și echilibrat.',
  },
  {
    title: 'Mezoterapie',
    description:
      'Îmbunătățirea hidratării și revitalizarea pielii printr-un tratament personalizat, pentru un aspect mai luminos și uniform.',
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
  'Rinoplastie',
  'Blefaroplastie',
  'Chirurgie facială',
];

export const footer = {
  copyright: '© 2026 Facial Harmony Clinic by Dr. Ana',
  tagline: 'Chirurgie estetică cu intenție și echilibru.',
  backToTopLabel: 'Înapoi sus',
};
