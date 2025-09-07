document.getElementById("formLogin").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombreIngresado = document.getElementById("nombreUsuario").value.trim();
  const claveIngresada = document.getElementById("claveUsuario").value.trim();
  const mensajeError = document.getElementById("mensajeError");

  // Validación de campos vacíos
  if (!nombreIngresado || !claveIngresada) {
    mensajeError.textContent = "Por favor completa todos los campos.";
    return;
  }

  // Obtener lista de usuarios registrados
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Buscar coincidencia exacta
  const usuarioValido = usuarios.find(
    (u) => u.nombre === nombreIngresado && u.clave === claveIngresada
  );

  if (usuarioValido) {
    mensajeError.textContent = "";

    // Guardar sesión activa
    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioValido));

    // Redirigir al menú principal
    window.location.href = "../index.html";
  } else {
    mensajeError.textContent = "Usuario o contraseña incorrectos.";
  }
});