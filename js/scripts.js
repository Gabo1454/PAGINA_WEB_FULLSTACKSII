document.addEventListener("DOMContentLoaded", () => {
  // Obtener usuario activo desde localStorage
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

  // Verificar que los elementos existen antes de insertar contenido
  const nombreSpan = document.getElementById("nombre-usuario");
  const puntosSpan = document.getElementById("puntos-usuario");
  const bienvenida = document.getElementById("bienvenida");

  if (usuarioActivo) {
    if (nombreSpan) {
      nombreSpan.textContent = usuarioActivo.nombre;
    }

    if (puntosSpan) {
      puntosSpan.textContent = usuarioActivo.puntos;
    }

    if (bienvenida) {
      bienvenida.textContent = `¡Bienvenido, ${usuarioActivo.nombre}!`;
    }
  }

  // Función para mostrar/ocultar la barra de búsqueda
  window.toggleBusqueda = function () {
    const barra = document.querySelector(".barra-busqueda");
    barra.style.display = barra.style.display === "none" ? "inline-block" : "none";
  };

  // Inicializar contador del carrito (si decides usarlo más adelante)
  const contadorCarrito = document.getElementById("contador-carrito");
  if (contadorCarrito) {
    const cantidad = sessionStorage.getItem("carritoCantidad") || "0";
    contadorCarrito.textContent = cantidad;
  }
});