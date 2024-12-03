# Focus Flow

Next, we’re going to build an app called Focus Flow using the Test-Driven Development (TDD) approach. If you already forgot what is TDD, don’t worry—this will be a great way to see it in action! Hopefully during the project you will see how TDD helps you write better, more reliable applications by focusing on writing tests before you write any actual code, since this approach ensures your code is not only functional but also meets all requirements from the start.

To follow along, make sure to download the starter project. Once you have it, install the dependencies and run the development server to get everything set up. The starter project builds on what we created in the last chapter but comes with Tailwind CSS and the lucide-react icons library already installed.

If you need any additional help or want to review the README or source code, everything is available in the final folder. Let’s dive in and bring the Focus Flow app to life!

## Project Setup

03-focus-flow/01-focus-flow-starter

```sh
npm i
npm run dev
```

## Main Logic

To make things simpler, we’ll start by building the core logic of the application first. Once that’s complete, we’ll move on to writing the tests. This approach will allow you to see the bigger picture of how the application works before diving into the details of test setup.

- create `src/utils.ts` file

This file contains all of the types and the main logic of the application.

```tsx
import { useState } from 'react';

export type ItemCategory = 'urgent' | 'important' | 'normal' | 'low';

export type Item = {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
};

export type ItemWithoutId = Omit<Item, 'id'>;

export const useFlowManager = () => {
  const [items, setItems] = useState<Item[]>([]);

  const handleAddItem = (newItem: ItemWithoutId) => {
    setItems([...items, { ...newItem, id: Date.now().toString() }]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return { items, handleAddItem, handleDeleteItem };
};
```

## Components

- create `src/components/Form.tsx` file
- create `src/components/List.tsx` file
- create `src/components/ItemCard.tsx` file

```tsx
const Form = () => {
  return <div>Form</div>;
};
export default Form;
```

## App.tsx

```tsx
import Form from './components/Form';
import List from './components/List';
import { useFlowManager } from './utils';

export default function Home() {
  const { items, handleAddItem, handleDeleteItem } = useFlowManager();
}
```

In order to fix we need to setup props for the components.

components/Form.tsx

```tsx
import { type ItemWithoutId, type ItemCategory } from '../utils';

const Form = ({ onSubmit }: { onSubmit: (item: ItemWithoutId) => void }) => {
  return <div>Form</div>;
};
export default Form;
```

```tsx
import ItemCard from './ItemCard';
import { Item } from '../utils';

const List = ({
  items,
  onDelete,
}: {
  items: Item[];
  onDelete: (id: string) => void;
}) => {
  return <div>List</div>;
};
export default List;
```

## Form Tests

`src/__tests__/Form.test.tsx`

For the Form component I'm going to setup tests one by one but you can set all of them at once.

1. Set up the test environment:

   - Import necessary testing libraries (React Testing Library, Vitest)
   - Import the component to be tested

2. Create helper functions:

   - Define a function to get commonly used elements (e.g., `getElements`)

3. Set up the test suite:

   - Use `describe` to group related tests
   - Create mock functions for callbacks (e.g., `mockOnSubmit`)

4. Write individual test cases:

   - Use `test` or `it` to define each test case
   - Render the component with necessary props
   - Interact with the component using `userEvent`
   - Make assertions using `expect`

5. Test initial render:

   - Check if form fields are empty initially

6. Test form submission:

   - Fill out form fields
   - Submit the form
   - Verify if the submit callback is called with correct data

7. Test form validation:

   - Try submitting an empty form
   - Verify that the submit callback is not called

8. Test form reset after submission:

   - Fill out and submit the form
   - Check if fields are cleared after submission

9. Use `beforeEach` to reset mocks between tests

10. Use async/await for asynchronous operations (e.g., user interactions)

11. Use descriptive test names to clearly indicate what each test is checking

src/**tests**/Form.test.tsx

