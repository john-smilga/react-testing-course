import { useEffect } from 'react';
import Form from './components/Form';
import List from './components/List';
import { usePosts } from './hooks/usePosts';

const App = () => {
  const {
    posts,
    error,
    fetchPosts,
    handleCreatePost,
    handleLike,
    handleDelete,
  } = usePosts();
  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div className='max-w-3xl mx-auto mt-10 p-4'>
      <h1 className='text-2xl font-bold mb-4'>Posts Manager</h1>
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      <Form onSubmit={handleCreatePost} />
      <List posts={posts} onLike={handleLike} onDelete={handleDelete} />
    </div>
  );
};
export default App;
