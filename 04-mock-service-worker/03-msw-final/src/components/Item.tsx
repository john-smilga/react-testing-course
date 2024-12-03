import { type Post } from '../hooks/usePosts';

type ItemProps = {
  post: Post;
  onLike: (postId: string) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
};

const Item = ({ post, onLike, onDelete }: ItemProps) => {
  return (
    <article className='border p-4 rounded flex items-center justify-between'>
      <h3 className='text-lg'>{post.title}</h3>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => onLike(post.id)}
            className='px-3 py-1 bg-teal-500 text-white rounded'
          >
            👍 {post.likes}
          </button>
        </div>
        <button
          onClick={() => onDelete(post.id)}
          className='px-3 py-1 bg-gray-700 text-white rounded'
        >
          Delete
        </button>
      </div>
    </article>
  );
};
export default Item;
