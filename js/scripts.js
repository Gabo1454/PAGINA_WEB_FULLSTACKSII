// Array de productos
const productos = [
  {
    id: "JM001",
    nombre: "Catan",
    descripcion:
      "Juego de estrategia para colonizar la isla de Catan. Ideal para 3-4 jugadores.",
    precio: 29990,
    img: "img/catan.jpg",
  },
  {
    id: "JM002",
    nombre: "Carcassonne",
    descripcion:
      "Construye paisajes medievales con fichas. Ideal para 2-5 jugadores.",
    precio: 24990,
    img: "img/Carcassonne.webp",
  },
  {
    id: "AC001",
    nombre: "Controlador Xbox Series X",
    descripcion:
      "Botones mapeables y respuesta táctil mejorada. Compatible con Xbox y PC.",
    precio: 59990,
    img: "img/Controlador Xbox Series X.webp",
  },
  {
    id: "AC002",
    nombre: "Auriculares HyperX Cloud II",
    descripcion:
      "Sonido envolvente, micrófono desmontable y almohadillas de espuma viscoelástica.",
    precio: 79990,
    img: "img/Auriculares HyperX Cloud II.webp",
  },
  {
    id: "CO001",
    nombre: "PlayStation 5",
    descripcion:
      "Gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia inmersiva.",
    precio: 549990,
    img: "img/ps5-pro_front.webp",
  },
  {
    id: "CG001",
    nombre: "PC Gamer ASUS ROG Strix",
    descripcion:
      "Rendimiento extremo con los últimos componentes para gamers exigentes.",
    precio: 1299990,
    img: "img/PC Gamer ASUS ROG Strix.webp",
  },
  {
    id: "SG001",
    nombre: "Silla Gamer Secretlab Titan",
    descripcion:
      "Soporte ergonómico y personalización ajustable para sesiones prolongadas.",
    precio: 349990,
    img: "img/Silla Gamer Secretlab Titan.jpg",
  },
  {
    id: "MS001",
    nombre: "Mouse Logitech G502 HERO",
    descripcion:
      "Sensor de alta precisión y botones personalizables para control total.",
    precio: 49990,
    img: "img/Mouse Logitech G502 HERO.jpg",
  },
  {
    id: "MP001",
    nombre: "Mousepad Razer Goliathus",
    descripcion:
      "Superficie amplia con iluminación RGB personalizable para precisión gamer.",
    precio: 29990,
    img: "img/Mousepad Razer Goliathus.jpg",
  },
  {
    id: "PP001",
    nombre: "Polera Gamer 'Level-Up'",
    descripcion:
      "Camiseta cómoda y personalizable con tu gamer tag o diseño favorito.",
    precio: 14990,
    img: "img/Polera Gamer Level-Up.jpg",
  },
];

// Función para agregar al carrito
function agregarAlCarrito(productoId) {
  let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
  const producto = productos.find((p) => p.id === productoId);
  if (producto) {
    carrito.push(producto);
    sessionStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizar contador
    const contadorCarrito = document.getElementById("contador-carrito");
    if (contadorCarrito) {
      contadorCarrito.textContent = carrito.length;
    }

    alert(`Se agregó "${producto.nombre}" al carrito.`);
  }
}

// Espera a que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector(".main-catalogo");

  if (!contenedor) return;

  // Generar productos dinámicamente
  productos.forEach((producto) => {
    const card = document.createElement("article");
    card.classList.add("producto");

    card.innerHTML = `
      <img src="${producto.img}" alt="${
      producto.nombre
    }" width="200" height="200">
      <h3 class="nombre-producto">${producto.nombre}</h3>
      <p class="descripcion-producto">${producto.descripcion}</p>
      <div class="detalle-producto">
        <span class="precio-producto">$${producto.precio.toLocaleString()} CLP</span>
        <button class="btn-agregar">Añadir al Carrito</button>
      </div>
    `;

    // Agregar evento al botón
    const boton = card.querySelector(".btn-agregar");
    boton.addEventListener("click", () => agregarAlCarrito(producto.id));

    contenedor.appendChild(card);
  });

  // Inicializar contador del carrito
  const contadorCarrito = document.getElementById("contador-carrito");
  if (contadorCarrito) {
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    contadorCarrito.textContent = carrito.length;
  }
});
