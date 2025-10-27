import React from "react";
import { Link } from "react-router-dom";

const HomeView: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* --- Sección de Héroe (Inspirada en tu Slider) --- */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Banner de Fondo */}
        <img
          src="img/elden-ring-slider-banner.webp" // Usamos tu ruta
          alt="Banner de Oferta Gamer"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        {/* Contenido del Héroe */}
        <div className="relative z-10 text-center p-8 bg-black bg-opacity-60 rounded-xl">
          <h1 className="text-6xl font-extrabold text-red-500 mb-4 font-orbitron">
            LEVEL UP GAMER
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-lg mx-auto">
            Tu tienda definitiva para consolas, PCs y periféricos de última
            generación.
          </p>
          <Link
            to="/products"
            className="inline-block px-10 py-4 bg-indigo-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-105"
          >
            Explora el Catálogo 🚀
          </Link>
        </div>
      </section>

      {/* --- Sección Destacada de Categorías --- */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-red-500 border-b-2 border-red-500 pb-2">
          Lo Más Vendido
        </h2>
        {/* Placeholder para un Grid de 3-4 ProductCard destacados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-800 rounded-lg shadow-xl text-center">
            <i className="fa fa-keyboard text-4xl mb-3 text-indigo-400"></i>
            <h3 className="text-xl font-semibold">Periféricos RGB</h3>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-xl text-center">
            <i className="fa fa-headset text-4xl mb-3 text-indigo-400"></i>
            <h3 className="text-xl font-semibold">Audio Profesional</h3>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-xl text-center">
            <i className="fa fa-desktop text-4xl mb-3 text-indigo-400"></i>
            <h3 className="text-xl font-semibold">Monitores 144Hz+</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
