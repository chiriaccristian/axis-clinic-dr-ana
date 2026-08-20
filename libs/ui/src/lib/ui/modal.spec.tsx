import { fireEvent, render, screen } from '@testing-library/react';
import { Modal } from './modal';
import { TextField } from './form-field';

describe('Modal', () => {
  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose} label="Solicitare">
        <TextField label="Nume" />
      </Modal>,
    );

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('exposes an accessible name', () => {
    render(
      <Modal onClose={() => undefined} label="Solicitare">
        <TextField label="Nume" />
      </Modal>,
    );

    expect(screen.getByRole('dialog', { name: 'Solicitare' })).toBeTruthy();
  });
});

describe('TextField', () => {
  it('links the label to the input', () => {
    render(<TextField label="Nume complet" />);

    expect(screen.getByLabelText('Nume complet')).toBeTruthy();
  });
});
