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
