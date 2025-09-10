// Datos de ejemplo
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

// Mostrar detalles según el id de la URL
const params = new URLSearchParams(window.location.search);
const idProducto = params.get("id");

const producto = productos.find((p) => p.id === idProducto);

if (producto) {
  document.getElementById("detalle-img").src = producto.imagen;
  document.getElementById("detalle-img").alt = producto.nombre;
  document.getElementById("detalle-nombre").textContent = producto.nombre;
  document.getElementById("detalle-precio").textContent = producto.precio;
  document.getElementById("detalle-descripcion").textContent =
    producto.descripcion;

  document.getElementById("detalle-agregar").onclick = () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(producto.id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Producto agregado al carrito 🎮");
  };
} else {
  document.querySelector(".detalle-producto").innerHTML =
    "<p>Producto no encontrado</p>";
}
