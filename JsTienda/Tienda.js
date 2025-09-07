document.addEventListener("DOMContentLoaded", () => {
  // 🔥 Limpieza automática del carrito al entrar a la tienda
  sessionStorage.removeItem("carrito");

  // 🔄 Reiniciar contador visual
  const contadorCarrito = document.getElementById("contador-carrito");
  if (contadorCarrito) contadorCarrito.textContent = "0";

  // 👤 Mostrar nombre y puntos del usuario (si lo usas)
  const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));
  const nombreSpan = document.getElementById("nombre-usuario");
  const puntosSpan = document.getElementById("puntos-usuario");
  if (usuarioActivo) {
    if (nombreSpan) nombreSpan.textContent = usuarioActivo.nombre;
    if (puntosSpan) puntosSpan.textContent = usuarioActivo.puntos;
  }

  // 🧩 Catálogo de productos
  const productos = [
    { codigo: "JM001", nombre: "Catan", precio: 29990, descripcion: "Juego de estrategia para colonizar la isla de Catan. Ideal para 3-4 jugadores.", imagen: "img/catan.jpg" },
    { codigo: "JM002", nombre: "Carcassonne", precio: 24990, descripcion: "Construye paisajes medievales con fichas. Ideal para 2-5 jugadores.", imagen: "img/Carcassonne.webp" },
    { codigo: "AC001", nombre: "Controlador Xbox Series X", precio: 59990, descripcion: "Botones mapeables y respuesta táctil mejorada. Compatible con Xbox y PC.", imagen: "img/Controlador Xbox Series X.webp" },
    { codigo: "AC002", nombre: "Auriculares HyperX Cloud II", precio: 79990, descripcion: "Sonido envolvente, micrófono desmontable y almohadillas de espuma viscoelástica.", imagen: "img/Auriculares HyperX Cloud II.webp" },
    { codigo: "CO001", nombre: "PlayStation 5", precio: 549990, descripcion: "Gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia inmersiva.", imagen: "img/ps5-pro_front.webp" },
    { codigo: "CG001", nombre: "PC Gamer ASUS ROG Strix", precio: 1299990, descripcion: "Rendimiento extremo con los últimos componentes para gamers exigentes.", imagen: "img/PC Gamer ASUS ROG Strix.webp" },
    { codigo: "SG001", nombre: "Silla Gamer Secretlab Titan", precio: 349990, descripcion: "Soporte ergonómico y personalización ajustable para sesiones prolongadas.", imagen: "img/Silla Gamer Secretlab Titan.jpg" },
    { codigo: "MS001", nombre: "Mouse Logitech G502 HERO", precio: 49990, descripcion: "Sensor de alta precisión y botones personalizables para control total.", imagen: "img/Mouse Logitech G502 HERO.jpg" },
    { codigo: "MP001", nombre: "Mousepad Razer Goliathus", precio: 29990, descripcion: "Superficie amplia con iluminación RGB personalizable para precisión gamer.", imagen: "img/Mousepad Razer Goliathus.jpg" },
    { codigo: "PP001", nombre: "Polera Gamer 'Level-Up'", precio: 14990, descripcion: "Camiseta cómoda y personalizable con tu gamer tag o diseño favorito.", imagen: "img/Polera Gamer Level-Up.jpg" }
  ];

  // 🖼️ Renderizar productos
  const contenedor = document.getElementById("contenedor-productos");
  contenedor.innerHTML = "";
  productos.forEach((producto) => {
    const div = document.createElement("article");
    div.classList.add("producto");
    div.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" width="200" height="200" />
      <h3 class="nombre-producto">${producto.nombre}</h3>
      <p class="descripcion-producto">${producto.descripcion}</p>
      <div class="detalle-producto">
        <span class="precio-producto">$${producto.precio.toLocaleString()} CLP</span>
        <button class="btn-agregar" onclick="agregarAlCarrito('${producto.codigo}')">Añadir al Carrito</button>
      </div>
    `;
    contenedor.appendChild(div);
  });
});

// 🛒 Agregar producto al carrito
function agregarAlCarrito(codigo) {
  let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
  carrito.push(codigo);
  sessionStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  alert("Producto agregado al carrito 🎮");
}

// 🔢 Actualizar contador
function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
  if (contador) contador.textContent = carrito.length;
}