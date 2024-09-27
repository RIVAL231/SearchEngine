import React, { useState } from 'react';
import SearchForm from './components/SearchEngineForm';
import SearchResults from './components/SearchResults';
import './globals.css';

export default function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (term) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://search-backend-two.vercel.app
/api/search?term=${encodeURIComponent(term)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Educational Search</h1>
      <SearchForm onSearch={handleSearch} />
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {!loading && !error && <SearchResults results={results} />}
    </div>
  );
}