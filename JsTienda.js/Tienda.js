const productos = [
  {
    codigo: "JM001",
    categoria: "Juegos de Mesa",
    nombre: "Catan",
    precio: 29990,
    descripcion: "Juego de estrategia para colonizar Catan.",
    imagen: "coloca aquí la url"
  },
  {
    codigo: "JM002",
    categoria: "Juegos de Mesa",
    nombre: "Carcassonne",
    precio: 24990,
    descripcion: "Construye paisajes medievales con fichas.",
    imagen: "coloca aquí la url"
  },
  {
    codigo: "AC001",
    categoria: "Accesorios",
    nombre: "Controlador Xbox Series X",
    precio: 59990,
    descripcion: "Botones mapeables y respuesta táctil.",
    imagen: "coloca aquí la url"
  },
  {
    codigo: "AC002",
    categoria: "Accesorios",
    nombre: "Auriculares HyperX Cloud II",
    precio: 79990,
    descripcion: "Sonido envolvente y comodidad gamer.",
    imagen: "coloca aquí la url"
  },
  {
    codigo: "CO001",
    categoria: "Consolas",
    nombre: "PlayStation 5",
    precio: 549990,
    descripcion: "Gráficos de última generación.",
    imagen: "coloca aquí la url"
  },
  {
    codigo: "CG001",
    categoria: "Computadores Gamers",
    nombre: "PC Gamer ASUS ROG Strix",
    precio: 1299990,
    descripcion: "Rendimiento extremo para gamers exigentes.",
    imagen: "coloca aquí la url"
  },
  {
    codigo: "SG001",
    categoria: "Sillas Gamers",
    nombre: "Silla Secretlab Titan",
    precio: 349990,
    descripcion: "Ergonomía y confort para largas sesiones.",
    imagen: "coloca aquí la url"
  },
  {
    codigo: "MS001",
    categoria: "Mouse",
    nombre: "Mouse Logitech G502 HERO",
    precio: 49990,
    descripcion: "Sensor preciso y botones personalizables.",
    imagen: "coloca aquí la url"
  },
  {
    codigo: "MP001",
    categoria: "Mousepad",
    nombre: "Mousepad Razer Goliathus",
    precio: 29990,
    descripcion: "Superficie amplia con iluminación RGB.",
    imagen: "coloca aquí la url"
  },
  {
    codigo: "PP001",
    categoria: "Poleras Personalizadas",
    nombre: "Polera Gamer 'Level-Up'",
    precio: 14990,
    descripcion: "Diseño personalizable con tu gamer tag.",
    imagen: "coloca aquí la url"
  }
];

function renderizarProductos(lista) {
  const contenedor = document.getElementById("contenedor-productos");
  contenedor.innerHTML = "";

  lista.forEach((producto) => {
    const div = document.createElement("article");
    div.classList.add("producto");
    div.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" width="200