document.addEventListener("DOMContentLoaded", () => {
  // Array de artículos
  const articulos = [
    {
      imagen: "img/banner-jinx.jpeg",
      titulo: "Banner-Jinx",
      detalle:
        "Participa y gana puntos LevelUp para canjear en nuestra tienda.",
    },
    {
      imagen: "img/snake-delta.jpg",
      titulo: "Metal Gear Delta disponible",
      detalle: "Ya puedes conseguir Metal Gear Delta en nuestra tienda online.",
    },
    {
      imagen: "img/noticia3.jpg",
      titulo: "Actualización PS5",
      detalle: "Nuevas funciones y mejoras de rendimiento para PlayStation 5.",
    },
    {
      imagen: "img/noticia4.jpg",
      titulo: "Evento de eSports",
      detalle:
        "Prepárate para competir en el torneo de eSports más esperado del año.",
    },
  ];

  // Obtener elementos del DOM
  const contenedor = document.getElementById("lista-articulos");
  const modal = document.getElementById("modal-noticia");
  const modalImagen = document.getElementById("modal-imagen");
  const modalTitulo = document.getElementById("modal-titulo");
  const modalDetalle = document.getElementById("modal-detalle");
  const cerrarModal = document.getElementById("cerrar-modal");

  // Renderizar artículos
  articulos.forEach((articulo) => {
    const div = document.createElement("div");
    div.classList.add("articulo-card");
    div.innerHTML = `
      <img src="${articulo.imagen}" alt="${articulo.titulo}" />
      <h3>${articulo.titulo}</h3>
      <p>${articulo.detalle.substring(0, 80)}...</p>
    `;

    // Abrir modal al hacer click
    div.addEventListener("click", () => {
      modalImagen.src = articulo.imagen;
      modalTitulo.textContent = articulo.titulo;
      modalDetalle.textContent = articulo.detalle;
      modal.style.display = "flex";
    });

    contenedor.appendChild(div);
  });

  // Cerrar modal
  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Cerrar modal si se hace click fuera del contenido
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
