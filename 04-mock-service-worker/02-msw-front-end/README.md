# Mock Service Worker

Let's continue our journey by building a posts manager app where we'll not only test our current knowledge but also learn how to use Mock Service Worker to mock our API requests. Yes, this project will include HTTP requests!

For the core functionality, we'll create a form to create posts, a list to display them, and each post will have like and delete buttons.

This project has two starting points, so let's discuss the options:

1. If you want to build the entire project from scratch, including the front-end, start with the `01-starter` folder.
2. If you're only interested in the testing challenges and Mock Service Worker implementation, use the `02-front-end` folder which comes with the front-end already implemented.

I recommend watching the setup videos to understand how to configure the server for HTTP requests, though you can always adjust the video speed to skip familiar content.

The `03-final` folder contains the complete project with Mock Service Worker implemented, which you can use as a reference. Now that we understand our options, let's begin - I'll be starting with the `01-starter` folder.

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

And once we have a working application, let's work on our tests.
If you did not build the project from scratch, please get a hold of the `02-front-end` folder and run:

- `npm install` to install dependencies
- `npm run server` to start the JSON Server
- `npm run dev` to start the React application

Also, this is a good opportunity to practice your current knowledge. Below you can find a list of steps that you can follow to create the tests for all three components. Form, List and Item. If you are interested in such challenge, pause the video and give it a try.

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

## Mock Service Worker

```bash
npm install msw@latest --save-dev
```

- create `src/mocks/handlers.ts` file
- create `src/mocks/server.ts` file

src/mocks/handlers.ts

```ts
// Import necessary utilities from MSW and our Post type
import { http, HttpResponse } from 'msw';
import { Post } from '../hooks/usePosts';

// Define the API endpoint we want to mock
const url = 'http://localhost:4000/posts';

// Create mock data that will be used as our "database"
export let posts: Post[] = [
  {
    id: '1',
    title: 'First Post',
    likes: 5,
  },
  {
    id: '2',
    title: 'Second Post',
    likes: 10,
  },
];

// Define request handlers for MSW
export const handlers = [
  // Mock the GET /posts endpoint
  // When a request is made to this URL, return our mock posts data
  http.get(url, async () => {
    return HttpResponse.json(posts);
  }),
];
```

src/mocks/server.ts

```ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

const server = setupServer(...handlers);

export default server;
```

- add `src/vitest.setup.ts` file

```ts
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import server from './mocks/server';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// Start worker before all tests
beforeAll(() => {
  server.listen();
});

//  Close worker after all tests
afterAll(() => {
  server.close();
});

// Reset handlers after each test `important for test isolation`
afterEach(() => {
  server.resetHandlers();
});
```

- create `src/App.test.tsx` file

```tsx
import { render, screen, within } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { getFormElements } from './__tests__/Form.test';
import { posts } from './mocks/handlers';
import server from './mocks/server';

describe('App', () => {
  test('renders the App component', () => {
    render(<App />);
    expect(screen.getByText(/posts manager/i)).toBeInTheDocument();
  });
  test('fetches posts on mount', async () => {
    render(<App />);
    expect(await screen.findByText(/first post/i)).toBeInTheDocument();
    expect(await screen.findByText(/second post/i)).toBeInTheDocument();
    // expect(await screen.findByText(/third post/i)).toBeInTheDocument();
  });
});
```

src/hooks/usePosts.ts

if you don't believe me that the data is fetched from the mock, you can check the console log in the `usePosts` hook

```ts
const { data } = await axios.get<Post[]>(API_URL);
// console.log(data);
```

## Rest of the handlers

src/mocks/handlers.ts

```ts
import { http, HttpResponse } from 'msw';
import { Post } from '../hooks/usePosts';
const url = 'http://localhost:4000/posts';

export let posts: Post[] = [
  {
    id: '1',
    title: 'First Post',
    likes: 5,
  },
  {
    id: '2',
    title: 'Second Post',
    likes: 10,
  },
];

export const handlers = [
  http.get(url, async () => {
    return HttpResponse.json(posts);
  }),
  http.post(url, async ({ request }) => {
    const newPost = (await request.json()) as Post;
    newPost.id = Date.now().toString();
    posts.push(newPost);
    return HttpResponse.json(newPost, { status: 201 });
  }),
  http.put(`${url}/:id`, async ({ params, request }) => {
    const { id } = params;
    const updatedPost = (await request.json()) as Post;
    const index = posts.findIndex((post) => post.id === id);
    posts[index] = updatedPost;
    return HttpResponse.json(updatedPost, { status: 200 });
  }),
  http.delete(`${url}/:id`, async ({ params }) => {
    const { id } = params;
    posts = posts.filter((post) => post.id !== id);
    return HttpResponse.json(null, { status: 200 });
  }),
];
```

