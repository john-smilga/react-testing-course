import { render, screen } from '@testing-library/react';
import List from '../List';
import { Review } from '../Form';

const mockReviews: Review[] = [
  {
    email: 'test@example.com',
    rating: '5',
    text: 'Great product!',
  },
  {
    email: 'user@example.com',
    rating: '4',
    text: 'Pretty good',
  },
];

describe('List Component', () => {
  test('renders "No reviews yet" when reviews array is empty', () => {
    render(<List reviews={[]} />);
    expect(screen.getByText('No reviews yet')).toBeInTheDocument();
  });

  test('renders reviews when provided', () => {
    render(<List reviews={mockReviews} />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Great product!')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByText('Pretty good')).toBeInTheDocument();
  });

  test('renders correct number of stars based on rating', () => {
    render(<List reviews={mockReviews} />);

    const stars = screen.getAllByText('⭐'.repeat(5));
    expect(stars[0]).toBeInTheDocument();

    const fourStars = screen.getAllByText('⭐'.repeat(4));
    expect(fourStars[0]).toBeInTheDocument();
  });

  test('renders the reviews heading', () => {
    render(<List reviews={mockReviews} />);
    expect(screen.getByText('Reviews')).toBeInTheDocument();
  });
});
