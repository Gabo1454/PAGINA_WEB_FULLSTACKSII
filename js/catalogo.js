// --- Catálogo de productos ---
const productosCatalogo = [
  {
    codigo: "JM001",
    nombre: "Catan",
    precio: 29990,
    descripcion: "Juego de estrategia para colonizar la isla de Catan.",
    categoria: "Juegos de Mesa",
    imagen: "img/catan.jpg",
  },
  {
    codigo: "JM002",
    nombre: "Carcassonne",
    precio: 24990,
    descripcion: "Construye paisajes medievales con fichas.",
    categoria: "Juegos de Mesa",
    imagen: "img/Carcassonne.webp",
  },
  {
    codigo: "CO001",
    nombre: "PlayStation 5",
    precio: 549990,
    descripcion: "Gráficos impresionantes y tiempos de carga ultrarrápidos.",
    categoria: "Consolas",
    imagen: "img/ps5-pro_front.webp",
  },
  {
    codigo: "CO002",
    nombre: "Xbox Series X 1TB",
    precio: 780000,
    descripcion: "Potente consola de nueva generación.",
    categoria: "Consolas",
    imagen: "img/xbox-serie-x.webp",
  },
  {
    codigo: "CG001",
    nombre: "PC Gamer ASUS ROG Strix",
    precio: 1299990,
    descripcion: "Rendimiento extremo con los últimos componentes.",
    categoria: "PC de Escritorio",
    imagen: "img/asus-rog-strix-helios-atx.avif",
  },
  {
    codigo: "NB001",
    nombre: "Notebook HP OMEN 15 RTX 4080",
    precio: 1500000,
    descripcion: "Portátil gamer de alto rendimiento.",
    categoria: "Notebooks Gamers",
    imagen: "img/hp-omEn_front.avif",
  },
  {
    codigo: "NB002",
    nombre: "Notebook Lenovo Legion 5",
    precio: 1200000,
    descripcion: "Potencia equilibrada para gamers y creadores.",
    categoria: "Notebooks Gamers",
    imagen: "img/legion-5.webp",
  },
  {
    codigo: "AC001",
    nombre: "Controlador Xbox Series X",
    precio: 59990,
    descripcion: "Mando ergonómico compatible con Xbox y PC.",
    categoria: "Periféricos",
    imagen: "img/Controlador-Xbox-Series-X.webp",
  },
  {
    codigo: "AC002",
    nombre: "Auriculares HyperX Cloud II",
    precio: 79990,
    descripcion: "Sonido envolvente y micrófono desmontable.",
    categoria: "Periféricos",
    imagen: "img/Auriculares-HyperX-Cloud-II.webp",
  },
  {
    codigo: "MS001",
    nombre: "Mouse Logitech G502 HERO",
    precio: 49990,
    descripcion: "Sensor de alta precisión con botones personalizables.",
    categoria: "Periféricos",
    imagen: "img/Mouse-Logitech-G502-HERO.jpg",
  },
  {
    codigo: "MP001",
    nombre: "Mousepad Razer Goliathus",
    precio: 29990,
    descripcion: "Superficie amplia con iluminación RGB.",
    categoria: "Periféricos",
    imagen: "img/Mousepad-Razer-Goliathus.jpg",
  },
  {
    codigo: "SG001",
    nombre: "Silla Gamer Secretlab Titan",
    precio: 349990,
    descripcion: "Soporte ergonómico premium para sesiones largas.",
    categoria: "Sillas Gamer",
    imagen: "img/Silla-Gamer-Secretlab-Titan.jpg",
  },
  {
    codigo: "PP001",
    nombre: "Polera Gamer 'Level-Up'",
    precio: 14990,
    descripcion: "Camiseta cómoda y personalizable.",
    categoria: "Ropa",
    imagen: "img/Polera-Gamer-Level-Up.jpg",
  },
  {
    codigo: "FG001",
    nombre: "BRING ARTS YoRHa 2B Ver. 2.0",
    precio: 89990,
    descripcion: "Figura coleccionable de edición especial.",
    categoria: "Figuras",
    imagen: "img/play-art-2b-2.0.jpg",
  },
  {
    codigo: "CD001",
    nombre: "Código 10 USD PSN USA",
    precio: 12990,
    descripcion: "Tarjeta prepago digital para PSN.",
    categoria: "Códigos",
    imagen: "img/10-dolares-psn-usa.avif",
  },
  {
    codigo: "CD002",
    nombre: "Código Steam 20 USD",
    precio: 22000,
    descripcion: "Tarjeta digital de Steam.",
    categoria: "Códigos",
    imagen: "img/20-dolares-steam.png",
  },
];