```tsx
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Form from '../components/Form';
import userEvent, { UserEvent } from '@testing-library/user-event';

const getElements = () => ({
  titleInput: screen.getByRole('textbox', { name: /title/i }),
  descriptionInput: screen.getByRole('textbox', { name: /description/i }),
  categorySelect: screen.getByRole('combobox', { name: /category/i }),
  submitButton: screen.getByRole('button', { name: /add task/i }),
});

describe('Form Component', () => {
  let user: UserEvent;
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    user = userEvent.setup();
  });

  // 1. Test renders form with empty fields initially
  test('renders form with empty fields initially', () => {
    render(<Form onSubmit={mockOnSubmit} />);

    const { titleInput, descriptionInput, categorySelect } = getElements();

    expect(titleInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
    expect(categorySelect).toHaveValue('');
  });
  // 2. Test submits form with entered values
  test('submits form with entered values', async () => {
    render(<Form onSubmit={mockOnSubmit} />);
    const { titleInput, descriptionInput, categorySelect, submitButton } =
      getElements();

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'Task Description');
    await user.selectOptions(categorySelect, 'urgent');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'Task Description',
      category: 'urgent',
    });
  });
  // 3. Test validates required fields
  test('validates required fields', async () => {
    render(<Form onSubmit={mockOnSubmit} />);
    const { submitButton } = getElements();
    await user.click(submitButton);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  // 4. Test clears form after successful submission
  test('clears form after successful submission', async () => {
    render(<Form onSubmit={mockOnSubmit} />);
    const { titleInput, descriptionInput, categorySelect, submitButton } =
      getElements();

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'Task Description');
    await user.selectOptions(categorySelect, 'urgent');
    await user.click(submitButton);

    expect(titleInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
    expect(categorySelect).toHaveValue('');
  });
});
```

src/components/Form.tsx

```tsx
import { useState } from 'react';
import { type ItemWithoutId, type ItemCategory } from '../utils';

const Form = ({ onSubmit }: { onSubmit: (item: ItemWithoutId) => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItemCategory | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className='max-w-xl'>
      <h2 className='text-xl font-semibold mb-2'>Add New Task</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='title'
            className='text-sm font-medium leading-none block mb-2'
          >
            Title
          </label>
          <input
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className='flex h-10 w-full rounded-md border px-3 py-2 text-sm'
          />
        </div>
        <div>
          <label
            htmlFor='description'
            className='text-sm font-medium leading-none block mb-2'
          >
            Description
          </label>
          <input
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className='flex h-10 w-full rounded-md border  px-3 py-2 text-sm'
          />
        </div>
        <div>
          <label
            htmlFor='category'
            className='text-sm font-medium leading-none block mb-2'
          >
            Category
          </label>
          <select
            id='category'
            value={category}
            onChange={(e) => setCategory(e.target.value as ItemCategory)}
            required
            className='flex h-10 w-full rounded-md border  px-3 py-2 text-sm'
          >
            <option value=''>Select Category</option>
            <option value='urgent'>Urgent</option>
            <option value='important'>Important</option>
            <option value='normal'>Normal</option>
            <option value='low'>Low Priority</option>
          </select>
        </div>
        <button
          type='submit'
          className='rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 '
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default Form;
```

### Test 2 : Submits form with entered values

```tsx
// 2. Test submits form with entered values
test('submits form with entered values', async () => {
  render(<Form onSubmit={mockOnSubmit} />);
  const { titleInput, descriptionInput, categorySelect, submitButton } =
    getElements();

  await user.type(titleInput, 'New Task');
  await user.type(descriptionInput, 'Task Description');
  await user.selectOptions(categorySelect, 'urgent');
  await user.click(submitButton);

  expect(mockOnSubmit).toHaveBeenCalledWith({
    title: 'New Task',
    description: 'Task Description',
    category: 'urgent',
  });
});
```

