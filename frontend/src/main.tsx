import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // [IMPORT 1]
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';

// [SETUP 2] Create the client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents excessive refetching when alt-tabbing
      staleTime: 1000 * 60 * 5,    // Data stays fresh for 5 minutes
      retry: 1,                    // Retry failed requests once
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* [SETUP 3] Wrap the App */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
