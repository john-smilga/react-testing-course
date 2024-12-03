import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import Form from '../components/Form';

export const getFormElements = () => {
  return {
    input: screen.getByRole('textbox', { name: /title/i }),
    submitBtn: screen.getByRole('button', { name: /add post/i }),
  };
};

describe('Form Component', () => {
  const mockOnSubmit = vi.fn();
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
    mockOnSubmit.mockClear();
    render(<Form onSubmit={mockOnSubmit} />);
  });
  test('renders correctly', () => {
    const { input, submitBtn } = getFormElements();
    expect(input).toHaveValue('');
    expect(submitBtn).toBeInTheDocument();
  });
  test('updates input value on change', async () => {
    const { input } = getFormElements();
    await user.type(input, 'Test Post');
    expect(input).toHaveValue('Test Post');
  });
  test('requires title input before submission', async () => {
    const { submitBtn } = getFormElements();
    await user.click(submitBtn);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  test('submits the form with correct data', async () => {
    const { input, submitBtn } = getFormElements();
    await user.type(input, 'Test Post');
    await user.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Post',
      likes: 0,
    });
  });
  test('clears input after submission', async () => {
    const { input, submitBtn } = getFormElements();
    await user.type(input, 'Test Post');
    await user.click(submitBtn);
    expect(input).toHaveValue('');
  });
});
