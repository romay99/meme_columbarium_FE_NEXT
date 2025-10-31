'use client';
import React, { useState, useContext } from 'react';
import { FaSearch } from 'react-icons/fa';
import { ThemeContext } from '../../dark-mode/ThemeContext';

const SearchBar = ({ placeholder, onSearch }) => {
  const { darkMode } = useContext(ThemeContext);
  const [query, setQuery] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <div
        className={`flex w-6/12 rounded-full overflow-hidden shadow-sm border ${
          darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
        }`}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder || '검색어를 입력하세요...'}
          className={`flex-grow p-3 text-lg focus:outline-none ${
            darkMode
              ? 'text-black placeholder-gray-400'
              : 'text-black placeholder-gray-500'
          }`}
        />
        <button
          onClick={() => onSearch(query)}
          className={`px-4 flex items-center justify-center transition-colors duration-200 ${
            darkMode
              ? 'bg-cyan-700 hover:bg-cyan-600 text-white'
              : 'bg-cyan-500 hover:bg-cyan-400 text-white'
          }`}
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
