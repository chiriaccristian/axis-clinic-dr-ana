import { render, screen } from '@testing-library/react';
import { ProcedureCard } from './procedure-card';
import { SectionLabel } from './section-label';

describe('ProcedureCard', () => {
  it('renders the procedure content', () => {
    render(
      <ProcedureCard
        title="Rinoplastie"
        description="Proporții naturale."
        action="Detalii procedură"
      />,
    );

    expect(screen.getByRole('heading', { name: 'Rinoplastie' })).toBeTruthy();
    expect(screen.getByText('Detalii procedură')).toBeTruthy();
  });

  it('uses the wine background when featured', () => {
    const { container } = render(
      <ProcedureCard
        title="Blefaroplastie"
        description="O privire odihnită."
        action="Detalii"
        featured
      />,
    );

    expect(container.querySelector('article')?.className).toContain('bg-wine');
  });
});

describe('SectionLabel', () => {
  it('renders the ordinal marker', () => {
    render(<SectionLabel index="03">Abordarea mea</SectionLabel>);

    expect(screen.getByText('03')).toBeTruthy();
    expect(screen.getByText(/Abordarea mea/)).toBeTruthy();
  });
});
