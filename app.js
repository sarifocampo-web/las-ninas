// ===============================
// ESTADO
// ===============================
let productos = [
  { nombre: "Leche", categoria: "Alimentos", stock: 1, minimo: 2 },
  { nombre: "Fideos", categoria: "Alimentos", stock: 0, minimo: 1 },
  { nombre: "Detergente", categoria: "Limpieza", stock: 1, minimo: 1 },
  { nombre: "Tomate", categoria: "Verdulería", stock: 0, minimo: 2 }
];

let textoBusqueda = "";

// ===============================
// ELEMENTOS
// ===============================
const contenedor = document.getElementById("productos");
const listaSuper = document.getElementById("listaSuper");
const inputBusqueda = document.getElementById("inputBusqueda");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnAgregar = document.getElementById("btnAgregar");

// ===============================
// EVENTOS
// ===============================
inputBusqueda.oninput = e => {
  textoBusqueda = e.target.value.toLowerCase();
  render();
};

btnLimpiar.onclick = () => {
  textoBusqueda = "";
  inputBusqueda.value = "";
  render();
};

btnAgregar.onclick = () => {
  const nombre = prompt("Nombre del producto:");
  if (!nombre) return;

  const categoria = prompt("Categoría:");
  if (!categoria) return;

  const minimo = parseInt(prompt("Stock mínimo:"), 10);
  if (isNaN(minimo)) {
    alert("El stock mínimo debe ser un número");
    return;
  }

  const nombreF = capitalizar(nombre);
  const categoriaF = capitalizar(categoria);

  if (productos.some(p => p.nombre === nombreF)) {
    alert("Ese producto ya existe");
    return;
  }

  productos.push({
    nombre: nombreF,
    categoria: categoriaF,
    stock: 0,
    minimo
  });

  render();
};

// ===============================
// RENDER
// ===============================
function render() {
  renderProductos();
  renderListaSuper();
}

function renderProductos() {
  contenedor.innerHTML = "";

  productos
    .filter(p =>
      p.nombre.toLowerCase().includes(textoBusqueda) ||
      p.categoria.toLowerCase().includes(textoBusqueda)
    )
    .forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "producto" + (p.stock < p.minimo ? " falta" : "");

      div.innerHTML = `
        <div class="acciones">
          <button onclick="editar(${i})">✏️</button>
          <button onclick="borrar(${i})">🗑️</button>
        </div>

        <div class="nombre">${p.nombre}</div>
        <div class="stock">Stock: ${p.stock} (mín: ${p.minimo})</div>

        <div class="botones">
          <button onclick="restar(${i})">−</button>
          <button onclick="sumar(${i})">＋</button>
        </div>
      `;

      contenedor.appendChild(div);
    });
}

function renderListaSuper() {
  listaSuper.innerHTML = "";

  const faltantes = productos.filter(p => p.stock < p.minimo);

  if (faltantes.length === 0) {
    listaSuper.innerHTML = "<p>No falta nada 🎉</p>";
    return;
  }

  const porCategoria = {};

  // Agrupamos por categoría
  faltantes.forEach(p => {
    if (!porCategoria[p.categoria]) porCategoria[p.categoria] = [];
    porCategoria[p.categoria].push(p);
  });

  for (const categoria in porCategoria) {
    const h3 = document.createElement("h3");
    h3.textContent = categoria;
    listaSuper.appendChild(h3);

    const ul = document.createElement("ul");
    porCategoria[categoria].forEach((p, i) => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `super-${categoria}-${i}`;

      checkbox.onchange = () => {
        if (checkbox.checked) {
          const cantidad = parseInt(prompt(`¿Cuánto compraste de ${p.nombre}?`), 10);
          if (!isNaN(cantidad) && cantidad > 0) {
            p.stock += cantidad;
            render();
          } else {
            checkbox.checked = false;
          }
        }
      };

      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = `${p.nombre} (faltan ${p.minimo - p.stock})`;

      li.appendChild(checkbox);
      li.appendChild(label);
      ul.appendChild(li);
    });

    listaSuper.appendChild(ul);
  }
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
  const nuevoMin = parseInt(prompt("Nuevo stock mínimo:", productos[i].minimo), 10);
  if (!isNaN(nuevoMin)) {
    productos[i].minimo = nuevoMin;
    render();
  }
}

// ===============================
// UTIL
// ===============================
function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// ===============================
render();
