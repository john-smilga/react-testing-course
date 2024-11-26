import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import ReviewForm from '../Form';

export const getFormElements = () => {
  const emailInput = screen.getByRole('textbox', { name: /email/i });
  const ratingSelect = screen.getByRole('combobox', { name: /rating/i });
  const textArea = screen.getByRole('textbox', { name: /your review/i });
  const submitButton = screen.getByRole('button', { name: /submit review/i });

  return {
    emailInput,
    ratingSelect,
    textArea,
    submitButton,
  };
};

describe('ReviewForm', () => {
  // Creates a mock function that will simulate the form submission handler
  const mockOnSubmit = vi.fn();

  // Before each test runs:
  beforeEach(() => {
    // Clear all information about how the mock was called
    // This ensures each test starts with a fresh mock function
    // without any previous calls recorded
    mockOnSubmit.mockClear();
  });

  test('renders form elements correctly', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);
    const { emailInput, ratingSelect, textArea, submitButton } =
      getFormElements();
    expect(emailInput).toHaveValue('');
    expect(ratingSelect).toHaveValue('');
    expect(textArea).toHaveValue('');
    expect(submitButton).toBeInTheDocument();
  });

  test('shows error message when review is too short', async () => {
    const user = userEvent.setup();
    render(<ReviewForm onSubmit={mockOnSubmit} />);

    // since inputs have html required attribute, all of them need to be filled, in order test short review error

    const { emailInput, ratingSelect, textArea, submitButton } =
      getFormElements();

    await user.type(emailInput, 'test@example.com');
    await user.selectOptions(ratingSelect, '5');
    await user.type(textArea, 'Short');
    await user.click(submitButton);

    expect(
      screen.getByText(/review must be at least 10 characters long/i)
    ).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<ReviewForm onSubmit={mockOnSubmit} />);

    const { emailInput, ratingSelect, textArea, submitButton } =
      getFormElements();

    await user.type(emailInput, 'test@example.com');
    await user.selectOptions(ratingSelect, '5');
    await user.type(
      textArea,
      'This is a valid review text that is long enough'
    );
    await user.click(submitButton);

    // We can validate the form submission because mockOnSubmit is a mock function (vi.fn())
    // that keeps track of all calls made to it. This allows us to verify:
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      rating: '5',
      text: 'This is a valid review text that is long enough',
    });

    // Check if form is reset after submission
    expect(emailInput).toHaveValue('');
    expect(ratingSelect).toHaveValue('');
    expect(textArea).toHaveValue('');
  });
});
