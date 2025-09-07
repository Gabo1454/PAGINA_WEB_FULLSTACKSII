document.getElementById("formLogin").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombreIngresado = document.getElementById("nombreUsuario").value.trim();
  const claveIngresada = document.getElementById("claveUsuario").value.trim();
  const mensajeError = document.getElementById("mensajeError");

  // Obtener datos guardados en localStorage
  const nombreGuardado = localStorage.getItem("usuarioNombre");
  const claveGuardada = localStorage.getItem("usuarioClave");

  // Validar credenciales
  if (nombreIngresado === nombreGuardado && claveIngresada === claveGuardada) {
    mensajeError.textContent = ""; // Limpiar mensaje de error
    window.location.href = "../index.html"; // Redirigir al menú
  } else {
    mensajeError.textContent = "Usuario o contraseña incorrectos.";
  }
});