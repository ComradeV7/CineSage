import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { useDebounce } from '../hooks/useDebounce';

export const AppLayout = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    // Navigate to home page to show search results
    if (window.location.pathname !== '/') {
        navigate('/');
    }
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <main>
        {/* Outlet renders the matched child route component */}
        <Outlet context={{ searchQuery: debouncedSearchTerm }} />
      </main>
    </>
  );
};
