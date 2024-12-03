import Item from './Item';
import { type Post } from '../hooks/usePosts';

type ListProps = {
  posts: Post[];
  onLike: (postId: string) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
};

const List = ({ posts, onLike, onDelete }: ListProps) => {
  return (
    <div className='space-y-4'>
      {posts.map((post) => {
        return (
          <Item key={post.id} post={post} onLike={onLike} onDelete={onDelete} />
        );
      })}
    </div>
  );
};
export default List;
