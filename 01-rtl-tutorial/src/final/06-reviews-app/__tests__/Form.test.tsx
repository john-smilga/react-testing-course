import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewForm from '../Form';

beforeEach(() => {
  render(<ReviewForm />);
});

const getFormElements = () => ({
  emailInput: screen.getByRole('textbox', { name: /email/i }),
  ratingSelect: screen.getByRole('combobox', { name: /rating/i }),
  reviewInput: screen.getByRole('textbox', { name: /your review/i }),
  submitButton: screen.getByRole('button', { name: /submit review/i }),
});

describe('ReviewForm', () => {
  test('renders all form elements', () => {
    const elements = getFormElements();

    expect(elements.emailInput).toHaveValue('');
    expect(elements.ratingSelect).toHaveValue('');
    expect(elements.reviewInput).toHaveValue('');
    expect(elements.submitButton).toBeInTheDocument();
  });
  test('ensures all inputs have required attribute', () => {
    const elements = getFormElements();

    expect(elements.emailInput).toHaveAttribute('required');
    expect(elements.ratingSelect).toHaveAttribute('required');
    expect(elements.reviewInput).toHaveAttribute('required');
  });
  test('allows typing in all input fields', async () => {
    const user = userEvent.setup();
    const { emailInput, ratingSelect, reviewInput } = getFormElements();

    await user.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');

    await user.selectOptions(ratingSelect, '4');
    expect(ratingSelect).toHaveValue('4');

    await user.type(reviewInput, 'Great product!');
    expect(reviewInput).toHaveValue('Great product!');
  });

  test('shows validation error for review text that is less than 10 characters', async () => {
    const user = userEvent.setup();
    const elements = getFormElements();

    expect(
      screen.queryByText(/review must be at least 10 characters long/i)
    ).not.toBeInTheDocument();

    await user.type(elements.emailInput, 'test@example.com');
    await user.selectOptions(elements.ratingSelect, '4');
    await user.type(elements.reviewInput, 'Short');
    await user.click(elements.submitButton);
    expect(
      screen.getByText(/review must be at least 10 characters long/i)
    ).toBeInTheDocument();
  });

  test('successfully submits form with valid data', async () => {
    const user = userEvent.setup();
    const { emailInput, ratingSelect, reviewInput, submitButton } =
      getFormElements();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();

    await user.type(emailInput, 'test@example.com');
    await user.selectOptions(ratingSelect, '5');
    await user.type(reviewInput, 'This is a great product review');
    await user.click(submitButton);

    // Form should be cleared after successful submission
    expect(emailInput).toHaveValue('');
    expect(ratingSelect).toHaveValue('');
    expect(reviewInput).toHaveValue('');

    // Review should be displayed in the list
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });
});
