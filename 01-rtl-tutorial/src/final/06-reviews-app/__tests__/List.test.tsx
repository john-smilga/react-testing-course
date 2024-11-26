import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import List from '../List';
import { Review } from '../Sandbox';

const mockReviews: Review[] = [
  {
    email: 'test@example.com',
    rating: '4',
    text: 'Great product!',
  },
  {
    email: 'user@example.com',
    rating: '5',
    text: 'Excellent service',
  },
];

describe('List Component', () => {
  test('displays "No reviews yet" when reviews array is empty', () => {
    render(<List reviews={[]} />);
    expect(screen.getByText('No reviews yet')).toBeInTheDocument();
  });

  test('renders reviews correctly when provided', () => {
    render(<List reviews={mockReviews} />);

    // Check if reviews header is present
    expect(screen.getByText('Reviews')).toBeInTheDocument();

    // Check if both reviews are rendered
    mockReviews.forEach((review) => {
      expect(screen.getByText(review.email)).toBeInTheDocument();
      expect(screen.getByText(review.text)).toBeInTheDocument();
      // Check if stars are rendered
      const stars = '⭐'.repeat(Number(review.rating));
      expect(screen.getByText(stars)).toBeInTheDocument();
    });
  });
});
