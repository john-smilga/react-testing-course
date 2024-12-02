# Testing Project Template

As promised in this course section, I will show you how to create a project template with Vite, TypeScript, Vitest, and React Testing Library, so you can use it as a starting point for your own projects. Before we start, I want to mention that if you get stuck or encounter any issues, you can always reference the `02-testing-project-template`, including the README file where you will find all of the commands and code we are going to write in this course section.

A brief walkthrough on how to set up Vite (TypeScript Template), Vitest, and React Testing Library.

[Article](https://johnsmilga.com/articles/2024/10/15)

## Vitest

In your command line, create a new Vite project and choose the React with TypeScript option.

```bash
npm create vite@latest
```

Next, open up the integrated terminal and install Vitest.

```bash
npm install vitest --save-dev
```

Add the test script to your package.json:

```json
"scripts": {
    "test": "vitest"
  },
```

Create a test file, e.g., random.test.ts, in your project. Make sure you add the suffix "test" — in my case, I will do it in the src directory.

```ts
import { describe, it, expect } from 'vitest';

describe('basic arithmetic checks', () => {
  it('1 + 1 equals 2', () => {
    expect(1 + 1).toBe(2);
  });

  it('2 * 2 equals 4', () => {
    expect(2 * 2).toBe(4);
  });
});
```

Run the test:

```bash
npm run test
```

If everything is correct, your test should pass. You should not see any errors in your terminal, and everything should be green 😀. Since I want to focus on the setup in this article, we won’t spend time on the actual commands. The plan is to cover testing code in one of the later articles.

## React Testing Library

Since we want to test our React components, we need to install React Testing Library and other dependencies. Stop the test by pressing Ctrl + C and install the following dependencies:

```bash
# Core testing utilities for React components
npm install @testing-library/react @testing-library/jest-dom jsdom @testing-library/user-event --save-dev
```

`@testing-library/react` - Core testing utilities for React components
`@testing-library/jest-dom` - Custom matchers to simplify assertions
`jsdom` - Simulates a browser-like environment for tests to run in Node.js
`@testing-library/user-event` - Simulates user interactions (clicks, typing, etc.) in tests

Add the test object to vite.config.ts:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
});
```

If you have red squiggly lines in your vite.config.ts file, no worries — it’s because we are using TypeScript, and we will fix it very soon.

After that, we want to create a setup file. In the root directory, create vitest.setup.ts and add the following code:

src/vitest.setup.ts

```ts
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

Make some changes in the vite.config.ts file:

```ts
// Import defineConfig from vitest/config
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Enable global variables for testing
    globals: true,
    // Use jsdom as the environment
    environment: 'jsdom',
    // Path to the setup file
    setupFiles: './src/vitest.setup.ts',
  },
});
```

We also need to add the following code to our tsconfig.app.json file, which allows us to use Vitest's global functions like describe, it, and expect without needing to import them explicitly. If you’re wondering about the @testing-library/jest-dom, it’s because we want to use the custom matchers provided by the library globally as well.

tsconfig.app.json

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

Now we are ready to test our React components with React Testing Library and Vitest. Create a new file, e.g., Random.tsx, in your project and add the following code:

src/Random.tsx

```tsx
const Random = () => {
  return <div>Random Component</div>;
};
export default Random;
```

After that, create a tests directory in the src folder and add a Random.test.tsx file with the following code:

`src/__tests__/Random.test.tsx`

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Random from '../Random';

describe('Random Component', () => {
  it('renders correctly', () => {
    render(<Random />);
    screen.debug(); // Logs the DOM structure
    const element = screen.getByText('Random Component');
    expect(element).toBeInTheDocument();
  });
});
```

That's it for the setup. Now you can run the test by typing npm run test in your terminal. If everything is correct, you should see the following output:

```bash

  <body>
  <div>
    <div>
      Random Component
    </div>
  </div>
</body>

 ✓ src/random.test.ts (2)
 ✓ src/__tests__/Random.test.tsx (1)

 Test Files  2 passed (2)
      Tests  3 passed (3)
   Start at  15:17:47
   Duration  334ms (transform 22ms, setup 128ms, collect 14ms, tests 14ms, environment 281ms, prepare 53ms)


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

Happy testing! 🎉

## TailwindCSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
