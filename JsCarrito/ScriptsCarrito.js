document.addEventListener("DOMContentLoaded", () => {
  const productosCatalogo = [
    { codigo: "JM001", nombre: "Catan", precio: 29990, imagen: "img/catan.jpg" },
    { codigo: "JM002", nombre: "Carcassonne", precio: 24990, imagen: "img/Carcassonne.webp" },
    { codigo: "AC001", nombre: "Controlador Xbox Series X", precio: 59990, imagen: "img/Controlador Xbox Series X.webp" },
    { codigo: "AC002", nombre: "Auriculares HyperX Cloud II", precio: 79990, imagen: "img/Auriculares HyperX Cloud II.webp" },
    { codigo: "CO001", nombre: "PlayStation 5", precio: 549990, imagen: "img/ps5-pro_front.webp" },
    { codigo: "CG001", nombre: "PC Gamer ASUS ROG Strix", precio: 1299990, imagen: "img/PC Gamer ASUS ROG Strix.webp" },
    { codigo: "SG001", nombre: "Silla Gamer Secretlab Titan", precio: 349990, imagen: "img/Silla Gamer Secretlab Titan.jpg" },
    { codigo: "MS001", nombre: "Mouse Logitech G502 HERO", precio: 49990, imagen: "img/Mouse Logitech G502 HERO.jpg" },
    { codigo: "MP001", nombre: "Mousepad Razer Goliathus", precio: 29990, imagen: "img/Mousepad Razer Goliathus.jpg" },
    { codigo: "PP001", nombre: "Polera Gamer 'Level-Up'", precio: 14990, imagen: "img/Polera Gamer Level-Up.jpg" }
  ];

  const contenedor = document.getElementById("carrito-contenido");
  const totalSpan = document.getElementById("total-compra");
  const puntosSpan = document.getElementById("puntos-usuario");
  const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

  const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));
  if (usuarioActivo && puntosSpan) {
    puntosSpan.textContent = usuarioActivo.puntos;
  }

  let total = 0;

  if (carrito.length === 0) {
    contenedor.innerHTML = `<p class="mensaje-vacio">Tu carrito está vacío.</p>`;
    totalSpan.textContent = "$0 CLP";
  } else {
    carrito.forEach((codigo) => {
      const producto = productosCatalogo.find(p => p.codigo === codigo);
      if (producto) {
        total += producto.precio;
        const div = document.createElement("div");
        div.classList.add("producto-carrito");
        div.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}" />
          <h3>${producto.nombre}</h3>
          <p>Precio: $${producto.precio.toLocaleString()} CLP</p>
        `;
        contenedor.appendChild(div);
      }
    });

    totalSpan.textContent = `$${total.toLocaleString()} CLP`;
  }

  const finalizarBtn = document.getElementById("btn-finalizar");
  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", () => {
      alert("¡Gracias por tu compra gamer! 🎮");
      sessionStorage.removeItem("carrito");
      window.location.href = "index.html";
    });
  }

  const limpiarBtn = document.getElementById("btn-limpiar");
if (limpiarBtn) {
  limpiarBtn.addEventListener("click", () => {
    // 🔥 Borrar toda la sesión
    sessionStorage.clear();

    // 🧹 Limpiar visualmente el carrito
    contenedor.innerHTML = `<p class="mensaje-vacio">Tu carrito está vacío.</p>`;
    totalSpan.textContent = "$0 CLP";

    // 🔢 Reiniciar contador si existe
    const contadorCarrito = document.getElementById("contador-carrito");
    if (contadorCarrito) contadorCarrito.textContent = "0";

    // ✅ Confirmación
    alert("CArrito limpiado correctamente 🧹");
  });
}



});