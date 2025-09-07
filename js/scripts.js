document.addEventListener("DOMContentLoaded", () => {
  // Obtener datos del usuario desde sessionStorage
  const nombreUsuario = localStorage.getItem("usuarioNombre");
  const puntosUsuario = localStorage.getItem("usuarioPuntos");

  // Verificar que los elementos existen antes de insertar contenido
  const nombreSpan = document.getElementById("nombre-usuario");
  const puntosSpan = document.getElementById("puntos-usuario");

  if (nombreUsuario && nombreSpan) {
    nombreSpan.textContent = nombreUsuario;
  }

  if (puntosUsuario && puntosSpan) {
    puntosSpan.textContent = puntosUsuario;
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