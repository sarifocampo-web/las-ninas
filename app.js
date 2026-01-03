// ===============================
// ESTADO
// ===============================
let productos = [
  { nombre: "Leche", categoria: "Alimentos", stock: 1 },
  { nombre: "Fideos", categoria: "Alimentos", stock: 0 },
  { nombre: "Detergente", categoria: "Limpieza", stock: 1 },
  { nombre: "Tomate", categoria: "Verdulería", stock: 0 }
];

let textoBusqueda = "";

// ===============================
// ELEMENTOS
// ===============================
const contenedor = document.getElementById("productos");
const inputBusqueda = document.getElementById("inputBusqueda");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnAgregar = document.getElementById("btnAgregar");

// ===============================
// EVENTOS (BLINDADOS)
// ===============================
if (inputBusqueda) {
  inputBusqueda.addEventListener("input", (e) => {
    textoBusqueda = e.target.value.toLowerCase();
    render();
  });
}

if (btnLimpiar) {
  btnLimpiar.onclick = () => {
    textoBusqueda = "";
    if (inputBusqueda) inputBusqueda.value = "";
    render();
  };
}

if (btnAgregar) {
  btnAgregar.onclick = () => {
    const nombre = prompt("Nombre del producto:");
    if (!nombre) return;

    const categoria = prompt("Categoría:");
    if (!categoria) return;

    const nombreFormateado =
      nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
    const categoriaFormateada =
      categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();

    const existe = productos.some(
      p => p.nombre === nombreFormateado
    );

    if (existe) {
      alert("Ese producto ya existe");
      return;
    }

    productos.push({
      nombre: nombreFormateado,
      categoria: categoriaFormateada,
      stock: 0
    });

    render();
  };
}

// ===============================
// RENDER
// ===============================
function render() {
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(textoBusqueda) ||
    p.categoria.toLowerCase().includes(textoBusqueda)
  );

  filtrados.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "producto" + (p.stock === 0 ? " falta" : "");

    card.innerHTML = `
      <div class="acciones">
        <button onclick="editar(${index})">✏️</button>
        <button onclick="borrar(${index})">🗑️</button>
      </div>

      <div class="nombre">${p.nombre}</div>
      <div class="stock">Stock: ${p.stock}</div>

      <div class="botones">
        <button onclick="restar(${index})">−</button>
        <button onclick="sumar(${index})">＋</button>
      </div>
    `;

    contenedor.appendChild(card);
  });
}

// ===============================
// ACCIONES
// ===============================
function sumar(i) {
  productos[i].stock++;
  render();
}

function restar(i) {
  if (productos[i].stock > 0) productos[i].stock--;
  render();
}

function borrar(i) {
  if (confirm("¿Eliminar producto?")) {
    productos.splice(i, 1);
    render();
  }
}

function editar(i) {
  const nuevoNombre = prompt("Nuevo nombre:", productos[i].nombre);
  if (!nuevoNombre) return;

  productos[i].nombre =
    nuevoNombre.charAt(0).toUpperCase() +
    nuevoNombre.slice(1).toLowerCase();

  render();
}

// ===============================
// INIT
// ===============================
render();
