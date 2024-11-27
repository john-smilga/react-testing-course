import { describe, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ItemCard from '../components/ItemCard';
import { type Item } from '../utils';

type MockProps = Item & { onDelete: () => void };

describe('ItemCard', () => {
  const mockProps: MockProps = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    category: 'urgent',
    onDelete: vi.fn(),
  };

  test('renders card with correct content', () => {
    render(<ItemCard {...mockProps} />);

    expect(
      screen.getByRole('heading', { name: 'Test Task' })
    ).toBeInTheDocument();
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
  });

  test('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<ItemCard {...mockProps} />);

    const deleteButton = screen.getByRole('button', {
      name: 'Delete task: 1',
    });
    await user.click(deleteButton);

    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });
});
