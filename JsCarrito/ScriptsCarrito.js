document.addEventListener("DOMContentLoaded", () => {
  const productosCatalogo = [
    {
      codigo: "JM001",
      nombre: "Catan",
      precio: 29990,
      imagen: "img/catan.jpg",
    },
    {
      codigo: "JM002",
      nombre: "Carcassonne",
      precio: 24990,
      imagen: "img/Carcassonne.webp",
    },
    {
      codigo: "AC001",
      nombre: "Controlador Xbox Series X",
      precio: 59990,
      imagen: "img/Controlador-Xbox-Series-X.webp",
    },
    {
      codigo: "AC002",
      nombre: "Auriculares HyperX Cloud II",
      precio: 79990,
      imagen: "img/Auriculares-HyperX-Cloud-II.webp",
    },
    {
      codigo: "CO001",
      nombre: "PlayStation 5",
      precio: 549990,
      imagen: "img/ps5-pro_front.webp",
    },
    {
      codigo: "CG001",
      nombre: "PC Gamer ASUS ROG Strix",
      precio: 1299990,
      imagen: "img/asus-rog-strix-helios-atx.avif",
    },
    {
      codigo: "SG001",
      nombre: "Silla Gamer Secretlab Titan",
      precio: 349990,
      imagen: "img/Silla-Gamer-Secretlab-Titan.jpg",
    },
    {
      codigo: "MS001",
      nombre: "Mouse Logitech G502 HERO",
      precio: 49990,
      imagen: "img/Mouse-Logitech-G502-HERO.jpg",
    },
    {
      codigo: "MP001",
      nombre: "Mousepad Razer Goliathus",
      precio: 29990,
      imagen: "img/Mousepad-Razer-Goliathus.jpg",
    },
    {
      codigo: "PP001",
      nombre: "Polera Gamer 'Level-Up'",
      precio: 14990,
      imagen: "img/Polera-Gamer-Level-Up.jpg",
    },
  ];

  const contenedor = document.getElementById("carrito-contenido");
  const totalSpan = document.getElementById("total-compra");
  const contadorCarrito = document.getElementById("contador-carrito");
  const finalizarBtn = document.getElementById("btn-finalizar");
  const limpiarBtn = document.getElementById("btn-limpiar");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // 🔹 Guardar carrito en localStorage
  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  // 🔹 Renderizar el carrito
  function renderCarrito() {
    contenedor.innerHTML = "";
    let total = 0;
    let cantidadTotal = 0;

    if (carrito.length === 0) {
      contenedor.innerHTML = `<p class="mensaje-vacio">Tu carrito está vacío.</p>`;
      totalSpan.textContent = "$0 CLP";
      if (contadorCarrito) contadorCarrito.textContent = "0";
      return;
    }

    carrito.forEach((item) => {
      const producto = productosCatalogo.find((p) => p.codigo === item.codigo);
      if (producto) {
        total += producto.precio * item.cantidad;
        cantidadTotal += item.cantidad;

        const div = document.createElement("div");
        div.classList.add("producto-carrito");
        div.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}" />
          <h3>${producto.nombre}</h3>
          <p>Precio: $${producto.precio.toLocaleString()} CLP</p>
          <p>Cantidad: ${item.cantidad}</p>
          <button onclick="cambiarCantidad('${item.codigo}', 1)">+</button>
          <button onclick="cambiarCantidad('${item.codigo}', -1)">-</button>
          <button onclick="eliminarDelCarrito('${item.codigo}')">🗑️</button>
        `;
        contenedor.appendChild(div);
      }
    });

    totalSpan.textContent = `$${total.toLocaleString()} CLP`;
    if (contadorCarrito) contadorCarrito.textContent = cantidadTotal;
  }

  // 🔹 Cambiar cantidad
  window.cambiarCantidad = (codigo, delta) => {
    const item = carrito.find((p) => p.codigo === codigo);
    if (item) {
      item.cantidad += delta;
      if (item.cantidad <= 0) {
        carrito = carrito.filter((p) => p.codigo !== codigo);
      }
      guardarCarrito();
      renderCarrito();
    }
  };

  // 🔹 Eliminar producto
  window.eliminarDelCarrito = (codigo) => {
    carrito = carrito.filter((p) => p.codigo !== codigo);
    guardarCarrito();
    renderCarrito();
  };

  // 🔹 Finalizar compra
  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", () => {
      alert("¡Gracias por tu compra gamer! 🎮");
      carrito = [];
      guardarCarrito();
      renderCarrito();
      window.location.href = "index.html";
    });
  }

  // 🔹 Limpiar carrito
  if (limpiarBtn) {
    limpiarBtn.addEventListener("click", () => {
      carrito = [];
      guardarCarrito();
      renderCarrito();
      alert("Carrito limpiado correctamente 🧹");
    });
  }

  // Inicializar
  renderCarrito();
});
