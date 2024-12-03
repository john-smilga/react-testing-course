import { render, screen } from '@testing-library/react';
import { type Post } from '../hooks/usePosts';
import List from '../components/List';

const mockPosts: Post[] = [
  { id: '1', title: 'Test Post 1', likes: 0 },
  { id: '2', title: 'Test Post 2', likes: 5 },
];

const mockOnLike = vi.fn();
const mockOnDelete = vi.fn();

describe('List Component', () => {
  test('renders correct number of articles', () => {
    render(
      <List posts={mockPosts} onLike={mockOnLike} onDelete={mockOnDelete} />
    );
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(2);
  });
  test('renders empty list when no posts provided', () => {
    render(<List posts={[]} onLike={mockOnLike} onDelete={mockOnDelete} />);
    const articles = screen.queryAllByRole('article');
    expect(articles).toHaveLength(0);
  });
});