src/components/Form.tsx

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // typescript will complain if we don't check for empty strings
  onSubmit({ title, description, category });
};
```

### Test 3 : Validates required fields

Since we use html input `required` attribute, test will pass right away if we don't fill out all of the inputs in the form.

```tsx
// 3. Test validates required fields
test('validates required fields', async () => {
  render(<Form onSubmit={mockOnSubmit} />);
  const { submitButton } = getElements();
  await user.click(submitButton);
  expect(mockOnSubmit).not.toHaveBeenCalled();
});
```

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // typescript will complain if we don't check for empty strings
  if (!title || !description || !category) return;
  onSubmit({ title, description, category });
};
```

### Test 4 : Clears form after successful submission

```tsx
// 4. Test clears form after successful submission
test('clears form after successful submission', async () => {
  render(<Form onSubmit={mockOnSubmit} />);
  const { titleInput, descriptionInput, categorySelect, submitButton } =
    getElements();

  await user.type(titleInput, 'New Task');
  await user.type(descriptionInput, 'Task Description');
  await user.selectOptions(categorySelect, 'urgent');
  await user.click(submitButton);

  expect(titleInput).toHaveValue('');
  expect(descriptionInput).toHaveValue('');
  expect(categorySelect).toHaveValue('');
});
```

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // typescript will complain if we don't check for empty strings
  if (!title || !description || !category) return;
  onSubmit({ title, description, category });
  setTitle('');
  setDescription('');
  setCategory('');
};
```

## List Tests

- create `src/__tests__/List.test.tsx` file

```tsx
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import List from '../components/List';
import { type Item } from '../utils';
// Mock the ItemCard component to simplify testing
// This replaces the actual ItemCard component with a simple article element
// that contains the text "item card"
vi.mock('../components/ItemCard', () => ({
  // The default export is a function that returns a simple article element
  // This helps us test the List component in isolation without the complexity
  // of the actual ItemCard implementation
  default: () => <article>item card</article>,
}));

describe('List', () => {
  const mockItems: Item[] = [
    {
      id: '1',
      title: 'Test Item 1',
      description: 'Content 1',
      category: 'urgent',
    },
    {
      id: '2',
      title: 'Test Item 2',
      description: 'Content 2',
      category: 'normal',
    },
  ];
  const mockOnDelete = vi.fn();

  test('renders the Flow Board heading', () => {
    render(<List items={mockItems} onDelete={mockOnDelete} />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Flow Board' })
    ).toBeInTheDocument();
  });

  test('renders correct number of ItemCards', () => {
    render(<List items={mockItems} onDelete={mockOnDelete} />);

    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(2);
  });
  //
  test('renders empty grid when no items provided', () => {
    render(<List items={[]} onDelete={mockOnDelete} />);
    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });
  // ALTERNATIVE if we want to test the number of items only in the component. Useful if there are other places where such items are rendered.

  test('ALTERNATIVE: renders correct number of ItemCards', () => {
    const { queryAllByRole } = render(
      <List items={mockItems} onDelete={mockOnDelete} />
    );
    expect(queryAllByRole('article')).toHaveLength(2);
  });

  test('ALTERNATIVE: renders empty grid when no items provided', () => {
    const { queryAllByRole } = render(
      <List items={[]} onDelete={mockOnDelete} />
    );
    expect(queryAllByRole('article')).toHaveLength(0);
  });
});
```

src/components/List.tsx

```tsx
import ItemCard from './ItemCard';
import { type Item } from '../utils';

