# MSW Starter

## JSON Server

[JSON Server](https://www.npmjs.com/package/json-server)

```bash
npm install json-server

```

create a db.json file

db.json

```json
"posts": [
    {
      "id": "1",
      "title": "testing library",
      "likes": 10
    },
    {
      "id": "2",
      "title": "node ts course",
      "likes": 8
    }
  ]
```

default port is 3000

```bash
npx json-server db.json --port 4000
```

package.json

```json
"scripts": {
  "server": "json-server db.json --port 4000"
}
```

`http://localhost:4000/posts`

GET /posts
GET /posts/:id
POST /posts
PUT /posts/:id
PATCH /posts/:id
DELETE /posts/:id

## Rest Client Extension

- install the extension
- create a new posts.http file

posts.http

```
### Get all posts

GET http://localhost:4000/posts

### Get a single post

GET http://localhost:4000/posts/1

### Create a post

POST http://localhost:4000/posts
content-type: application/json

{
  "title": "new post",
  "likes": 0
}

### Update a post

PUT http://localhost:4000/posts/1
content-type: application/json

{
  "title": "updated post"
}

### Delete a post

DELETE http://localhost:4000/posts/1

```

## usePosts Hook

- install axios

```bash
npm install axios
```

src/hooks/usePosts.ts

```ts
import { useState } from 'react';
import axios from 'axios';

export type Post = {
  id: string;
  title: string;
  likes: number;
};

export type PostWithoutId = Omit<Post, 'id'>;

const API_URL = 'http://localhost:4000/posts';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>('');

  const fetchPosts = async (): Promise<void> => {
    try {
      const { data } = await axios.get<Post[]>(API_URL);
      setPosts(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch posts');
    }
  };

  const handleCreatePost = async (postData: PostWithoutId): Promise<void> => {
    try {
      await axios.post(API_URL, {
        ...postData,
      });
      await fetchPosts();
      setError('');
    } catch (err) {
      setError('Failed to create post');
    }
  };

  const handleLike = async (postId: string): Promise<void> => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) {
        setError('Post not found');
        return;
      }
      await axios.put(`${API_URL}/${postId}`, {
        ...post,
        likes: post.likes + 1,
      });
      await fetchPosts();
      setError('');
    } catch (err) {
      setError('Failed to like post');
    }
  };

  const handleDelete = async (postId: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${postId}`);
      await fetchPosts();
      setError('');
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  return {
    posts,
    error,
    fetchPosts,
    handleCreatePost,
    handleLike,
    handleDelete,
  };
};
```

## Components

create components folder

- Form.tsx
- List.tsx
- Item.tsx

src/components/Form.tsx

```tsx
const Form = () => {
  return <div>Form</div>;
};
export default Form;
```

src/App.tsx

```tsx
import { useEffect } from 'react';
import Form from './components/Form';
import List from './components/List';
import { usePosts } from './hooks/usePosts';

function App() {
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
}

export default App;
```

## Form Component

src/components/Form/Form.tsx

```tsx
import { useState, FormEvent, ChangeEvent } from 'react';

type FormProps = {
  onSubmit: (data: { title: string; likes: number }) => Promise<void>;
};

function Form({ onSubmit }: FormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ title, likes: 0 });
    setTitle('');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className='mb-8'>
      <label htmlFor='title' className='sr-only'>
        Title
      </label>
      <input
        id='title'
        type='text'
        value={title}
        onChange={handleChange}
        placeholder='Enter post title'
        className='p-2 border rounded mr-2 w-64'
        required
      />
      <button
        type='submit'
        className='px-4 py-2 bg-teal-500 text-white rounded'
      >
        Add Post
      </button>
    </form>
  );
}

export default Form;
```

## List Component

src/components/List.tsx

```tsx
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
```

## Item Component

src/components/Item.tsx

```tsx

```