// --- Carrito con cantidades ---
function agregarAlCarrito(codigo) {
  console.log("Agregando al carrito:", codigo); // <- Verifica que se recibe correctamente
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let item = carrito.find((p) => p.codigo === codigo);

  if (item) {
    item.cantidad += 1;
  } else {
    carrito.push({ codigo: codigo, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  alert("Producto agregado al carrito 🎮");
}

function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  if (contador) contador.textContent = total;
}

// --- Render catálogo ---
function renderCatalogo(filtrados = productosCatalogo) {
  const contenedor = document.getElementById("catalogo-productos");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  filtrados.forEach((producto) => {
    const card = document.createElement("article");
    card.classList.add("producto");
    card.setAttribute("data-categoria", producto.categoria);

    card.innerHTML = `
      <img src="${producto.imagen}" alt="${
      producto.nombre
    }" width="200" height="200" />
      <h3 class="nombre-producto">${producto.nombre}</h3>
      <p class="descripcion-producto">${producto.descripcion}</p>
      <span class="precio-producto">$${producto.precio.toLocaleString()} CLP</span>
      <button class="btn-agregar">Añadir al Carrito</button>
    `;

    const boton = card.querySelector(".btn-agregar");

    // Click en botón agrega al carrito
    boton.addEventListener("click", (e) => {
      e.stopPropagation(); // evita redirección
      agregarAlCarrito(producto.codigo);
    });

    // Click en tarjeta redirige a detalle
    card.addEventListener("click", () => {
      window.location.href = `producto.html?id=${producto.codigo}`;
    });

    contenedor.appendChild(card);
  });
}

// --- Filtrado de productos ---
function filtrarProductos() {
  const checkboxes = document.querySelectorAll(".filtros input[type=checkbox]");
  const precioMax = document.querySelector(".filtro-precio input").value;

  let categoriasSeleccionadas = [];
  checkboxes.forEach((cb) => {
    if (cb.checked) {
      switch (cb.id) {
        case "juegos-mesa":
          categoriasSeleccionadas.push("Juegos de Mesa");
          break;
        case "notebooks-gamers":
          categoriasSeleccionadas.push("Notebooks Gamers");
          break;
        case "pc-escritorio":
          categoriasSeleccionadas.push("PC de Escritorio");
          break;
        case "consolas":
          categoriasSeleccionadas.push("Consolas");
          break;
        case "perifericos":
          categoriasSeleccionadas.push("Periféricos");
          break;
        case "sillas-gamer":
          categoriasSeleccionadas.push("Sillas Gamer");
          break;
        case "ropa":
          categoriasSeleccionadas.push("Ropa");
          break;
        case "figuras":
          categoriasSeleccionadas.push("Figuras");
          break;
        case "codigos":
          categoriasSeleccionadas.push("Códigos");
          break;
        case "juegos":
          categoriasSeleccionadas.push("Juegos");
          break;
      }
    }
  });

  const filtrados = productosCatalogo.filter((p) => {
    const catMatch =
      categoriasSeleccionadas.length === 0 ||
      categoriasSeleccionadas.includes(p.categoria);
    const precioMatch = p.precio <= precioMax;
    return catMatch && precioMatch;
  });

  renderCatalogo(filtrados);
}

// --- Inicialización ---
document.addEventListener("DOMContentLoaded", () => {
  renderCatalogo();
  actualizarContadorCarrito();

  document.querySelectorAll(".filtros input").forEach((input) => {
    input.addEventListener("change", filtrarProductos);
  });

  document
    .querySelector(".filtro-precio input")
    .addEventListener("input", filtrarProductos);
});
