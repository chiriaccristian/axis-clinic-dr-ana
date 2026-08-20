import { FormEvent, useState } from 'react';
import {
  Button,
  Form,
  Modal,
  ModalHeading,
  ModalText,
  SectionLabel,
  SelectField,
  SuccessMessage,
  TextField,
} from '@org/ui';
import { appointmentOptions, brand } from '../../content/site-content';

export interface AppointmentModalProps {
  onClose: () => void;
}

export function AppointmentModal({ onClose }: AppointmentModalProps) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '');
    const email = String(data.get('email') ?? '');
    const phone = String(data.get('phone') ?? '');
    const procedure = String(data.get('procedure') ?? '');
    const subject = `Solicitare programare — ${name}`;
    const body = [
      `Nume: ${name}`,
      `Email: ${email}`,
      `Telefon: ${phone}`,
      `Procedură: ${procedure}`,
    ].join('\n');

    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <Modal onClose={onClose} label="Solicitare de programare">
      {sent ? (
        <SuccessMessage
          title="Mulțumesc."
          description={`S-a deschis clientul tău de email cu solicitarea completată. Dacă nu se deschide, scrie-mi direct la ${brand.email}.`}
        />
      ) : (
        <>
          <SectionLabel index="Primul pas" />
          <ModalHeading>
            Programează
            <br />
            <em>o conversație.</em>
          </ModalHeading>
          <ModalText>
            Completează formularul, iar echipa mea îți va răspunde în maximum 24
            de ore.
          </ModalText>
          <Form onSubmit={handleSubmit}>
            <TextField
              label="Nume complet"
              name="name"
              required
              placeholder="Numele tău"
            />
            <TextField
              label="Adresă de email"
              name="email"
              required
              type="email"
              placeholder="email@exemplu.ro"
            />
            <TextField
              label="Telefon"
              name="phone"
              type="tel"
              placeholder="07xx xxx xxx"
            />
            <SelectField
              label="Cu ce te pot ajuta?"
              name="procedure"
              required
              defaultValue=""
            >
              <option value="">Alege o procedură</option>
              {appointmentOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </SelectField>
            <Button variant="submit" type="submit">
              Trimite solicitarea
            </Button>
          </Form>
        </>
      )}
    </Modal>
  );
}
