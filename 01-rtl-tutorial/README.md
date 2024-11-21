## RTL Tutorial

Alright, now that we have discussed the main concepts and libraries we are going to use in this course, let's start our testing journey with the React Testing Library tutorial, where we will learn the core concepts of React Testing Library as well as testing in general.

Since adding React Testing Library to an existing Vite project requires quite a few steps, and based on my experience, students get bored with such setup at the beginning of the course, I have prepared a project with pre-configured Vite, Vitest, and React Testing Library. This way, we don't need to waste any time and can dive right into the fun part - writing our first tests. With that said, to all the setup junkies - don't worry, we will cover the entire setup process in the next course section.

## Setup

In order to follow along with the course content, you will need to get a hold of the course repository located at this [URL](https://github.com/john-smilga/react-testing-course).I also shared the link in the previous lecture, so
Once you have cloned the repository, open the 01-rtl-tutorial folder in your favorite IDE (in my case VSCode), install the dependencies by running `npm install`, run `npm run dev` to start the project in development mode, and also open another terminal instance and run `npm run test` to start the tests.If everything is set up correctly, you should see the following output in the terminal:

## Files and Folders

This is a boilerplate Vite project, with Typescript, TailwindCSS, and all of the testing libraries already set up for you.

- node_modules - folder containing all the dependencies for the project
- public - folder containing all the static assets for the project
- src - folder containing all the source code for the project
- `src/__tests__` - folder containing test file for App component
- `src/final` - folder containing the entire source code of the project
- `src/tutorial` - where we will be writing our tests and setting up our components
- `src/vitest.setup.ts` - file containing the setup for Vitest
- package.json - file containing all the project dependencies and scripts
  `npm run dev` - script to start the development server
  `npm run test` - script to start the test runner

For the most part we will focus on tests and only navigate to the actual browser from time to time, so dev server can be stopped at any time unlike the test runner which will constantly run in the background to watch for changes and re-run the tests.

Also in the root you will find README.md file with the course outline, more detailed explanations of the course content,links to additional resources, code examples which you can use as a reference, and other helpful information. So make sure to check it out.

## Explore our First Test

First take a look at the `src/App.tsx` file and notice the heading with the text "React Testing Library". This is the component we will be testing.

src/App.tsx

```tsx
function App() {
  return (
    <div className='p-8'>
      <h1 className='font-bold text-2xl'>React Testing Library</h1>
      <p className='mt-4 text-gray-700'>
        React Testing Library and Vitest work together to provide a robust
        testing environment.
      </p>
    </div>
  );
}
export default App;
```

Open the `App.test.tsx` file in the `src/__tests__` folder and take a look at the first test.

```tsx
import { render, screen } from '@testing-library/react';
// Note: technically already available globally
import { test, expect } from 'vitest';
import App from '../App';

// test is a function provided by Vitest that defines a single test case.
// it takes two arguments: a string description of what the test should do, and a callback function containing the actual test code.
// When you run your tests, each test block runs as a separate test, and the description helps identify which test passed or failed.
// Note that `test` and `it` are aliases - they do exactly the same thing and can be used interchangeably.

test('should render heading with correct text', () => {
  // Render the App component
  //mounts your React component into a simulated browser environment.
  render(<App />);

  // `screen.debug()` is a function that logs the current state of the virtual DOM to the console. It helps you visualize the component's structure and see what's being rendered.

  screen.debug();

  // `screen` is an object provided by `@testing-library/react` that contains methods for querying and interacting with the virtual DOM.

  //`screen.getByText('Random Component')` is a function that searches for an element with the text "Random Component" in the virtual DOM.

  const heading = screen.getByText('React Testing Library');

  // Verify that the heading is present in the document
  // `expect` is an assertion function.is used to create assertions.
  // `toBeInTheDocument()` is a matcher that checks if the element is present in the virtual DOM.
  expect(heading).toBeInTheDocument();
  expect(2 + 2).toBe(4);
});
```

## Explanation

The `test` function is a fundamental testing function that defines a single test case. It takes two arguments: a string description of what the test should do, and a callback function containing the actual test code. When you run your tests, each `test` block runs as a separate test, and the description helps identify which test passed or failed. For example, `test('should render heading', () => { ... })` creates a test that verifies if a heading renders correctly. Note that `test` and `it` are aliases - they do exactly the same thing and can be used interchangeably.

`render()` is a function provided by `@testing-library/react` that mounts your React component into a JSDOM environment (a simulated browser environment). JSDOM creates the virtual DOM, and the render function sets up the component within this environment so you can test it. Think of it as "painting" your component onto a simulated webpage for testing purposes.

`screen.debug()` is a function that logs the current state of the virtual DOM to the console. It helps you visualize the component's structure and see what's being rendered.

`screen` is an object provided by `@testing-library/react` that contains methods for querying and interacting with the virtual DOM.

`screen.getByText('Random Component')` is a function that searches for an element with the text "Random Component" in the virtual DOM. It returns the first element that matches the text.

`expect()` is a function that wraps an actual value you want to test. It creates an "expectation" object that lets you check different things about that value using matchers. Think of it as starting a sentence like "I expect this value to..."`

```tsx
expect(actualValue).matcher(expectedValue);
```

`toBeInTheDocument()` is a matcher that checks if the element is present in the virtual DOM.
Matchers are methods that let you test values in different ways. They complete the "expectation sentence" by specifying exactly what you're checking for. We will learn more matchers as we go.

## Shorter Syntax

Both code snippets test the same thing - the shorter version just skips the intermediate variable assignment and tests the element directly.

```tsx
test('should render heading with correct text', () => {
  // Render the App component
  render(<App />);

  // Log the DOM tree for debugging
  screen.debug();

  // Get the heading element by its text content
  // const heading = screen.getByText('React Testing Library');
  // Verify that the heading is present in the document
  // expect(heading).toBeInTheDocument();

  expect(screen.getByText('React Testing Library')).toBeInTheDocument();
});
```

## Understanding Test Validation

Think of tests like checking boxes on a list. An empty test (with no checks) automatically passes - it's like saying "yes" without asking any questions. The same applies to a test that has no assertions. When you add assertions, you're declaring what you expect to be true - it's like saying "I expect this specific condition to be true, please verify it". If reality doesn't match your expectation, the test will fail.

For example, if you tell the test "1 + 1 should equal 3", it will fail because that's mathematically incorrect. Similarly, when we change the text in `getByText('React Testing Library')` to `getByText('Angular Testing Library')`, the test will fail because there is no element with that text in the component.

You can also force a test to fail by throwing an error - this is like raising a red flag to say "stop, something's wrong here!". This is particularly useful when you want to explicitly mark a test as failed under certain conditions.

```tsx
test('this empty test will pass', () => {
  // Empty test - will pass!
});

test('this test will pass too', () => {
  const sum = 1 + 1;
  expect(sum).toBe(2);
  // fail
  expect(2 + 2).toBe(5);
});

test('this test will fail because the assertion fails', () => {
  expect(1 + 1).toBe(3);

  const heading = screen.getByText('Angular Testing Library');
  // Verify that the heading is present in the document
  expect(heading).toBeInTheDocument();
});

test('this test will fail because we throw an error', () => {
  throw new Error('Forced failure');
});
```

## Test Suite Organization with `describe`

The `describe` function is used to group related test cases into a test suite. It takes a descriptive string and a callback function containing the test cases. This organization helps maintain clear test structure and improves test readability. The first argument should be a descriptive string that clearly identifies what you're testing (like a component name or functionality), and the second argument is a callback function that contains your test cases. Below is an example of how to use `describe` to group related tests:

```tsx
import { render, screen } from '@testing-library/react';
// Note: technically already available globally
import { it, expect } from 'vitest';
import App from '../App';

describe('App Component', () => {
  test('should render heading with correct text', () => {
    render(<App />);
    const heading = screen.getByText('React Testing Library');
    expect(heading).toBeInTheDocument();
  });

  test('should render paragraph with correct text', () => {
    render(<App />);
    expect(screen.getByText(/library and vitest/i)).toBeInTheDocument();
  });
});
```

## Running Tests with Vitest

Vitest automatically finds and runs any files that have .test or .spec in their name, or files inside `__tests__` folders. To run all tests, just type `npm test`. If you just want to run one test file, press `h` in the terminal to see all the commands. and `p` to select the file you want to run.
With that said `vitest` is really smart and add runs only the tests that have changed.

## Vitest vs React Testing Library

random.test.ts

```ts
import { describe, it, expect } from 'vitest';
// notice `it` instead of `test`
describe('basic arithmetic checks', () => {
  it('1 + 1 equals 2', () => {
    expect(1 + 1).toBe(2);
  });

  it('2 * 2 equals 4', () => {
    expect(2 * 2).toBe(4);
  });
});
```

Vitest and React Testing Library (RTL) serve different but complementary purposes in testing React applications. Vitest is a test runner that provides the basic structure (describe, test) and assertions (expect) needed to execute tests. While similar to Jest, Vitest offers better performance and seamless Vite integration. When testing React components (as shown in the App.test.tsx example above), you need React Testing Library alongside Vitest. RTL provides the essential tools to render components, query the DOM, and simulate user interactions, while Vitest handles running the tests and managing assertions. You can think of Vitest as the engine that runs your tests, while RTL is the specialized toolkit for testing React components from a user's perspective. This allows you to write comprehensive tests that verify both component behavior and user interactions.

## Setup

- stop the test runner (CTRL + C)
- optional: remove App.test.tsx
- explore ./src/tutorial
  - where we will be writing our tests and setting up our components
- explore ./src/final
  - folder contains all solutions (source code) and is excluded from the test
- vite.config.ts

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    // Note: The following configuration block shows how to exclude specific directories from Vitest testing. Pay special attention to the exclude array which prevents test running in directories like node_modules, dist, cypress, and most importantly the final folder containing solutions.
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/final/**', // Add this line to exclude the final folder
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress}.config.*',
    ],
  },
});
```

## Search ByText

React Testing Library Query Methods
getByText, queryByText, getAllByText, queryAllByText, findByText, findAllByText

Here are the key differences between these React Testing Library query methods:

Get vs Query vs Find

- getBy...

  - Throws error if element not found
  - Returns single element
  - Use when element should exist

- queryBy...

  - Returns null if element not found
  - Returns single element
  - Use when testing element should NOT exist

- findBy...

  - Returns Promise
  - Retries until element found or timeout
  - Use for async elements

Single vs All

- Single Element Methods

  - getByText, queryByText, findByText
  - Returns single element
  - Throws if multiple matches found

- Multiple Element Methods

  - getAllByText, queryAllByText, findAllByText
  - Returns array of elements
  - Use when expecting multiple matches

- inspect the component
  ./src/tutorial/01-search-by-text/Sandbox.tsx

```tsx
import { useEffect, useState } from 'react';

function Sandbox() {
  const [showMessage, setShowMessage] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h1>React Testing Library Examples</h1>
      <p>You can search me with regular expression: 123-456-7890</p>

      {showError && <p>Error message</p>}
      <ul>
        <li>Item 1</li>
        <li>Item 1</li>
        <li>Item 1</li>
      </ul>
      {showMessage && <p>Async message</p>}
    </div>
  );
}

export default Sandbox;
```

- create test file
  ./src/tutorial/01-search-by-text/Sandbox.test.tsx

  - test whether heading renders correctly
  - test whether paragraph renders correctly
  - test whether paragraph with phone number renders correctly

```tsx
import { render, screen } from '@testing-library/react';
import Sandbox from './Sandbox';

describe('01-search-by-text', () => {
  test('demonstrates different query methods', async () => {
    render(<Sandbox />);

    // 1. getByText - exact string match
    const heading = screen.getByText('React Testing Library Examples');
    expect(heading).toBeInTheDocument();

    // 2. getByText with regex - phone number
    const phoneRegex = /\d{3}-\d{3}-\d{4}/;
    const phoneText = screen.getByText(phoneRegex);
    expect(phoneText).toBeInTheDocument();

    // 3. queryByText - element doesn't exist
    const errorMessage = screen.queryByText('Error message');
    expect(errorMessage).not.toBeInTheDocument();

    // 4. getAllByText - multiple elements
    const items = screen.getAllByText('Item 1');
    expect(items).toHaveLength(3);

    // 5. findByText - async element
    const asyncMessage = await screen.findByText('Async message');
    expect(asyncMessage).toBeInTheDocument();
  });
});
```
