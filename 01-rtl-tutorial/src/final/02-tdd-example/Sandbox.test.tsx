import { render, screen } from '@testing-library/react';
import Sandbox from './Sandbox';

describe('02-tdd-example', () => {
  test('should render header', () => {
    render(<Sandbox />);
    const heading = screen.getByText(/testing/i);
    expect(heading).toBeInTheDocument();
  });
});
