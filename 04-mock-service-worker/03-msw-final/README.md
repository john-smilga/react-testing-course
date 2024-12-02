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
import { type Post } from '../hooks/usePosts';

type ItemProps = {
  post: Post;
  onLike: (postId: string) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
};

const Item = ({ post, onLike, onDelete }: ItemProps) => {
  return (
    <article
      key={post.id}
      className='border p-4 rounded flex items-center justify-between'
    >
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
```

## Form Tests

- create `src/__tests__/Form.test.tsx` file

* Import necessary dependencies:

  - @testing-library/react for render and screen
  - vitest for testing utilities (describe, test, expect, vi)
  - @testing-library/user-event for simulating user interactions
  - Form component from your components directory

* Create a getFormElements helper function:

  - Export a function that returns an object
  - Use screen.getByRole to find form elements:
    - Find input using 'textbox' role with name matching /title/i
    - Find submit button using 'button' role with name matching /add post/i

* Set up the basic test structure:

  - Create a describe block for 'Form'
  - Create mock function for onSubmit using vi.fn()
  - Declare userEvent variable

* Create beforeEach setup:

  - Initialize userEvent
  - Clear mock function
  - Render Form component with mock onSubmit prop

* Write test case for initial rendering:

  - Create test block named 'renders correctly'
  - Get form elements using helper function
  - Assert that input has empty value
  - Assert that submit button is in the document

* Write test case for input changes:

  - Create test block named 'updates input value on change'
  - Get input element using helper function
  - Simulate typing 'Test Post' using userEvent
  - Assert that input value matches typed text

* Write test case for form validation:

  - Create test block named 'requires title input before submission'
  - Get submit button using helper function
  - Simulate clicking submit button without input
  - Assert that onSubmit mock was not called

* Write test case for successful form submission:

  - Create test block named 'submits the form with correct data'
  - Get both input and submit button
  - Simulate typing 'Test Post'
  - Simulate clicking submit button
  - Assert that onSubmit was called with correct data object (title and likes)

* Write test case for form reset after submission:
  - Create test block named 'clears input after submission'
  - Get both input and submit button
  - Simulate typing and submitting form
  - Assert that input value is empty after submission

```tsx
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent, { UserEvent } from '@testing-library/user-event';
import Form from '../components/Form';

export const getFormElements = () => ({
  input: screen.getByRole('textbox', { name: /title/i }),
  submitBtn: screen.getByRole('button', { name: /add post/i }),
});

describe('Form', () => {
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
```

## List Tests

- Import necessary dependencies:

  - @testing-library/react for render and screen
  - Post type from hooks/usePosts for typing
  - List component from your components directory

- Define mock data and functions:

  - Create mockPosts array with Post objects, each having id, title, and likes
  - Create mockOnLike and mockOnDelete functions using vi.fn()

- Set up the basic test structure:

  - Create a describe block for 'List Component'

- Write test case for rendering posts:

  - Create test block named 'renders correct number of articles'
  - Render List component with mockPosts, mockOnLike, and mockOnDelete
  - Use screen.getAllByRole to get all articles
  - Assert that the number of articles matches the length of mockPosts

- Write test case for rendering an empty list:
  - Create test block named 'renders empty list when no posts provided'
  - Render List component with an empty posts array, mockOnLike, and mockOnDelete
  - Use screen.queryAllByRole to get all articles
  - Assert that the number of articles is zero

`src/__tests__/List.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import { type Post } from '../hooks/usePosts';
import List from '../components/List';

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Test Post 1',
    likes: 0,
  },
  {
    id: '2',
    title: 'Test Post 2',
    likes: 5,
  },
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
```

## Item Tests

- Import necessary dependencies:

  - @testing-library/react for render and screen
  - @testing-library/user-event for UserEvent type and functionality
  - vitest for testing utilities (describe, test, expect, vi)
  - Item component from components directory
  - Post type from hooks/usePosts

- Define mock data and functions:

  - Create mockPost object with id, title, and likes
  - Create mockOnDelete function using vi.fn()
  - Create mockOnLike function using vi.fn()

- Set up the test structure:

  - Create a describe block for 'Item'
  - Declare UserEvent variable
  - Create beforeEach block to:
    - Setup userEvent
    - Clear all mocks
    - Render Item component with mock props

- Write test case for title rendering:

  - Create test block named 'renders post title correctly'
  - Use screen.getByText to find title text
  - Assert that title is in the document

- Write test case for likes display:

  - Create test block named 'displays correct number of likes'
  - Use screen.getByText to find likes count with emoji
  - Assert that likes count is in the document

- Write test case for like functionality:

  - Create test block named 'calls onLike when like button is clicked'
  - Find like button using getByRole with button role and emoji name
  - Simulate click on like button
  - Assert that onLike was called once with correct post ID

- Write test case for delete functionality:
  - Create test block named 'calls onDelete when delete button is clicked'
  - Find delete button using getByRole with button role
  - Simulate click on delete button
  - Assert that onDelete was called once with correct post ID

`src/__tests__/Item.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import Item from '../components/Item';
import { type Post } from '../hooks/usePosts';

const mockPost: Post = {
  id: '1',
  title: 'testing library',
  likes: 5,
};

const mockOnDelete = vi.fn();
const mockOnLike = vi.fn();

describe('Item', () => {
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
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockPost.id);
  });
});
```
