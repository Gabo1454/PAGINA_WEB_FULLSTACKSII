// let numero = 10;
// console.log(numero);

// const juan = {
//   nombre: "Juan",
//   apellido: "Perez",
//   edad: 23,
//   direccion: {
//     ciudad: "Buenos Aires",
//     pais: "Argentina",
//   },
// };

// console.log(juan);

// const pedro = juan;
// pedro.nombre = "Pedro";
// pedro.apellido = "Gomez";
// pedro.edad = 30;
// pedro.direccion.ciudad = "Cordoba";
// pedro.direccion.pais = "Argentina";

// console.log(juan, pedro);

// const maria = { ...juan };
// maria.nombre = "Maria";
// maria.apellido = "Lopez";
// maria.edad = 28;
// maria.direccion.ciudad = "Rosario";
// maria.direccion.pais = "Argentina";

// console.log(juan, maria);

// const ana = structuredClone(juan);
// ana.nombre = "Ana";
// ana.apellido = "Gonzalez";
// ana.edad = 35;
// ana.direccion.ciudad = "Mendoza";
// ana.direccion.pais = "Argentina";

// console.log(juan, ana);

const personas = [];
console.log(personas);

const form = document.getElementById("personForm");
const contador = document.getElementById("contador");
const listaPersonas = document.getElementById("listaPersonas");

function crearPersona() {
  return {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    edad: parseInt(document.getElementById("edad").value),
    email: document.getElementById("email").value,
    telefono: document.getElementById("telefono").value,
  };
}

function agregarPersona(persona) {
  personas.push(persona);
}

function actualizarContador() {
  contador.textContent = personas.length;
}

function mostrarPersona(persona) {
  const li = document.createElement("li");
  li.classList.add("list-group-item");
  li.textContent = `
    Nombre: ${persona.nombre}
    Apellido: ${persona.apellido}
    Edad: ${persona.edad}
    Email: ${persona.email}
    Telefono: ${persona.telefono}
  `;
  listaPersonas.appendChild(li);
}

function limpiarFormulario() {
  form.reset();
}

function manejarEnvioFormulario(event) {
  event.preventDefault();
  const nuevaPersona = crearPersona();
  agregarPersona(nuevaPersona);
  actualizarContador();
  mostrarPersona(nuevaPersona);
  limpiarFormulario();
}

form.addEventListener("submit", manejarEnvioFormulario);
