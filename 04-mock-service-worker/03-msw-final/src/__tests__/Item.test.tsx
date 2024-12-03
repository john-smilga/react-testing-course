import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { type Post } from '../hooks/usePosts';
import Item from '../components/Item';

const mockOnLike = vi.fn();
const mockOnDelete = vi.fn();

const mockPost: Post = {
  id: '1',
  title: 'testing library',
  likes: 5,
};

describe('Item Component', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
    render(
      <Item post={mockPost} onLike={mockOnLike} onDelete={mockOnDelete} />
    );
  });

  test('renders post title correctly', () => {
    expect(screen.getByText('testing library')).toBeInTheDocument();
  });
  test('displays correct number of likes', () => {
    expect(screen.getByText(`👍 ${mockPost.likes}`)).toBeInTheDocument();
  });
  test('calls onLike when like button is clicked', async () => {
    const likeButton = screen.getByRole('button', {
      name: `👍 ${mockPost.likes}`,
    });
    await user.click(likeButton);
    expect(mockOnLike).toHaveBeenCalledTimes(1);
    expect(mockOnLike).toHaveBeenCalledWith(mockPost.id);
  });
  test('calls onDelete when delete button is clicked', async () => {
    const deleteButton = screen.getByRole('button', {
      name: /delete/i,
    });
    await user.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockPost.id);
  });
});