export default function List({
  items,
  onDelete,
}: {
  items: Item[];
  onDelete: (id: string) => void;
}) {
  return (
    <section className='mt-8'>
      <h2 className='text-xl font-semibold mb-2'>Flow Board</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {items.map((item) => (
          <ItemCard key={item.id} {...item} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}
```

## ItemCard Tests

components/ItemCard.tsx

```tsx
import { Trash2 } from 'lucide-react';

type ItemCardProps = {
  id: string;
  title: string;
  description: string;
  category: string;
  onDelete: (id: string) => void;
};

const ItemCard = ({
  id,
  title,
  description,
  category,
  onDelete,
}: ItemCardProps) => {
  return <div>ItemCard</div>;
};
export default ItemCard;
```

- create `src/__tests__/ItemCard.test.tsx` file

```tsx
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
```

## Context API

You can use current to setup to setup integration tests for App.tsx but in my case I will show you how to test components that use the context.

- create `src/AppWithContext.tsx` file

```tsx
const AppWithContext = () => {
  return <div>AppWithContext</div>;
};
export default AppWithContext;
```

- create `src/FlowContext.tsx` file

```tsx
import { createContext, useContext, ReactNode, useState } from 'react';
import { Item, ItemWithoutId } from './utils';

interface FlowContextType {
  items: Item[];
  handleAddItem: (newItem: ItemWithoutId) => void;
  handleDeleteItem: (id: string) => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);

  const handleAddItem = (newItem: ItemWithoutId) => {
    setItems([...items, { ...newItem, id: Date.now().toString() }]);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <FlowContext.Provider value={{ items, handleAddItem, handleDeleteItem }}>
      {children}
    </FlowContext.Provider>
  );
}

export function useFlowContext() {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
}
```

src/main.tsx

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import App from './App.tsx';
import AppWithContext from './AppWithContext.tsx';
import './index.css';
import { FlowProvider } from './FlowContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FlowProvider>
      <AppWithContext />
    </FlowProvider>
  </StrictMode>
);
```

src/AppWithContext.tsx

```tsx
import Form from './components/Form';
import List from './components/List';
import { useFlowContext } from './FlowContext';
const AppWithContext = () => {
  const { items, handleAddItem, handleDeleteItem } = useFlowContext();
  return (
    <main className='container mx-auto p-4 max-w-6xl'>
      <h1 className='text-3xl font-bold mb-8'>Focus Flow</h1>
      <Form onSubmit={handleAddItem} />
      <List items={items} onDelete={handleDeleteItem} />
    </main>
  );
};
export default AppWithContext;
```

## AppWithContext Tests

- create `src/__tests__/AppWithContext.test.tsx` file

```tsx
import { render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { FlowProvider } from '../FlowContext';
import AppWithContext from '../AppWithContext';

const getElements = () => ({
  titleInput: screen.getByRole('textbox', { name: /title/i }),
  descriptionInput: screen.getByRole('textbox', { name: /description/i }),
  categorySelect: screen.getByRole('combobox', { name: /category/i }),
  submitButton: screen.getByRole('button', { name: /add task/i }),
});

const customRenderAppWithContext = () => {
  return render(
    <FlowProvider>
      <AppWithContext />
    </FlowProvider>
  );
};

const addTestItem = async (user: UserEvent) => {
  const { titleInput, descriptionInput, categorySelect, submitButton } =
    getElements();
  await user.type(titleInput, 'Test Item');
  await user.type(descriptionInput, 'Test Content');
  await user.selectOptions(categorySelect, 'urgent');
  await user.click(submitButton);
};

describe('AppWithContext', () => {
  let user: UserEvent;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
    customRenderAppWithContext();
  });

  test('renders heading and form elements', () => {
    expect(
      screen.getByRole('heading', { level: 1, name: 'Focus Flow' })
    ).toBeInTheDocument();
    // Verify all form elements are present
    const elements = getElements();
    Object.values(elements).forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });

  test('handles adding an item', async () => {
    const cardsBefore = screen.queryAllByRole('article');
    expect(cardsBefore).toHaveLength(0);

    await addTestItem(user);

    // Use getByText instead of findByText since we already have findAllByRole above
    const cardsAfter = await screen.findAllByRole('article');
    expect(cardsAfter).toHaveLength(1);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
  });

  test('handles deleting an item', async () => {
    await addTestItem(user);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument(); // Verify delete button exists

    await user.click(deleteButton);
    expect(screen.queryByText('Test Item')).not.toBeInTheDocument(); // Verify item content is gone
    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });
});
```
