import React, { useState } from "react";

// Definimos la interfaz para las props, esperando una función para manejar la búsqueda
interface SearchBarProps {
  // onSearch enviará el término de búsqueda al componente padre (ProductsIndex)
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setInputValue(term);
    // Llama a la función onSearch inmediatamente al teclear para un filtrado instantáneo
    onSearch(term);
  };

  return (
    // El ancho máximo del contenedor de búsqueda (responsive)
    <div className="flex items-center w-full max-w-xs md:max-w-sm">
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={inputValue}
        onChange={handleInputChange}
        // Estilo Oscuro/Rojo: Fondo oscuro, borde sutil, foco en rojo
        className="p-2 border border-gray-600 rounded-l-lg w-full bg-gray-700 text-white focus:outline-none focus:border-red-500 placeholder-gray-400"
      />
      {/* Botón de búsqueda (mayormente cosmético) */}
      <button
        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-r-lg transition duration-300 shadow-md"
        title="Buscar"
      >
        {/* Ícono de lupa simple (SVG inline) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 002 8z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
