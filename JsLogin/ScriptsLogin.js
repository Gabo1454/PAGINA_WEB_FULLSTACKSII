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
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }

  if (edad < 18) {
    alert("Debes ser mayor de edad para registrarte.");
    return;
  }

  // Guardar datos en localStorage
  localStorage.setItem("usuarioNombre", nombre);
  localStorage.setItem("usuarioPuntos", referido ? "50" : "0");
  localStorage.setItem("usuarioClave", clave);

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