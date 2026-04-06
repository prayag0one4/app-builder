import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme based on system preference on mount
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  // Apply CSS variables based on the dark mode state
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.style.setProperty('--bg-color', '#202124');
      root.style.setProperty('--text-color', '#e8eaed');
      root.style.setProperty('--input-bg', '#303134');
      root.style.setProperty('--input-border', '#5f6368');
      root.style.setProperty('--input-hover-border', '#8ab4f8');
      root.style.setProperty('--input-focus-border', '#8ab4f8');
      root.style.setProperty('--input-shadow', '0 1px 6px rgba(0, 0, 0, 0.5)');
      root.style.setProperty('--input-hover-shadow', '0 1px 6px rgba(0, 0, 0, 0.5)');
    } else {
      root.style.setProperty('--bg-color', '#ffffff');
      root.style.setProperty('--text-color', '#202124');
      root.style.setProperty('--input-bg', '#ffffff');
      root.style.setProperty('--input-border', '#dfe1e5');
      root.style.setProperty('--input-hover-border', '#bdc1c6');
      root.style.setProperty('--input-focus-border', '#1a73e8');
      root.style.setProperty('--input-shadow', '0 1px 6px rgba(32, 33, 36, 0.28)');
      root.style.setProperty('--input-hover-shadow', '0 1px 6px rgba(32, 33, 36, 0.28)');
    }
  }, [isDarkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.location.href = googleSearchUrl;
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="App">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          color: 'var(--text-color)',
          padding: '10px',
          borderRadius: '50%',
          transition: 'background-color 0.3s'
        }}
        aria-label="Toggle Dark Mode"
        title="Toggle Dark Mode"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* Logo */}
      <div className="mb-4 text-center">
        <h1
          style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            letterSpacing: '-1px',
            color: 'var(--text-color)',
            userSelect: 'none'
          }}
        >
          G-Redirect
        </h1>
      </div>

      {/* Search Form */}
      <form className="search-container" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search Google or type a URL"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </form>
    </div>
  );
}

export default App;
