import { useEffect, useState } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  debounceMs?: number; // default 300
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Buscar por nombre...",
  debounceMs = 300,
  className,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      onSearch(inputValue.trim());
    }, debounceMs);

    return () => clearTimeout(t);
  }, [inputValue, debounceMs, onSearch]);

  return (
    <div className={className} role="search" aria-label="Buscar productos">
      <label htmlFor="search-input" className="visually-hidden">
        Buscar productos
      </label>
      <div style={{ display: "flex", gap: 4 }}>
        <input
          id="search-input"
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          aria-label="Buscar productos"
        />
        <button
          type="button"
          aria-label="Buscar"
          onClick={() => onSearch(inputValue.trim())} // búsqueda inmediata al click
        >
          🔍
        </button>
      </div>
    </div>
  );
}
