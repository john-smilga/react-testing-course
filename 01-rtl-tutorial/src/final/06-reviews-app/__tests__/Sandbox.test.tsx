import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sandbox from '../Sandbox';
import { getFormElements } from './Form.test.tsx';

describe('Reviews App', () => {
  // Basic rendering test
  test('renders Reviews App title', () => {
    render(<Sandbox />);
    expect(screen.getByText(/reviews app/i)).toBeInTheDocument();
  });

  // Integration test for adding a review
  test('adds a new review when form is submitted', async () => {
    const user = userEvent.setup();
    render(<Sandbox />);

    // Get form elements
    const { emailInput, ratingSelect, textArea, submitButton } =
      getFormElements();

    // Fill out the form
    await user.type(emailInput, 'test@example.com');
    await user.selectOptions(ratingSelect, '5');
    await user.type(textArea, 'Great product!');

    // Submit the form
    await user.click(submitButton);

    // Verify the review appears in the list
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Great product!')).toBeInTheDocument();
    expect(screen.getByText('⭐'.repeat(5))).toBeInTheDocument();
  });
  test('alternative - adds a new review when form is submitted', async () => {
    const user = userEvent.setup();
    render(<Sandbox />);

    const reviews = screen.queryAllByRole('article');
    expect(reviews).toHaveLength(0);
    // Get form elements
    const { emailInput, ratingSelect, textArea, submitButton } =
      getFormElements();

    // Fill out and submit form
    await user.type(emailInput, 'test@example.com');
    await user.selectOptions(ratingSelect, '5');
    await user.type(textArea, 'Great product!');
    await user.click(submitButton);

    // Verify one new review was added
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });
});
