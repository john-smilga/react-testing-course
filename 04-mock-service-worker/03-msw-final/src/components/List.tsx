import { type Post } from '../hooks/usePosts';
import Item from './Item';

type ListProps = {
  posts: Post[];
  onLike: (postId: string) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
};

function List({ posts, onLike, onDelete }: ListProps) {
  return (
    <div className='space-y-4'>
      {posts.map((post) => (
        <Item key={post.id} post={post} onLike={onLike} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default List;
