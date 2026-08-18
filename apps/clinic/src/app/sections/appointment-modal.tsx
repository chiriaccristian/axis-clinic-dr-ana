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
import { appointmentOptions } from '../../content/site-content';

export interface AppointmentModalProps {
  onClose: () => void;
}

export function AppointmentModal({ onClose }: AppointmentModalProps) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <Modal onClose={onClose}>
      {sent ? (
        <SuccessMessage
          title="Mulțumesc."
          description="Am primit solicitarea ta. Te vom contacta în cel mai scurt timp."
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
            <TextField label="Nume complet" required placeholder="Numele tău" />
            <TextField
              label="Adresă de email"
              required
              type="email"
              placeholder="email@exemplu.ro"
            />
            <SelectField label="Cu ce te pot ajuta?" required defaultValue="">
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
