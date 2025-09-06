let contador = 0;
let puntosLevelUp = {};

function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

function agregarPersona() {
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const fecha = document.getElementById("fecha").value;
  const correo = document.getElementById("correo").value.trim().toLowerCase();
  const referido = document.getElementById("referido").value.trim();
  const mensaje = document.getElementById("mensaje-descuento");

  if (!nombre || !apellido || !fecha || !correo) {
    alert("Estimado: Por favor completa todos los campos.");
    return;
  }

  const edad = calcularEdad(fecha);
  if (edad < 18 || edad > 120) {
    alert("La edad debe estar entre 18 y 120 años.");
    return;
  }

  contador++;
  document.getElementById("contador").textContent = contador;

  if (referido) {
    if (!puntosLevelUp[referido]) {
      puntosLevelUp[referido] = 0;
    }
    puntosLevelUp[referido] += 100;
    console.log(`🎮 Código ${referido} ha ganado 100 puntos. Total: ${puntosLevelUp[referido]} puntos LevelUp.`);
  }

  const personaHTML = `
    <div class="persona">
      <strong>Nombre:</strong> ${nombre}<br>
      <strong>Apellido:</strong> ${apellido}<br>
      <strong>Fecha de Nacimiento:</strong> ${fecha}<br>
      <strong>Edad:</strong> ${edad} años<br>
      <strong>Correo:</strong> ${correo}<br>
      ${referido ? `<strong>Referido por:</strong> ${referido}<br>` : ""}
    </div>
  `;

  document.getElementById("lista-personas").insertAdjacentHTML("beforeend", personaHTML);

  if (correo.endsWith("@duoc.cl")) {
    mensaje.textContent = "🎉 ¡Descuento de por vida del 20% activado para usuarios Duoc!";
    mensaje.classList.remove("descuento-oculto");
    mensaje.classList.add("descuento-activo");
  } else {
    mensaje.textContent = "";
    mensaje.classList.remove("descuento-activo");
    mensaje.classList.add("descuento-oculto");
  }

  document.getElementById("formulario-registro").reset();
}
