// src/components/sections/SearchBar.tsx
import { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";

type Props = {
  onSearch: (q: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  onSearch,
  placeholder = "Nombre del producto...",
}: Props) {
  const [value, setValue] = useState("");
  const debounceRef = useRef<number | null>(null);

  // 🔹 cada vez que cambia el texto, disparamos onSearch con debounce
  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      onSearch(value.trim());
    }, 300);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [value, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const clear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.wrapper}>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={clear}
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </form>
  );
}
