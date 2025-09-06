let contador = 0;

function agregarPersona() {
  const apellido = document.getElementById("apellido").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const edad = document.getElementById("edad").value;
  const fecha = document.getElementById("fecha").value;
  const direccion = document.getElementById("direccion").value.trim();

  if (!apellido || !nombre || !edad || !fecha || !direccion) {
    alert("Por favor completa todos los campos.");
    return;
  }

  contador++;
  document.getElementById("contador").textContent = contador;

  const personaHTML = `
  <div class="persona">
    <strong>Nombre:</strong> ${nombre}<br>
    <strong>Apellido:</strong> ${apellido}<br>
    <strong>Edad:</strong> ${edad}<br>
    <strong>Nacimiento:</strong> ${fecha}<br>
    <strong>Dirección:</strong> ${direccion}
  </div>
`;

  document.getElementById("lista-personas").insertAdjacentHTML("beforeend", personaHTML);

  document.getElementById("formulario-registro").reset();
}
