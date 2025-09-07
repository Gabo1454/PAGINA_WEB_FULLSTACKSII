function agregarPersona() {
  const nombre = document.getElementById("nombre").value.trim();
  const clave = document.getElementById("clave").value.trim();
  const fecha = document.getElementById("fecha").value;
  const correo = document.getElementById("correo").value.trim();
  const referido = document.getElementById("referido").value.trim();

  const mensajeDescuento = document.getElementById("mensaje-descuento");
  const contadorSpan = document.getElementById("contador");

  // Validación de campos vacíos
  if (!nombre || !clave || !fecha || !correo) {
    alert("Por favor completa todos los campos obligatorios.");
    return;
  }

  // Validación de edad mínima
  const fechaNacimiento = new Date(fecha);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }

  if (edad < 18) {
    alert("Debes ser mayor de edad para registrarte.");
    return;
  }

  // Obtener usuarios existentes
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Verificar si el nombre ya está registrado
  const existe = usuarios.some((u) => u.nombre === nombre);
  if (existe) {
    alert("Ese nombre de usuario ya está registrado.");
    return;
  }

  // Crear nuevo usuario
  const nuevoUsuario = {
    nombre: nombre,
    clave: clave,
    correo: correo,
    puntos: referido ? 50 : 0,
    referido: referido
  };

  // Agregar al array y guardar
  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  // Actualizar contador
  let contador = parseInt(contadorSpan.textContent);
  contador++;
  contadorSpan.textContent = contador;

  // Mostrar mensaje de descuento si hay referido
  if (referido) {
    mensajeDescuento.textContent = "¡Has ganado 50 puntos LevelUp por tu referido!";
    mensajeDescuento.classList.remove("descuento-oculto");
  }

  // Redirigir al menú
  window.location.href = "index.html";
}