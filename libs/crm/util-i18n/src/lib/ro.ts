/** Romanian UI text for the CRM. Keys are stable; only the text changes. */
export const ro = {
  'app.name': 'CRM',
  'app.loading': 'Se încarcă…',
  'app.nav.home': 'Acasă',
  'app.nav.users': 'Utilizatori',
  'app.logout': 'Ieșire',
  'app.home.title': 'Bine ai venit, {username}',
  'app.home.body':
    'Programările, pacienții și consultațiile vor apărea aici pe măsură ce le adăugăm.',
  'app.notFound': 'Pagina nu există.',

  'role.super_admin': 'Super admin',
  'role.manager': 'Manager clinică',
  'role.doctor': 'Medic',

  'status.active': 'Activ',
  'status.disabled': 'Dezactivat',

  'login.title': 'Autentificare',
  'login.username': 'Utilizator',
  'login.password': 'Parolă',
  'login.submit': 'Intră în cont',
  'login.submitting': 'Se verifică…',

  'invite.title': 'Creează-ți contul',
  'invite.intro':
    'Alege un nume de utilizator și o parolă. Cu ele te vei autentifica de acum înainte.',
  'invite.username': 'Nume de utilizator',
  'invite.usernameHint':
    'Litere mici, cifre, punct, cratimă sau underscore, 3–32 de caractere.',
  'invite.password': 'Parolă',
  'invite.passwordHint': 'Cel puțin {min} caractere.',
  'invite.confirm': 'Confirmă parola',
  'invite.submit': 'Creează contul',
  'invite.submitting': 'Se creează…',
  'invite.missingToken':
    'Linkul de invitație nu este complet. Deschide din nou linkul primit pe email.',

  'users.title': 'Utilizatori',
  'users.empty': 'Nu există încă utilizatori.',
  'users.col.username': 'Utilizator',
  'users.col.email': 'Email',
  'users.col.role': 'Rol',
  'users.col.tenant': 'Clinică',
  'users.col.status': 'Stare',
  'users.col.lastLogin': 'Ultima autentificare',
  'users.never': 'Niciodată',
  'users.platform': 'Platformă',

  'invitation.title': 'Invită un utilizator',
  'invitation.email': 'Email',
  'invitation.role': 'Rol',
  'invitation.tenant': 'Clinică',
  'invitation.tenantPlaceholder': 'Alege clinica',
  'invitation.submit': 'Trimite invitația',
  'invitation.submitting': 'Se trimite…',
  'invitation.emailed':
    'Invitația a fost trimisă pe email. Linkul e valabil 7 zile.',
  'invitation.notEmailed':
    'Emailul nu a putut fi trimis. Trimite manual linkul de mai jos (valabil 7 zile, o singură folosire):',
  'invitation.copy': 'Copiază linkul',
  'invitation.copied': 'Copiat',

  'tenants.title': 'Clinici',
  'tenants.empty':
    'Nu există încă nicio clinică. Creează una ca să poți invita manageri și medici.',
  'tenants.name': 'Numele clinicii',
  'tenants.submit': 'Adaugă clinica',
  'tenants.created': 'Creată',

  'error.invalid_credentials': 'Utilizator sau parolă greșite.',
  'error.too_many_requests':
    'Prea multe încercări. Așteaptă un minut și încearcă din nou.',
  'error.invalid_username': 'Numele de utilizator nu este valid.',
  'error.weak_password': 'Parola trebuie să aibă cel puțin {min} caractere.',
  'error.password_mismatch': 'Parolele nu coincid.',
  'error.username_taken': 'Numele de utilizator este deja folosit.',
  'error.email_taken': 'Există deja un cont cu acest email.',
  'error.invalid_email': 'Adresa de email nu este validă.',
  'error.tenant_required': 'Alege clinica.',
  'error.invalid_name': 'Completează numele.',
  'error.not_found':
    'Invitația nu mai este valabilă: a expirat sau a fost deja folosită.',
  'error.forbidden': 'Nu ai drepturi pentru această acțiune.',
  'error.unauthenticated': 'Sesiunea a expirat. Autentifică-te din nou.',
  'error.network': 'Nu am putut contacta serverul. Verifică conexiunea.',
  'error.generic': 'A apărut o eroare. Încearcă din nou.',
} as const;
