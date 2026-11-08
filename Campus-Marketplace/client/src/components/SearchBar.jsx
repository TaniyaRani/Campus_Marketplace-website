import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles } from 'lucide-react';

const SUGGESTIONS = ['Mini Drafter', 'Casio FX-991', 'Room Cooler', 'Mountain Bicycle', 'CLRS Book', 'Lab Coat'];

const SearchBar = ({ initialValue = '', onSearch, className = '' }) => {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleSearch = (term) => {
    const searchTerm = term !== undefined ? term : query;
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleChipClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center shadow-lg shadow-indigo-500/5 rounded-2xl bg-white border border-slate-200/90 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition-all p-1.5">
        <div className="pl-3 text-slate-400">
          <Search className="w-5 h-5 text-indigo-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search what you need on campus (e.g. Drafter, Bicycle, Books)..."
          className="w-full px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-transparent outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              if (onSearch) onSearch('');
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center space-x-1.5 flex-shrink-0"
        >
          <span>Find Deals</span>
        </button>
      </form>

      {/* Suggested Quick Search Chips */}
      <div className="flex items-center flex-wrap gap-1.5 mt-3 pt-1">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center mr-1">
          <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
          Popular in ABES:
        </span>
        {SUGGESTIONS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleChipClick(tag)}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200/60 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