src/App.test.tsx

```tsx
describe('App', () => {
  test('creates a new post', async () => {
    const user = userEvent.setup();
    render(<App />);
    const { input, submitBtn } = getFormElements();
    await user.type(input, 'New Post');
    await user.click(submitBtn);
    expect(await screen.findByText(/new post/i)).toBeInTheDocument();
  });
  test('updates a post', async () => {
    const user = userEvent.setup();
    render(<App />);
    const likeBtn = await screen.findByRole('button', {
      name: `👍 ${posts[0].likes}`,
    });
    await user.click(likeBtn);
    expect(
      await screen.findByRole('button', { name: `👍 ${posts[0].likes}` })
    ).toBeInTheDocument();
  });
  test('deletes a post', async () => {
    const user = userEvent.setup();
    render(<App />);
    const initialPosts = await screen.findAllByRole('article');
    expect(initialPosts).toHaveLength(3);
    const lastPost = initialPosts[2];

    // The within method is a utility provided by the @testing-library/react package. It allows you to scope your queries to a specific DOM element, rather than searching the entire document.

    const deleteBtn = within(lastPost).getByRole('button', {
      name: /delete/i,
    });
    await user.click(deleteBtn);
    const postsAfterDelete = await screen.findAllByRole('article');
    expect(postsAfterDelete).toHaveLength(2);
  });
});
```

## Testing Errors

src/mocks/handlers.ts

```ts
export const getErrorHandler = [
  http.get(url, () => {
    return HttpResponse.json(
      { message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }),
];

export const createErrorHandler = [
  http.post(url, () => {
    return HttpResponse.json(
      { message: 'Failed to create post' },
      { status: 400 }
    );
  }),
];

export const updateErrorHandler = [
  http.put(`${url}/:id`, () => {
    return HttpResponse.json(
      { message: 'Failed to update post' },
      { status: 400 }
    );
  }),
];

export const deleteErrorHandler = [
  http.delete(`${url}/:id`, () => {
    return HttpResponse.json(
      { message: 'Failed to delete post' },
      { status: 400 }
    );
  }),
];
```

src/App.test.tsx

```tsx
import {
  getErrorHandler,
  createErrorHandler,
  updateErrorHandler,
  deleteErrorHandler,
} from './mocks/handlers';

describe('App', () => {
  test('shows error message when fetching posts fails', async () => {
    // By default, the server is configured to return the mock data.   To test how the application handles errors, we need to explicitly configure the server to simulate a failure. This is done using the line server.use(...errorHandler);
    server.use(...getErrorHandler);
    render(<App />);
    expect(
      await screen.findByText(/failed to fetch posts/i)
    ).toBeInTheDocument();
  });
  test('shows error message when creating a post fails', async () => {
    const user = userEvent.setup();
    server.use(...createErrorHandler);
    render(<App />);
    const { input, submitBtn } = getFormElements();
    await user.type(input, 'New Post');
    await user.click(submitBtn);
    // verify error message is shown
    expect(
      await screen.findByText(/failed to create post/i)
    ).toBeInTheDocument();
  });
  test('displays error message when updating post fails', async () => {
    const user = userEvent.setup();
    server.use(...updateErrorHandler);
    render(<App />);
    const likeBtn = await screen.findByRole('button', {
      name: `👍 ${posts[0].likes}`,
    });
    await user.click(likeBtn);
    expect(await screen.findByText(/failed to like post/i)).toBeInTheDocument();
  });
  test('displays error message when deleting post fails', async () => {
    const user = userEvent.setup();
    server.use(...deleteErrorHandler);
    render(<App />);

    const allPosts = await screen.findAllByRole('article');
    const firstPost = allPosts[0];
    const deleteBtn = within(firstPost).getByRole('button', {
      name: /delete/i,
    });

    await user.click(deleteBtn);

    expect(
      await screen.findByText(/failed to delete post/i)
    ).toBeInTheDocument();
  });
});
```
