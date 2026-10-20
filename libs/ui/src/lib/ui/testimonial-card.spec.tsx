import { render, screen } from '@testing-library/react';
import { TestimonialCard } from './testimonial-card';

describe('TestimonialCard', () => {
  it('renders the quote with author and source', () => {
    render(
      <TestimonialCard
        quote="O experiență foarte plăcută."
        author="Ioana P."
        source="Facebook"
      />,
    );

    expect(screen.getByText('O experiență foarte plăcută.')).toBeTruthy();
    expect(screen.getByText(/Ioana P\./)).toBeTruthy();
    expect(screen.getByText(/Facebook/)).toBeTruthy();
  });

  it('omits the source when missing', () => {
    render(<TestimonialCard quote="Recomand." author="Pacientă" />);

    expect(screen.queryByText(/·/)).toBeNull();
  });
});
